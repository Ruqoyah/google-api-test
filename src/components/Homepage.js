import React from 'react';
import '../styles/App.css';
import GoogleBtn from './GoogleBtn';

const Homepage = () => {
  return (
    <div className="app">
      <div className="app-wrapper">
      <GoogleBtn/>
      </div>
    </div>
  );
}

export default Homepage;