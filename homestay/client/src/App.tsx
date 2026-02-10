import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Loader2 } from "lucide-react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// DevConsole removed - dangerous in production
import { ThemeProvider } from "@/contexts/theme-context";
import { ServiceProvider } from "@/contexts/service-context";
import { AuthLayout } from "@/components/auth-layout";
import { getDefaultRouteForRole } from "@/config/navigation";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import OwnerDashboardNew from "@/pages/owner-dashboard-new";
import ProfilePage from "@/pages/profile";
import NewApplication from "@/pages/applications/new";
import ServiceRequestHandler from "@/pages/applications/service-request";
import ApplicationDetail from "@/pages/applications/detail";
import HimKoshPaymentPage from "@/pages/applications/payment-himkosh";
import PublicProperties from "@/pages/public/properties";
import PublicPropertyDetail from "@/pages/public/property-detail";
import ProcedureChecklistPage from "@/pages/public/procedure-checklist";
import HelpPage from "@/pages/help";
import AnalyticsPage from "@/pages/analytics";
import SystemStatus from "@/pages/public/system-status";
import WorkflowMonitoring from "@/pages/workflow-monitoring";
import PaymentVerification from "@/pages/payment-verification";
import PrintAffidavit from "@/pages/print-affidavit";
import PrintUndertaking from "@/pages/print-undertaking";
import AdminUsers from "@/pages/admin/users";
import AdminConsole from "@/pages/admin/console";
import StateDashboardV2 from "@/pages/state-dashboard/StateDashboardV2";

import AdminLGDImport from "@/pages/admin/lgd-import";
import AdminAuditLog from "@/pages/admin/audit-log";
import AdminRcApplications from "@/pages/admin/rc-applications";
import AdminRcApplicationDetail from "@/pages/admin/rc-application-detail";
import AdminRcApplicationCertificate from "@/pages/admin/rc-application-certificate";
import LegacyOwnerSupport from "@/pages/legacy/owner-support";
import TestRunner from "@/pages/admin/test-runner";
import SuperAdminConsole from "@/pages/admin/super-admin-console";
import SuperAdminDashboard from "@/pages/admin/super-admin-dashboard";

import AdminBackup from "@/pages/admin/backup";
import AdminExportImport from "@/pages/admin/export-import";
import AdminPolicySettings from "@/pages/admin/policy-settings";
import BaselineStatsPage from "@/pages/admin/baseline-stats";
import SystemControlsPage from "@/pages/admin/system-controls";
import PaymentTestKotak from "@/pages/admin/payment-test-kotak";
import SeedToolsPage from "@/pages/admin/seed-tools";
import PaymentReportsPage from "@/pages/admin/payment-reports";
import DADashboard from "@/pages/da/dashboard"; // ⚠️ LEGACY - Old stage-based layout
import DAQueue from "@/pages/da/queue"; // ✅ NEW - Unified queue layout
import DALegacyDashboard from "@/pages/legacy/da-dashboard";
import DAApplicationDetail from "@/pages/da/application-detail";
import DAIncompleteApplications from "@/pages/da/incomplete-applications";
import DAInspections from "@/pages/da/inspections";
import DAInspectionReport from "@/pages/da/inspection-report";
import DAProfile from "@/pages/da/profile";
import DTDODashboard from "@/pages/dtdo/dashboard"; // ⚠️ LEGACY - Old stage-based layout
import DTDOLegacyDashboard from "@/pages/legacy/dtdo-dashboard"; // Dedicated legacy queue
import DTDOQueue from "@/pages/dtdo/queue"; // ✅ NEW - Unified queue layout
import DTDOApplicationReview from "@/pages/dtdo/application-review";
import DTDOScheduleInspection from "@/pages/dtdo/schedule-inspection";
import DTDOInspectionReview from "@/pages/dtdo/inspection-review";
import DTDOProfile from "@/pages/dtdo/profile";
import DTDOGrievances from "@/pages/dtdo/grievances";
import OfficerApplicationSearch from "@/pages/officer-application-search";

import ExistingOwnerOnboarding from "@/pages/existing-owner-onboarding";

