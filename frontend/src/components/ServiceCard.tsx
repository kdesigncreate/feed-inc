import React from 'react';
import Image from 'next/image';
import { ServiceCard } from '@/types';
import { Button } from '@/components/Button';

interface ServiceCardComponentProps {
  service: ServiceCard;
  index: number;
}

export const ServiceCardComponent: React.FC<ServiceCardComponentProps> = ({ service, index }) => {
  return (
    <div className={`flex flex-col md:flex-row w-full max-w-7xl mx-auto bg-white overflow-hidden gap-3 md:gap-0${index % 2 === 1 ? ' md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-1/2 aspect-[3/2] md:aspect-[21/9] relative flex items-center justify-center mb-6 md:mb-0">
        <Image
          src={service.imageSrc}
          alt={service.imageAlt}
          fill
          className="object-cover rounded-lg"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="md:w-1/2 w-full flex flex-col justify-center p-6 text-left">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{service.title}</h3>
        <p className="text-gray-700 text-base mb-8">{service.description}</p>
        <ul className="list-none bg-gray-100 rounded mb-6 p-6 md:p-8">
          {service.features.map((feature, i) => (
            <li key={i} className="relative pl-4 mb-3 text-sm font-semibold text-gray-700 last:mb-0">
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Button
            href={service.buttonHref}
            target={service.isExternal ? '_blank' : undefined}
            variant="primary"
          >
            {service.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};