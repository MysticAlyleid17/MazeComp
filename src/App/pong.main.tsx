import { createRoot } from 'react-dom/client';
import '../pong/styles/app.css';
import PongPage from './PongPage';

createRoot(document.getElementById('root')!).render(
 
    <PongPage />
  
);
