'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { isValidImageUrl } from '@/lib/imageUtils';

interface ImageUploadProps {
  //interfaceとは型を定義するためのもの。
  //ImageUploadPropsはImageUploadPropsの型を定義するためのもの。
  currentImage?: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  label?: string;
  isRequired?: boolean;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  //ImageUploadはImageUploadのコンポーネント。
  //React.FCはReactの関数コンポーネントにするためのもの。
  //引数はImageUploadPropsの型を持つキーを持つオブジェクト。
  currentImage,
  onImageUpload,
  onImageRemove,
  label = "画像をアップロード",
  isRequired = false,
  maxFileSize = 5,
  acceptedFormats = ['jpeg', 'jpg', 'png', 'webp']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  //isUploadingはアップロード中かどうかを表す。
  //setIsUploadingはisUploadingの状態を変更するための関数。 
  const [error, setError] = useState<string | null>(null);
  //errorはエラーを表す。
  //setErrorはerrorの状態を変更するための関数。
  const fileInputRef = useRef<HTMLInputElement>(null);
  //fileInputRefはfileInputのrefを表す。
  //useRefはrefを作成するためのもの。
  //HTMLInputElementはHTMLのinput要素を表す。

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //handleFileSelectはファイルを選択するための関数。
    //eventはファイル選択イベントを表す。
    //React.ChangeEvent<HTMLInputElement>はファイル選択イベントを表す。
    const file = event.target.files?.[0];
    //fileはファイルを表す。
    //event.target.files?.[0]はファイルを選択するための関数。
    if (!file) return;
    //fileが存在しない場合はreturnする。
    setError(null);
    //errorの状態をnullにする。

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    //fileExtensionはファイルの拡張子を表す。
    //file.name.split('.').pop()?.toLowerCase()はファイルの拡張子を取得するための関数。
    //splitは文字列を分割するための関数。
    //popは配列の最後の要素を取得するための関数。
    //toLowerCaseは文字列を小文字に変換するための関数。
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      //fileExtensionが存在しない場合もしくはacceptedFormatsに含まれていない場合はreturnする。
      setError(`対応している形式: ${acceptedFormats.join(', ')}`);
      //setErrorはエラーを表す。
      //`対応している形式: ${acceptedFormats.join(', ')}`はエラーメッセージを表す。
      //acceptedFormats.join(', ')はacceptedFormatsの要素を結合するための関数。
      //joinは配列の要素を結合するための関数。
      //','はカンマを表す。
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    //fileSizeMBはファイルのサイズを表す。
    //file.size / (1024 * 1024)はファイルのサイズをMBに変換するための関数。
    //1024 * 1024は1024バイトをMBに変換するための関数。
    if (fileSizeMB > maxFileSize) {
      //fileSizeMBがmaxFileSizeを超えている場合はreturnする。
      setError(`ファイルサイズは${maxFileSize}MB以下にしてください`);
      //setErrorはエラーを表す。
      //`ファイルサイズは${maxFileSize}MB以下にしてください`はエラーメッセージを表す。
      //maxFileSizeはファイルのサイズを表す。
      //MBはメガバイトを表す。
      return;
    }

    setIsUploading(true);
    //setIsUploadingはisUploadingの状態をtrueにする。

    try {
      const formData = new FormData();
      //formDataはFormDataを表す。
      //new FormData()はFormDataを作成するための関数。
      formData.append('thumbnail', file);
      //formDataにfileを追加するための関数。
      //appendはFormDataにデータを追加するための関数。
      //thumbnailはファイルの名前を表す。

      console.log('Sending file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      console.log('FormData entries:', Array.from(formData.entries()));
      //Array.from(formData.entries())はFormDataの要素を配列に変換するための関数。
      //Array.fromは配列を作成するための関数。
      //entriesはFormDataの要素を取得するための関数。

      const response = await api.post('/upload-thumbnail', formData, {
        //api.postはAPIを呼び出すための関数。
        //'/upload-thumbnail'はAPIのエンドポイントを表す。
        //formDataはFormDataを表す。
        headers: {
          'Content-Type': undefined, 
          //headersにContent-Typeを追加するための関数。
        },
      });
      onImageUpload(response.data.url);
      //onImageUploadは画像をアップロードするための関数。
      //response.data.urlは画像のURLを表す。
    } catch (err: any) {
      console.error('Upload error:', err);
      console.error('Response data:', err.response?.data);
      
      if (err.response?.data?.message) {
        //err.response?.data?.messageが存在する場合はif文の中に入る。
        setError(err.response.data.message);
        //setErrorはエラーを表す。
        //err.response.data.messageはエラーメッセージを表す。
      } else if (err.response?.data?.errors) {
        //err.response?.data?.errorsが存在する場合はif文の中に入る。
        const errors = err.response.data.errors;
        //err.response.data.errorsはエラーメッセージを表す。
        const firstError = Object.values(errors)[0];
        //firstErrorはfirstErrorの要素を取得するための関数。
        //Object.values(errors)[0]はerrorsの要素を取得するための関数。
        const errorMessage = Array.isArray(firstError) ? firstError[0] : 'バリデーションエラー';
        //errorMessageはerrorMessageの要素を取得するための関数。
        //Array.isArray(firstError)はfirstErrorが配列かどうかを表す。
        //firstError[0]はfirstErrorの要素を取得するための関数。
        setError(`${errorMessage} (詳細: ${JSON.stringify(errors)})`);
        //setErrorはエラーを表す。
        //JSON.stringify(errors)はerrorsをJSON形式に変換するための関数。
      } else {
        //err.messageが存在しない場合はelse文の中に入る。
        setError(err.message || 'アップロードに失敗しました');
        //setErrorはエラーを表す。
      }
    } finally {
      setIsUploading(false);
      //setIsUploadingはisUploadingの状態をfalseにする。
    }
  };

  const handleRemoveImage = () => {
    //handleRemoveImageは画像を削除するための関数。
    onImageRemove();
    //onImageRemoveは画像を削除するための関数。
    if (fileInputRef.current) {
      //fileInputRef.currentが存在する場合はif文の中に入る。
      fileInputRef.current.value = '';
      //fileInputRef.current.valueを''にする。
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