import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File | string) => void;
  id?: string;
  previewImage?: string | null;
  className?: string;
  variant?: "square" | "circle";
  useFile?: boolean; // If true, send File object; if false, send base64
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, id, previewImage, className, variant, useFile = false }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(previewImage || null);
  }, [previewImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (useFile) {
          // Send File object directly
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
          onImageUpload(file);
        } else {
          // Send base64 string (existing behavior)
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            setPreview(base64String);
            onImageUpload(base64String);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onImageUpload, useFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  return (
    <div
      id={id}
      {...getRootProps()}
      className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer w-[300px] ${
        isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-gray-100'
      } ${
        variant === "circle" ? "rounded-full" : (variant === "square" && "aspect-square")
      } ${
        className
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-sm text-gray-600">
            Pastikan format foto anda <span className="font-medium">JPG atau PNG</span>.
          </div>
          <div className="text-sm text-gray-600">
            File maksimal file hanya <span className="font-medium">2mb</span>.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
