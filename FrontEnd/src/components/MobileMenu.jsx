import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Menu panel */}
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-gray-800 p-6 shadow-xl">
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-col space-y-4">
          <a href={"#features"} onClick={onClose} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-left">
            Features
          </a >
          <a href='#social' onClick={onClose} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-left">
            Social
          </a>
          <Link to={"/login"} className="bg-[#fd5000] text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 transition-colors w-full text-center">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}