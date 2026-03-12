import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDateIST } from "@/lib/dateUtils";
import type { HomestayApplication, User } from "@shared/schema";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Eye,
  FileText,
} from "lucide-react";

type SearchPayload = {
  textSearch?: string;
  applicationNumber?: string;
  ownerMobile?: string;
  ownerAadhaar?: string;
  status?: string;
  district?: string;
  paymentStatus?: string;
  applicationKind?: string;
  fromDate?: string;
  toDate?: string;
  limit?: string;
  offset?: string;
};

type SearchResponse = {
  results: HomestayApplication[];
  totalCount: number;
  limit: number;
  offset: number;
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 border-gray-200" },
  submitted: { label: "New", color: "bg-blue-50 text-blue-700 border-blue-200" },
  under_scrutiny: { label: "Under Scrutiny", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  forwarded_to_dtdo: { label: "→ DTDO", color: "bg-violet-50 text-violet-700 border-violet-200" },
  dtdo_review: { label: "DTDO Review", color: "bg-purple-50 text-purple-700 border-purple-200" },
  inspection_scheduled: { label: "Inspection", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  inspection_complete: { label: "Inspected", color: "bg-teal-50 text-teal-700 border-teal-200" },
  payment_pending: { label: "Payment Due", color: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Approved", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reverted_by_dtdo: { label: "Reverted", color: "bg-orange-50 text-orange-700 border-orange-200" },
  objection_raised: { label: "Objection", color: "bg-red-50 text-red-700 border-red-200" },
  reverted_to_applicant: { label: "Sent Back", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  sent_back_for_corrections: { label: "Corrections", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-800 border-red-300" },
  site_inspection_scheduled: { label: "Inspection", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
};

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "New (Submitted)" },
  { value: "under_scrutiny", label: "Under Scrutiny" },
  { value: "forwarded_to_dtdo", label: "Forwarded to DTDO" },
  { value: "dtdo_review", label: "DTDO Review" },
  { value: "inspection_scheduled", label: "Inspection Scheduled" },
  { value: "inspection_complete", label: "Inspection Complete" },
  { value: "payment_pending", label: "Payment Pending" },
  { value: "approved", label: "Approved" },
  { value: "reverted_by_dtdo", label: "Reverted by PA" },
  { value: "objection_raised", label: "DTDO Objection" },
  { value: "reverted_to_applicant", label: "Sent Back" },
  { value: "rejected", label: "Rejected" },
];

const PAGE_SIZE = 25;

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] || { label: status, color: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function OfficerApplicationSearch() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [appTypeFilter, setAppTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<HomestayApplication[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/me"],
  });

  const role = userData?.user?.role ?? "";
  const isStateLevel = ["super_admin", "admin", "state_officer", "supervisor_hq", "payment_officer"].includes(role);

  const detailBasePath = useMemo(() => {
    if (role === "dealing_assistant") return "/da/applications/";
    if (role === "district_tourism_officer") return "/dtdo/applications/";
    if (role === "district_officer") return "/da/applications/";
    return "/da/applications/";
  }, [role]);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 350);
    return () => clearTimeout(timer);
  }, [searchText]);

  const searchMutation = useMutation({
    mutationFn: async (payload: SearchPayload) => {
      const response = await apiRequest("POST", "/api/applications/search", payload);
      return response.json() as Promise<SearchResponse>;
    },
    onSuccess: (data) => {
      setResults(data.results ?? []);
      setTotalCount(data.totalCount ?? 0);
      setHasSearched(true);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Search failed.";
      toast({ title: "Search Error", description: message, variant: "destructive" });
    },
  });

  const executeSearch = useCallback(
    (pageOverride?: number) => {
      const currentPage = pageOverride ?? page;
      const payload: SearchPayload = {
        limit: String(PAGE_SIZE),
        offset: String(currentPage * PAGE_SIZE),
      };
      if (debouncedSearch.trim().length >= 2) {
        payload.textSearch = debouncedSearch.trim();
      }
      if (statusFilter !== "all") payload.status = statusFilter;
      if (districtFilter !== "all") payload.district = districtFilter;
      if (paymentFilter !== "all") payload.paymentStatus = paymentFilter;
      if (appTypeFilter !== "all") payload.applicationKind = appTypeFilter;
      if (fromDate) payload.fromDate = fromDate;
      if (toDate) payload.toDate = toDate;

      searchMutation.mutate(payload);
    },
    [debouncedSearch, statusFilter, districtFilter, paymentFilter, appTypeFilter, fromDate, toDate, page, searchMutation],
  );

  // Auto-search on debounced text change or filter change
  useEffect(() => {
    setPage(0);
    executeSearch(0);
  }, [debouncedSearch, statusFilter, districtFilter, paymentFilter, appTypeFilter, fromDate, toDate]);

  // Re-search on page change
  useEffect(() => {
    if (hasSearched) {
      executeSearch();
    }
  }, [page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const activeFilterCount = [
    statusFilter !== "all",
    districtFilter !== "all",
    paymentFilter !== "all",
    appTypeFilter !== "all",
    !!fromDate,
    !!toDate,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setDistrictFilter("all");
    setPaymentFilter("all");
    setAppTypeFilter("all");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Search Applications</h1>
          <p className="text-sm text-muted-foreground">
            Find any application by name, number, mobile, property or district
          </p>
        </div>
      </div>

      {/* Search Bar — THE main input */}
      <Card className="border-primary/20 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type anything — App number, owner name, mobile, homestay name, district..."
                className="pl-10 pr-10 h-11 text-base border-0 bg-muted/40 focus-visible:ring-1 focus-visible:ring-primary/30"
                autoFocus
              />
              {searchText && (
                <button
                  onClick={() => { setSearchText(""); searchInputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`h-11 gap-1.5 shrink-0 ${activeFilterCount > 0 ? "border-primary text-primary" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
              {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t space-y-3">
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* District (state-level roles only) */}
                {isStateLevel && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">District</label>
                    <Select value={districtFilter} onValueChange={setDistrictFilter}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {["Shimla", "Kullu", "Kangra", "Mandi", "Chamba", "Solan", "Sirmaur", "Hamirpur", "Una", "Bilaspur", "Kinnaur", "Lahaul & Spiti"].map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* App Type */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">App Type</label>
                  <Select value={appTypeFilter} onValueChange={setAppTypeFilter}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="new_registration">New Registration</SelectItem>
                      <SelectItem value="legacy_onboarding">Existing RC</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                      <SelectItem value="add_rooms">Add Rooms</SelectItem>
                      <SelectItem value="delete_rooms">Delete Rooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Payment</label>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* From Date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
                    <X className="w-3 h-3 mr-1" /> Clear all
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-0">
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {searchMutation.isPending ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" /> Searching…
                  </span>
                ) : (
                  <>
                    {totalCount.toLocaleString()} application{totalCount !== 1 ? "s" : ""}
                    {debouncedSearch && (
                      <span className="text-muted-foreground font-normal"> matching "{debouncedSearch}"</span>
                    )}
                  </>
                )}
              </span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-sm">
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-1">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Table */}
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold">App No.</TableHead>
                    <TableHead className="font-semibold">Homestay</TableHead>
                    <TableHead className="font-semibold">Owner</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Mobile</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">District</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right font-semibold w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((app) => (
                    <TableRow
                      key={app.id}
                      className="cursor-pointer hover:bg-primary/5 transition-colors"
                      onClick={() => setLocation(`${detailBasePath}${app.id}`)}
                    >
                      <TableCell className="font-mono text-xs font-medium whitespace-nowrap text-primary">
                        {app.applicationNumber}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate text-sm" title={app.propertyName}>
                        {app.propertyName}
                      </TableCell>
                      <TableCell className="text-sm max-w-[120px] truncate" title={app.ownerName}>
                        {app.ownerName}
                      </TableCell>
                      <TableCell className="text-sm font-mono hidden sm:table-cell">
                        {app.ownerMobile}
                      </TableCell>
                      <TableCell className="text-sm hidden md:table-cell">
                        {app.district}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal whitespace-nowrap bg-muted/30">
                          {app.applicationKind === 'legacy_onboarding' ? 'Existing RC' : 
                           app.applicationKind === 'new_registration' ? 'New' : 
                           app.applicationKind?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                        {formatDateIST(app.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); setLocation(`${detailBasePath}${app.id}`); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : hasSearched && !searchMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No applications found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try different keywords or adjust your filters
              </p>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Start typing to search</p>
              <p className="text-xs text-muted-foreground mt-1">
                Search by application number, owner name, mobile, homestay name, or district
              </p>
            </div>
          ) : null}

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="sm" className="h-7 text-xs"
                  disabled={page === 0}
                  onClick={() => setPage(0)}
                >
                  First
                </Button>
                <Button
                  variant="outline" size="sm" className="h-7 text-xs"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline" size="sm" className="h-7 text-xs"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline" size="sm" className="h-7 text-xs"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(totalPages - 1)}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
