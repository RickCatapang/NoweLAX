// components/questions/import/import-result-dialog.tsx

"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  ArrowRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImportResultDialogProps {
  result: {
    total: number;
    imported: number;
    failed: number;
    status: string;
    importBatchId: string;
    failedItems?: Array<{ row: number; error: string }>;
  };
  open: boolean;
  onClose: () => void;
  onViewQuestions: () => void;
}

export function ImportResultDialog({
  result,
  open,
  onClose,
  onViewQuestions,
}: ImportResultDialogProps) {
  const isSuccess = result.failed === 0;
  const isPartial = result.failed > 0 && result.imported > 0;
  const isFailure = result.imported === 0 && result.failed > 0;

  const getStatusIcon = () => {
    if (isSuccess) return <CheckCircle2 className="size-8 text-green-600" />;
    if (isPartial) return <AlertCircle className="size-8 text-yellow-600" />;
    return <XCircle className="size-8 text-red-600" />;
  };

  const getStatusColor = () => {
    if (isSuccess) return "border-green-500/20 bg-green-500/10";
    if (isPartial) return "border-yellow-500/20 bg-yellow-500/10";
    return "border-red-500/20 bg-red-500/10";
  };

  const getStatusText = () => {
    if (isSuccess) return "All questions imported successfully!";
    if (isPartial) return "Some questions failed to import";
    return "Failed to import questions";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileCheck className="size-5" />
            Import Complete
          </DialogTitle>
          <DialogDescription>
            Here's a summary of your question import.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Status Card */}
          <Card className={cn("border-2 p-6", getStatusColor())}>
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-background">
                {getStatusIcon()}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{getStatusText()}</h3>
                <p className="text-sm text-muted-foreground">
                  Batch ID:{" "}
                  <span className="font-mono text-xs">
                    {result.importBatchId}
                  </span>
                </p>
              </div>

              <Badge
                variant={
                  isSuccess
                    ? "default"
                    : isPartial
                      ? "secondary"
                      : "destructive"
                }
                className="shrink-0"
              >
                {result.status}
              </Badge>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{result.total}</p>
            </Card>
            <Card className="border-green-500/20 p-4 text-center bg-green-500/5">
              <p className="text-sm text-muted-foreground">Imported</p>
              <p className="text-2xl font-bold text-green-600">
                {result.imported}
              </p>
            </Card>
            <Card className="border-red-500/20 p-4 text-center bg-red-500/5">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-600">{result.failed}</p>
            </Card>
          </div>

          {/* Failed Items */}
          {result.failedItems && result.failedItems.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-red-600">
                Failed Items ({result.failedItems.length})
              </p>
              <ScrollArea className="h-32 rounded-md border p-2">
                {result.failedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 py-1 text-sm border-b last:border-0"
                  >
                    <span className="text-muted-foreground shrink-0 font-mono text-xs">
                      Row {item.row}:
                    </span>
                    <span className="text-red-600 text-xs">{item.error}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onViewQuestions}>
              View Questions
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button onClick={onClose}>
              <CheckCircle2 className="mr-2 size-4" />
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
