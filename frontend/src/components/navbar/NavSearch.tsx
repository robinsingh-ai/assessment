// Search Component
interface SearchProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    isOpen: boolean;
  }
  
  export const NavSearch: React.FC<SearchProps> = ({ searchTerm, onSearchChange, onSearchSubmit, isOpen }) => {
    return (
      <div className={`navbar-search ${isOpen ? 'active' : ''}`}>
        <form onSubmit={onSearchSubmit}>
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
            aria-label="Search books"
          />
          <button type="submit" className="search-button" aria-label="Submit search">
            🔍
          </button>
        </form>
      </div>
    );
  };