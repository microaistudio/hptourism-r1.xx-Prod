import { useQuery } from "@tanstack/react-query";
import HimKoshPaymentPage from "./payment-himkosh-view";
import CCAvenuePaymentPage from "./payment-ccavenue";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentGatewayHandler() {
  const { data, isLoading } = useQuery<{ gateway: string }>({
    queryKey: ["/api/public/settings/payment-gateway"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/public/settings/payment-gateway");
      return res.json();
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data?.gateway === 'ccavenue') {
    return <CCAvenuePaymentPage />;
  }

  // Default to HimKosh
  return <HimKoshPaymentPage />;
}
