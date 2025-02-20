import { useEffect, useState } from "react";
import { FaBars, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaMapSigns, FaPhone, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../services/api";
import './PerfilCliente.css';

export default function PerfilCliente() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [nomeExibido, setNomeExibido] = useState("");

    useEffect(() => {
        async function fetchCliente() {
            const id_cliente = localStorage.getItem("id_cliente");
            const token = localStorage.getItem("token");

            if (!id_cliente || !token) {
                navigate("/");
                return;
            }

            try {
                const response = await api.get(`/api/cliente/${id_cliente}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.error === 0) {
                    setCliente(response.data.dados);
                } else {
                    setError("Erro ao carregar os dados.");
                }
            } catch (err) {
                setError("Erro ao buscar os dados. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }

        fetchCliente();
    }, [navigate]);

    useEffect(() => {
        function atualizarNomeExibido() {
            if (!cliente) return;

            const nomeCompleto = cliente.pessoa.fantasia || cliente.pessoa.nome;
            const primeiroNome = nomeCompleto.split(" ")[0];

            if (window.innerWidth <= 768) {
                setNomeExibido(primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase());
            } else {
                setNomeExibido(nomeCompleto.charAt(0).toUpperCase() + nomeCompleto.slice(1).toLowerCase());
            }
        }

        atualizarNomeExibido();
        window.addEventListener("resize", atualizarNomeExibido);

        return () => window.removeEventListener("resize", atualizarNomeExibido);
    }, [cliente]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("id_cliente");
        navigate("/");
    }

    const links = [
        { title: 'Faturas', link: "/minhas-faturas" },
        { title: 'Área do Cliente', link: "/area-cliente" },
    ];

    return (
        <div className="area-cliente-pagina-interna">
            {loading ? (
                <p className="carregando">Carregando...</p>
            ) : (
                <>
                    <div className="cabecalho-area-cliente">
                        <div className="nome">Olá, {nomeExibido}</div>
                        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FaTimes size={27} /> : <FaBars size={27} />}
                        </button>
                        <nav className={`links ${menuOpen ? "open" : ""}`}>
                            {links.map((item, i) => (
                                <Link key={i} to={item.link} onClick={() => setMenuOpen(false)}>
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="container-perfil-cliente">
                        {error ? (
                            <p className="erro">{error}</p>
                        ) : (
                            <div className="perfil-container">
                                <div className="perfil-card">
                                    <div className="perfil-header">
                                        <FaUser size={40} className="perfil-avatar" />
                                        <h2>{cliente.pessoa.fantasia || cliente.pessoa.nome}</h2>
                                    </div>
                                    <div className="perfil-info">
                                        <p><FaMapMarkerAlt /> <strong>Rua:</strong> <span>{cliente.pessoa.endereco}</span></p>
                                        <p><FaMapMarkerAlt /> <strong>Número:</strong> <span>{cliente.pessoa.num_end}</span></p>
                                        <p><FaMapMarkerAlt /> <strong>Bairro:</strong> <span>{cliente.pessoa.bairro}</span></p>
                                        <p><FaMapMarkerAlt /> <strong>Cidade:</strong> <span>{cliente.pessoa.cidade}</span></p>
                                        <p><FaMapSigns /> <strong>Referência:</strong> <span>{cliente.pessoa.referencia || "Não informado"}</span></p>
                                    </div>


                                    <button className="logout-button" onClick={handleLogout}>
                                        <FaSignOutAlt /> Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}