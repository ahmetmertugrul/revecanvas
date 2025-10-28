import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromptTemplate } from "@shared/schema";
import { Sparkles, Pencil, Shuffle } from "lucide-react";

// Import category preview images
import landscapeImg from "@assets/generated_images/Mountain_landscape_sunset_scene_8ce8f6c7.png";
import portraitImg from "@assets/generated_images/Professional_portrait_business_headshot_f4af713f.png";
import abstractImg from "@assets/generated_images/Abstract_fluid_art_colors_c6d042e8.png";
import productImg from "@assets/generated_images/Product_photography_bluetooth_speaker_91ddc4fc.png";
import architectureImg from "@assets/generated_images/Modern_architecture_building_exterior_bc05a2ed.png";
import fantasyImg from "@assets/generated_images/Magical_fantasy_forest_scene_bc038f3c.png";
import natureImg from "@assets/generated_images/Ocean_wave_nature_seascape_050ff4b3.png";
import artImg from "@assets/generated_images/Digital_art_portrait_illustration_1dc8de79.png";

// Import new style preview images
import animeImg from "@assets/stock_images/anime_character_port_b38709d7.jpg";
import pixarImg from "@assets/stock_images/pixar_3d_animated_ch_8e9de0f6.jpg";
import marvelImg from "@assets/stock_images/marvel_superhero_com_2f2e8408.jpg";
import origamiImg from "@assets/stock_images/origami_paper_folded_04498397.jpg";
import vaporwaveImg from "@assets/stock_images/vaporwave_90s_retro__32e66da5.jpg";
import legoImg from "@assets/stock_images/lego_brick_toy_const_a5d52c92.jpg";
import ghibliImg from "@assets/stock_images/studio_ghibli_animat_b997f242.jpg";
import stickerImg from "@assets/stock_images/cute_sticker_design__52dd2c23.jpg";
import storybookImg from "@assets/stock_images/fantasy_storybook_il_b72a8e64.jpg";
import puppetImg from "@assets/stock_images/puppet_felt_handmade_6b7d4244.jpg";

interface TemplateGalleryProps {
  templates: PromptTemplate[];
  onSelectTemplate: (template: PromptTemplate) => void;
  selectedTemplateId?: string;
}

export function TemplateGallery({
  templates,
  onSelectTemplate,
  selectedTemplateId,
}: TemplateGalleryProps) {
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

  const getTemplateImage = (template: PromptTemplate) => {
    // Map by template title (same across all models)
    const styleImages: Record<string, string> = {
      "Watercolor Style": artImg,
      "Cyberpunk Aesthetic": fantasyImg,
      "Oil Painting Classic": artImg,
      "Minimalist Design": abstractImg,
      "Japanese Anime": animeImg,
      "Pixar": pixarImg,
      "Marvel": marvelImg,
      "Origami": origamiImg,
      "Vaporwave / 90's": vaporwaveImg,
      "LEGO": legoImg,
      "Studio Ghibli": ghibliImg,
      "Sticker": stickerImg,
      "Fantasy Storybook": storybookImg,
      "Puppet": puppetImg,
    };
    
    // If template title matches a style, use its image
    if (styleImages[template.title]) {
      return styleImages[template.title];
    }
    
    // Fallback to category-based images
    const categoryImages: Record<string, string> = {
      landscape: landscapeImg,
      portrait: portraitImg,
      abstract: abstractImg,
      product: productImg,
      architecture: architectureImg,
      fantasy: fantasyImg,
      nature: natureImg,
      art: artImg,
    };
    return categoryImages[template.category] || abstractImg;
  };

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          data-testid="text-templates-heading"
        >
          Quick Start Templates
        </h2>
        <Badge variant="secondary" data-testid="badge-template-count">
          {templates.length} templates
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-8 cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedTemplateId === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectTemplate(template)}
            data-testid={`card-template-${template.id}`}
            aria-selected={selectedTemplateId === template.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTemplate(template);
              }
            }}
          >
            <div className="space-y-4">
              {/* Visual Preview */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={getTemplateImage(template)}
                  alt={template.category}
                  className="w-full h-full object-cover"
                  data-testid={`img-template-preview-${template.id}`}
                />
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2.5">
                  {getModelIcon(template.modelType)}
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <h3
                  className="font-semibold text-lg"
                  data-testid={`text-template-title-${template.id}`}
                >
                  {template.title}
                </h3>
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
