import {
  Home,
  FileText,
  Bell,
  BarChart3,
  BarChart,
  Users,
  ClipboardList,
  Settings,
  Database,
  ClipboardCheck,
  User,
  Activity,
  MapPin,
  Search,
  Download,
  Shield,
  RefreshCw,
  CreditCard,
  MessageSquare,
  Lock,
  FileArchive,
  FileArchive,
  TestTube,
  Server,
  LineChart,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "neutral";
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Property Owner Navigation Menu - 4 Sections per R1.0 Architecture
export const ownerNavigation: NavSection[] = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "Applications",
    items: [
      {
        title: "New Application",
        url: "/applications/new",
        icon: ClipboardList,
      },
      {
        title: "Existing RC Registration",
        url: "/existing-owner",
        icon: FileText,
      },
      // Adventure Sports and other services will be added here
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help & FAQ",
        url: "/help",
        icon: MessageSquare,
      },
      {
        title: "Grievances",
        url: "/grievances",
        icon: Shield,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "My Services",
        url: "/service-settings",
        icon: Settings,
      },
      {
        title: "Download RC",
        url: "/dashboard?filter=approved",
        icon: Download,
      },
    ],
  },
];

// Officer Navigation Menu (District & State Officers)
export const officerNavigation: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Him-Darshan (State)",
        url: "/state-dashboard",
        icon: Activity,
      },
      {
        title: "Workflow Monitoring",
        url: "/workflow-monitoring",
        icon: BarChart3,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports & Insights",
        url: "/admin/payment-reports",
        icon: LineChart,
      },
      {
        title: "Existing RC",
        url: "/admin/existing-rc",
        icon: FileArchive,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        title: "Baseline Data",
        url: "/admin/baseline-stats",
        icon: Database,
      },
    ],
  },
];

// Admin Navigation Menu - Refined for System Admin (User Mgmt + Apps only)
export const adminNavigation: NavSection[] = [
  {
    title: "Admin",
    items: [
      {
        title: "User Management",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "RC Applications",
        url: "/admin/rc-applications",
        icon: FileText,
      },
      {
        title: "Baseline Data",
        url: "/admin/baseline-stats",
        icon: Database,
      },
    ],
  },
];

// System Admin Navigation Menu - Limited Access
// System Admin Navigation Menu - Limited Access
export const systemAdminNavigation: NavSection[] = [
  {
    title: "Testing Tools",
    items: [
      {
        title: "Test Runner",
        url: "/admin/test-runner",
        icon: TestTube,
      },
    ],
  },
];

// Super Admin Navigation Menu
export const superAdminNavigation: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/admin/super-dashboard",
        icon: Home,
      },
      {
        title: "User Management",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "LGD Import",
        url: "/admin/lgd-import",
        icon: MapPin,
      },
      {
        title: "Super Console",
        url: "/admin/super-console",
        icon: Settings,
      },
      {
        title: "RC Applications",
        url: "/admin/rc-applications",
        icon: FileText,
      },
    ],
  },
  {
    title: "Super Console",
    items: [
      { title: "System Status", url: "/admin/super-console#system-overview", icon: Database },
      { title: "Reset & Seeds", url: "/admin/super-console#reset-zone", icon: RefreshCw },
      { title: "Payments", url: "/admin/super-console#payment-settings", icon: CreditCard },
      { title: "Communications", url: "/admin/super-console#communications", icon: MessageSquare },
      { title: "Security", url: "/admin/super-console#security", icon: Shield },
      { title: "District Staff", url: "/admin/super-console#staff-tools", icon: Users },
      { title: "Smoke Tests", url: "/admin/super-console#smoke-tests", icon: Server },
      { title: "Test Data", url: "/admin/super-console#test-data", icon: TestTube },
      { title: "Baseline Data", url: "/admin/baseline-stats", icon: Database },
      { title: "Policy Settings", url: "/admin/policy-settings", icon: Settings },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Workflow Monitor",
        url: "/workflow-monitoring",
        icon: BarChart3,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports & Insights",
        url: "/admin/payment-reports",
        icon: LineChart,
      },
      {
        title: "Existing RC",
        url: "/admin/existing-rc",
        icon: FileArchive,
      },
    ],
  },
];

