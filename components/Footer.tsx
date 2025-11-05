
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50">
      <div className="container mx-auto px-6 py-6 text-center text-gray-400 border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} The Spirit Shelf. All rights reserved.</p>
        <p className="text-sm mt-1">Experience responsibly.</p>
      </div>
    </footer>
  );
};

export default Footer;
