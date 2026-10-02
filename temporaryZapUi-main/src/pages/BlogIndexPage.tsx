import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Search, FileText, Settings2, Layers, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import { BLOG_POSTS } from '../data/blogData';

const ALL_CATEGORY = 'All Guides';

const FeaturedArticleVisual: React.FC<{ slug: string }> = ({ slug }) => {
  if (slug === 'srm-assignment-printing') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '140px', height: '180px', background: 'var(--paper)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', transform: 'rotate(-5deg) translateX(-20px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '30px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }} />
          <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ width: '80%', height: '4px', background: 'var(--border-hover)', borderRadius: '2px' }} />
            <div style={{ width: '60%', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', width: '140px', height: '180px', background: 'var(--paper)', border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', transform: 'rotate(2deg) translateX(20px)', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div style={{ height: '30px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--color-accent-subtle)', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', padding: '0 0.5rem', color: 'var(--color-accent)' }}>
            <FileText size={14} />
          </div>
          <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ width: '100%', height: '4px', background: 'var(--ink)', borderRadius: '2px' }} />
            <div style={{ width: '90%', height: '4px', background: 'var(--ink)', borderRadius: '2px' }} />
            <div style={{ width: '40%', height: '4px', background: 'var(--text-muted)', borderRadius: '2px' }} />
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: 700 }}>B&W</span>
              <Settings2 size={12} style={{ color: 'var(--color-accent)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-subtle)', borderRadius: 'var(--radius-xl)', color: 'var(--color-accent)' }}>
      <Layers size={48} />
    </div>
  );
};


const BlogIndexPage: React.FC = () => {
  const allPosts = Object.values(BLOG_POSTS);
  
  // Extract unique categories
  const categories = [ALL_CATEGORY, ...Array.from(new Set(allPosts.map(p => p.category)))];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  
  // Filter logic
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesCategory = activeCategory === ALL_CATEGORY || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, searchQuery]);

  // Featured article logic
  const featuredPostSlug = 'srm-assignment-printing';
  const featuredPost = allPosts.find(p => p.slug === featuredPostSlug);
  
  // Exclude featured from grid if it's currently matching filters
  const gridPosts = filteredPosts.filter(p => p.slug !== featuredPostSlug || searchQuery !== '' || activeCategory !== ALL_CATEGORY);
  
  // Only show featured block on default view (no active filters/search)
  const showFeatured = activeCategory === ALL_CATEGORY && searchQuery === '' && featuredPost;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "ZapPrints Student Printing Guides & Resources",
      "description": "Guides, tutorials, and practical advice on printing assignments, lab records, and project reports for SRM KTR students.",
      "url": `${PRIMARY_DOMAIN}/blog`,
      "publisher": {
        "@type": "Organization",
        "name": "ZapPrints",
        "url": PRIMARY_DOMAIN,
        "logo": `${PRIMARY_DOMAIN}/zap%20prints%20logo.png`
      }
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
          "name": "Blog",
          "item": `${PRIMARY_DOMAIN}/blog`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '3.5rem' }}>
      <SEOHead
        title="Student Printing Guides & Academic Resources | ZapPrints Blog"
        description="Practical guides for SRM KTR students on formatting and printing assignments, lab records, project reports, B&W vs color decisions, and Java Canteen pickup."
        canonicalPath="/blog"
        schema={schema}
      />

      {/* ── Breadcrumb Bar ── */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)' }}>
        <div className="container" style={{ padding: '0.65rem var(--gutter)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" className="hover-link" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Blog &amp; Guides</span>
        </div>
      </div>

      <section style={{ padding: '4rem 0 3rem 0', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Student Knowledge Hub
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Campus Printing Guides &amp; Tutorials
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Practical advice on formatting, duplex alignment, PDF preparation, and avoiding queue delays at SRM KTR.
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'var(--paper-sunk)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
             <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guides for:</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Assignments</span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Projects</span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Lab Records</span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Printing Advice</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 0', background: 'var(--paper-sunk)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--color-accent)' : 'var(--border-subtle)',
                    background: activeCategory === cat ? 'var(--color-accent-subtle)' : 'var(--paper)',
                    color: activeCategory === cat ? 'var(--color-accent)' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: activeCategory === cat ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  className="focus-ring"
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                className="focus-ring"
                aria-label="Search guides"
              />
            </div>
          </div>

          {/* Featured Article */}
          {showFeatured && featuredPost && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '3rem' }}
            >
              <Link to={`/blog/${featuredPost.slug}`} className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', background: 'var(--paper)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)', padding: '2rem', textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', background: 'var(--color-accent-subtle)', padding: '4px 10px', borderRadius: '99px' }}>
                      FEATURED GUIDE
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} />
                      {featuredPost.readingTime}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    {featuredPost.title}
                  </h2>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '480px' }}>
                    {featuredPost.description}
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-accent)', marginTop: 'auto' }}>
                    <span>Read Full Guide</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                   <FeaturedArticleVisual slug={featuredPost.slug} />
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid or Empty State */}
          <AnimatePresence mode="wait">
            {filteredPosts.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--paper)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-2xl)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}><FilterX size={48} /></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>No guides found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your search or category filter.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory(ALL_CATEGORY); }}
                  className="btn btn-ghost"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
              >
                {gridPosts.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blog/${item.slug}`}
                    className="card blog-card"
                    style={{
                      padding: '2rem',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'var(--paper)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-2xl)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} />
                        {item.readingTime}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                      {item.title}
                    </h2>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
                      {item.description}
                    </p>

                    <div className="blog-card-cta" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-accent)', marginTop: 'auto' }}>
                      <span>Read Guide</span>
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Hub Footer CTA */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'var(--paper-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--ink)' }}>Ready to print your documents?</h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              Upload your files directly to ZapPrints and pick them up at Java Canteen between class sessions. No queues.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/order" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)' }}>
                Start Printing Now
              </Link>
              <Link to="/srm-ktr-printing" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)' }}>
                Campus Pickup Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .blog-card {
          transition: all 0.25s ease;
        }
        .blog-card:hover {
          transform: translateY(-4px) scale(0.99);
          border-color: var(--color-accent);
          box-shadow: var(--shadow-md);
        }
        .blog-card-cta {
          transition: transform 0.2s ease;
        }
        .blog-card:hover .blog-card-cta {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default BlogIndexPage;
