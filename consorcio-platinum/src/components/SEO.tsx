import { Helmet } from 'react-helmet-async';
import type { Article } from '@/types/article';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: Article;
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website',
  article 
}: SEOProps) => {
  const siteUrl = 'https://www.hirayamacorretora.com.br/consorcio';
  const defaultTitle = 'Consórcio Platinum | Planejamento Inteligente para Conquistar seu Patrimônio';
  const defaultDescription = 'Consórcio automóvel, imobiliário, empresarial e para investimento com diagnóstico antes da proposta, estratégia de lance e acompanhamento consultivo até a contemplação.';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || article?.og_image_url || article?.image_url || defaultImage;
  const seoUrl = url || (typeof window !== 'undefined' ? `${siteUrl}${window.location.pathname}` : siteUrl);
  const seoKeywords = keywords || article?.seo_keywords || 'consórcio automóvel, consórcio imobiliário, consórcio sem juros, planejamento com consórcio, consórcio empresarial, consórcio para investimento';

  // Structured Data (JSON-LD)
  const structuredData = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seo_title || article.title,
    description: article.seo_description || article.description,
    image: seoImage,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Consórcio Platinum',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Consórcio Platinum',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.jpg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': seoUrl
    }
  } : {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Consórcio Platinum',
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    description: defaultDescription,
    sameAs: [
      'https://wa.link/3gwhbl'
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Consórcio Platinum" />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoTitle} />

      {/* Article specific */}
      {article && (
        <>
          <meta property="article:published_time" content={article.created_at} />
          <meta property="article:modified_time" content={article.updated_at} />
          <meta property="article:author" content="Consórcio Platinum" />
          <meta property="article:section" content={article.category} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={seoTitle} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
