import { GenerationResult } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Pencil, Shuffle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GenerationOutputProps {
  results: GenerationResult[];
}

export function GenerationOutput({ results }: GenerationOutputProps) {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.images.map((image, imgIdx) => (
              <Card
                key={imgIdx}
                className="group relative overflow-hidden"
                data-testid={`card-image-${resultIdx}-${imgIdx}`}
              >
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={result.prompt || "Generated image"}
                    className="w-full h-full object-cover"
                    data-testid={`img-generated-${resultIdx}-${imgIdx}`}
                  />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(
                        image.url,
                        image.file_name || `reve-${result.model}-${Date.now()}.png`
                      )}
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
