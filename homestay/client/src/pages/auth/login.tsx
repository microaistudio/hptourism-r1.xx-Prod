import { useEffect, useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getDefaultRouteForRole } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Building2, Lock, Phone, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import heroImagePine from "@assets/stock_images/beautiful_himachal_p_50139e3f.jpg";
import hpsedcLogo from "@/assets/logos/hpsedc.svg";
import vCliqLogo from "@/assets/logos/v-cliq-logo.jpg";
import type { User as UserType } from "@shared/schema";

// --- Configuration & Types ---

const COLORS = {
  primary: "#10b981", // Toned down emerald-500
  primaryDark: "#059669", // emerald-600
  text: "#44475b",
  background: "#ffffff",
  blue: "#3b82f6", // Toned down blue-500
  blueDark: "#2563eb", // blue-600
};

type LoginAuthMode = "password" | "otp";
type OtpChannel = "sms" | "email";
type LoginAudience = "user" | "office";

const loginSchema = z
  .object({
    identifier: z.string().min(3, "Enter username, mobile number, or email"),
    password: z.string().optional(),
    captchaAnswer: z.string().optional(),
    authMode: z.enum(["password", "otp"]),
    otpChannel: z.enum(["sms", "email"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.authMode === "password" && (!data.password || data.password.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required",
      });
    }
    if (data.authMode === "otp" && !data.otpChannel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otpChannel"],
        message: "Choose where to receive the OTP",
      });
    }
  });

type LoginForm = z.infer<typeof loginSchema>;

