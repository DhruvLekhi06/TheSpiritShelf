
import React from 'react';

interface GuideLabelProps {
  title: string;
  className?: string;
}

const getGradient = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('scotch')) {
      return 'bg-gradient-to-br from-amber-900 via-amber-800 to-orange-950 text-amber-50';
  }
  if (lower.includes('gin') || lower.includes('botanical')) {
      return 'bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-950 text-emerald-50';
  }
  if (lower.includes('cocktail') || lower.includes('mixology')) {
      return 'bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-950 text-fuchsia-50';
  }
  if (lower.includes('wine') || lower.includes('champagne')) {
      return 'bg-gradient-to-br from-rose-900 via-red-900 to-red-950 text-rose-50';
  }
  if (lower.includes('tequila') || lower.includes('agave')) {
      return 'bg-gradient-to-br from-yellow-700 via-yellow-800 to-lime-900 text-yellow-50';
  }
  return 'bg-gradient-to-br from-slate-800 to-gray-900 text-gray-100';
};

const GuideLabel: React.FC<GuideLabelProps> = ({ title, className = '' }) => {
  const gradient = getGradient(title);
  
  return (
    <div className={`relative w-full h-full flex items-center justify-center p-8 overflow-hidden ${gradient} ${className}`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-4 border border-white/20 pointer-events-none"></div>
        <div className="absolute inset-6 border border-white/10 pointer-events-none"></div>
        
        {/* Shine effect */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none"></div>

        <div className="relative z-10 text-center">
             <span className="block text-white/70 text-xs font-sans uppercase tracking-[0.2em] mb-4">The Spirit Shelf Guide</span>
             <h3 className="font-serif font-bold text-3xl md:text-5xl drop-shadow-lg leading-tight max-w-2xl mx-auto" style={{ fontFamily: '"Playfair Display", serif' }}>
                {title}
             </h3>
             <div className="w-24 h-1 bg-white/30 mx-auto mt-6 rounded-full backdrop-blur-sm"></div>
        </div>
    </div>
  );
};

export default GuideLabel;
