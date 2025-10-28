import { PromptTemplate } from "@shared/schema";

export const promptTemplates: PromptTemplate[] = [
  // Text-to-Image Templates
  {
    id: "t2i-1",
    title: "Serene Mountain Sunset",
    prompt: "A serene mountain landscape at sunset with snow-capped peaks, dramatic orange and pink sky, reflecting lake in the foreground, ultra realistic, cinematic lighting, 8k quality",
    category: "landscape",
    modelType: "text-to-image",
  },
  {
    id: "t2i-2",
    title: "Professional Portrait",
    prompt: "Professional headshot portrait of a confident person, natural lighting, blurred office background, sharp focus on face, business attire, warm color grading, shot with 85mm lens",
    category: "portrait",
    modelType: "text-to-image",
  },
  {
    id: "t2i-3",
    title: "Abstract Fluid Art",
    prompt: "Abstract fluid art with swirling colors of purple, teal, and gold, smooth gradients, liquid paint texture, contemporary modern art style, high contrast",
    category: "abstract",
    modelType: "text-to-image",
  },
  {
    id: "t2i-4",
    title: "Product Photography",
    prompt: "Professional product photography of a sleek wireless bluetooth speaker, modern minimalist design, white background, studio lighting with soft shadows, commercial quality, high resolution",
    category: "product",
    modelType: "text-to-image",
  },
  {
    id: "t2i-5",
    title: "Modern Architecture",
    prompt: "Modern minimalist architecture exterior, clean geometric lines, glass and concrete materials, natural daylight, surrounded by landscaped garden, architectural photography style",
    category: "architecture",
    modelType: "text-to-image",
  },
  {
    id: "t2i-6",
    title: "Magical Forest",
    prompt: "Enchanted forest with glowing mushrooms, ethereal mist, rays of sunlight filtering through ancient trees, mystical atmosphere, fantasy art style, vibrant colors",
    category: "fantasy",
    modelType: "text-to-image",
  },
  {
    id: "t2i-7",
    title: "Ocean Wave",
    prompt: "Massive ocean wave crashing, turquoise and deep blue water, white foam, dramatic seascape, golden hour lighting, ultra realistic water simulation, 8k detail",
    category: "nature",
    modelType: "text-to-image",
  },
  {
    id: "t2i-8",
    title: "Digital Art Portrait",
    prompt: "Digital art portrait in anime style, vibrant colors, detailed eyes, flowing hair with dynamic movement, soft lighting, expressive character design, high quality illustration",
    category: "art",
    modelType: "text-to-image",
  },
  
  // Edit Templates
  {
    id: "edit-1",
    title: "Add Sunset Glow",
    prompt: "Add a warm golden sunset glow to the scene, enhance colors with orange and pink tones, create dramatic lighting",
    category: "nature",
    modelType: "edit",
  },
  {
    id: "edit-2",
    title: "Professional Retouch",
    prompt: "Professional portrait retouching, enhance skin smoothness while maintaining natural texture, brighten eyes, adjust color balance",
    category: "portrait",
    modelType: "edit",
  },
  {
    id: "edit-3",
    title: "Add Snow Effect",
    prompt: "Transform the scene into a winter wonderland, add realistic snow, create cold atmospheric lighting, white and blue color grading",
    category: "landscape",
    modelType: "edit",
  },
  {
    id: "edit-4",
    title: "Enhance Details",
    prompt: "Enhance fine details and sharpness, increase texture clarity, boost color vibrancy, improve overall image quality",
    category: "product",
    modelType: "edit",
  },
  
  // Remix Templates
  {
    id: "remix-1",
    title: "Watercolor Style",
    prompt: "Transform into a beautiful watercolor painting, soft blended colors, artistic brushstrokes, paper texture, impressionist style",
    category: "art",
    modelType: "remix",
  },
  {
    id: "remix-2",
    title: "Cyberpunk Aesthetic",
    prompt: "Reimagine in cyberpunk style with neon lights, futuristic elements, dark atmosphere, vibrant pink and cyan colors, dystopian sci-fi aesthetic",
    category: "fantasy",
    modelType: "remix",
  },
  {
    id: "remix-3",
    title: "Oil Painting Classic",
    prompt: "Transform into a classical oil painting, rich textures, dramatic lighting, Renaissance art style, museum quality masterpiece",
    category: "art",
    modelType: "remix",
  },
  {
    id: "remix-4",
    title: "Minimalist Design",
    prompt: "Simplify into minimalist design, clean lines, limited color palette, negative space, modern geometric composition, flat design aesthetic",
    category: "abstract",
    modelType: "remix",
  },
  {
    id: "remix-5",
    title: "Japanese Anime",
    prompt: "The Japanese anime style brings your photo to life with anime's bold, colorful energy. It captures the unique charm of animated storytelling from Japan, with stylized features, dynamic poses, and a touch of drama or fantasy.",
    category: "art",
    modelType: "remix",
  },
  {
    id: "remix-6",
    title: "Pixar",
    prompt: "Filled with charm and imagination, this style turns your photo into something straight out of a Pixar film. Characters become more expressive, scenes feel animated and alive, and everything carries a warm, storybook quality that's both fun and heartfelt.",
    category: "art",
    modelType: "remix",
  },
  {
    id: "remix-7",
    title: "Marvel",
    prompt: "Packed with intensity and heroic flair, this style reimagines your photo as part of the Marvel universe. Expect dynamic poses, cinematic lighting, and larger-than-life energy that captures the excitement of epic battles and legendary characters.",
    category: "fantasy",
    modelType: "remix",
  },
  {
    id: "remix-8",
    title: "Origami",
    prompt: "Clean folds, sharp edges, and a minimalist charm define this style, turning your photo into a scene crafted entirely from paper. With a delicate, geometric look, it captures the elegance of traditional origami while giving your image a fresh and artistic twist.",
    category: "abstract",
    modelType: "remix",
  },
  {
    id: "remix-9",
    title: "Vaporwave / 90's",
    prompt: "Dreamy neon colors, glitchy textures, and retro-futuristic vibes define this throwback style. Inspired by 90s aesthetics and early internet culture, it gives your photo a surreal, nostalgic feel, like a lost scene from an old VHS tape or a synthwave album cover.",
    category: "abstract",
    modelType: "remix",
  },
  {
    id: "remix-10",
    title: "LEGO",
    prompt: "With blocky shapes, bright colors, and a playful twist, this style rebuilds your photo as if made entirely from LEGO bricks. Characters become minifigures, and scenes take on a toy-like charm full of fun and creativity.",
    category: "art",
    modelType: "remix",
  },
];

export const getTemplatesByModel = (modelType: string) => {
  return promptTemplates.filter(t => t.modelType === modelType);
};

export const getTemplatesByCategory = (category: string) => {
  return promptTemplates.filter(t => t.category === category);
};