type OtpChallengeState = {
  id: string;
  expiresAt: string;
  channel: OtpChannel;
  maskedMobile?: string;
  maskedEmail?: string;
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State
  const [audience, setAudience] = useState<LoginAudience>("user");
  const [captchaQuestion, setCaptchaQuestion] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [captchaEnabled, setCaptchaEnabled] = useState<boolean>(true);
  const [otpChallenge, setOtpChallenge] = useState<OtpChallengeState | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpOptionEnabled, setOtpOptionEnabled] = useState(false);
  const [otpChannels, setOtpChannels] = useState<{ sms: boolean; email: boolean }>({ sms: true, email: true });
  const [loginOptionsLoaded, setLoginOptionsLoaded] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      captchaAnswer: "",
      authMode: "password",
      otpChannel: "sms",
    },
  });

  const authMode = form.watch("authMode");

  // --- Helpers ---

  const getRedirectRoute = (user: UserType): string => {
    return getDefaultRouteForRole(user.role);
  };

  const ensureValidOtpChannel = (preferred?: OtpChannel) => {
    const current = preferred ?? form.getValues("otpChannel");
    if (current && otpChannels[current]) {
      form.setValue("otpChannel", current, { shouldValidate: false });
      return;
    }
    if (otpChannels.sms) {
      form.setValue("otpChannel", "sms", { shouldValidate: false });
      return;
    }
    if (otpChannels.email) {
      form.setValue("otpChannel", "email", { shouldValidate: false });
      return;
    }
    form.setValue("otpChannel", undefined as unknown as OtpChannel, { shouldValidate: false });
  };

  const handleAuthModeChange = (mode: LoginAuthMode) => {
    if (authMode === mode) return;
    setOtpChallenge(null);
    setOtpValue("");
    setOtpError(null);
    form.setValue("authMode", mode, { shouldValidate: false });
    if (mode === "otp") {
      form.setValue("password", "");
      form.clearErrors("password");
      ensureValidOtpChannel();
    }
  };

  const refreshCaptcha = useCallback(async () => {
    try {
      setCaptchaLoading(true);
      const response = await apiRequest("GET", "/api/auth/captcha");
      const data = await response.json();
      if (data.enabled === false) {
        setCaptchaEnabled(false);
        setCaptchaQuestion("");
        form.setValue("captchaAnswer", "");
        return;
      }
      setCaptchaEnabled(true);
      setCaptchaQuestion(data.question);
      form.setValue("captchaAnswer", "");
    } catch (error) {
      toast({
        title: "Captcha unavailable",
        description: (error as Error)?.message || "Unable to load captcha. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCaptchaLoading(false);
    }
  }, [form, toast]);

  // --- Effects ---

  useEffect(() => {
    void refreshCaptcha();
  }, [refreshCaptcha]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawParam = params.get("audience") || params.get("role");
    if (rawParam === "user" || rawParam === "owner") {
      setAudience("user");
    }
    if (rawParam === "office" || rawParam === "officer") {
      setAudience("office");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadOptions = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/login/options");
        const data = await response.json();
        if (!cancelled) {
          const smsEnabled = Boolean(data?.smsOtpEnabled);
          const emailEnabled = Boolean(data?.emailOtpEnabled);
          const anyOtpChannel = smsEnabled || emailEnabled;
          setOtpChannels({ sms: smsEnabled, email: emailEnabled });
          setOtpOptionEnabled(anyOtpChannel);
          const isOtpRequired = Boolean(data?.otpRequired);
          setOtpRequired(isOtpRequired);
          ensureValidOtpChannel(smsEnabled ? "sms" : emailEnabled ? "email" : undefined);
          setLoginOptionsLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("[auth] Failed to load login options", error);
          setOtpOptionEnabled(false);
          setLoginOptionsLoaded(true);
        }
      }
    };
    void loadOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    ensureValidOtpChannel();
  }, [otpChannels.sms, otpChannels.email]);

  // --- SSO Logic ---
  const ssoTypeRef = useRef<'citizen' | 'staff'>('citizen');
  const [ssoConfig, setSsoConfig] = useState<{
    enabled: boolean;
    loginScriptUrl: string | null;
    serviceId: string | null;
    staffServiceId: string | null;
  } | null>(null);

  useEffect(() => {
    // Check for token in URL (SSO Redirect Fallback)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken && urlToken.length > 20) {
      // Remove token from URL to clean up
      window.history.replaceState({}, document.title, window.location.pathname);
      handleSSOCallback(urlToken);
    }

    apiRequest("GET", "/api/auth/hpsso/config")
      .then((res) => res.json())
      .then((data) => setSsoConfig(data))
      .catch((err) => console.error("Failed to load SSO config:", err));
  }, []);

  // Inject HPSSO Script
  useEffect(() => {
    if (ssoConfig?.loginScriptUrl && !document.querySelector(`script[src="${ssoConfig.loginScriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = ssoConfig.loginScriptUrl;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [ssoConfig?.loginScriptUrl]);

  const handleSSOCallback = async (token: string) => {
    try {
      // Hide iframe
      const backdrop = document.querySelector('.backdrop') as HTMLElement;
      const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;
      if (iframeContainer) iframeContainer.style.display = 'none';

      const response = await apiRequest("POST", "/api/auth/hpsso/callback", {
        token,
        type: ssoTypeRef.current
      });
      const data = await response.json();

      if (data.success) {
        // CRITICAL: Clear all cached queries
        queryClient.clear();

        if (data.action === 'login' || data.action === 'register') {
          toast({
            title: "Login Successful",
            description: "Redirecting...",
          });
          // Allow session to propagate
          await new Promise(r => setTimeout(r, 500));
          window.location.reload(); // Force reload to pick up session
        } else if (data.action === 'link_required') {
          toast({
            title: "Account Linking Required",
            description: data.message,
          });
          // Redirect or show linking modal (Logic to be expanded if needed)
          // For now, reload to let backend handle state if sesssion was created
          window.location.reload();
        }
      } else {
        throw new Error(data.error || "SSO Login failed");
      }
    } catch (error: any) {
      toast({
        title: "SSO Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // IMPORTANT: In production, verify event.origin matches HPSSO domain
      // console.log("SSO Message:", event.data);

      if (event.data) {
        // CHECK 1: Full Backend Response (from Iframe Bridge)
        // If the backend already validated the token and set the session (or requires linking),
        // it sends the full payload { success: true, action: '...', ... }
        if (event.data.success === true) {

          // Case 0: OTP Required (Staff 2FA)
          if (event.data.action === 'otp_required') {
            const { challengeId, maskedMobile, expiresAt, message, channel } = event.data;
            setOtpChallenge({
              id: challengeId,
              expiresAt: expiresAt,
              channel: channel ?? 'sms',
              maskedMobile: maskedMobile,
            });
            setOtpValue("");
            setOtpError(null);

            toast({
              title: "Verification Required",
              description: message || "Please verify your identity.",
            });

            // Hide iframe
            const backdrop = document.querySelector('.backdrop') as HTMLElement;
            const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;
            if (backdrop) backdrop.style.display = 'none';
            if (iframeContainer) iframeContainer.style.display = 'none';
            return;
          }

          // Case A: Login Successful (Session Cookie Set)
          if (event.data.action === 'login') {
            toast({
              title: "Login Successful",
              description: "Redirecting...",
            });

            // Hide iframe
            const backdrop = document.querySelector('.backdrop') as HTMLElement;
            const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;
            if (backdrop) backdrop.style.display = 'none';
            if (iframeContainer) iframeContainer.style.display = 'none';

            // Force reload to pick up the session
            setTimeout(() => window.location.reload(), 500);
            return;
          }

          // Case B: Registration Required (Data provided)
          if (event.data.action === 'register') {
            toast({
              title: "Registration Required",
              description: "Redirecting to registration form...",
            });
            // Hide iframe
            const backdrop = document.querySelector('.backdrop') as HTMLElement;
            const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;
            if (backdrop) backdrop.style.display = 'none';
            if (iframeContainer) iframeContainer.style.display = 'none';

            // Redirect with DATA payload (v4 fix for Desktop)
            const encodedData = encodeURIComponent(JSON.stringify(event.data));
            window.location.href = `/auth/hpsso-register?data=${encodedData}`;
            return;
          }

          // Case C: Link Required
          if (event.data.action === 'link_required') {
            toast({
              title: "Account Linking Required",
              description: event.data.message || "Please link your account.",
            });
            // Same issue: Session not set.
          }
        }

        // Check 2: Raw Token (Legacy or Direct Message)
        // Only if NOT handled above.
        if (typeof event.data === 'string' && event.data.length > 20) {
          handleSSOCallback(event.data);
        }
        else if (typeof event.data === 'object' && event.data.token && !event.data.success) {
          // If it has token but NO success flag, it's a raw token message
          handleSSOCallback(event.data.token);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSSOLogin = (type: 'citizen' | 'staff' = 'citizen', serviceIdOverride?: string | null) => {
    const targetServiceId = serviceIdOverride || ssoConfig?.serviceId;
    if (!ssoConfig?.enabled || !targetServiceId) {
      toast({
        title: "Configuration Error",
        description: "SSO Service ID not configured",
        variant: "destructive"
      });
      return;
    }

    // Set the expected SSO type for the callback
    ssoTypeRef.current = type;

    // Mobile detection - popup/iframe doesn't work reliably on mobile browsers
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: Use full-page redirect to HimAccess
      // Using the same login URL as iframe but without embedding, so it shows as full page
      // HimAccess will redirect back to our callback URL after authentication
      const loginType = type === 'staff' ? 'staff' : 'citizen';
      const himAccessUrl = `https://sso.hp.gov.in/login-iframe?service_id=${targetServiceId}&login_type=${loginType}`;

      toast({
        title: "Redirecting to Him Access",
        description: "Please complete authentication on the Him Access portal.",
      });

      // Small delay to show toast, then redirect
      setTimeout(() => {
        window.location.href = himAccessUrl;
      }, 500);
      return;
    }

    // Desktop: Use existing popup/iframe method
    // Attempt to resolve the global function (handles 'const' vs 'window.var' declaration)
    let ssoFunction: any = (window as any).getIframeSSO;

    if (!ssoFunction) {
      try {
        // Fallback for 'const' declarations in global scope which aren't on window
        // eslint-disable-next-line no-new-func
        ssoFunction = new Function("try { return getIframeSSO; } catch(e) { return undefined; }")();
      } catch (e) {
        console.warn("Failed to resolve getIframeSSO via new Function", e);
      }
    }

    if (typeof ssoFunction === 'function') {
      ssoFunction(targetServiceId, type);

      // Ensure container is visible
      const backdrop = document.querySelector('.backdrop') as HTMLElement;
      const iframeContainer = document.getElementById('iframeContainer') as HTMLElement;
      if (backdrop) backdrop.style.display = 'block';
      if (iframeContainer) iframeContainer.style.display = 'block';
    } else {
      toast({
        title: "One moment",
        description: "SSO Service is initializing. Please try again in a few seconds.",
      });
    }
  };

  // --- Mutations ---

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: async (data: { user?: UserType; otpRequired?: boolean; challengeId?: string; expiresAt?: string; maskedMobile?: string; maskedEmail?: string; channel?: OtpChannel }) => {
      if (data?.otpRequired && data.challengeId && data.expiresAt) {
        setOtpChallenge({
          id: data.challengeId,
          expiresAt: data.expiresAt,
          channel: data.channel ?? "sms",
          maskedMobile: data.maskedMobile,
          maskedEmail: data.maskedEmail,
        });
        setOtpValue("");
        setOtpError(null);
        toast({
          title: "OTP sent",
          description: `Enter the code sent to ${data.maskedMobile ?? data.maskedEmail ?? "your registered contact"}.`,
        });
        return;
      }
      if (!data?.user) {
        toast({
          title: "Login failed",
          description: "Unexpected response from server.",
          variant: "destructive",
        });
        return;
      }

      // CRITICAL: Clear all cached queries to prevent stale session data
      queryClient.clear();

      // Session verification: Confirm session is established before redirecting
      // This prevents the race condition where toast shows but redirect fails
      const verifySession = async (retries = 3): Promise<boolean> => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await apiRequest("GET", "/api/auth/me");
            const meData = await response.json();
            if (meData?.user?.id) return true;
          } catch {
            // Session not ready yet, will retry
          }
          if (i < retries - 1) {
            await new Promise(r => setTimeout(r, 200)); // Small delay between retries
          }
        }
        return false;
      };

      const sessionReady = await verifySession();
      if (sessionReady) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        // FORCE RELOAD to ensure session cookies are picked up 100%
        window.location.href = getRedirectRoute(data.user);
      } else {
        // Fallback: Try redirect anyway (session might still work)
        toast({
          title: "Welcome back!",
          description: "Redirecting to dashboard...",
        });
        // Small delay to ensure cookie is set
        await new Promise(r => setTimeout(r, 300));
        window.location.href = getRedirectRoute(data.user);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ otp }: { otp: string }) => {
      const response = await apiRequest("POST", "/api/auth/login/verify-otp", {
        challengeId: otpChallenge?.id,
        otp,
      });
      return response.json();
    },
    onSuccess: async (data: { user: UserType }) => {
      // CRITICAL: Clear all cached queries to prevent stale session data
      queryClient.clear();

      // Session verification: Confirm session is established before redirecting
      const verifySession = async (retries = 3): Promise<boolean> => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await apiRequest("GET", "/api/auth/me");
            const meData = await response.json();
            if (meData?.user?.id) return true;
          } catch {
            // Session not ready yet, will retry
          }
          if (i < retries - 1) {
            await new Promise(r => setTimeout(r, 200));
          }
        }
        return false;
      };

      const sessionReady = await verifySession();
      if (sessionReady) {
        toast({
          title: "Welcome back!",
          description: "OTP verified successfully.",
        });
        setLocation(getRedirectRoute(data.user));
      } else {
        // Fallback: Try redirect anyway
        toast({
          title: "Welcome back!",
          description: "Redirecting to dashboard...",
        });
        await new Promise(r => setTimeout(r, 300));
        setLocation(getRedirectRoute(data.user));
      }
    },
    onError: (error: any) => {
      setOtpError(error?.message || "OTP verification failed");
    },
  });

  // --- Handlers ---

  const onSubmit = (data: LoginForm) => {
    if (otpChallenge) return;
    if (captchaEnabled && !data.captchaAnswer?.trim()) {
      form.setError("captchaAnswer", { message: "Please solve the security check" });
      return;
    }
    loginMutation.mutate(data, {
      onSettled: () => {
        if (captchaEnabled) {
          void refreshCaptcha();
        }
      },
    });
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otpChallenge) return;
    if (otpValue.trim().length !== 6) {
      setOtpError("Enter the 6-digit code sent to your phone.");
      return;
    }
    setOtpError(null);
    verifyOtpMutation.mutate({ otp: otpValue });
  };

  const handleOtpReset = () => {
    setOtpChallenge(null);
    setOtpValue("");
    setOtpError(null);
    void refreshCaptcha();
  };

  const otpExpiresAt = otpChallenge ? new Date(otpChallenge.expiresAt) : null;

  // --- Visuals ---

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800">

      {/* 1. LEFT COLUMN: Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url(${heroImagePine})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full text-white">
          {/* V CLIQ Campaign Logo - Removed */}

          <div className="flex items-center gap-3" onClick={() => setLocation("/")}>
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg cursor-pointer hover:bg-white/20 transition">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <span className="font-semibold tracking-wide cursor-pointer">Back to Home</span>
          </div>

          <div className="space-y-6 max-w-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            <h1 className="text-5xl font-bold leading-tight">
              <span style={{ color: COLORS.primary }}>Home Stay</span> <br />
              Registration
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed opacity-90">
              Register under HP Homestay Rules 2025 and avail exclusive discounts:
            </p>

            <div className="space-y-2 text-base text-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>10% Discount</strong> on 3-year registration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>5% Additional Discount</strong> for women owners</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>50% Discount</strong> for Pangi Sub-Division</span>
              </div>
            </div>

            {/* HPSSO Iframe Container */}
            <div className="backdrop" style={{
              display: 'none',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.6)',
              zIndex: 9998,
              backdropFilter: 'blur(4px)'
            }}></div>
            <div id="iframeContainer" className="iframe-container" style={{
              display: 'none',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '550px', // Fits Him Access form nicely
              maxWidth: '95vw',
              height: '650px', // Fits content without excess space
              maxHeight: '95vh',
              background: 'white',
              zIndex: 9999,
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              paddingTop: '0px'
            }}></div>

          </div>

          <div className="text-xs text-white/40">
            © 2025 HP Tourism. Beautiful Himachal.
          </div>
        </div>
      </div>

      {/* 2. RIGHT COLUMN: Content */}
      < div className="flex-1 flex items-center justify-center p-6 md:p-12 relative" >
        <div className="max-w-[550px] w-full space-y-8">

          <div className="lg:hidden flex items-center gap-2 mb-6 text-gray-500" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold text-gray-900">
              {otpChallenge ? "Verify OTP" : "Welcome back"}
            </h2>
            <p className="text-xl text-gray-500">
              {otpChallenge
                ? "Please enter the verification code sent to your registered contact."
                : "Please enter your details to access your dashboard."
              }
            </p>
          </div>

          {/* Logic Branch: OTP Challenge vs Login Form */}
          {otpChallenge ? (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-center py-4">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value.replace(/\D/g, ""));
                    setOtpError(null);
                  }}
                  autoFocus
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((slot) => (
                      <InputOTPSlot key={`otp-slot-${slot}`} index={slot} className="h-12 w-12 border-gray-300 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {otpExpiresAt && (
                <p className="text-xs text-center text-muted-foreground">
                  Code expires at {otpExpiresAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}

              {otpError && <p className="text-sm text-center text-red-600 font-medium bg-red-50 p-2 rounded">{otpError}</p>}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg text-white"
                style={{ backgroundColor: COLORS.primary }}
                disabled={verifyOtpMutation.isPending || otpValue.length !== 6}
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : "Verify & Sign In"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-600 hover:text-green-700 hover:bg-green-50 transition-all font-semibold"
                onClick={handleOtpReset}
              >
                Use a different account
              </Button>
            </form>
          ) : (
            /* STANDARD LOGIN FORM */
            <Tabs
              value={audience}
              onValueChange={(v) => {
                setAudience(v as LoginAudience);
                setLocation(`/login?audience=${v}`);
                handleAuthModeChange("password");
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-14 rounded-xl mb-8">
                <TabsTrigger
                  value="user"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:border data-[state=active]:border-emerald-500 data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Citizen / Owner
                </TabsTrigger>
                <TabsTrigger
                  value="office"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:border data-[state=active]:border-blue-400 data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Department
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">

                  {/* Identifier Field */}
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-lg">
                          {audience === 'user' ? "Mobile Number or Email" : "Username"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-400">
                              {audience === 'user' ? <Phone className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <Input
                              {...field}
                              className="pl-10 h-14 bg-gray-50 border-gray-200 focus-visible:ring-green-500 focus-visible:border-green-500 transition-all rounded-lg text-lg"
                              placeholder={audience === 'user' ? "e.g. 9876543210" : "Enter official username"}
                              autoComplete="off"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Auth Mode Switcher */}
                  <input type="hidden" {...form.register("authMode")} />

                  {/* Password Mode */}
                  {authMode === "password" && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-gray-700 font-medium text-lg">Password</FormLabel>
                            {otpOptionEnabled && (
                              <button
                                type="button"
                                onClick={() => handleAuthModeChange("otp")}
                                className="text-sm font-bold text-green-600 hover:text-green-700 hover:underline"
                              >
                                Login via OTP
                              </button>
                            )}
                          </div>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-3 top-3.5 text-gray-400">
                                <Lock className="w-5 h-5" />
                              </div>
                              <Input
                                type="password"
                                {...field}
                                className="pl-10 h-14 bg-gray-50 border-gray-200 focus-visible:ring-green-500 focus-visible:border-green-500 transition-all rounded-lg text-lg"
                                placeholder="••••••••"
                                autoComplete="new-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* SSO Login Button (Citizen Only) */}
                  {audience === "user" && ssoConfig?.enabled && authMode === "password" && (
                    <div className="pt-2 pb-2">
                      <button
                        type="button"
                        onClick={() => handleSSOLogin('citizen', ssoConfig.serviceId)}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all shadow-sm group"
                      >
                        {/* Him Access Logo Placeholder */}
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                          H
                        </div>
                        <span>Login with Him Access</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </button>
                      <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-medium">Or Login with Credentials</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                      </div>
                    </div>
                  )}

                  {/* SSO Login Button (Department / Staff) */}
                  {audience === "office" && ssoConfig?.enabled && authMode === "password" && (
                    <div className="pt-2 pb-2">
                      <button
                        type="button"
                        onClick={() => handleSSOLogin('staff', ssoConfig.staffServiceId)}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-lg transition-all shadow-sm group"
                      >
                        {/* Him Access Logo Placeholder - Blue for Staff */}
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          H
                        </div>
                        <span>Login with Him Access (Staff)</span>
                        <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                      </button>
                      <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-medium">Or Official Login</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                      </div>
                    </div>
                  )}

                  {/* OTP Mode - Channel Selection */}
                  {authMode === "otp" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-gray-700 font-medium">Authentication Method</FormLabel>
                        <button
                          type="button"
                          onClick={() => handleAuthModeChange("password")}
                          className="text-xs font-bold text-gray-500 hover:text-gray-700 hover:underline"
                        >
                          Back to Password
                        </button>
                      </div>

                      <FormField
                        control={form.control}
                        name="otpChannel"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-3">
                              {(["sms", "email"] as const).map((option) => (
                                <Button
                                  type="button"
                                  key={option}
                                  variant="outline"
                                  className={`h-10 ${field.value === option ? 'border-green-500 bg-green-50 text-green-700' : 'text-gray-600'}`}
                                  onClick={() => otpChannels[option] && field.onChange(option)}
                                  disabled={!otpChannels[option]}
                                >
                                  {option === "sms" ? "Send SMS" : "Send Email"}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-xs text-gray-500">
                        We will send a one-time password to your selected contact method.
                      </div>
                    </div>
                  )}

                  {/* CAPTCHA Section */}
                  {captchaEnabled ? (
                    <FormField
                      control={form.control}
                      name="captchaAnswer"
                      render={({ field }) => (
                        <div className="flex items-center gap-4">
                          {/* Captcha Display Box */}
                          <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg h-14 flex items-center justify-between px-4 select-none relative overflow-hidden group hover:border-gray-300 transition-colors">
                            <div className="flex items-center justify-center w-full relative z-10">
                              {captchaLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                              ) : (
                                <span className="font-mono text-xl font-bold tracking-wider text-gray-700">
                                  {captchaQuestion}
                                </span>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => refreshCaptcha()}
                              variant="outline"
                              className="h-14 w-14 rounded-lg border-gray-200 hover:bg-gray-50 hover:text-green-600 transition-colors"
                              disabled={captchaLoading}
                              title="Refresh Captcha"
                            >
                              <RefreshCw className={`w-5 h-5 ${captchaLoading ? "animate-spin" : ""}`} />
                            </Button>
                          </div>

                          {/* Input Field */}
                          <div className="w-24 sm:w-32">
                            <FormControl>
                              <Input
                                {...field}
                                className="h-14 text-center font-bold text-lg tracking-widest bg-white border-gray-200 focus-visible:ring-green-500 focus-visible:border-green-500 rounded-lg placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300 placeholder:text-sm"
                                placeholder="Answer"
                                autoComplete="off"
                              />
                            </FormControl>
                          </div>
                        </div>
                      )}
                    />
                  ) : (
                    <div className="text-xs text-center text-gray-300 border border-dashed border-gray-200 rounded p-2">
                      Captcha disabled for this environment
                    </div>
                  )}
                  <FormMessage className="text-center" />


                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all rounded-lg text-white"
                    style={{ backgroundColor: COLORS.primary }}
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In <ArrowRight className="ml-2 h-5 w-5 opacity-80" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setLocation("/forgot-password")}
                      className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              </Form>
            </Tabs>
          )}

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-400">
              Facing issues? Contact support at
            </p>
            <a href="mailto:support@hptourism.gov.in" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">
              support@hptourism.gov.in
            </a>
            <p className="text-[10px] text-gray-300 pt-2">
              v{import.meta.env.APP_VERSION}
            </p>
          </div>

        </div>
      </div >
    </div >
  );
}
