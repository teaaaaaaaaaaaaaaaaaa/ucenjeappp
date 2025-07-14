import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`
        ${className}
        ${isActive 
          ? 'text-primary font-medium' 
          : 'text-foreground hover:text-primary'}
        transition-colors
      `}
    >
      {children}
    </Link>
  );
};

export default NavLink; 