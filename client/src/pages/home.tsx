import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ModelTabs } from "@/components/ModelTabs";
import { TemplateGallery } from "@/components/TemplateGallery";
import { TextToImageForm } from "@/components/TextToImageForm";
import { EditForm } from "@/components/EditForm";
import { RemixForm } from "@/components/RemixForm";
import { GenerationOutput } from "@/components/GenerationOutput";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { promptTemplates, getTemplatesByModel } from "@/lib/templates";
import { GenerationResult, TextToImageInput, EditInput, RemixInput, PromptTemplate } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [activeModel, setActiveModel] = useState<string>("text-to-image");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<GenerationResult[]>([]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
  };

  const handleModelChange = (model: string) => {
    setActiveModel(model);
    setSelectedTemplate(null);
    setError("");
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setError("");
  };

  const handleTextToImageGenerate = async (input: TextToImageInput) => {
    if (!apiKey) {
      setError("Please enter your FAL.ai API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...input, apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Generation failed");
      }

      const data = await response.json();
      
      const newResult: GenerationResult = {
        images: data.images,
        prompt: input.prompt,
        model: "text-to-image",
        timestamp: Date.now(),
      };

      setResults((prev) => [newResult, ...prev]);
      setSelectedTemplate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditGenerate = async (input: EditInput) => {
    if (!apiKey) {
      setError("Please enter your FAL.ai API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...input, apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Edit failed");
      }

      const data = await response.json();
      
      const newResult: GenerationResult = {
        images: data.images,
        prompt: input.prompt,
        model: "edit",
        timestamp: Date.now(),
      };

      setResults((prev) => [newResult, ...prev]);
      setSelectedTemplate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to edit image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemixGenerate = async (input: RemixInput) => {
    if (!apiKey) {
      setError("Please enter your FAL.ai API key");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate/remix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...input, apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Remix failed");
      }

      const data = await response.json();
      
      const newResult: GenerationResult = {
        images: data.images,
        prompt: input.prompt,
        model: "remix",
        timestamp: Date.now(),
      };

      setResults((prev) => [newResult, ...prev]);
      setSelectedTemplate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remix image");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTemplates = getTemplatesByModel(activeModel);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
      
      <ModelTabs activeModel={activeModel} onModelChange={handleModelChange} />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 space-y-8">
        {!apiKey && (
          <Alert data-testid="alert-no-api-key">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please enter your FAL.ai API key in the header to start generating images.
              Get your API key from{" "}
              <a
                href="https://fal.ai/dashboard/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                fal.ai/dashboard/keys
              </a>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="p-6">
              {activeModel === "text-to-image" && (
                <TextToImageForm
                  onGenerate={handleTextToImageGenerate}
                  isGenerating={isGenerating}
                  disabled={!apiKey}
                  initialPrompt={selectedTemplate?.prompt}
                />
              )}

              {activeModel === "edit" && (
                <EditForm
                  onGenerate={handleEditGenerate}
                  isGenerating={isGenerating}
                  disabled={!apiKey}
                  initialPrompt={selectedTemplate?.prompt}
                />
              )}

              {activeModel === "remix" && (
                <RemixForm
                  onGenerate={handleRemixGenerate}
                  isGenerating={isGenerating}
                  disabled={!apiKey}
                  initialPrompt={selectedTemplate?.prompt}
                />
              )}
            </Card>

            <TemplateGallery
              templates={currentTemplates}
              onSelectTemplate={handleTemplateSelect}
              selectedTemplateId={selectedTemplate?.id}
            />
          </div>

          <div className="space-y-6">
            {isGenerating && (
              <LoadingState message="Generating your image with Reve AI..." />
            )}

            {error && !isGenerating && (
              <ErrorState
                error={error}
                onRetry={() => setError("")}
              />
            )}

            <GenerationOutput results={results} />
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>Powered by Reve AI &amp; FAL.ai</p>
            <div className="flex items-center gap-4">
              <a
                href="https://fal.ai/models/fal-ai/reve/text-to-image/api"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-docs"
              >
                Documentation
              </a>
              <a
                href="https://fal.ai/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-pricing"
              >
                API Pricing
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
