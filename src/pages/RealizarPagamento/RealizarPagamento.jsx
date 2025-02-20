import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import api from "../../services/api";

export default function RealizarPagamento() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

            const nomeCompleto = cliente.pessoa.nome.trim();
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

    const links = [
        {
            title: "Área do Cliente",
            link: "/area-cliente"
        },
        {
            title: "Faturas",
            link: "/minhas-faturas"
        },
        {
            title: "Perfil",
            link: "/meu-perfil"
        }
    ];

    return (
        <div className="area-cliente-pagina-interna">
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

            <h1>Realizar Pagamento</h1>
            <p>ID da fatura: {id}</p>
        </div>

    );
}
