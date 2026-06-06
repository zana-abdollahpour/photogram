"use client";

import { useRef } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
}

export function FileUploadArea({ onFileSelect }: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef?.current?.click()}
      className="border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
    >
      <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
      <p className="mb-2 text-lg font-medium">Drag photo here</p>
      <p className="text-muted-foreground mb-4 text-sm">
        or click to select from your computer
      </p>
      <Button variant="outline">
        <ImageIcon className="mr-2 h-4 w-4" />
        Select from your computer
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
