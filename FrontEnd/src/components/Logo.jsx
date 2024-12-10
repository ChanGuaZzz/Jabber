import React from 'react';
import logo from '../img/logo.png';

export function Logo() {
  return (
    <img 
      src={logo}
      alt="Jabber Logo"
      className="h-8 w-8"
    />
  );
}