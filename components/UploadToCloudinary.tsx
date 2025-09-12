// components/UploadToCloudinary.tsx
"use client";
import { useRef, useState } from "react";
import { Image as ImgIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadToCloudinary({
  onUploaded,
  label = "Upload Image",
  className = "",
}: {
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset);

    setUploading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      // secure_url: https hosted image
      onUploaded(json.secure_url);
    } catch (err: unknown) {
      console.error(err);
      setError("Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickFile}
      />
      <Button
        type="button"
        variant="outline"
        className="rounded-full h-9 px-3 text-[12px]"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Upload image"
      >
        {uploading ? (
          <span className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4 animate-pulse" /> Uploading…
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <ImgIcon className="h-4 w-4" /> {label}
          </span>
        )}
      </Button>
      {error ? <span className="text-[12px] text-red-600">{error}</span> : null}
    </div>
  );
}
