import { Link } from 'react-router-dom';

export const NavbarLogo: React.FC = () => {
    return (
      <div className="navbar-logo">
        <Link to="/">
          <h1>Library Management</h1>
        </Link>
      </div>
    );
  };
  