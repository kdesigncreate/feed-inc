'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { isValidImageUrl } from '@/lib/imageUtils';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  label?: string;
  isRequired?: boolean;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  label = "画像をアップロード",
  isRequired = false,
  maxFileSize = 5,
  acceptedFormats = ['jpeg', 'jpg', 'png', 'webp']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      setError(`対応している形式: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setError(`ファイルサイズは${maxFileSize}MB以下にしてください`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      // Debug: Log what we're sending
      console.log('Sending file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      console.log('FormData entries:', Array.from(formData.entries()));

      const response = await api.post('/upload-thumbnail', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set the correct multipart boundary
        },
      });

      onImageUpload(response.data.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      console.error('Response data:', err.response?.data);
      
      // Handle axios error responses
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : 'バリデーションエラー';
        setError(`${errorMessage} (詳細: ${JSON.stringify(errors)})`);
      } else {
        setError(err.message || 'アップロードに失敗しました');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      
      {isValidImageUrl(currentImage) ? (
        <div className="relative inline-block">
          <div className="relative w-48 h-32 border rounded-lg overflow-hidden">
            <Image
              src={currentImage}
              alt="Thumbnail preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="w-full">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-sm text-gray-500">アップロード中...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg
                  className="h-8 w-8 text-gray-400 mb-2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  クリックして画像を選択
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {acceptedFormats.join(', ')} / 最大{maxFileSize}MB
                </p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.map(format => `.${format}`).join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <p className="text-xs text-gray-500">
        推奨サイズ: 600x400px (3:2の比率)<br/>
        制限: 200x200px以上、2000x2000px以下、最大5MB
      </p>
    </div>
  );
};