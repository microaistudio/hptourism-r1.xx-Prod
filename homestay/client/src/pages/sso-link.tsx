/**
 * SSO Account Linking Page
 * 
 * Displayed when an existing user logs in via HimAccess (HPSSO) for the first time.
 * Allows them to confirm linking their SSO identity to their existing account.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Link2, User, Shield, ArrowRight, X, UserPlus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import vcliqLogo from '@/assets/logos/v-cliq-logo.jpg';

interface SSOLinkData {
    sso_id: number;
    name: string;
    mobile: string;
    email: string;
    district: string;
    existing_user: {
        id: string;
        username: string;
        fullName: string;
    } | null;
    link_token: string;
}

export default function SSOLinkPage() {
    const [, navigate] = useLocation();
    const [ssoData, setSsoData] = useState<SSOLinkData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load SSO data from URL query param on mount
    useEffect(() => {
        // Get data from URL query param
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');

        if (encodedData) {
            try {
                const parsed = JSON.parse(decodeURIComponent(encodedData));
                // Map the payload structure to our expected format
                setSsoData({
                    sso_id: parsed.sso_data?.sso_id || parsed.sso_id,
                    name: parsed.sso_data?.name || parsed.name,
                    mobile: parsed.sso_data?.mobile || parsed.mobile,
                    email: parsed.sso_data?.email || parsed.email,
                    district: parsed.sso_data?.district || parsed.district,
                    existing_user: parsed.existing_user,
                    link_token: parsed.link_token,
                });
            } catch {
                setError('Invalid link data. Please try logging in again.');
            }
        } else {
            // No data - redirect to login
            setError('No linking data provided.');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [navigate]);

    // Link account mutation
    const linkMutation = useMutation({
        mutationFn: async () => {
            if (!ssoData) throw new Error('No SSO data');

            const response = await apiRequest('POST', '/api/auth/hpsso/link-public', {
                sso_id: ssoData.sso_id,
                existing_user_id: ssoData.existing_user?.id,
                link_token: ssoData.link_token,
            });

            return response.json();
        },
        onSuccess: () => {
            // Clear stored data
            sessionStorage.removeItem('sso_link_data');
            // Redirect to dashboard
            navigate('/dashboard');
        },
        onError: (err: Error) => {
            setError(err.message || 'Failed to link account. Please try again.');
        },
    });

    const handleCancel = () => {
        sessionStorage.removeItem('sso_link_data');
        navigate('/login');
    };

    // NEW: Register new account with SSO data pre-filled
    const handleRegisterNew = () => {
        // Store SSO data for registration page pre-fill
        sessionStorage.setItem('sso_registration_data', JSON.stringify({
            sso_id: ssoData?.sso_id,
            name: ssoData?.name,
            mobile: ssoData?.mobile,
            email: ssoData?.email,
            district: ssoData?.district,
            token: 'sso-link-redirect'
        }));
        sessionStorage.removeItem('sso_link_data');
        navigate('/register?sso=true');
    };

    // Check if existing account is incomplete/unknown
    const isAccountIncomplete = !ssoData?.existing_user?.fullName ||
        ssoData.existing_user.fullName === 'Unknown' ||
        !ssoData?.existing_user?.username ||
        ssoData.existing_user.username === 'user';

    if (!ssoData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <Card className="w-full max-w-lg shadow-xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Link2 className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        {isAccountIncomplete ? 'Create Your Account' : 'Link Your Account'}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        {isAccountIncomplete
                            ? 'No existing account found. Create a new account using your HimAccess identity.'
                            : 'We found an existing account that matches your HimAccess credentials'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Two identity cards side by side */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* HimAccess Identity */}
                        <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-blue-800 text-sm">HimAccess</span>
                            </div>
                            <p className="font-medium text-gray-800 truncate">{ssoData.name}</p>
                            <p className="text-sm text-gray-600 truncate">{ssoData.mobile || ssoData.email}</p>
                            {ssoData.district && (
                                <p className="text-xs text-gray-500 mt-1">{ssoData.district}</p>
                            )}
                        </div>

                        {/* Existing Account / HomeStay Portal */}
                        <div className={`rounded-xl border-2 p-4 ${isAccountIncomplete ? 'border-amber-200 bg-amber-50/50' : 'border-green-200 bg-green-50/50'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                {isAccountIncomplete ? (
                                    <img src={vcliqLogo} alt="VCliq" className="h-5 w-5 rounded" />
                                ) : (
                                    <User className="h-5 w-5 text-green-600" />
                                )}
                                <span className={`font-semibold text-sm ${isAccountIncomplete ? 'text-amber-800' : 'text-green-800'}`}>
                                    {isAccountIncomplete ? 'HomeStay Portal' : 'Your Account'}
                                </span>
                            </div>
                            <p className="font-medium text-gray-800 truncate">
                                {isAccountIncomplete ? 'Not registered yet' : (ssoData.existing_user?.fullName || 'Unknown')}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                                {isAccountIncomplete ? 'Create your account below' : `@${ssoData.existing_user?.username || 'user'}`}
                            </p>
                        </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-sm">
                                {isAccountIncomplete
                                    ? 'Your HimAccess identity will be linked to your new account'
                                    : 'These will be linked together'}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                        {/* Show Link button only when account is complete */}
                        {!isAccountIncomplete && (
                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                onClick={() => linkMutation.mutate()}
                                disabled={linkMutation.isPending}
                            >
                                {linkMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Linking...
                                    </>
                                ) : (
                                    <>
                                        Yes, Link My Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Primary Register button when account is incomplete */}
                        {isAccountIncomplete && (
                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                onClick={handleRegisterNew}
                            >
                                <UserPlus className="mr-2 h-5 w-5" />
                                Create New Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="lg"
                            className="w-full text-gray-600"
                            onClick={handleCancel}
                            disabled={linkMutation.isPending}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>

                        {/* Show secondary Register option only when there's an error AND account is complete */}
                        {(error && !isAccountIncomplete) && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                                onClick={handleRegisterNew}
                                disabled={linkMutation.isPending}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Register New Account Instead
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-center text-gray-500 pt-2">
                        {isAccountIncomplete || error
                            ? "Create a new account using your HimAccess identity."
                            : "After linking, you can use HimAccess to log in directly."}
                    </p>
                </CardContent>
            </Card>
        </div >
    );
}
