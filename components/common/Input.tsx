import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-muted mb-2">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-brand-dark/50 border-2 border-brand-outline rounded-lg px-4 py-3 text-brand-light placeholder-brand-muted focus:outline-none focus:ring-0 focus:border-brand-accent focus:shadow-md focus:shadow-brand-accent/30 transition-all duration-300"
        {...props}
      />
    </div>
  );
};

export default Input;
