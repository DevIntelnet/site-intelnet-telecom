import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AreaCliente.css";
import api from "../../services/api";
import { FaBars, FaTimes } from "react-icons/fa";

export default function AreaCliente() {
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

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("id_cliente");
        navigate("/");
    }

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    const links = [
        {
            title: 'Faturas',
            link: "/",
        },
        {
            title: 'Perfil',
            link: "/",
        },

    ];

    const getStatusText = (status_id) => {
        switch (status_id) {
            case 3:
                return 'Em espera';
            case 4:
                return 'Em análise';
            case 5:
                return 'Cancelada';
            case 6:
                return 'Finalizada';
            default:
                return 'Status desconhecido';
        }
    };

    const getStatusClass = (status_id) => {
        switch (status_id) {
            case 3:
            case 4:
                return 'amarelo';
            case 5:
                return 'vermelho';
            case 6:
                return 'verde';
            default:
                return '';
        }
    };

    return (
        <div className="area-cliente-pagina-interna">
            <div className="cabecalho-area-cliente">
                <div className="nome">Olá, {nomeExibido}</div>
                {/* Botão de menu hambúrguer */}
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={27} /> : <FaBars size={27} />}
                </button>

                {/* Menu de navegação */}
                <nav className={`links ${menuOpen ? "open" : ""}`}>
                    {links.map((item, i) => (
                        <a key={i} href={"#section" + i} onClick={() => setMenuOpen(false)}>
                            {item.title}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="planos-section">
                <h2 className="planos-titulo">Meus Planos de Internet</h2>
                <div className="planos-container">
                    {cliente.plano && cliente.plano.length > 0 ? (
                        cliente.plano.map((plano) => (
                            <div key={plano.id} className="plano-card-inicio">
                                <h3 className="plano-nome">{plano.nome}</h3>
                                <p className="plano-valor">R$ {plano.valor}</p>

                                {plano.nome.includes("100 MEGA") && (
                                    <p className="plano-aviso">Canais gratuitos</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Nenhum plano ativo.</p>
                    )}
                </div>
            </div>


            <div className="ordens-servico-section">
                <h2 className="ordens-servico-titulo">Minhas Ordens de Serviço</h2>
                <div className="ordens-servico-container">
                    {cliente.ordemServico.length > 0 ? (
                        cliente.ordemServico.map((os) => {
                            const dataCadastro = new Date(os.dataCadastro);
                            const dataExecucao = new Date(os.dataExecucao);
                            const statusClass = getStatusClass(os.status_id);
                            const statusText = getStatusText(os.status_id);

                            return (
                                <div key={os.id} className="ordem-card">
                                    <div className="ordem-card-content">
                                        <p><strong>Data de Cadastro:</strong> {dataCadastro.toLocaleDateString('pt-BR')}</p>
                                        <p><strong>Previsto para:</strong> {dataExecucao ? new Date(dataExecucao).toLocaleDateString('pt-BR') : "Em análise"}</p>
                                        <div className="ordem-card-status">
                                            <strong>Situação:</strong>
                                            <span className={`status-card ${statusClass}`}>{statusText}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Nenhuma OS registrada.</p>
                    )}
                </div>
            </div>



            {/* <section className="plano">
                <h2>Seu Plano</h2>
                {cliente.plano && cliente.plano.length > 0 ? (
                    cliente.plano.map((plano) => (
                        <div key={plano.id} className="plano-card-inicio">
                            <h3>{plano.nome}</h3>
                            <p><strong>Valor:</strong> R$ {plano.valor}</p>
                            <p><strong>Contrato:</strong> {plano.num_contrato}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhum plano ativo.</p>
                )}
            </section>

            <section className="ordens">
                <h2>Ordens de Serviço</h2>
                {cliente.ordemServico.length > 0 ? (
                    cliente.ordemServico.map((os) => (
                        <div key={os.id} className="os-card">
                            <h3>OS #{os.codigo}</h3>
                            <p><strong>Data:</strong> {os.dataCadastro}</p>
                            <p><strong>Atividades:</strong> {os.atividades}</p>
                            <p><strong>Observação:</strong> {os.observacao || "Nenhuma"}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma OS registrada.</p>
                )}
            </section> */}

            {/* <button className="logout-btn" onClick={handleLogout}>Sair</button> */}
        </div>
    );
}
