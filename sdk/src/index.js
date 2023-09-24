import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Web3Card from './components/Web3Card';

// Export the Web3Card component for use in other applications
export default Web3Card;

// Render the example application
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