import ContactPage from "@/pages/contact";
import TrackApplicationPage from "@/pages/track-application";
import VerifyCertificatePage from "@/pages/verify-certificate";
import AdventureSportsRegistration from "@/pages/adventure-sports/registration";
import ServiceSelection from "@/pages/services";
import ServiceSettings from "@/pages/service-settings";
import { GrievancesUnderConstruction, HelpUnderConstruction } from "@/pages/under-construction";

import GrievanceList from "@/pages/grievances";
import GrievanceReports from "@/pages/grievances/reports";
import type { User } from "@shared/schema";
import MaintenancePage from "@/pages/maintenance";
import SSOLinkPage from "@/pages/sso-link";
import HPSSORegisterPage from "@/pages/auth/hpsso-register";

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles?: string[];
}

function ProtectedRoute({ component: Component, allowedRoles }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { data: userData, isLoading } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  // If still loading, show nothing (AuthLayout will show loading state)
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AuthLayout>
    );
  }

  // If not logged in, redirect to login
  if (!userData?.user) {
    setLocation("/login");
    return null;
  }

  // If role restrictions exist and user doesn't have required role, redirect to their home
  if (allowedRoles && !allowedRoles.includes(userData.user.role)) {
    const homeRoute = getDefaultRouteForRole(userData.user.role);
    setLocation(homeRoute);
    return null;
  }

  return (
    <AuthLayout>
      <Component />
    </AuthLayout>
  );
}

/**
 * ProtectedRouteFullPage - For pages that have their own full layout (sidebar, etc.)
 * Does NOT wrap in AuthLayout - the component renders as a full page takeover.
 * Use this for new unified queue layouts that include their own navigation.
 */
