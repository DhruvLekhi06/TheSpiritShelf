
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GUIDES_DATA } from '../constants';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import GuideLabel from './common/GuideLabel';

const GuideDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const guide = GUIDES_DATA.find(c => c.slug === slug);

    if (!guide) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-serif">Guide Not Found</h1>
                <Link to="/guides" className="text-brand-accent hover:underline mt-4 inline-block">Back to Guides</Link>
            </div>
        );
    }
    
    // NOTE: In a real app, sanitize this HTML to prevent XSS attacks.
    const guideContentHtml = marked(guide.content);

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="container mx-auto max-w-4xl px-6 py-12">
                <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl mb-10 border border-brand-outline">
                    <GuideLabel title={guide.title} />
                </div>
                
                <h1 className="text-5xl font-serif font-bold text-white mb-4">{guide.title}</h1>
                <p className="text-xl text-brand-muted font-light leading-relaxed mb-8 border-l-4 border-brand-accent pl-4">
                    {guide.description}
                </p>
                
                <div className="w-full h-px bg-brand-outline mb-8"></div>

                <div 
                    className="prose prose-invert prose-lg text-gray-300 max-w-none prose-headings:font-serif prose-headings:text-white prose-a:text-brand-accent hover:prose-a:text-brand-accent-hover prose-strong:text-brand-light prose-blockquote:border-brand-accent prose-li:marker:text-brand-accent"
                    dangerouslySetInnerHTML={{ __html: guideContentHtml }}
                >
                </div>
            </div>
        </motion.div>
    );
};

export default GuideDetailPage;
