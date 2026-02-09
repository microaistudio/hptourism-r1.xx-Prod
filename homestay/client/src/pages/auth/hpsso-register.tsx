/**
 * HP SSO Registration Callback Page
 * 
 * Handles the redirect from HPSSO for NEW users who don't have an account yet.
 * Extracts the token from the URL, validates it via the backend, and redirects
 * to the standard registration page with pre-filled SSO data.
 */

import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, UserPlus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';

interface SSOData {
    sso_id: number;
    name: string;
    mobile: string;
    email: string;
    gender: string;
    dob: string;
    guardian_name: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    aadhaar_verified: boolean;
}

export default function HPSSORegisterPage() {
    const [, setLocation] = useLocation();
    const searchString = useSearch();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ssoData, setSsoData] = useState<SSOData | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(searchString);
        const token = params.get('token');
        const dataStr = params.get('data');

        if (dataStr) {
            try {
                // Parse pre-verified data from backend (v3 fix)
                const data = JSON.parse(decodeURIComponent(dataStr));

                if (data.action === 'register' && data.sso_data) {
                    setSsoData(data.sso_data);
                    sessionStorage.setItem('sso_registration_data', JSON.stringify({
                        ...data.sso_data,
                        token: data.token || 'pre-verified'
                    }));
                    setTimeout(() => setLocation('/register?sso=true'), 1500);
                } else {
                    throw new Error('Invalid data format');
                }
                setIsLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse SSO data:", e);
                // Fallthrough to token attempt or error
            }
        }

        if (!token) {
            setError('No SSO token or data provided. Please try logging in again.');
            setIsLoading(false);
            return;
        }

        // Validate token and get SSO data from backend
        const validateToken = async () => {
            try {
                // Use new JSON-only endpoint (v8 fix)
                const res = await fetch(`/api/auth/hpsso/validate-json?token=${encodeURIComponent(token)}`);
                if (!res.ok) {
                    const errorJson = await res.json();
                    throw new Error(errorJson.error || 'Server validation failed');
                }
                const response = await res.json();

                if (response.action === 'register' && response.sso_data) {
                    setSsoData(response.sso_data);
                    // Store SSO data in sessionStorage for the registration page
                    sessionStorage.setItem('sso_registration_data', JSON.stringify({
                        ...response.sso_data,
                        token
                    }));
                    // Redirect to registration page after a brief delay to show success
                    setTimeout(() => {
                        setLocation('/register?sso=true');
                    }, 1500);
                } else if (response.action === 'login') {
                    // User already exists and is now logged in
                    setLocation('/dashboard');
                } else if (response.action === 'link_required') {
                    // Redirect to SSO link page
                    const encodedData = encodeURIComponent(JSON.stringify(response));
                    setLocation(`/sso-link?data=${encodedData}`);
                } else {
                    setError('Unexpected response from server. Please try again.');
                }
            } catch (err) {
                console.error('SSO validation error:', err);
                setError(err instanceof Error ? err.message : 'Failed to validate SSO token. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [searchString, setLocation]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            Verifying Your Identity
                        </CardTitle>
                        <CardDescription>
                            Please wait while we verify your HimAccess SSO credentials...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                            <AlertTriangle className="h-6 w-6" />
                            Verification Failed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={() => setLocation('/login')}>
                                Back to Login
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (ssoData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                            <UserPlus className="h-6 w-6" />
                            Welcome, {ssoData.name}!
                        </CardTitle>
                        <CardDescription>
                            Your identity has been verified via HimAccess.
                            <br />
                            Redirecting you to complete your registration...
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
