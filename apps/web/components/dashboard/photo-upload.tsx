"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Image as ImageIcon, Plus, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDebouncedFunction } from "@/hooks/useDebouncedFunction";

import { Fab } from "@/components/ui/fab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PhotoUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    fileInputRef.current = null;
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleSelectFile(file);
  };

  const handleBrowseClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    fileInputRef.current?.click();
  };

  const handleFileSelect: React.ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (e) => {
    const file = e.target.files?.[0];
    handleSelectFile(file);
  };

  const [handleChangeCaption] = useDebouncedFunction(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCaption(e.target.value.trim());
    },
  );

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) {
      return;
    }

    try {
      setIsUploading(true);

      // TODO: handle upload

      handleClearSelection();
      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Fab>
          <Plus className="size-6" />
        </Fab>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={cn(
              "border-muted-foreground/25 rounded-lg border-2 border-dashed p-8 text-center",
              "hover:border-muted-foreground/50 cursor-pointer transition-colors",
            )}
          >
            <Upload className="text-muted-foreground mx-auto mb-4 size-12" />
            <p className="mb-2 text-lg font-medium">Drag photos here</p>
            <p className="text-muted-foreground mb-4 text-sm">
              or click to select from your device
            </p>
            <Button variant="outline">
              <ImageIcon className="mr-2 size-4" />
              Select from your device
            </Button>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              multiple={false}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <DialogClose className="bg-red-900!" ref={dialogCloseRef} />
            <div className="relative">
              <Image
                src={preview}
                alt="preview"
                height={64}
                width={64}
                className="h-64 w-full rounded-lg object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                className="group absolute top-2 right-2 bg-black/50 text-white transition-all hover:bg-black/70"
                onClick={handleClearSelection}
              >
                <X className="group-hover:text-destructive size-4 transition-all" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <textarea
                rows={3}
                name="caption"
                id="caption"
                placeholder="write a caption..."
                className="w-full resize-none rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={handleChangeCaption}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClearSelection}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !caption.trim()}
              >
                Share
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
