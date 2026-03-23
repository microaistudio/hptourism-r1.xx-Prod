import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlayCircle, FileText, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

export default function HelpPage() {
    const { data: response, isLoading } = useQuery<{ resources: HelpResource[] }>({
        queryKey: ['/api/help'],
    });

    const resources = response?.resources || [];

    const videos = resources.filter(r => r.type === 'video');
    const pdfs = resources.filter(r => r.type === 'pdf');
    const faqs = resources.filter(r => r.type === 'faq');

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-6xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Help & Resources</h1>
                    <p className="text-muted-foreground mt-2">
                        Guides, tutorials, and Frequently Asked Questions to help you use the portal.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">Loading...</div>
            ) : (
                <div className="space-y-12">
                    {/* Videos Section */}
                    {videos.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2">
                                <PlayCircle className="w-6 h-6 text-primary" />
                                Video Guides
                            </h2>
                            <div className="grid gap-6 lg:grid-cols-2">
                                {videos.map(video => (
                                    <Card key={video.id} className="border-l-4 border-l-primary flex flex-col h-full">
                                        <CardHeader>
                                            <CardTitle className="text-xl">{video.title}</CardTitle>
                                            {video.description && <CardDescription>{video.description}</CardDescription>}
                                        </CardHeader>
                                        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                                            {video.contentUrl && (
                                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-sm bg-black flex items-center justify-center">
                                                    {video.contentUrl.toLowerCase().endsWith('.mp4') ? (
                                                        <video 
                                                            src={video.contentUrl} 
                                                            controls 
                                                            className="w-full h-full object-contain"
                                                            preload="metadata"
                                                        />
                                                    ) : (
                                                        <iframe
                                                            src={video.contentUrl}
                                                            loading="lazy"
                                                            title={video.title}
                                                            allow="clipboard-write; fullscreen"
                                                            allowFullScreen
                                                            className="absolute top-0 left-0 w-full h-full border-none bg-white"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            {video.contentUrl && video.contentUrl.includes('supademo.com') && (
                                                <div className="flex justify-end mt-4">
                                                    <Button variant="outline" asChild>
                                                        <a
                                                            href={video.contentUrl.replace('/embed/', '/demo/')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                            Open in Full Screen
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PDF Guides / Documents Section */}
                    {pdfs.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2">
                                <FileText className="w-6 h-6 text-primary" />
                                Reference Documents
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pdfs.map(pdf => (
                                    <Card key={pdf.id} className="hover:border-primary/50 transition-colors">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{pdf.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {pdf.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {pdf.description}
                                                </p>
                                            )}
                                            {pdf.contentUrl && (
                                                <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5" asChild>
                                                    <a href={pdf.contentUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        View / Download PDF
                                                    </a>
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQs Section */}
                    {(faqs.length > 0 || resources.length === 0) && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2">
                                <HelpCircle className="w-6 h-6 text-primary" />
                                Frequently Asked Questions
                            </h2>
                            
                            {faqs.length > 0 ? (
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {faqs.map(faq => (
                                        <Card key={faq.id}>
                                            <CardHeader className="pb-3 border-b bg-muted/20">
                                                <CardTitle className="text-base text-primary/90 leading-tight">
                                                    Q: {faq.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                                                    {faq.contentBody?.split('\n').map((line, i) => (
                                                        <p key={i} className="mb-2">{line}</p>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 bg-muted/20 rounded-lg">
                                    <p className="text-muted-foreground">More resources will be added here soon.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
