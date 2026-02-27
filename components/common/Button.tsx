import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', loading = false, ...props }) => {
  const baseStyles = 'px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';
  
  const variantStyles = {
    primary: 'bg-gradient-to-br from-brand-accent to-brand-accent-dark text-brand-dark hover:shadow-[0_0_20px_theme(colors.brand-accent.DEFAULT)] focus-visible:ring-brand-accent-light hover:-translate-y-px',
    secondary: 'bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 focus-visible:ring-brand-accent hover:shadow-lg hover:shadow-brand-accent/10',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className} ${loading ? 'cursor-not-allowed' : ''}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <svg className="animate-spin h-6 w-6 mx-auto text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