// Dealing Assistant Navigation Menu - 5 Sections per R1.0 Architecture
export const daNavigation: NavSection[] = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        url: "/da/dashboard",  // STABLE stage-based layout
        icon: Home,
      },
    ],
  },
  {
    title: "Work Queues",
    items: [
      {
        title: "New Applications",
        url: "/da/dashboard",
        icon: ClipboardList,
      },
      {
        title: "Inspections",
        url: "/da/inspections",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Existing RC",
    items: [
      {
        title: "Existing RC Queue",
        url: "/da/legacy",
        icon: FileText,
      },
    ],
  },
  {
    title: "Grievances",
    items: [
      {
        title: "Open Tickets",
        url: "/da/grievances",
        icon: MessageSquare,
      },
      // More grievance items in Phase 4
    ],
  },
  {
    title: "Insights",
    items: [
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart,
      },
      {
        title: "Workflow Monitor",
        url: "/workflow-monitoring",
        icon: Activity,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        title: "Search",
        url: "/da/search",
        icon: Search,
      },
      {
        title: "My Profile",
        url: "/da/profile",
        icon: User,
      },
    ],
  },
];

// DTDO Navigation Menu - 5 Sections per R1.0 Architecture
export const dtdoNavigation: NavSection[] = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        url: "/dtdo/dashboard",  // STABLE stage-based layout
        icon: Home,
      },
    ],
  },
  {
    title: "Work Queues",
    items: [
      {
        title: "New Applications",
        url: "/dtdo/dashboard",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Existing RC",
    items: [
      {
        title: "Existing RC Queue",
        url: "/dtdo/legacy",
        icon: FileText,
      },
    ],
  },
  {
    title: "Grievances",
    items: [
      {
        title: "Open Tickets",
        url: "/dtdo/grievances",
        icon: MessageSquare,
      },
      // More grievance items in Phase 4
    ],
  },
  {
    title: "Insights",
    items: [
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart,
      },
      {
        title: "Workflow Monitor",
        url: "/workflow-monitoring",
        icon: Activity,
      },
      {
        title: "Reports & Insights",
        url: "/admin/payment-reports",
        icon: LineChart,
      },
      {
        title: "Existing RC",
        url: "/admin/existing-rc",
        icon: FileArchive,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        title: "Search",
        url: "/dtdo/search",
        icon: Search,
      },
      {
        title: "My Profile",
        url: "/dtdo/profile",
        icon: User,
      },
    ],
  },
];

// Get navigation based on user role
export function getNavigationForRole(role: string): NavSection[] {
  if (role === 'super_admin') {
    return superAdminNavigation;
  }
  if (role === 'system_admin') {
    return systemAdminNavigation;
  }
  if (role === 'admin') {
    return adminNavigation;
  }
  if (role === 'dealing_assistant') {
    return daNavigation;
  }
  if (role === 'district_tourism_officer' || role === 'district_officer') {
    return dtdoNavigation; // DTDO has dedicated navigation
  }
  if (role === 'state_officer') {
    return officerNavigation;
  }
  return ownerNavigation;
}

// Get default route for role
export function getDefaultRouteForRole(role: string): string {
  if (role === 'super_admin') {
    return '/admin/super-dashboard';
  }
  if (role === 'system_admin') {
    return '/admin/test-runner';
  }
  if (role === 'admin') {
    return '/admin/users';
  }
  if (role === 'dealing_assistant') {
    return '/da/dashboard';  // Stable dashboard layout
  }
  if (role === 'district_tourism_officer' || role === 'district_officer') {
    return '/dtdo/dashboard';  // Stable dashboard layout
  }
  if (role === 'state_officer') {
    return '/workflow-monitoring';
  }
  // All other roles now land on /dashboard with role-specific content
  return '/dashboard';
}
