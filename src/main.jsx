import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ProveedorTema } from "./context/ProveedorTema"; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProveedorTema>
      <App />
    </ProveedorTema>
  </BrowserRouter>
);
