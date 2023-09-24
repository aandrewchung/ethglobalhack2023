import React from 'react';
import Web3Card from './components/Web3Card';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <h1>Web3Card Example</h1>
      <Web3Card address="vitalik.eth" />
</div>
  );
};

export default App;

/*
      <Web3Card address="stani.lens" />
      <Web3Card address="dwr.eth.farcaster" />
      <Web3Card address="0x028f936e528de34fc95179780751ec21256825ce604950580978a8961c5af03e50" />
*/