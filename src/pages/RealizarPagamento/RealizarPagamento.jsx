import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import api from "../../services/api";
import "./RealizarPagamento.css";

import { MdOutlineAttachMoney } from "react-icons/md";

export default function RealizarPagamento() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nomeExibido, setNomeExibido] = useState("");

    const [boleto, setBoleto] = useState(null);

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
        async function fetchBoleto() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await api.get(`/api/financeiro/one-boleto/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.error === 0) {
                    setBoleto(response.data.dados);
                } else {
                    setError("Erro ao carregar os dados do boleto.");
                }
            } catch (err) {
                setError("Erro ao buscar os dados. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }

        fetchBoleto();
    }, [id]);

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

            <div className="campo-resumo-pagamento">
                <div className="campo-resmo-pag">
                    <h2>Resumo da Fatura</h2>
                    <MdOutlineAttachMoney size={50} color="#072d6c" className="icon-pag" />

                    <div className="dados-beneficiario">
                        <span>Beneficiário:</span>
                        <span>INTELNET SERVICO DE MULTIMIDIA LTDA</span>
                        <span>CNPJ:</span>
                        <span>07.692.425/0001-58</span>
                    </div>

                    <div className="dados-boleto">
                        <div>
                            <span>Mês de referência:</span>
                            <span>INTELNET SERVICO DE MULTIMIDIA LTDA</span>
                        </div>
                        <div>
                            <span>Vencimento:</span>
                            <span>INTELNET SERVICO DE MULTIMIDIA LTDA</span>
                        </div>
                        <div>
                            <span>Valor total:</span>
                            <span>INTELNET SERVICO DE MULTIMIDIA LTDA</span>
                        </div>
                    </div>
                </div>

                {/* <p>ID da fatura: {id}</p> */}
            </div>
        </div>

    );
}
