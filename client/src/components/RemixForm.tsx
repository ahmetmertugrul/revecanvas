import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { remixInputSchema, RemixInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Shuffle, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RemixFormProps {
  onGenerate: (input: RemixInput) => void;
  isGenerating: boolean;
  disabled?: boolean;
  initialPrompt?: string;
}

export function RemixForm({ onGenerate, isGenerating, disabled, initialPrompt }: RemixFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<RemixInput>({
    resolver: zodResolver(remixInputSchema),
    defaultValues: {
      prompt: "",
      image_url: "",
      aspect_ratio: "1:1",
      num_images: 1,
      output_format: "png",
    },
  });

  // Update form when initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      form.setValue("prompt", initialPrompt);
    }
  }, [initialPrompt, form]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("image_url", result);
        setUploadedImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }, [form, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("image_url", result);
        setUploadedImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  }, [form]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadedImageUrl("");
    form.setValue("image_url", "");
  };

  const handleSubmit = (data: RemixInput) => {
    if (!uploadedImageUrl) {
      toast({
        title: "Image required",
        description: "Please upload a reference image",
        variant: "destructive",
      });
      return;
    }
    onGenerate({ ...data, image_url: uploadedImageUrl });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel className="text-base font-semibold">Upload Reference Image</FormLabel>
          
          {!imagePreview ? (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                id="remix-reference-image-upload"
                disabled={disabled}
                data-testid="input-remix-file-upload"
              />
              <Card 
                className="border-2 border-dashed p-8 text-center hover-elevate transition-all cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => !disabled && fileInputRef.current?.click()}
                data-testid="dropzone-remix-upload"
              >
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drop your reference image here or click to upload</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, or WebP</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="relative p-4">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={clearImage}
                data-testid="button-clear-remix-image"
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={imagePreview}
                alt="Reference"
                className="w-full h-auto rounded-lg"
                data-testid="img-remix-preview"
              />
            </Card>
          )}
        </div>

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Style Prompt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the style you want to apply..."
                  className="min-h-24 md:min-h-32 resize-none text-base"
                  disabled={disabled}
                  data-testid="input-remix-prompt"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="aspect_ratio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aspect Ratio</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-remix-aspect-ratio">
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="3:2">3:2 (Photo)</SelectItem>
                    <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                    <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                    <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="num_images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Images</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(parseInt(val))}
                  value={field.value.toString()}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-remix-num-images">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 Image</SelectItem>
                    <SelectItem value="2">2 Images</SelectItem>
                    <SelectItem value="3">3 Images</SelectItem>
                    <SelectItem value="4">4 Images</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="output_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output Format</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-remix-output-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto px-12 h-12"
          disabled={disabled || isGenerating || !uploadedImageUrl}
          data-testid="button-remix-generate"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          {isGenerating ? "Remixing..." : "Remix Image"}
        </Button>
      </form>
    </Form>
  );
}
