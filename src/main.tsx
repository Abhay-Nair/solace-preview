import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// GitHub Pages cannot serve SPA deep links directly. Its published build uses
// hash routing; local development retains the original clean BrowserRouter URLs.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router><App /></Router>
  </React.StrictMode>,
);
