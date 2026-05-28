"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type MediaItem = {
  url: string;
  mediaType: "IMAGE" | "VIDEO";
  fileName?: string;
};

export function MediaUpload({
  onUploaded,
}: {
  onUploaded: (items: MediaItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<MediaItem[]>([]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected?.length) return;

    setUploading(true);
    const uploaded: MediaItem[] = [];

    for (const file of Array.from(selected)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push({
          url: data.url,
          mediaType: data.mediaType,
          fileName: data.fileName,
        });
      } else {
        toast.error("Failed to upload file");
      }
    }

    const all = [...files, ...uploaded];
    setFiles(all);
    onUploaded(all);
    setUploading(false);
    if (uploaded.length) toast.success(`${uploaded.length} file(s) attached`);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        multiple
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="glass"
        className="w-full min-h-[52px] rounded-xl"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Camera className="h-5 w-5 text-primary" />
        )}
        {uploading ? "Uploading…" : "Add Photo or Video"}
      </Button>
      {files.length > 0 && (
        <p className="text-xs text-green-400 mt-2 flex items-center gap-1 justify-center">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {files.length} file(s) ready
        </p>
      )}
    </div>
  );
}
