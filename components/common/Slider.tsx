import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const backgroundStyle = {
    background: `linear-gradient(to right, #c0954b ${percentage}%, #262626 ${percentage}%)`
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="block text-sm font-medium text-brand-light leading-tight pr-4">{label}</label>
        <span className="text-xl font-bold font-mono text-brand-accent">{value.toFixed(0)}</span>
      </div>
      <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-brand-outline rounded-full appearance-none cursor-pointer custom-slider"
            style={backgroundStyle}
          />
          <div className="flex justify-between text-xs text-brand-muted mt-1 px-1">
              <span>{min}</span>
              <span>{max}</span>
          </div>
      </div>
    </div>
  );
};

export default Slider;