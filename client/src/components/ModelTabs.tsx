import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Pencil, Shuffle } from "lucide-react";

interface ModelTabsProps {
  activeModel: string;
  onModelChange: (model: string) => void;
}

export function ModelTabs({ activeModel, onModelChange }: ModelTabsProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <Tabs value={activeModel} onValueChange={onModelChange} className="w-full">
          <TabsList className="w-full md:w-auto h-auto p-0 bg-transparent border-0">
            <TabsTrigger
              value="text-to-image"
              className="flex items-center gap-2 px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              data-testid="tab-text-to-image"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Text-to-Image</span>
              <span className="sm:hidden">T2I</span>
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="flex items-center gap-2 px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              data-testid="tab-edit"
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
              <span className="sm:hidden">Edit</span>
            </TabsTrigger>
            <TabsTrigger
              value="remix"
              className="flex items-center gap-2 px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              data-testid="tab-remix"
            >
              <Shuffle className="h-4 w-4" />
              <span className="hidden sm:inline">Remix</span>
              <span className="sm:hidden">Remix</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
