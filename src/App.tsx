import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { LoginForm } from './pages/LoginForm';
import { SearchDogs } from './pages/SearchDog';
import { FavoriteDogs } from './pages/FavoDogs';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <Router>
      <div className="App flex flex-col h-screen">
        <header className="App-header">
          <NavBar />
        </header>
        <main className="flex-1 mt-12">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/search" element={<SearchDogs />} />
            <Route path="/favo" element={<FavoriteDogs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
