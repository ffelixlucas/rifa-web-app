import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

// Só tenta renderizar se tiver o elemento
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
