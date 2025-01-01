import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';

//render the APP component into the DOM
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);