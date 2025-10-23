import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textToImageInputSchema, TextToImageInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sparkles } from "lucide-react";

interface TextToImageFormProps {
  onGenerate: (input: TextToImageInput) => void;
  isGenerating: boolean;
  disabled?: boolean;
  initialPrompt?: string;
}

export function TextToImageForm({ onGenerate, isGenerating, disabled, initialPrompt }: TextToImageFormProps) {
  const form = useForm<TextToImageInput>({
    resolver: zodResolver(textToImageInputSchema),
    defaultValues: {
      prompt: "",
      aspect_ratio: "3:2",
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

  const handleSubmit = (data: TextToImageInput) => {
    onGenerate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Prompt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the image you want to generate in detail..."
                  className="min-h-24 md:min-h-32 resize-none text-base"
                  disabled={disabled}
                  data-testid="input-prompt"
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
                    <SelectTrigger data-testid="select-aspect-ratio">
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
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-num-images">
                      <SelectValue placeholder="Select count" />
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
                    <SelectTrigger data-testid="select-output-format">
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
          disabled={disabled || isGenerating}
          data-testid="button-generate"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </form>
    </Form>
  );
}
