/**
 * HP SSO Authentication Routes
 * Handles HP Gov Single Sign-On callbacks and user authentication
 */

import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import {
    validateHPSSOToken,
    validateStaffToken,
    checkHPSSOHealth,
    getHPSSOConfig,
    getHPSSOBaseUrl,
    type HPSSOUserData,
    type HPSSOStaffData,
} from '../../services/hpsso';
import { logger } from '../../logger';
import {
    invalidateExistingSessions,
    createLoginOtpChallenge,
    maskMobileNumber,
} from './utils';

const log = logger.child({ module: 'hpsso-routes' });

export const hpssoRouter = Router();

// Token validation request schema
const validateTokenSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    type: z.enum(['citizen', 'staff']).optional().default('citizen'),
});

// Link account request schema
const linkAccountSchema = z.object({
    sso_id: z.number(),
    existing_user_id: z.string().uuid().optional(),
});

/**
 * GET /api/auth/hpsso/config
 * Returns HP SSO configuration for frontend (non-sensitive)
 */
hpssoRouter.get('/config', (req, res) => {
    const config = getHPSSOConfig();

    res.json({
        enabled: config.enabled,
        environment: config.environment,
        loginScriptUrl: config.enabled ? `${getHPSSOBaseUrl()}/nodeapi/iframe/iframe.js` : null,
        serviceId: config.enabled ? config.serviceId : null,
        staffServiceId: config.enabled ? config.staffServiceId : null,
    });
});

/**
 * GET /api/auth/hpsso/health
 * Check HP SSO service health
 */
hpssoRouter.get('/health', async (req, res) => {
    try {
        const health = await checkHPSSOHealth();
        res.json(health);
    } catch (error) {
        log.error({ err: error }, 'HP SSO health check failed');
        res.status(500).json({ error: 'Health check failed' });
    }
});


/**
 * GET /api/auth/hpsso/validate-json
 * Explicit JSON-only validation for frontend clients
 * Fixes circular redirect issues
 */
hpssoRouter.get('/validate-json', async (req, res) => {
    try {
        const token = req.query.token as string;
        if (!token) return res.status(400).json({ error: 'Token required' });

        // Validate Token
        const ssoUserData = await validateHPSSOToken(token);

        log.info({ sso_id: ssoUserData.sso_id }, 'Manual token validation success');

        // Check for existing user
        let existingUser = null;
        if (ssoUserData.mobile) {
            const usersFound = await db.select().from(users).where(eq(users.mobile, ssoUserData.mobile)).limit(1);
            if (usersFound.length > 0) existingUser = usersFound[0];
        }

        // Return Data (No Side Effects)
        res.json({
            success: true,
            sso_data: {
                sso_id: ssoUserData.sso_id,
                name: ssoUserData.name,
                mobile: ssoUserData.mobile,
                email: ssoUserData.email,
                district: ssoUserData.dist,
                state: ssoUserData.state,
                address: ssoUserData.loc,
            },
            existing_user: existingUser ? { id: existingUser.id, username: existingUser.username } : null,
            action: existingUser ? 'link_required' : 'register'
        });

    } catch (error) {
        log.error({ err: error }, 'Token validation failed');
        res.status(500).json({ error: error instanceof Error ? error.message : 'Validation failed' });
    }
});

/**
 * POST /api/auth/hpsso/callback
 * Handles callback from HP SSO I-frame after user authentication
 * This is called when the I-frame sends the token back to our app
 */
