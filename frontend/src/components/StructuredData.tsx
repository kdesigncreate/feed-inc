'use client';

import React from 'react';

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    email: string;
    contactType: string;
  };
}

interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
  category?: string;
}

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

// Organization Schema Component
export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name = "株式会社フィード",
  description = "リアルとデジタルの両面からプロモーションやPR、ブランディングを支援する専門会社",
  url = "https://www.feed-inc.com",
  logo = "https://www.feed-inc.com/image/logo_feed.png",
  address = {
    streetAddress: "神宮前6-28-9",
    addressLocality: "渋谷区",
    addressRegion: "東京都",
    postalCode: "150-0001",
    addressCountry: "JP"
  },
  contactPoint = {
    telephone: "+81-3-3505-3005",
    email: "contact@feed-inc.com",
    contactType: "customer service"
  }
}) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "foundingDate": "1990",
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "contactPoint": {
      "@type": "ContactPoint",
      ...contactPoint
    },
    "sameAs": [
      url
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "プロモーション企画・制作",
          "description": "店頭販促、デザイン、キャンペーン、イベント、デジタルプロモーションの企画・制作"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
};

// Article Schema Component
export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  url,
  image,
  category
}) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "株式会社フィード",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.feed-inc.com/image/logo_feed.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "url": url,
    ...(image && {
      "image": {
        "@type": "ImageObject",
        "url": image
      }
    }),
    ...(category && {
      "articleSection": category
    }),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
};

// Website Schema Component
export const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({
  name,
  url,
  description,
  potentialAction
}) => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    ...(potentialAction && {
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": potentialAction.target
        },
        "query-input": potentialAction.queryInput
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
};

// Service Schema Component
export const ServiceSchema: React.FC<{
  services: Array<{
    name: string;
    description: string;
    category: string;
  }>;
}> = ({ services }) => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "株式会社フィード",
    "url": "https://www.feed-inc.com",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "フィードのサービス",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description,
          "category": service.category,
          "provider": {
            "@type": "Organization",
            "name": "株式会社フィード"
          }
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
};