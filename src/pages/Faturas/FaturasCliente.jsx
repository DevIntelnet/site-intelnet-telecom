import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './FaturasCliente.css'
import { TbCircleArrowUpRightFilled } from "react-icons/tb";


export default function FaturasCliente() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [faturas, setFaturas] = useState([]); // Estado para armazenar os boletos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [nomeExibido, setNomeExibido] = useState("");

    // Função para determinar o texto do status
    const getStatusTextFatura = (item) => {
        const hoje = new Date();
        const regVencimento = new Date(item.reg_vencimento);

        if (item.reg_baixa === 1 || item.reg_baixa === 2) {
            return 'PAGO';
        }

        // if (item.informacoes_pos_registro) {
        //   const status = JSON.parse(item.informacoes_pos_registro).status_boleto_registrado;
        //   if (status) {
        //     return status.toUpperCase();
        //   }
        // }

        if (regVencimento < hoje) {
            return 'VENCIDO';
        }

        return 'EM ABERTO';
    };

    // Função para determinar a cor do status
    const getStatusColorFatura = (item) => {
        const hoje = new Date();
        const regVencimento = new Date(item.reg_vencimento);

        if (item.reg_baixa === 1 || item.reg_baixa === 2) {
            return '#106f42'; // Verde para pago
        }

        if (item.informacoes_pos_registro) {
            const status = JSON.parse(item.informacoes_pos_registro).status_boleto_registrado;
            // if (status === 'Ativo' || status === '') {
            //   return '#ffcc29'; // Amarelo para ativo ou vazio
            // } else 
            if (status === 'Liquidado') {
                return '#106f42'; // Verde para liquidado
            } else if (status === 'Baixado') {
                return '#00ace4'; // Azul para baixado
            }
        }

        if (regVencimento < hoje) {
            return '#ed3237'; // Vermelho para vencido
        }

        return '#00ace4'; // Azul padrão para em aberto
    };

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

            setLoading(true);

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
                    setLoading(false);
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
                {loading == true ? <h4 style={{ color: '#072d6c' }}>Carregando faturas...</h4>
                    :
                    faturas.length === 0 ? <h4 style={{ color: '#072d6c' }}>Nenhuma fatura encontrada.</h4> : (
                        <div className="lista-faturas">
                            {faturas.map((fatura) => {
                                const dataVencimento = new Date(fatura.reg_vencimento);
                                return (
                                    <div
                                        key={fatura.id}
                                        className="card-fatura"
                                        onClick={() => navigate(`/realizar-pagamento/${fatura.id}`)}
                                        style={{ cursor: "pointer" }} // Para indicar que é clicável
                                    >
                                        <div>
                                            <div className="status-fatura">
                                                <h4
                                                    style={{
                                                        color: getStatusColorFatura(fatura),
                                                    }}
                                                >{getStatusTextFatura(fatura)}</h4>
                                                {(fatura.reg_baixa == 1 || fatura.reg_baixa == 2) && (
                                                    <h5 style={{
                                                        color: '#072d6c',
                                                    }}>
                                                        Valor pago - R$ {fatura.bx_valor_pago}
                                                    </h5>
                                                )}

                                            </div>
                                            <p><strong>Vencimento:</strong> <small style={{ color: '#373435', fontWeight: 'bold' }}>{dataVencimento.toLocaleDateString('pt-BR')}</small></p>
                                            <p><strong>Valor:</strong> <span style={{ color: '#373435', fontWeight: 'bold' }}>{fatura.reg_valor_total ? `R$ ${fatura.reg_valor_total.toFixed(2)}` : "N/A"}</span></p>
                                            {fatura.descricao && <p><strong>Descrição:</strong> <small style={{ color: '#373435', fontWeight: 'bold' }}>{fatura.descricao}</small></p>}
                                        </div>
                                        <div className="actions-fatura">
                                            <TbCircleArrowUpRightFilled size={35} color="#072d6c" />
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    )
                }
            </div>
        </div>
    );
}