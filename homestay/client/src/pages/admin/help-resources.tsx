import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, LinkIcon, Video, FileText, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type HelpResource = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  contentUrl: string | null;
  contentBody: string | null;
  isActive: boolean;
  displayOrder: number;
};

export default function AdminHelpResources() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<HelpResource | null>(null);

  const { data: resourcesResponse, isLoading } = useQuery<{ resources: HelpResource[] }>({
    queryKey: ['/api/help/admin'],
  });

  const generateEmptyResource = (): Partial<HelpResource> => ({
    title: "",
    description: "",
    type: "faq",
    contentUrl: "",
    contentBody: "",
    isActive: true,
    displayOrder: 0,
  });

  const [formData, setFormData] = useState<Partial<HelpResource>>(generateEmptyResource());

  const handleOpenDialog = (resource?: HelpResource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData(resource);
    } else {
      setEditingResource(null);
      setFormData(generateEmptyResource());
    }
    setIsDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<HelpResource>) => {
      if (editingResource) {
        return apiRequest("PATCH", `/api/help/${editingResource.id}`, data);
      } else {
        return apiRequest("POST", "/api/help", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/help/admin'] });
      queryClient.invalidateQueries({ queryKey: ['/api/help'] });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Help resource saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/help/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/help/admin'] });
      queryClient.invalidateQueries({ queryKey: ['/api/help'] });
      toast({ title: "Success", description: "Help resource deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSave = () => {
    if (!formData.title || !formData.type) {
      toast({ title: "Validation Error", description: "Title and Type are required.", variant: "destructive" });
      return;
    }
    saveMutation.mutate(formData);
  };

  const resources = resourcesResponse?.resources || [];

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Help & FAQ</h1>
          <p className="text-muted-foreground">Add and organize videos, PDFs, and FAQs for users.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Resource
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <Card key={resource.id} className={!resource.isActive ? "opacity-60" : ""}>
              <CardContent className="flex items-start justify-between p-4">
                <div className="flex gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {resource.type === 'video' && <Video className="w-5 h-5 text-primary" />}
                    {resource.type === 'pdf' && <FileText className="w-5 h-5 text-primary" />}
                    {resource.type === 'faq' && <HelpCircle className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {resource.title}
                      {!resource.isActive && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">Inactive</span>}
                    </h3>
                    {resource.description && <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>}
                    
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <span className="capitalize border px-1.5 rounded">{resource.type}</span>
                      <span>Order: {resource.displayOrder}</span>
                      {resource.contentUrl && (
                        <span className="flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> URL Attached
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(resource)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (confirm("Are you sure you want to delete this resource?")) {
                      deleteMutation.mutate(resource.id);
                    }
                  }} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {resources.length === 0 && (
            <div className="text-center p-8 border rounded-lg bg-gray-50 text-gray-500">
              No resources found. Click "Add Resource" to create one.
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Title *</Label>
                <Input 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g., How to apply for a new registration?" 
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Short Description</Label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Brief description shown in card list..." 
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Resource Type *</Label>
                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faq">FAQ (Text Answer)</SelectItem>
                    <SelectItem value="video">Video Tutorial</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Display Order (Priority)</Label>
                <Input 
                  type="number"
                  value={formData.displayOrder || 0} 
                  onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})} 
                  placeholder="0" 
                />
              </div>

              {['video', 'pdf'].includes(formData.type || '') && (
                <div className="space-y-2 col-span-2">
                  <Label>External URL (Video embed or PDF link)</Label>
                  <Input 
                    value={formData.contentUrl || ''} 
                    onChange={e => setFormData({...formData, contentUrl: e.target.value})} 
                    placeholder="https://..." 
                  />
                  <p className="text-xs text-muted-foreground">For youtube/vimeo use embed URLs.</p>
                </div>
              )}

              {formData.type === 'faq' && (
                <div className="space-y-2 col-span-2">
                  <Label>Answer / Content Body</Label>
                  <Textarea 
                    value={formData.contentBody || ''} 
                    onChange={e => setFormData({...formData, contentBody: e.target.value})} 
                    placeholder="Write the full answer here..." 
                    rows={6}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 col-span-2 pt-2 border-t mt-2">
                <Switch 
                  id="active" 
                  checked={formData.isActive} 
                  onCheckedChange={c => setFormData({...formData, isActive: c})} 
                />
                <Label htmlFor="active">Publish to users (Active)</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
