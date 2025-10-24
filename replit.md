# Reve AI Image Generator

A modern, single-page web application for generating AI images using FAL.ai's Reve models.

## Overview

This application allows users to create stunning AI-generated images using three powerful Reve AI models:
- **Text-to-Image**: Generate images from text descriptions
- **Edit**: Edit existing images with text instructions
- **Remix**: Transform images with different artistic styles

## Features

- 🎨 Three AI models (Text-to-Image, Edit, Remix)
- 📋 Pre-built prompt templates for quick generation
- 🔐 Secure API key management (stored locally)
- 💾 Session-based generation history
- 📱 Fully responsive design
- 🌙 Professional UI with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- shadcn/ui components
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Express.js
- FAL.ai client SDK (@fal-ai/client)
- In-memory storage for session history
- Zod for validation

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and templates
│   │   └── App.tsx         # Main app component
├── server/
│   ├── routes.ts           # API endpoints
│   └── storage.ts          # In-memory storage
├── shared/
│   └── schema.ts           # Shared type definitions
```

## API Endpoints

- `POST /api/generate/text-to-image` - Generate images from text
- `POST /api/generate/edit` - Edit images with instructions
- `POST /api/generate/remix` - Remix images with styles
- `GET /api/generations` - Get generation history
- `DELETE /api/generations` - Clear generation history

## User Flow

1. User enters their FAL.ai API key in the header
2. Select a model tab (Text-to-Image, Edit, or Remix)
3. Choose a template or enter custom prompt
4. Configure generation parameters (aspect ratio, format, etc.)
5. Click generate to create images
6. View, download, and manage generated images

## API Key Security

- API keys are stored in localStorage (client-side only)
- Keys are sent to backend only for FAL.ai API calls
- Backend acts as a proxy, never persists API keys
- Users maintain full control of their credentials

## Recent Changes

### October 24, 2025
- ✅ **Fixed upload click functionality**: Edit and Remix upload areas now use label wrapping for reliable click-to-upload (native browser behavior)
- ✅ **Improved API key input design**: Eye icon repositioned to right side with better vertical alignment
- ✅ **Enhanced template visuals**: Increased image size (h-32→h-48), larger text (title: text-base font-semibold, prompt: text-sm), better spacing

### October 23, 2025
- ✅ **Fixed upload functionality**: EditForm and RemixForm now support click-to-upload via Card onClick handlers (in addition to drag-and-drop)
- ✅ **Enhanced API key security**: Completely removed localStorage/sessionStorage - API keys now stored ONLY in React state, never persisted
- ✅ **Added AI-generated template preview images**: Each of 8 categories now has unique, AI-generated preview images instead of gradients (landscape, portrait, abstract, product, architecture, fantasy, nature, art)
- ✅ **Corrected Remix API integration**: Updated to match FAL.ai documentation (uses image_urls array, num_images parameter; removed unsupported strength field)

### Initial Setup
- ✅ Initial project setup with fullstack TypeScript
- ✅ Implemented all three Reve AI model interfaces
- ✅ Created 16 pre-built prompt templates
- ✅ Built responsive UI with professional design
- ✅ Integrated FAL.ai client SDK
- ✅ Added session-based generation history

## Development

The application runs on a single port with Vite serving the frontend and Express handling the backend.

**Start command**: `npm run dev`

## Environment

No environment variables needed - users provide their own FAL.ai API keys through the UI.
