import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationRule = {
  id: string;
  label: string;
  description: string;
  smsEnabled: boolean;
  smsTemplate: string;
  emailEnabled: boolean;
  emailSubject: string;
  emailBody: string;
  placeholders: string[];
};

type NotificationSettingsResponse = {
  events: NotificationRule[];
  updatedAt?: string | null;
  updatedBy?: string | null;
};

const humanize = (value?: string | null) => {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const NotificationRuleItem = ({
  rule,
  onUpdate,
  disabled
}: {
  rule: NotificationRule;
  onUpdate: (updater: (rule: NotificationRule) => NotificationRule) => void;
  disabled: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg bg-card transition-all duration-200"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1.5 flex-1 mr-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm">{rule.label}</h4>
            <Badge variant="secondary" className="text-[10px] font-mono uppercase h-5">
              {rule.id}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{rule.description}</p>

          {/* Compact status indicators */}
          <div className="flex items-center gap-3 mt-1">
            <div className={cn("flex items-center gap-1.5 text-xs", rule.smsEnabled ? "text-green-600 dark:text-green-400" : "text-muted-foreground/60")}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-medium">{rule.smsEnabled ? "SMS On" : "SMS Off"}</span>
            </div>
            <div className={cn("flex items-center gap-1.5 text-xs", rule.emailEnabled ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground/60")}>
              <Mail className="w-3.5 h-3.5" />
              <span className="font-medium">{rule.emailEnabled ? "Email On" : "Email Off"}</span>
            </div>
          </div>
        </div>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full hover:bg-muted">
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="px-4 pb-4 pt-0 space-y-4 border-t bg-muted/5 mt-2 pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-medium text-muted-foreground mr-2">Variables:</span>
            {rule.placeholders.map((token) => (
              <Badge key={token} variant="outline" className="text-[10px] font-mono bg-background">
                {`{{${token}}}`}
              </Badge>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* SMS Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">SMS Template</Label>
                </div>
                <Switch
                  checked={rule.smsEnabled}
                  onCheckedChange={(checked) =>
                    onUpdate((current) => ({ ...current, smsEnabled: checked }))
                  }
                  disabled={disabled}
                  className="scale-90"
                />
              </div>
              <Textarea
                value={rule.smsTemplate}
                onChange={(e) =>
                  onUpdate((current) => ({ ...current, smsTemplate: e.target.value }))
                }
                placeholder="Enter SMS template"
                disabled={!rule.smsEnabled || disabled}
                className="min-h-[120px] text-xs font-mono"
              />
            </div>

            {/* Email Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Email Content</Label>
                </div>
                <Switch
                  checked={rule.emailEnabled}
                  onCheckedChange={(checked) =>
                    onUpdate((current) => ({ ...current, emailEnabled: checked }))
                  }
                  disabled={disabled}
                  className="scale-90"
                />
              </div>
              <Input
                value={rule.emailSubject}
                onChange={(e) =>
                  onUpdate((current) => ({ ...current, emailSubject: e.target.value }))
                }
                placeholder="Email Subject"
                disabled={!rule.emailEnabled || disabled}
                className="h-8 text-sm"
              />
              <Textarea
                value={rule.emailBody}
                onChange={(e) =>
                  onUpdate((current) => ({ ...current, emailBody: e.target.value }))
                }
                placeholder="Email Body (HTML supported)"
                disabled={!rule.emailEnabled || disabled}
                className="min-h-[140px] text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const NotificationRulesCard = () => {
  const { toast } = useToast();
  const { data, isLoading, refetch } = useQuery<NotificationSettingsResponse>({
    queryKey: ["/api/admin/notifications"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/notifications");
      return (await response.json()) as NotificationSettingsResponse;
    },
  });
  const [rules, setRules] = useState<NotificationRule[]>([]);

  useEffect(() => {
    if (data?.events) {
      setRules(data.events);
    }
  }, [data?.events]);

  const notificationsMutation = useMutation({
    mutationFn: async (payload: { events: NotificationRule[] }) =>
      apiRequest("PUT", "/api/admin/notifications", payload),
    onSuccess: () => {
      toast({ title: "Notification settings saved" });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update notification settings",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    },
  });

  const lastUpdatedLabel = useMemo(() => {
    if (!data?.updatedAt) return null;
    return humanize(data.updatedAt);
  }, [data?.updatedAt]);

  const handleRuleChange = (id: string, updater: (rule: NotificationRule) => NotificationRule) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? updater(rule) : rule)));
  };

  const canSave = rules.length > 0 && !isLoading;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <CardTitle>Workflow Notifications</CardTitle>
        </div>
        <CardDescription>SMS/email templates for OTP, scrutiny, inspection, and payment milestones</CardDescription>
        {lastUpdatedLabel && (
          <Badge variant="outline" className="w-fit text-xs">
            Updated {lastUpdatedLabel}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.map((rule) => (
          <NotificationRuleItem
            key={rule.id}
            rule={rule}
            onUpdate={(updater) => handleRuleChange(rule.id, updater)}
            disabled={isLoading || notificationsMutation.isPending}
          />
        ))}

        <Button
          onClick={() => notificationsMutation.mutate({ events: rules })}
          disabled={!canSave || notificationsMutation.isPending}
          className="w-full md:w-auto"
        >
          {notificationsMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save notification rules"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
