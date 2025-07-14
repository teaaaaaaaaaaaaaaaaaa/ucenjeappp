import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`h-10 ${className}`}>
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#2563EB"/>
        <path d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM21 25H19V23H21V25ZM21 21H19V15H21V21Z" fill="white"/>
        <path d="M50 25V10H61V13H53V16H60V19H53V22H61V25H50Z" fill="#1F2937"/>
        <path d="M62 10H66L72 19V10H75V25H71L65 16V25H62V10Z" fill="#1F2937"/>
        <path d="M77 10H80V25H77V10Z" fill="#1F2937"/>
        <path d="M82 25V10H86L90 19L94 10H98V25H95V14L90 25H88L83 14V25H82Z" fill="#1F2937"/>
      </svg>
    </div>
  );
};

export default Logo; 