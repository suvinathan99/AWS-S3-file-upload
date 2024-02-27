import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SudokuBoard from './SudokuBoard'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>fileupload</h1>
      </div>

      <Routes>
        <Route path="/" element={<SudokuBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
