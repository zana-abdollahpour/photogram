"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { useDebouncedFunction } from "@/hooks/useDebouncedFunction";

import { Fab } from "@/components/ui/fab";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUploadArea } from "@/components/ui/file-upload-area";
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
  const utils = trpc.useUtils();
  const createPost = trpc.postsRouter.create.useMutation({
    onSuccess: () => {
      utils.postsRouter.findAll.invalidate();
    },
  });

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

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("caption", caption);

      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("failed to upload image");
      }

      const { filename } = await uploadResponse.json();
      await createPost.mutateAsync({ image: filename, caption: caption });
      await utils.postsRouter.findAll.invalidate();

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
          <FileUploadArea onFileSelect={handleSelectFile} />
        ) : (
          <div className="space-y-4">
            <DialogClose className="hidden" ref={dialogCloseRef} />
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
