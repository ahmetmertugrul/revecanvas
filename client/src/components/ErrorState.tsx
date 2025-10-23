import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="p-8 border-destructive/50" data-testid="card-error-state">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" data-testid="icon-error" />
        <div className="space-y-2">
          <p className="font-semibold text-destructive">Generation Failed</p>
          <p className="text-sm text-muted-foreground" data-testid="text-error-message">
            {error}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" data-testid="button-retry">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
