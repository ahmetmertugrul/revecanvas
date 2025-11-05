import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function Header({ apiKey, onApiKeyChange }: HeaderProps) {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const { toast } = useToast();

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  const handleKeyChange = (value: string) => {
    setLocalKey(value);
    onApiKeyChange(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles
              className="h-6 w-6 text-primary"
              data-testid="icon-logo"
            />
            <h1
              className="text-xl md:text-2xl font-bold"
              data-testid="text-app-title"
            >
              Reve Canvas
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="Enter your FAL.ai API Key"
              value={localKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="font-mono text-sm"
              data-testid="input-api-key"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowKey(!showKey)}
              data-testid="button-toggle-key-visibility"
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          <a
            href="https://try.elevenlabs.io/9j4lhxxrp7va"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            data-testid="link-elevenlabs"
          >
            Elevenlabs
          </a>
        </div>
      </div>

      {apiKey && (
        <div className="border-t bg-muted/50 py-1">
          <div className="container mx-auto px-4 md:px-8">
            <p
              className="text-xs text-muted-foreground text-center"
              data-testid="text-security-notice"
            >
              🔒 Your API key is kept in memory only and sent directly to FAL.ai
              - never stored
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
