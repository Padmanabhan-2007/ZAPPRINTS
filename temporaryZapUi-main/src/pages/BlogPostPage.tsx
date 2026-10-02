import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import { BLOG_POSTS } from '../data/blogData';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_POSTS[slug] : null;

  if (!post) {
    return <Navigate to="/srm-ktr-printing" replace />;
  }

  const otherPosts = Object.values(BLOG_POSTS).filter(p => p.slug !== post.slug);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.datePublished,
      "dateModified": post.dateModified,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${PRIMARY_DOMAIN}/blog/${post.slug}`
      },
      "author": {
        "@type": "Organization",
        "name": "ZapPrints Editorial Team",
        "url": PRIMARY_DOMAIN
      },
      "publisher": {
        "@type": "Organization",
        "name": "ZapPrints",
        "url": PRIMARY_DOMAIN,
        "logo": {
          "@type": "ImageObject",
          "url": `${PRIMARY_DOMAIN}/zap%20prints%20logo.png`
        }
      },
      "image": `${PRIMARY_DOMAIN}/zap%20prints%20logo%20banner.png`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": PRIMARY_DOMAIN
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "SRM KTR Printing",
          "item": `${PRIMARY_DOMAIN}/srm-ktr-printing`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `${PRIMARY_DOMAIN}/blog/${post.slug}`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page, #faf9f7)', color: 'var(--text-main, #2a1f1a)', minHeight: '100vh', paddingBottom: '3.5rem' }}>
      <SEOHead
        title={post.seoTitle}
        description={post.description}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        schema={schema}
      />

      {/* ── Breadcrumb Bar ── */}
      <div style={{ borderBottom: '1px solid var(--border-subtle, #ede9e5)', background: '#ffffff', padding: '0.65rem 0' }}>
        <div className="container" style={{ fontSize: '0.8rem', color: 'var(--color-muted, #7a6a62)', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/srm-ktr-printing" style={{ color: 'inherit', textDecoration: 'none' }}>SRM KTR Printing</Link>
          <span>/</span>
          <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{post.category}</span>
        </div>
      </div>

      <article className="container" style={{ maxWidth: '820px', padding: '3rem 1.25rem 0 1.25rem' }}>
        
        {/* Article Meta Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'color-mix(in srgb, var(--orange) 10%, transparent)', color: 'var(--orange)', padding: '3px 10px', borderRadius: '99px' }}>
              {post.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-muted, #7a6a62)' }}>
              <Clock size={14} />
              <span>{post.readingTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-muted, #7a6a62)' }}>
              <Calendar size={14} />
              <span>{post.datePublished}</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.25, color: '#0f172a', marginBottom: '1.25rem' }}>
            {post.title}
          </h1>

          <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-muted, #7a6a62)', borderLeft: '3px solid var(--orange)', paddingLeft: '1rem', fontStyle: 'normal' }}>
            {post.content.lead}
          </p>
        </header>

        {/* Main Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
          {post.content.sections.map((section, idx) => (
            <section key={idx} className="card" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-xl, 1.5rem)' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '0.85rem' }}>
                {section.heading}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', lineHeight: 1.65, color: '#334155' }}>
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {section.tip && (
                <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: 'color-mix(in srgb, var(--orange) 7%, transparent)', borderLeft: '3px solid var(--orange)', fontSize: '0.875rem', color: '#166534', lineHeight: 1.5 }}>
                  {section.tip}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Embedded Ordering CTA Box */}
        <div className="card" style={{ marginTop: '2.5rem', padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: 'var(--radius-xl, 1.5rem)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'color-mix(in srgb, var(--orange) 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-light)', margin: '0 auto 1rem auto' }}>
            <Sparkles size={20} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
            Ready to Print Your Document?
          </h2>
          <p style={{ fontSize: '0.925rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: 1.55 }}>
            Upload your PDF, customize B&amp;W or color and duplex settings, and collect your fresh prints directly at Java Canteen without standing in shop lines.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/order" className="btn btn-accent" style={{ padding: '0.75rem 1.75rem', fontSize: '0.925rem', fontWeight: 700, borderRadius: 'var(--radius-full, 99px)', gap: '0.5rem' }}>
              <span>Upload Document Now</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/pricing" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.925rem', fontWeight: 600, borderRadius: 'var(--radius-full, 99px)' }}>
              View Transparent Rates
            </Link>
          </div>
        </div>

        {/* Related Guides Section */}
        <section style={{ marginTop: '3rem', borderTop: '1px solid var(--border-subtle, #ede9e5)', paddingTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              More SRM Student Printing Guides
            </h2>
            <Link to="/srm-ktr-printing" style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
              All Campus Services →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {otherPosts.slice(0, 3).map((item) => (
              <Link 
                key={item.slug} 
                to={`/blog/${item.slug}`} 
                className="card" 
                style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '0.5rem', flex: 1 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted, #7a6a62)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={12} />
                  <span>{item.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </article>
    </div>
  );
};

export default BlogPostPage;