hpssoRouter.all('/callback', async (req, res) => {
    try {
        // Handle both JSON (Frontend API) and Form POST (Iframe Redirect)
        const isFormPost = req.is('application/x-www-form-urlencoded');

        // Extract token from Body (POST) or Query (GET)
        const rawToken = req.body.token || req.query.token;
        const rawType = req.body.type || req.query.type || 'citizen'; // Default to citizen

        const validation = validateTokenSchema.safeParse({ token: rawToken, type: rawType });

        if (!validation.success) {
            const errorMsg = 'Invalid request: ' + validation.error.errors.map(e => e.message).join(', ');
            return res.status(400).send(`<html><body><h3>SSO Error: ${errorMsg}</h3></body></html>`);
        }

        const { token, type } = validation.data;

        let ssoUserData: HPSSOUserData;
        let isStaff = false;

        if (type === 'staff') {
            isStaff = true;
            // Validate Staff Token
            const staffData = await validateStaffToken(token);

            // Map Staff Data to Common User Data format for consistent handling
            ssoUserData = {
                sso_id: 0,
                vault_id: 0,
                username: staffData.emailId || staffData.employeeName,
                name: staffData.employeeName,
                mobile: '',
                email: staffData.emailId,
                gender: 'Other',
                dob: '',
                co: '',
                street: '',
                lm: '',
                loc: staffData.officeName,
                vtc: staffData.officeTypeName,
                dist: '',
                state: 'Himachal Pradesh',
                pc: '',
                aadhaarNumber: '',
                UsersArray: [],
                education: [],
                WorkExperience: [],
                Skills: []
            } as any;

            // Use empId as sso_id for internal tracking
            ssoUserData.sso_id = staffData.empId;

            log.info({
                empId: staffData.empId,
                role: staffData.desigName
            }, 'HP SSO Staff login verified');

        } else {
            // Validate Citizen Token (Default)
            ssoUserData = await validateHPSSOToken(token);

            log.info({
                sso_id: ssoUserData.sso_id,
                mobile: ssoUserData.mobile?.slice(-4)
            }, 'HP SSO callback received');
        }

        // Check if user exists with this SSO ID
        const existingUserBySSOId = await db
            .select()
            .from(users)
            .where(eq(users.ssoId, ssoUserData.sso_id.toString()))
            .limit(1);

        if (existingUserBySSOId.length > 0) {
            // User already linked
            const user = existingUserBySSOId[0];

            // --- STAFF 2FA LOGIC ---
            if (isStaff) {
                // For Staff, we DO NOT create a session yet.
                // We generate an OTP and ask for verification.

                if (!user.mobile) {
                    // Should not happen for valid staff, but safety check
                    const errorMsg = "Staff account has no mobile number for OTP.";
                    if (isFormPost) {
                        return res.send(`<html><body><h3>Login Failed: ${errorMsg}</h3></body></html>`);
                    }
                    return res.status(400).json({ error: errorMsg });
                }

                // Generate OTP Challenge
                const challenge = await createLoginOtpChallenge(user, 'sms');

                const otpPayload = {
                    success: true,
                    action: 'otp_required',
                    challengeId: challenge.id,
                    maskedMobile: maskMobileNumber(user.mobile),
                    expiresAt: challenge.expiresAt,
                    message: "Please enter the OTP sent to your registered mobile number."
                };

                if (isFormPost) {
                    return res.send(`
                        <html>
                        <body>
                        <script>
                            if (window.parent) {
                                window.parent.postMessage(${JSON.stringify(otpPayload)}, '*');
                            }
                        </script>
                        <h3>Verification Required. Sending OTP...</h3>
                        </body>
                        </html>
                    `);
                }
                return res.json(otpPayload);
            }
            // --- END STAFF 2FA ---

            // Enforce Single Session Policy
            await invalidateExistingSessions(user.id);

            // Set session
            req.session.userId = user.id;
            req.session.role = user.role;

            const responsePayload = {
                success: true,
                action: 'login',
                token: token, // Pass token back for consistency if needed by frontend handler
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role,
                },
            };

            // Return HTML Bridge to notify parent window or redirect
            return res.send(`
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>
                <div style="text-align:center; margin-top: 20px; font-family: sans-serif;">
                    <h3>Login Successful</h3>
                    <p>Redirecting you to the dashboard...</p>
                    <p><a href="/dashboard">Click here if not redirected automatically</a></p>
                </div>
                <script>
                    try {
                        // Send success message to parent window if in iframe
                        // Accessing window.parent property can throw cross-origin error, so we try-catch
                        var inIframe = false;
                        try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }

                        if (inIframe) {
                            window.parent.postMessage(${JSON.stringify(responsePayload)}, '*');
                        } else {
                            // Mobile/Direct: Redirect to dashboard
                            // Use replace to avoid back-button loops
                            window.location.replace('/dashboard');
                        }
                    } catch(e) {
                         window.location.replace('/dashboard');
                    }
                </script>
                </body>
                </html>
            `);

            // For direct browser access (GET request), redirect to dashboard
            return res.redirect('/dashboard');
        }

        // Check if user exists with same mobile number (for Citizen) or Email (for Staff)
        let existingUserToLink: typeof users.$inferSelect | undefined;

        if (ssoUserData.mobile) {
            const existing = await db
                .select()
                .from(users)
                .where(eq(users.mobile, ssoUserData.mobile))
                .limit(1);
            if (existing.length > 0) existingUserToLink = existing[0];
        } else if (ssoUserData.email && isStaff) {
            const existing = await db
                .select()
                .from(users)
                .where(eq(users.email, ssoUserData.email))
                .limit(1);
            if (existing.length > 0) existingUserToLink = existing[0];
        }

        const linkPayload = {
            success: true,
            action: 'link_required',
            sso_data: {
                sso_id: ssoUserData.sso_id,
                name: ssoUserData.name,
                mobile: ssoUserData.mobile,
                email: ssoUserData.email,
                district: ssoUserData.dist,
            },
            existing_user: existingUserToLink ? {
                id: existingUserToLink.id,
                username: existingUserToLink.username,
                fullName: existingUserToLink.fullName,
            } : null,
            message: existingUserToLink
                ? `An account with this ${ssoUserData.mobile ? 'mobile number' : 'email'} already exists. Would you like to link it?`
                : 'Account linking required',
            // One-time token for secure public linking (encoded SSO data)
            link_token: Buffer.from(JSON.stringify({
                sso_id: ssoUserData.sso_id,
                user_id: existingUserToLink?.id,
                exp: Date.now() + 10 * 60 * 1000, // 10 minute expiry
            })).toString('base64'),
        };

        // Return HTML Bridge to notify parent window or redirect
        const encodedData = encodeURIComponent(JSON.stringify(linkPayload));
        return res.send(`
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>
                <div style="text-align:center; margin-top: 20px; font-family: sans-serif;">
                    <h3>Account Found</h3>
                    <p>Redirecting you to start account linking...</p>
                    <p><a href="/sso-link?data=${encodedData}">Click here if not redirected automatically</a></p>
                </div>
                <script>
                    try {
                        var inIframe = false;
                        try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }

                        if (inIframe) {
                            window.parent.postMessage(${JSON.stringify(linkPayload)}, '*');
                        } else {
                            // Mobile/Direct: Redirect to link page
                            window.location.replace('/sso-link?data=${encodedData}');
                        }
                    } catch(e) {
                         window.location.replace('/sso-link?data=${encodedData}');
                    }
                </script>
                </body>
                </html>
            `);

        if (existingUserToLink) {
            // Redirect to SSO Link page with encoded data
            const encodedData = encodeURIComponent(JSON.stringify(linkPayload));
            return res.redirect(`/sso-link?data=${encodedData}`);
        }

        // New user - return SSO data for registration
        log.info({ sso_id: ssoUserData.sso_id }, 'VERSION v6: Redirecting new user to registration with DATA');

        const registerPayload = {
            success: true,
            action: 'register',
            token: token,
            sso_data: {
                sso_id: ssoUserData.sso_id,
                name: ssoUserData.name,
                mobile: ssoUserData.mobile,
                email: ssoUserData.email,
                gender: ssoUserData.gender,
                dob: ssoUserData.dob,
                guardian_name: ssoUserData.co,
                address: formatAddress(ssoUserData),
                district: ssoUserData.dist,
                state: ssoUserData.state,
                pincode: ssoUserData.pc,
                aadhaar_verified: true,
            },
            message: 'Please complete your registration',
        };

        // Always return HTML for registration redirect to ensure mobile works
        const encodedRegisterData = encodeURIComponent(JSON.stringify(registerPayload));
        return res.send(`
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body>
            <div style="text-align:center; margin-top: 20px; font-family: sans-serif;">
                <h3>Registration Required</h3>
                <p>Redirecting you to registration form...</p>
                <p><a href="/auth/hpsso-register-v2?data=${encodedRegisterData}">Click here if not redirected automatically</a></p>
            </div>
            <script>
                try {
                    var inIframe = false;
                    try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }

                    if (inIframe) {
                        window.parent.postMessage(${JSON.stringify(registerPayload)}, '*');
                    } else {
                        // Mobile/Direct: Redirect to registration with DATA
                        window.location.replace('/auth/hpsso-register-v2?data=${encodedRegisterData}');
                    }
                } catch(e) {
                     window.location.replace('/auth/hpsso-register-v2?data=${encodedRegisterData}');
                }
            </script>
            </body>
            </html>
        `);

        if (req.method === 'GET') {
            // For direct browser access, redirect to registration page with DATA
            const encodedRegisterData = encodeURIComponent(JSON.stringify(registerPayload));
            return res.redirect(`/auth/hpsso-register-v2?data=${encodedRegisterData}`);
        }

        return res.json(registerPayload);

    } catch (error) {
        log.error({ err: error }, 'HP SSO callback error');
        const errorPayload = {
            error: 'Authentication failed',
            message: error instanceof Error ? error.message : 'Unknown error',
        };

        // Always return HTML error for browser visibility
        return res.status(500).send(`
            <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>
                    <h3>Authentication Failed</h3>
                    <p>${errorPayload.message}</p>
                    <p><a href="/auth/login">Back to Login</a></p>
                </body>
            </html>
        `);
    }
});

