import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schema?: object | object[];
  type?: 'website' | 'article' | 'product';
  image?: string;
  noindex?: boolean;
}

export const PRIMARY_DOMAIN = 'https://zapprints.store';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  schema,
  type = 'website',
  image = '/zap%20prints%20logo%20banner.png',
  noindex = false
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to set or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Primary Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    
    if (noindex) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // 3. Canonical Link
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = canonicalPath === '' || canonicalPath === '/' ? PRIMARY_DOMAIN : `${PRIMARY_DOMAIN}${cleanPath}`;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    const fullImageUrl = image.startsWith('http') ? image : `${PRIMARY_DOMAIN}${image}`;
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ZapPrints');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImageUrl);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl);

    // 6. JSON-LD Structured Data
    const existingScript = document.getElementById('zap-json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'zap-json-ld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(Array.isArray(schema) ? schema : schema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup json-ld on unmount
      const scriptToRemove = document.getElementById('zap-json-ld');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalPath, schema, type, image, noindex]);

  return null;
};

export default SEOHead;