function ProtectedRouteFullPage({ component: Component, allowedRoles }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { data: userData, isLoading } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  // Full page loading state (no AuthLayout)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!userData?.user) {
    setLocation("/login");
    return null;
  }

  // If role restrictions exist and user doesn't have required role, redirect to their home
  if (allowedRoles && !allowedRoles.includes(userData.user.role)) {
    const homeRoute = getDefaultRouteForRole(userData.user.role);
    setLocation(homeRoute);
    return null;
  }

  // Render component directly without AuthLayout wrapper
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />

      <Route path="/properties" component={PublicProperties} />
      <Route path="/properties/:id" component={PublicPropertyDetail} />
      <Route path="/procedure-checklist" component={ProcedureChecklistPage} />
      <Route path="/login" component={Login} />
      <Route path="/sso-link" component={SSOLinkPage} />
      <Route path="/auth/hpsso-register" component={HPSSORegisterPage} />
      <Route path="/register" component={Register} />
      <Route path="/contact">
        {() => <ContactPage />}
      </Route>
      <Route path="/track">
        {() => <TrackApplicationPage />}
      </Route>
      <Route path="/verify-certificate">
        {() => <VerifyCertificatePage />}
      </Route>
      <Route path="/print/affidavit" component={PrintAffidavit} />
      <Route path="/print/undertaking" component={PrintUndertaking} />
      <Route path="/system-status" component={SystemStatus} />
      {/* Public Shortcuts */}
      <Route path="/print-affidavit" component={PrintAffidavit} />
      <Route path="/print-undertaking" component={PrintUndertaking} />


      {/* Developer Testing Console */}


      {/* Protected Routes - All wrapped in AuthLayout */}
      {/* Service Selection Hub - Renders without sidebar (user selects service first) */}
      <Route path="/services">
        {() => <ServiceSelection />}
      </Route>

      {/* Property Owner Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/dashboard-new">
        {() => <ProtectedRoute component={OwnerDashboardNew} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={ProfilePage} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/service-settings">
        {() => <ProtectedRoute component={ServiceSettings} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/existing-owner">
        {() => <ProtectedRoute component={ExistingOwnerOnboarding} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/applications/service-request">
        {() => <ProtectedRoute component={ServiceRequestHandler} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/applications/new">
        {() => <ProtectedRoute component={NewApplication} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/grievances">
        {() => <ProtectedRoute component={GrievanceList} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/help">
        {() => <ProtectedRoute component={HelpPage} allowedRoles={['property_owner']} />}
      </Route>
      {/* Adventure Sports - Separate pipeline without Homestay sidebar */}
      <Route path="/adventure-sports/register">
        {() => <AdventureSportsRegistration />}
      </Route>
      <Route path="/applications/:id/payment-himkosh">
        {() => <ProtectedRoute component={HimKoshPaymentPage} allowedRoles={['property_owner']} />}
      </Route>
      <Route path="/applications/:id">
        {() => <ProtectedRoute component={ApplicationDetail} />}
      </Route>

      {/* Officer-Only Routes */}
      <Route path="/analytics">
        {() => <ProtectedRoute component={AnalyticsPage} allowedRoles={['dealing_assistant', 'district_tourism_officer', 'district_officer', 'state_officer', 'admin']} />}
      </Route>
      <Route path="/workflow-monitoring">
        {() => <ProtectedRoute component={WorkflowMonitoring} allowedRoles={['dealing_assistant', 'district_tourism_officer', 'district_officer', 'state_officer', 'admin']} />}
      </Route>
      <Route path="/payment-verification">
        {() => <ProtectedRoute component={PaymentVerification} allowedRoles={['district_officer', 'state_officer']} />}
      </Route>

      <Route path="/state-dashboard">
        {() => <ProtectedRoute component={StateDashboardV2} allowedRoles={['state_officer', 'admin', 'super_admin']} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        {() => <ProtectedRoute component={SuperAdminDashboard} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsers} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/console">
        {() => <ProtectedRoute component={AdminConsole} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>

      <Route path="/admin/lgd-import">
        {() => <ProtectedRoute component={AdminLGDImport} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/audit-log">
        {() => <ProtectedRoute component={AdminAuditLog} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/payment-reports">
        {() => <ProtectedRoute component={PaymentReportsPage} allowedRoles={['district_tourism_officer', 'district_officer', 'state_officer', 'admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/rc-applications">
        {() => <ProtectedRoute component={AdminRcApplications} allowedRoles={['admin_rc', 'admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/rc-applications/:id">
        {() => <ProtectedRoute component={AdminRcApplicationDetail} allowedRoles={['admin_rc', 'admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/rc-applications/:id/certificate">
        {() => <ProtectedRoute component={AdminRcApplicationCertificate} allowedRoles={['admin_rc', 'admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/rc-application-certificate">
        {() => <ProtectedRoute component={AdminRcApplicationCertificate} allowedRoles={['admin_rc', 'admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/legacy-owner-support">
        {() => <ProtectedRoute component={LegacyOwnerSupport} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/test-runner">
        {() => <ProtectedRoute component={TestRunner} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>

      {/* Super Admin Only Routes */}
      <Route path="/admin/super-dashboard">
        {() => <ProtectedRoute component={SuperAdminDashboard} allowedRoles={['super_admin']} />}
      </Route>

      <Route path="/admin/super-console">
        {() => <ProtectedRoute component={SuperAdminConsole} allowedRoles={['super_admin']} />}
      </Route>
      <Route path="/admin/backup">
        {() => <ProtectedRoute component={AdminBackup} allowedRoles={['super_admin']} />}
      </Route>
      <Route path="/admin/export-import">
        {() => <ProtectedRoute component={AdminExportImport} allowedRoles={['super_admin']} />}
      </Route>
      <Route path="/admin/policy-settings">
        {() => <ProtectedRoute component={AdminPolicySettings} allowedRoles={['admin', 'super_admin', 'system_admin']} />}
      </Route>
      <Route path="/admin/payment-test-kotak">
        {() => <ProtectedRoute component={PaymentTestKotak} allowedRoles={['admin', 'super_admin']} />}
      </Route>
      <Route path="/admin/seed-tools">
        {() => <ProtectedRoute component={SeedToolsPage} allowedRoles={['super_admin']} />}
      </Route>
      <Route path="/admin/system-controls">
        {() => <ProtectedRoute component={SystemControlsPage} allowedRoles={['super_admin']} />}
      </Route>
      <Route path="/admin/baseline-stats">
        {() => <ProtectedRoute component={BaselineStatsPage} allowedRoles={['admin', 'super_admin', 'system_admin', 'state_officer']} />}
      </Route>

      {/* ============================================================================
          Dealing Assistant Routes
          - /da/dashboard  = ✅ STABLE stage-based layout (current default)
          - /da/queue      = ❌ DISABLED - New unified queue layout (commented out)
          ============================================================================ */}
      {/* DISABLED: New queue layout - uncomment when ready to switch
      <Route path="/da/queue">
        {() => <ProtectedRouteFullPage component={DAQueue} allowedRoles={['dealing_assistant']} />}
      </Route>
      */}
      <Route path="/da/dashboard">
        {() => <ProtectedRoute component={DADashboard} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/legacy">
        {() => <ProtectedRoute component={DALegacyDashboard} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/profile">
        {() => <ProtectedRoute component={DAProfile} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/applications/:id">
        {() => <ProtectedRoute component={DAApplicationDetail} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/incomplete-applications">
        {() => <ProtectedRoute component={DAIncompleteApplications} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/inspections">
        {() => <ProtectedRoute component={DAInspections} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/inspections/:id">
        {() => <ProtectedRoute component={DAInspectionReport} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/search">
        {() => <ProtectedRoute component={OfficerApplicationSearch} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/grievances">
        {() => <ProtectedRoute component={GrievanceList} allowedRoles={['dealing_assistant']} />}
      </Route>
      <Route path="/da/grievance-reports">
        {() => <ProtectedRoute component={GrievanceReports} allowedRoles={['dealing_assistant']} />}
      </Route>

      {/* ============================================================================
          DTDO (District Tourism Development Officer) Routes
          - /dtdo/dashboard  = ✅ STABLE stage-based layout (current default)
          - /dtdo/queue      = ❌ DISABLED - New unified queue layout (commented out)
          ============================================================================ */}
      {/* DISABLED: New queue layout - uncomment when ready to switch
      <Route path="/dtdo/queue">
        {() => <ProtectedRouteFullPage component={DTDOQueue} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      */}
      <Route path="/dtdo/dashboard">
        {() => <ProtectedRoute component={DTDODashboard} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/legacy">
        {() => <ProtectedRoute component={DTDOLegacyDashboard} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/applications/:id">
        {() => <ProtectedRouteFullPage component={DTDOApplicationReview} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/schedule-inspection/:id">
        {() => <ProtectedRoute component={DTDOScheduleInspection} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/inspection-review/:id">
        {() => <ProtectedRoute component={DTDOInspectionReview} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/profile">
        {() => <ProtectedRoute component={DTDOProfile} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/search">
        {() => <ProtectedRoute component={OfficerApplicationSearch} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/grievances">
        {() => <ProtectedRoute component={DTDOGrievances} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>
      <Route path="/dtdo/grievance-reports">
        {() => <ProtectedRoute component={GrievanceReports} allowedRoles={['district_tourism_officer', 'district_officer']} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}


// Maintenance Mode Component wrapper to keep main App clean
function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  // 1. Capture and store bypass key from URL if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('access_key');
    if (key) {
      localStorage.setItem('maintenance_key', key);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 2. Fetch public settings, passing the stored key
  // We use key from localStorage. Note: This read happens once on mount/render. 
  // If key changes, a reload is typically expected or we'd need a storage listener.
  const storedKey = localStorage.getItem('maintenance_key');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/settings/public', storedKey], // Include key in queryKey to refresh if it changes
    queryFn: async () => {
      const url = storedKey
        ? `/api/settings/public?access_key=${encodeURIComponent(storedKey)}`
        : '/api/settings/public';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    }
  });

  if (isLoading) {
    // Optional: Show a full-screen loader or just render nothing until we know status
    // Rendering children immediately risks showing content then flashing to maintenance
    return <div className="h-screen w-screen flex items-center justify-center bg-white"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // 3. Check enabled status (server usage logic: if key is valid, server returns enabled: false)
  if (settings?.maintenanceMode?.enabled) {
    return <MaintenancePage config={settings.maintenanceMode} />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ServiceProvider>
          <TooltipProvider>
            <Toaster />
            {/* Maintenance Mode Wrap */}
            <MaintenanceWrapper>
              <Router />
            </MaintenanceWrapper>
            {/* DevConsole removed for production safety */}
          </TooltipProvider>
        </ServiceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
