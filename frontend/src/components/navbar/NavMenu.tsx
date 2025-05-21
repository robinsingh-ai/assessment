import { NavMenuItem } from "./NavMenuItem";


// Navigation Menu Component
export const NavMenu: React.FC<{ isOpen: boolean; onSearchToggle: () => void }> = ({ isOpen, onSearchToggle }) => {
    return (
      <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
        <NavMenuItem 
          title="Find, Borrow, Request"
          links={[
            { to: "/", text: "Home" },
            { to: "/books", text: "Browse Books" },
            { to: "/new-arrivals", text: "New Arrivals" },
            { to: "/popular", text: "Popular Titles" }
          ]}
        />
        
        <NavMenuItem 
          title="Research & Instruction"
          links={[
            { to: "/research-guides", text: "Research Guides" },
            { to: "/tutorials", text: "Tutorials" },
            { to: "/workshops", text: "Workshops" }
          ]}
        />
        
        <NavMenuItem 
          title="Library Spaces"
          links={[
            { to: "/study-rooms", text: "Study Rooms" },
            { to: "/computer-labs", text: "Computer Labs" },
            { to: "/meeting-spaces", text: "Meeting Spaces" }
          ]}
        />
        
        <NavMenuItem 
          title="About"
          links={[
            { to: "/about", text: "About Us" },
            { to: "/contact", text: "Contact" },
            { to: "/hours", text: "Hours & Location" }
          ]}
        />
        
        {/* Mobile-only search toggle */}
        <div className="navbar-item mobile-search-toggle" onClick={onSearchToggle}>
          <span className="dropdown-toggle">Search</span>
        </div>
      </div>
    );
  };