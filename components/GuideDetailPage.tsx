
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GUIDES_DATA } from '../constants';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';

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
                <img src={guide.imageUrl} alt={guide.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-8" />
                <h1 className="text-5xl font-serif font-bold text-white">{guide.title}</h1>
                <p className="text-xl text-gray-400 mt-2">{guide.description}</p>
                <div 
                    className="prose prose-invert prose-lg mt-8 text-gray-300 max-w-none prose-headings:font-serif prose-headings:text-white prose-a:text-brand-accent hover:prose-a:text-brand-accent-hover"
                    dangerouslySetInnerHTML={{ __html: guideContentHtml }}
                >
                </div>
            </div>
        </motion.div>
    );
};

export default GuideDetailPage;