import React from 'react';
import './PageContainer.css';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <div className="page-container">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default PageContainer; 