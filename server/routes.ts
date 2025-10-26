import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fal } from "@fal-ai/client";
import {
  textToImageInputSchema,
  editInputSchema,
  remixInputSchema,
} from "@shared/schema";

// Helper function to upload base64 image to FAL storage
async function uploadImageIfNeeded(imageUrl: string, apiKey: string): Promise<string> {
  // If it's already a URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a data URL, upload to FAL storage
  if (imageUrl.startsWith('data:')) {
    try {
      fal.config({ credentials: apiKey });
      
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Upload to FAL storage
      const uploadedUrl = await fal.storage.upload(blob);
      return uploadedUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  return imageUrl;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Text-to-Image Generation
  app.post("/api/generate/text-to-image", async (req, res) => {
    try {
      const { apiKey, ...input } = req.body;

      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      // Validate input
      const validatedInput = textToImageInputSchema.parse(input);

      // Configure FAL client with user's API key
      fal.config({
        credentials: apiKey,
      });

      // Call FAL.ai Reve text-to-image API
      const result = await fal.subscribe("fal-ai/reve/text-to-image", {
        input: validatedInput,
        logs: false,
      });

      // Extract images from result
      const images = result.data?.images || [];

      // Save to history
      const generationResult = {
        images,
        prompt: validatedInput.prompt,
        model: "text-to-image" as const,
        timestamp: Date.now(),
      };

      await storage.saveGeneration(generationResult);

      res.json(generationResult);
    } catch (error) {
      console.error("Text-to-image generation error:", error);
      
      let message = "Failed to generate image";
      if (error instanceof Error) {
        message = error.message;
      }
      
      res.status(500).json({ message });
    }
  });

  // Image Edit
  app.post("/api/generate/edit", async (req, res) => {
    try {
      const { apiKey, ...input } = req.body;

      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      // Validate input
      const validatedInput = editInputSchema.parse(input);

      // Upload image if it's a data URL
      const imageUrl = await uploadImageIfNeeded(validatedInput.image_url, apiKey);

      // Configure FAL client with user's API key
      fal.config({
        credentials: apiKey,
      });

      // Call FAL.ai Reve edit API
      const result = await fal.subscribe("fal-ai/reve/edit", {
        input: {
          ...validatedInput,
          image_url: imageUrl,
        },
        logs: false,
      });

      // Extract images from result
      const images = result.data?.images || [];

      // Save to history
      const generationResult = {
        images,
        prompt: validatedInput.prompt,
        model: "edit" as const,
        timestamp: Date.now(),
      };

      await storage.saveGeneration(generationResult);

      res.json(generationResult);
    } catch (error) {
      console.error("Image edit error:", error);
      
      let message = "Failed to edit image";
      if (error instanceof Error) {
        message = error.message;
      }
      
      res.status(500).json({ message });
    }
  });

  // Image Remix
  app.post("/api/generate/remix", async (req, res) => {
    try {
      const { apiKey, ...input } = req.body;

      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }

      // Validate input
      const validatedInput = remixInputSchema.parse(input);

      // Upload all images if they are data URLs
      const uploadedImageUrls = await Promise.all(
        validatedInput.image_urls.map(url => uploadImageIfNeeded(url, apiKey))
      );

      // Configure FAL client with user's API key
      fal.config({
        credentials: apiKey,
      });

      // Call FAL.ai Reve remix API
      const result = await fal.subscribe("fal-ai/reve/remix", {
        input: {
          prompt: validatedInput.prompt,
          image_urls: uploadedImageUrls,
          aspect_ratio: validatedInput.aspect_ratio,
          num_images: validatedInput.num_images,
          output_format: validatedInput.output_format,
        } as any,
        logs: false,
      });

      // Extract images from result
      const images = result.data?.images || [];

      // Save to history
      const generationResult = {
        images,
        prompt: validatedInput.prompt,
        model: "remix" as const,
        timestamp: Date.now(),
      };

      await storage.saveGeneration(generationResult);

      res.json(generationResult);
    } catch (error) {
      console.error("Image remix error:", error);
      
      let message = "Failed to remix image";
      if (error instanceof Error) {
        message = error.message;
      }
      
      res.status(500).json({ message });
    }
  });

  // Get generation history
  app.get("/api/generations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const generations = await storage.getGenerations(limit);
      res.json(generations);
    } catch (error) {
      console.error("Get generations error:", error);
      res.status(500).json({
        message: "Failed to retrieve generation history",
      });
    }
  });

  // Clear generation history
  app.delete("/api/generations", async (req, res) => {
    try {
      await storage.clearGenerations();
      res.json({ message: "Generation history cleared" });
    } catch (error) {
      console.error("Clear generations error:", error);
      res.status(500).json({
        message: "Failed to clear generation history",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
