import { useState } from "react";
import { GenerationResult } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Pencil, Shuffle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GenerationOutputProps {
  results: GenerationResult[];
}

interface SelectedImage {
  url: string;
  prompt: string;
  fileName: string;
  width?: number;
  height?: number;
}

export function GenerationOutput({ results }: GenerationOutputProps) {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'reve-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case "text-to-image":
        return <Sparkles className="h-3 w-3" />;
      case "edit":
        return <Pencil className="h-3 w-3" />;
      case "remix":
        return <Shuffle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getModelLabel = (model: string) => {
    switch (model) {
      case "text-to-image":
        return "Text-to-Image";
      case "edit":
        return "Edit";
      case "remix":
        return "Remix";
      default:
        return model;
    }
  };

  if (results.length === 0) {
    return (
      <Card className="p-12 text-center" data-testid="card-empty-state">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Sparkles className="h-16 w-16 opacity-20" />
          <div>
            <p className="text-lg font-medium">No images generated yet</p>
            <p className="text-sm">Select a template or enter a prompt to get started</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" data-testid="text-output-heading">
          Generated Images
        </h2>
        <Badge variant="secondary" data-testid="badge-generation-count">
          {results.reduce((acc, r) => acc + r.images.length, 0)} images
        </Badge>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {selectedImage && (
            <div className="flex flex-col h-full">
              <DialogHeader className="px-6 py-4 border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base line-clamp-2">
                      {selectedImage.prompt}
                    </DialogTitle>
                    {selectedImage.width && selectedImage.height && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedImage.width} × {selectedImage.height}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedImage.url, selectedImage.fileName)}
                    data-testid="button-modal-download"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    İndir
                  </Button>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-auto p-6">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="w-full h-auto rounded-lg"
                  data-testid="img-modal-preview"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {results.map((result, resultIdx) => (
        <div key={resultIdx} className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getModelIcon(result.model)}
              {getModelLabel(result.model)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>

          {result.prompt && (
            <Card className="p-4 bg-muted/50">
              <p className="text-sm" data-testid={`text-result-prompt-${resultIdx}`}>
                <span className="font-semibold">Prompt:</span> {result.prompt}
              </p>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.images.map((image, imgIdx) => (
              <Card
                key={imgIdx}
                className="group relative overflow-hidden cursor-pointer hover-elevate transition-all"
                data-testid={`card-image-${resultIdx}-${imgIdx}`}
                onClick={() => setSelectedImage({
                  url: image.url,
                  prompt: result.prompt || "Generated image",
                  fileName: image.file_name || `reve-${result.model}-${Date.now()}.png`,
                  width: image.width,
                  height: image.height,
                })}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={image.url}
                    alt={result.prompt || "Generated image"}
                    className="w-full h-full object-cover"
                    data-testid={`img-generated-${resultIdx}-${imgIdx}`}
                  />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(
                          image.url,
                          image.file_name || `reve-${result.model}-${Date.now()}.png`
                        );
                      }}
                      className="backdrop-blur-md"
                      data-testid={`button-download-${resultIdx}-${imgIdx}`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {(image.width && image.height) && (
                  <div className="p-3 bg-muted/50 text-xs text-muted-foreground text-center">
                    {image.width} × {image.height}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
