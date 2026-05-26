"use client";

import { useState, useCallback, useRef } from "react";

interface FileUploadZoneProps {
  label: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  onFileChange: (file: File | null) => void;
  error?: string;
  file?: File | null;
}

export function FileUploadZone({
  label,
  required = false,
  accept = "image/*,.pdf",
  maxSizeMB = 5,
  onFileChange,
  error,
  file,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (selectedFile: File) => {
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setSizeError(`Fichier trop volumineux. Maximum ${maxSizeMB}MB.`);
        return;
      }
      setSizeError(null);
      onFileChange(selectedFile);
    },
    [maxSizeMB, onFileChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const hasError = !!error || !!sizeError || (file === null && !!error);

  if (file) {
    const sizeKB = Math.round(file.size / 1024);
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    return (
      <div className="rounded-lg border border-accent/30 bg-accent-tint p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">{sizeText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="shrink-0 rounded-md p-1.5 text-ink-muted hover:bg-ink-muted/10 hover:text-red-600 transition-colors"
            aria-label="Supprimer le fichier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${
          hasError
            ? "border-red-300 bg-red-50"
            : isDragOver
            ? "border-accent bg-accent-tint"
            : "border-line bg-surface hover:border-ink-muted/40"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink-muted"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm font-medium text-ink">
            Glissez votre fichier ici ou cliquez pour parcourir
          </p>
          <p className="text-xs text-ink-muted">
            JPG, PNG ou PDF · Max {maxSizeMB}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          className="sr-only"
        />
      </div>
      {sizeError && <p className="mt-1.5 text-xs text-red-600">{sizeError}</p>}
      {error && !sizeError && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
