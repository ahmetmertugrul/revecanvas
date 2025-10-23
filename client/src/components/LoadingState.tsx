import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  progress?: number;
}

export function LoadingState({ message = "Generating your image...", progress }: LoadingStateProps) {
  return (
    <Card className="p-8" data-testid="card-loading-state">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" data-testid="icon-loading" />
        <div className="text-center space-y-2 w-full max-w-md">
          <p className="font-medium" data-testid="text-loading-message">{message}</p>
          {progress !== undefined && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" data-testid="progress-generation" />
              <p className="text-sm text-muted-foreground" data-testid="text-progress-percentage">
                {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
