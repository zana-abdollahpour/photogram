"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { authClient } from "@/lib/auth/client";
import { getImageUrl } from "@/lib/image";

import { Button } from "@/components/ui/button";
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

export function AvatarUpload() {
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const currentAvatar = session?.user.image;
  const utils = trpc.useUtils();

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
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadResponse = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("failed to upload profile picture");
      }

      const { filename } = await uploadResponse.json();
      await authClient.updateUser({ image: filename });
      await refetchSession();
      await utils.postsRouter.findAll.invalidate();
      await utils.postsRouter.findAll.refetch();

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
        <Button
          variant="ghost"
          size="icon"
          title="Change avatar"
          className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-1 -bottom-1 size-6 rounded-full border-gray-600 p-1 hover:border"
        >
          <Camera className="size-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update profile picture</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div className="space-y-4">
            {currentAvatar && (
              <div className="flex justify-center">
                <Image
                  src={getImageUrl(currentAvatar)}
                  alt="Current avatar"
                  height={64}
                  width={64}
                  className="border-muted size-24 rounded-full border-2 object-cover"
                  unoptimized
                />
              </div>
            )}

            <FileUploadArea onFileSelect={handleSelectFile} />
          </div>
        ) : (
          <div className="space-y-4">
            <DialogClose className="hidden" ref={dialogCloseRef} />
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  height={64}
                  width={64}
                  className="border-primary h-32 w-32 rounded-full border-2 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  onClick={handleClearSelection}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClearSelection}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Updating..." : "Update Avatar"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
