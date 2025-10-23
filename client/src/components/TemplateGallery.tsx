import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromptTemplate } from "@shared/schema";
import { Sparkles, Pencil, Shuffle } from "lucide-react";

interface TemplateGalleryProps {
  templates: PromptTemplate[];
  onSelectTemplate: (template: PromptTemplate) => void;
  selectedTemplateId?: string;
}

export function TemplateGallery({ templates, onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) {
  const getModelIcon = (modelType: string) => {
    switch (modelType) {
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

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" data-testid="text-templates-heading">
          Quick Start Templates
        </h2>
        <Badge variant="secondary" data-testid="badge-template-count">
          {templates.length} templates
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedTemplateId === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectTemplate(template)}
            data-testid={`card-template-${template.id}`}
            aria-selected={selectedTemplateId === template.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTemplate(template);
              }
            }}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm line-clamp-2" data-testid={`text-template-title-${template.id}`}>
                  {template.title}
                </h3>
                <div className="flex-shrink-0">
                  {getModelIcon(template.modelType)}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-3" data-testid={`text-template-prompt-${template.id}`}>
                {template.prompt}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {template.category}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
