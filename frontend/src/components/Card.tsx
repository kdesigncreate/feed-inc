import React from 'react';
import Image from 'next/image';

type CardProps = {
  title: string;
  date?: string;
  tag?: string;
  author?: string;
  avatar?: string;
  href?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  className?: string; 
  children?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ 
  //CardはCardのコンポーネント。
  //React.FCはReactの関数コンポーネントにするためのもの。
  //引数はCardProps型のオブジェクト。
  //戻り値はReact.ReactNode型。
  title, 
  date, 
  tag, 
  author, 
  avatar, 
  href = "#", 
  description,
  image,
  imageAlt,
  className = "",
  children 
}) => (
  <div className={`flex flex-col bg-white border border-blue-900 rounded-lg overflow-hidden shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-md ${className}`}>
    {image && (
      //imageがtrueの場合はdivを表示する。
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          className="object-cover"
        />
      </div>
    )}
    <div className="px-4 py-3 bg-gray-800 text-white">
      <span className="text-sm font-medium">Knowledge</span>
    </div>
    <div className="px-4 py-6 flex-1 flex flex-col">
      <h3 className="text-lg font-bold leading-relaxed mb-4 flex-1">
        <a href={href} className="text-gray-800 hover:text-blue-900 transition-colors duration-300">
          {title}
        </a>
      </h3>
      {description && (
        //descriptionがtrueの場合はpを表示する。
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      )}
      {children}
    </div>
    {(date || tag || author || avatar) && (
      //date, tag, author, avatarがtrueの場合はdivを表示する。
      <div className="flex justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col text-left">
          {date && <span className="text-sm text-gray-600" suppressHydrationWarning>{date}</span>}
          {tag && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mt-1 inline-block">
              {tag}
            </span>
          )}
        </div>
        {(author || avatar) && (
          //author, avatarがtrueの場合はdivを表示する。
          <div className="flex items-center gap-2">
            {avatar && (
              <Image
                src={avatar}
                alt="著者アイコン"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            {author && <span className="text-sm text-gray-600">{author}</span>}

          </div>
        )}
      </div>
    )}
  </div>
); 