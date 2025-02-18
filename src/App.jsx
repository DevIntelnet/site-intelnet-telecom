// import { useState } from 'react'
// import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import api from './services/api';
import Home from './pages/Home/Home';

function App() {

  function About() {
    return (<>
      <h1>Sobre Nós</h1>
    </>
    );
  }

  function NotFound() {
    return (<>
      <h1>Página não encontrada</h1>
    </>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
