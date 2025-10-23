import { z } from "zod";

// Reve Model Types
export const aspectRatioEnum = z.enum(["16:9", "9:16", "3:2", "2:3", "4:3", "3:4", "1:1"]);
export const outputFormatEnum = z.enum(["png", "jpeg", "webp"]);
export const modelTypeEnum = z.enum(["text-to-image", "edit", "remix"]);

// Text-to-Image Schema
export const textToImageInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  aspect_ratio: aspectRatioEnum.default("3:2"),
  num_images: z.number().int().min(1).max(4).default(1),
  output_format: outputFormatEnum.default("png"),
  sync_mode: z.boolean().optional(),
});

export type TextToImageInput = z.infer<typeof textToImageInputSchema>;

// Edit Schema - Allow data URLs or regular URLs
export const editInputSchema = z.object({
  prompt: z.string().min(1, "Edit instructions are required"),
  image_url: z.string().min(1, "Image is required"), // Accept data URLs
  aspect_ratio: aspectRatioEnum.default("1:1"),
  output_format: outputFormatEnum.default("png"),
});

export type EditInput = z.infer<typeof editInputSchema>;

// Remix Schema - Allow data URLs or regular URLs  
export const remixInputSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  image_url: z.string().min(1, "Image is required"), // Accept data URLs
  aspect_ratio: aspectRatioEnum.default("1:1"),
  num_images: z.number().int().min(1).max(4).default(1),
  output_format: outputFormatEnum.default("png"),
});

export type RemixInput = z.infer<typeof remixInputSchema>;

// Generated Image Response
export const generatedImageSchema = z.object({
  url: z.string(),
  content_type: z.string().optional(),
  file_name: z.string().optional(),
  file_size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type GeneratedImage = z.infer<typeof generatedImageSchema>;

export const generationResultSchema = z.object({
  images: z.array(generatedImageSchema),
  prompt: z.string().optional(),
  model: modelTypeEnum,
  timestamp: z.number(),
});

export type GenerationResult = z.infer<typeof generationResultSchema>;

// Template Category
export const templateCategoryEnum = z.enum([
  "landscape",
  "portrait", 
  "abstract",
  "product",
  "architecture",
  "nature",
  "art",
  "fantasy"
]);

export type TemplateCategory = z.infer<typeof templateCategoryEnum>;

// Prompt Template
export const promptTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  prompt: z.string(),
  category: templateCategoryEnum,
  previewUrl: z.string().optional(),
  modelType: modelTypeEnum,
});

export type PromptTemplate = z.infer<typeof promptTemplateSchema>;

// API Key Schema
export const apiKeySchema = z.object({
  key: z.string().min(1, "API key is required"),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

// Generation Status
export const generationStatusEnum = z.enum(["idle", "in_progress", "completed", "error"]);

export type GenerationStatus = z.infer<typeof generationStatusEnum>;