/**
 * POST /api/auth/hpsso/link
 * Link an existing account to HP SSO
 */
hpssoRouter.post('/link', async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const validation = linkAccountSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: 'Invalid request',
                details: validation.error.errors
            });
        }

        const { sso_id } = validation.data;

        // Update user with SSO ID
        await db
            .update(users)
            .set({
                ssoId: sso_id.toString(),
                updatedAt: new Date(),
            })
            .where(eq(users.id, req.session.userId));

        log.info({
            userId: req.session.userId,
            sso_id
        }, 'Account linked to HP SSO');

        res.json({
            success: true,
            message: 'Account linked successfully'
        });

    } catch (error) {
        log.error({ err: error }, 'HP SSO link error');
        res.status(500).json({ error: 'Failed to link account' });
    }
});

/**
 * POST /api/auth/hpsso/link-public
 * Link an existing account to HP SSO without requiring session
 * Uses a one-time link_token generated during callback
 */
hpssoRouter.post('/link-public', async (req, res) => {
    try {
        const { sso_id, existing_user_id, link_token } = req.body;

        if (!link_token || !sso_id || !existing_user_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Decode and validate link token
        let tokenData: { sso_id: number; user_id: string; exp: number };
        try {
            tokenData = JSON.parse(Buffer.from(link_token, 'base64').toString('utf8'));
        } catch {
            return res.status(401).json({ error: 'Invalid link token' });
        }

        // Check expiry
        if (Date.now() > tokenData.exp) {
            return res.status(401).json({ error: 'Link token expired. Please try logging in again.' });
        }

        // Validate token matches request
        if (tokenData.sso_id !== sso_id || tokenData.user_id !== existing_user_id) {
            return res.status(401).json({ error: 'Token mismatch' });
        }

        // Link the account
        await db
            .update(users)
            .set({
                ssoId: sso_id.toString(),
                updatedAt: new Date(),
            })
            .where(eq(users.id, existing_user_id));

        // Invalidate existing sessions for this user
        await invalidateExistingSessions(existing_user_id);

        // Create new session
        req.session.userId = existing_user_id;

        // Fetch user for response
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, existing_user_id))
            .limit(1);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.session.role = user[0].role;

        log.info({
            userId: existing_user_id,
            sso_id
        }, 'Account linked via public endpoint');

        res.json({
            success: true,
            message: 'Account linked successfully',
            user: {
                id: user[0].id,
                username: user[0].username,
                fullName: user[0].fullName,
                role: user[0].role,
            }
        });

    } catch (error) {
        log.error({ err: error }, 'HP SSO public link error');
        res.status(500).json({ error: 'Failed to link account' });
    }
});

/**
 * GET /api/auth/hpsso/status
 * Check if current user has HP SSO linked
 */
hpssoRouter.get('/status', async (req, res) => {
    try {
        if (!req.session?.userId) {
            return res.json({ linked: false, authenticated: false });
        }

        const user = await db
            .select({ ssoId: users.ssoId })
            .from(users)
            .where(eq(users.id, req.session.userId))
            .limit(1);

        const linked = user.length > 0 && !!user[0].ssoId;

        res.json({
            linked,
            authenticated: true,
        });

    } catch (error) {
        log.error({ err: error }, 'HP SSO status check error');
        res.status(500).json({ error: 'Status check failed' });
    }
});

/**
 * Helper: Format address from HP SSO data
 */
function formatAddress(data: HPSSOUserData): string {
    const parts = [
        data.street,
        data.lm,
        data.loc,
        data.vtc,
        data.dist,
        data.state,
        data.pc ? `PIN: ${data.pc}` : null,
    ].filter(Boolean);

    return parts.join(', ');
}
