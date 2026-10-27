"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadApi } from "@/lib/api";

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string, publicId: string, alt?: string) => void;
  folder?: string;
  label?: string;
  altText?: string;
  onAltChange?: (alt: string) => void;
  imageAlt?: string;
}

export default function ImageUpload({
  currentImage,
  onUpload,
  folder = "starlight/products",
  label = "Product Image",
  altText,
  onAltChange,
  imageAlt,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || "");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await uploadApi.uploadImage(file, folder, altText || imageAlt || "");
      onUpload(result.url, result.publicId, result.alt);
      setPreview(result.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setPreview(currentImage || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {label && (
        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          position: "relative",
          border: `2px dashed ${dragOver ? "var(--color-terracotta)" : error ? "#ef4444" : "var(--color-border)"}`,
          borderRadius: "12px",
          padding: "1rem",
          cursor: isUploading ? "wait" : "pointer",
          backgroundColor: dragOver ? "var(--color-cream-subtle)" : "#fafafa",
          transition: "all 0.2s",
          minHeight: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "0.5rem",
          overflow: "hidden",
        }}
      >
        {isUploading && (
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem", zIndex: 2 }}>
            <Loader2 size={28} color="var(--color-terracotta)" style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>Uploading to Cloudinary...</span>
          </div>
        )}

        {preview ? (
          <>
            <div style={{ position: "relative", width: "100%", height: "160px" }}>
              <Image
                src={preview}
                alt={altText || imageAlt || label || "Product Image"}
                fill
                style={{ objectFit: "contain", borderRadius: "8px" }}
                sizes="300px"
              />
            </div>
            {(imageAlt || altText) && (
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-dragon-black)", textAlign: "center" }}>
                🏷️ {imageAlt || altText}
              </div>
            )}
            <span style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)" }}>
              Click or drag to replace image
            </span>
          </>
        ) : (
          <>
            <Upload size={28} color="var(--color-text-tertiary)" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-dragon-black)" }}>
                {imageAlt ? `Upload Image for ${imageAlt}` : "Click to upload or drag & drop"}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                JPEG, PNG, WebP, GIF up to 5MB
              </div>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
      </div>

      {error && (
        <div style={{ fontSize: "0.78rem", color: "#dc2626", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <X size={13} /> {error}
        </div>
      )}

      {/* Alt text field for SEO */}
      {onAltChange !== undefined && (
        <div>
          <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: "0.3rem" }}>
            Image Alt Text (SEO) *
          </label>
          <input
            type="text"
            value={altText || ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe this image for screen readers & SEO"
            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "7px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
          />
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
