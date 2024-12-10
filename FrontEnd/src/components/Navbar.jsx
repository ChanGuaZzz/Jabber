import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-2xl font-bold text-white">Jabber</span>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden lg:flex lg:space-x-4">
              <a href='#features' className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Features
              </a>
              <a  href='#social' className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Social
              </a>
              <Link to='/login' className="bg-[#fd5000] text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu modal */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}