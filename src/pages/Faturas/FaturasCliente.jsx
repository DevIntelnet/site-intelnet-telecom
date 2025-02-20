import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './FaturasCliente.css'


export default function FaturasCliente() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [faturas, setFaturas] = useState([]); // Estado para armazenar os boletos
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
        async function fetchFaturas() {
            if (!cliente) return;

            const id_cliente = localStorage.getItem("id_cliente");
            const token = localStorage.getItem("token");

            if (!id_cliente || !token) return;

            console.log("Token usado para fetchFaturas:", token);

            try {
                const response = await api.get(`/api/financeiro/${id_cliente}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.error === 0) {
                    setFaturas(response.data.dados);
                } else {
                    setError("Erro ao carregar as faturas.");
                }
            } catch (err) {
                console.error("Erro ao buscar faturas:", err.response ? err.response.data : err.message);
                setError("Erro ao buscar as faturas. Tente novamente.");
            }
        }

        fetchFaturas();
    }, [cliente]);

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

    const links = [
        { title: "Perfil", link: "/meu-perfil" },
        { title: "Área do Cliente", link: "/area-cliente" },
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

            <div className="conteudo-faturas">
                {faturas.length === 0 ? <p>Nenhuma fatura encontrada.</p> : (
                    <div className="lista-faturas">
                        {faturas.map((fatura) => (
                            <div
                                key={fatura.id}
                                className="card-fatura"
                                onClick={() => navigate(`/realizar-pagamento/${fatura.id}`)}
                                style={{ cursor: "pointer" }} // Para indicar que é clicável
                            >
                                <p><strong>Vencimento:</strong> {fatura.reg_vencimento || "N/A"}</p>
                                <p><strong>Valor:</strong> {fatura.reg_valor_total ? `R$ ${fatura.reg_valor_total.toFixed(2)}` : "N/A"}</p>
                                {fatura.descricao && <p><strong>Descrição:</strong> {fatura.descricao}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}