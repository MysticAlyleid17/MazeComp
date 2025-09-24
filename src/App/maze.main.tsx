import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../maze/styles/app.css'
import MazePage from './MazePage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MazePage />
  </StrictMode>
);
