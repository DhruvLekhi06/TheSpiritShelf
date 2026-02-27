
import React from 'react';
import { AlcoholType } from '../../types';

interface AlcoholLabelProps {
  name: string;
  type: AlcoholType;
  brand: string;
  className?: string;
  variant?: 'card' | 'detail' | 'thumb';
}

const getTypeStyles = (type: AlcoholType) => {
  switch (type) {
    case AlcoholType.Whiskey:
      return 'bg-gradient-to-br from-amber-900 via-amber-700 to-orange-900 text-amber-100';
    case AlcoholType.Vodka:
      return 'bg-gradient-to-br from-slate-500 via-slate-400 to-slate-600 text-white';
    case AlcoholType.Gin:
      return 'bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-900 text-teal-50';
    case AlcoholType.Rum:
      return 'bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 text-orange-100';
    case AlcoholType.Tequila:
      return 'bg-gradient-to-br from-yellow-700 via-yellow-600 to-lime-800 text-yellow-50';
    case AlcoholType.Brandy:
      return 'bg-gradient-to-br from-red-950 via-rose-900 to-orange-950 text-rose-100';
    case AlcoholType.Wine:
      return 'bg-gradient-to-br from-fuchsia-900 via-purple-900 to-rose-900 text-fuchsia-100';
    case AlcoholType.Liqueur:
      return 'bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-indigo-100';
    default:
      return 'bg-gradient-to-br from-gray-800 to-black text-white';
  }
};

const AlcoholLabel: React.FC<AlcoholLabelProps> = ({ name, type, brand, className = '', variant = 'card' }) => {
  const gradientClass = getTypeStyles(type);
  
  if (variant === 'thumb') {
    return (
      <div className={`w-full h-full flex items-center justify-center ${gradientClass} ${className} overflow-hidden`}>
         <span className="font-serif font-bold text-xs opacity-80 text-center px-1 leading-tight">
             {brand.substring(0, 2).toUpperCase()}
         </span>
      </div>
    );
  }

  const isDetail = variant === 'detail';

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 text-center h-full w-full overflow-hidden ${gradientClass} ${className}`}>
        {/* Decorative Border */}
        <div className="absolute inset-4 border-2 border-white/20 pointer-events-none"></div>
        <div className="absolute inset-5 border border-white/10 pointer-events-none"></div>

        {/* Content */}
        <div className="z-10 flex flex-col items-center justify-center h-full space-y-2">
            
            {/* Top Label */}
            <span className={`uppercase tracking-[0.2em] font-medium opacity-70 ${isDetail ? 'text-sm mb-4' : 'text-[10px] mb-2'}`}>
                {type}
            </span>

            {/* Main Name Typography */}
            <h2 className={`font-serif font-bold leading-tight break-words max-w-full px-2 ${isDetail ? 'text-4xl md:text-5xl lg:text-6xl drop-shadow-lg' : 'text-2xl drop-shadow-md'}`} style={{ fontFamily: '"Playfair Display", serif' }}>
                {name.replace(brand, '').trim() || brand}
            </h2>

            {/* Brand / Subtitle */}
            <div className={`w-12 h-px bg-white/40 my-3 ${isDetail ? 'w-24' : ''}`}></div>
            <span className={`font-sans font-semibold uppercase tracking-widest ${isDetail ? 'text-xl' : 'text-xs'}`}>
                {brand}
            </span>
            
            {/* Bottom decoration */}
            <span className={`opacity-60 italic font-serif ${isDetail ? 'text-base mt-4' : 'text-[10px] mt-2'}`}>
                Est. Quality
            </span>
        </div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
};

export default AlcoholLabel;
