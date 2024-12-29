import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';


//render the APP component into the DOM
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);