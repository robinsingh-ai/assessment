import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import Navbar from './components/layout/Navbar';
import './App.css';

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    // Implement search functionality here
  };

  return (
    <div className="App">
      <Router>
        <Navbar onSearch={handleSearch} />
        <div className="content-container">
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
      </Router>
    </div>
  );
};

export default App;
