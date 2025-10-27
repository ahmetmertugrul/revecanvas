import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { remixInputSchema, RemixInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Shuffle, Upload, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RemixFormProps {
  onGenerate: (input: RemixInput) => void;
  isGenerating: boolean;
  disabled?: boolean;
  initialPrompt?: string;
}

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
  dataUrl: string;
}

export function RemixForm({ onGenerate, isGenerating, disabled, initialPrompt }: RemixFormProps) {
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<RemixInput>({
    resolver: zodResolver(remixInputSchema),
    defaultValues: {
      prompt: "",
      image_urls: [],
      aspect_ratio: "1:1",
      num_images: 1,
      output_format: "png",
    },
  });

  useEffect(() => {
    if (initialPrompt) {
      form.setValue("prompt", initialPrompt);
    }
  }, [initialPrompt, form]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Geçersiz dosya",
        description: "Lütfen resim dosyası seçin",
        variant: "destructive",
      });
      return;
    }

    if (imagePreviews.length + imageFiles.length > 10) {
      toast({
        title: "Çok fazla resim",
        description: "Maksimum 10 resim yükleyebilirsiniz",
        variant: "destructive",
      });
      return;
    }

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const newPreview: ImagePreview = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          dataUrl,
        };
        
        setImagePreviews(prev => {
          const updated = [...prev, newPreview];
          const urls = updated.map(p => p.dataUrl);
          form.setValue("image_urls", urls);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  }, [imagePreviews.length, form, toast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const handleUploadClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeImage = useCallback((id: string) => {
    setImagePreviews(prev => {
      const updated = prev.filter(p => p.id !== id);
      const urls = updated.map(p => p.dataUrl);
      form.setValue("image_urls", urls);
      
      const toRevoke = prev.find(p => p.id === id);
      if (toRevoke) {
        URL.revokeObjectURL(toRevoke.preview);
      }
      
      return updated;
    });
  }, [form]);

  const handleSubmit = (data: RemixInput) => {
    if (imagePreviews.length === 0) {
      toast({
        title: "Resim gerekli",
        description: "Lütfen en az 1 referans resim yükleyin",
        variant: "destructive",
      });
      return;
    }
    onGenerate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base font-semibold">
              Referans Resimleri Yükle
            </FormLabel>
            {imagePreviews.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {imagePreviews.length} / 10 resim
              </span>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="remix-reference-images-upload"
            disabled={disabled || imagePreviews.length >= 10}
            data-testid="input-remix-file-upload"
            multiple
          />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {imagePreviews.map((preview) => (
                <Card key={preview.id} className="relative group overflow-hidden aspect-square">
                  <img
                    src={preview.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    data-testid={`img-remix-preview-${preview.id}`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7 shadow-md"
                    onClick={() => removeImage(preview.id)}
                    data-testid={`button-remove-image-${preview.id}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Card>
              ))}
              
              {imagePreviews.length < 10 && (
                <Card
                  className="aspect-square border-2 border-dashed flex items-center justify-center hover-elevate transition-all cursor-pointer"
                  onClick={!disabled ? handleUploadClick : undefined}
                  data-testid="card-add-more-images"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                    <Plus className="h-8 w-8" />
                    <span className="text-xs font-medium">Daha Ekle</span>
                  </div>
                </Card>
              )}
            </div>
          )}

          {imagePreviews.length === 0 && (
            <Card 
              className="border-2 border-dashed p-8 text-center hover-elevate transition-all cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={!disabled ? handleUploadClick : undefined}
              data-testid="dropzone-remix-upload"
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">Referans resimlerinizi buraya sürükleyin veya tıklayın</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, veya WebP (Maksimum 10 resim)</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Stil Prompt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Uygulamak istediğiniz stili tanımlayın..."
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
                <FormLabel>En-Boy Oranı</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-remix-aspect-ratio">
                      <SelectValue placeholder="Oran seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Kare)</SelectItem>
                    <SelectItem value="16:9">16:9 (Yatay)</SelectItem>
                    <SelectItem value="9:16">9:16 (Dikey)</SelectItem>
                    <SelectItem value="3:2">3:2 (Fotoğraf)</SelectItem>
                    <SelectItem value="2:3">2:3 (Dikey)</SelectItem>
                    <SelectItem value="4:3">4:3 (Klasik)</SelectItem>
                    <SelectItem value="3:4">3:4 (Dikey)</SelectItem>
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
                <FormLabel>Resim Sayısı</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(parseInt(val))}
                  value={field.value.toString()}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-remix-num-images">
                      <SelectValue placeholder="Sayı seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 Resim</SelectItem>
                    <SelectItem value="2">2 Resim</SelectItem>
                    <SelectItem value="3">3 Resim</SelectItem>
                    <SelectItem value="4">4 Resim</SelectItem>
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
                <FormLabel>Çıktı Formatı</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-remix-output-format">
                      <SelectValue placeholder="Format seçin" />
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
          disabled={disabled || isGenerating || imagePreviews.length === 0}
          data-testid="button-remix-generate"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          {isGenerating ? "Remixleniyor..." : "Remix Yap"}
        </Button>
      </form>
    </Form>
  );
}
