import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Calendar from './Calendar';

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/calendar" component={Calendar} />
    </Router>
  );
}

export default App;
