// import { useState } from 'react'
// import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import api from './services/api';
import Home from './pages/Home/Home';
import AreaCliente from "./pages/AreaCliente/AreaCliente";
import { useEffect } from 'react';
import PerfilCliente from './pages/Perfil/PerfilCliente';
import FaturasCliente from './pages/Faturas/FaturasCliente';
import RealizarPagamento from './pages/RealizarPagamento/RealizarPagamento';
import Suporte from './pages/Suporte/Suporte';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

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
        <Route path="/area-cliente" element={<AreaCliente />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/meu-perfil" element={<PerfilCliente />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/minhas-faturas" element={<FaturasCliente />} />
        <Route path="/realizar-pagamento/:id" element={<RealizarPagamento />} />
      </Routes>
    </div>
  )
}

export default App
