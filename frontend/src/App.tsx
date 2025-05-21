import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import routes from './routes';
import Navbar from './components/navbar/Navbar';
import './App.css';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    // Navigate to books page with search term
    navigate(`/books?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="content-container" data-testid="content-container">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <AppContent />
      </Router>
    </div>
  );
};

export default App;
