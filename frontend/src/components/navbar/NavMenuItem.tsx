import React, { useState } from "react";
import { Link } from "react-router-dom";

// Navigation Menu Item Component
interface NavMenuItemProps {
    title: string;
    links: { to: string; text: string }[];
  }
  
  export const NavMenuItem: React.FC<NavMenuItemProps> = ({ title, links }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleToggle = (e: React.MouseEvent) => {
      // Only toggle on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    
    return (
      <div className="navbar-item dropdown">
        <span 
          className={`dropdown-toggle ${isOpen ? 'active' : ''}`}
          onClick={handleToggle}
        >
          {title}
        </span>
        <div className={`dropdown-content ${isOpen ? 'active' : ''}`}>
          {links.map((link, index) => (
            <Link key={index} to={link.to}>{link.text}</Link>
          ))}
        </div>
      </div>
    );
  };