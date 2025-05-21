import { Link } from "react-router-dom";

// Navigation Menu Item Component
interface NavMenuItemProps {
    title: string;
    links: { to: string; text: string }[];
  }
  
  export const NavMenuItem: React.FC<NavMenuItemProps> = ({ title, links }) => {
    return (
      <div className="navbar-item dropdown">
        <span className="dropdown-toggle">{title}</span>
        <div className="dropdown-content">
          {links.map((link, index) => (
            <Link key={index} to={link.to}>{link.text}</Link>
          ))}
        </div>
      </div>
    );
  };