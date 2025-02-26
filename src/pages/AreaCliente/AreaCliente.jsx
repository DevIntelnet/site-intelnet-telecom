import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AreaCliente.css";
import api from "../../services/api";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { LiaCarSideSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { MdAttachMoney } from "react-icons/md";
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import { HiCheckCircle } from "react-icons/hi";
import ModalAlerta from "../../components/Modal/ModalAlerta";

export default function AreaCliente() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [nomeExibido, setNomeExibido] = useState("");
    const [faturas, setFaturas] = useState([]); // Estado para armazenar os boletos
    const [isModalOpen, setIsModalOpen] = useState(false);

    const planosRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false); // Estado para controlar o arrasto
    const [startX, setStartX] = useState(0); // Posição inicial do cursor
    const [scrollLeft, setScrollLeft] = useState(0); // Posição inicial da rolagem

    const handleMouseDown = (event) => {
        const container = planosRef.current;
        if (!container) return;

        setIsDragging(true); // Ativa o estado de arrasto
        setStartX(event.pageX - container.offsetLeft); // Captura a posição inicial do cursor
        setScrollLeft(container.scrollLeft); // Captura a posição inicial de rolagem
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return; // Só movimenta se estiver arrastando

        const container = planosRef.current;
        if (!container) return;

        event.preventDefault(); // Evita seleção de texto enquanto arrasta
        const x = event.pageX - container.offsetLeft; // Posição atual do cursor
        const walk = (x - startX) * 1.5; // Distância percorrida (ajuste a velocidade com o fator 1.5)
        container.scrollLeft = scrollLeft - walk; // Ajusta a posição da rolagem
    };

    const handleMouseUp = () => {
        setIsDragging(false); // Desativa o estado de arrasto
    };

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const ossRef = useRef(null);
    const [isDraggingOS, setIsDraggingOS] = useState(false); // Estado para controlar o arrasto
    const [startXOS, setStartXOS] = useState(0); // Posição inicial do cursor
    const [scrollLeftOS, setScrollLeftOS] = useState(0); // Posição inicial da rolagem

    const handleMouseDownOS = (event) => {
        const container = ossRef.current;
        if (!container) return;

        setIsDraggingOS(true); // Ativa o estado de arrasto
        setStartXOS(event.pageX - container.offsetLeft); // Captura a posição inicial do cursor
        setScrollLeftOS(container.scrollLeft); // Captura a posição inicial de rolagem
    };

    const handleMouseMoveOS = (event) => {
        if (!isDraggingOS) return; // Só movimenta se estiver arrastando

        const container = ossRef.current;
        if (!container) return;

        event.preventDefault(); // Evita seleção de texto enquanto arrasta
        const x = event.pageX - container.offsetLeft; // Posição atual do cursor
        const walk = (x - startXOS) * 1.5; // Distância percorrida (ajuste a velocidade com o fator 1.5)
        container.scrollLeft = scrollLeftOS - walk; // Ajusta a posição da rolagem
    };

    const handleMouseUpOS = () => {
        setIsDraggingOS(false); // Desativa o estado de arrasto
    };

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const faturaRef = useRef(null);
    const [isDraggingFat, setIsDraggingFat] = useState(false); // Estado para controlar o arrasto
    const [startXFat, setStartXFat] = useState(0); // Posição inicial do cursor
    const [scrollLeftFat, setScrollLeftFat] = useState(0); // Posição inicial da rolagem

    const handleMouseDownFat = (event) => {
        const container = faturaRef.current;
        if (!container) return;

        setIsDraggingFat(true); // Ativa o estado de arrasto
        setStartXFat(event.pageX - container.offsetLeft); // Captura a posição inicial do cursor
        setScrollLeftFat(container.scrollLeft); // Captura a posição inicial de rolagem
    };

    const handleMouseMoveFat = (event) => {
        if (!isDraggingFat) return; // Só movimenta se estiver arrastando

        const container = faturaRef.current;
        if (!container) return;

        event.preventDefault(); // Evita seleção de texto enquanto arrasta
        const x = event.pageX - container.offsetLeft; // Posição atual do cursor
        const walk = (x - startXFat) * 1.5; // Distância percorrida (ajuste a velocidade com o fator 1.5)
        container.scrollLeft = scrollLeftFat - walk; // Ajusta a posição da rolagem
    };

    const handleMouseUpFat = () => {
        setIsDraggingFat(false); // Desativa o estado de arrasto
    };

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
                    setError(null);
                } else {
                    setFaturas([]);
                }
            } catch (err) {
                console.error("Erro ao buscar faturas:", err.response ? err.response.data : err.message);
                setFaturas([]);
            }
        }

        fetchFaturas();
    }, [cliente]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("id_cliente");
        navigate("/");
    }

    if (loading) return <h4 style={{ color: '#072d6c' }}>Carregando...</h4>;
    if (error) return <h4 style={{ color: '#072d6c' }}>{error}</h4>;

    const links = [
        {
            title: 'Suporte',
            link: "/suporte",
        },
        {
            title: 'Faturas',
            link: "/minhas-faturas",
        },
        {
            title: 'Perfil',
            link: "/meu-perfil",
        },

    ];

    const getStatusText = (status_id) => {
        switch (status_id) {
            case 1:
                return 'Inativo';
            case 2:
                return 'Ativo';
            case 3:
                return 'Em espera';
            case 4:
                return 'Em análise';
            case 5:
                return 'Cancelada';
            case 6:
                return 'Finalizada';
            case 14:
                return 'Bloqueado por Pendencia Financeira (Automático)';
            case 15:
                return 'Bloqueado por Pendencia Financeira (Manual)';
            case 16:
                return 'Aguardando Instalação';
            case 19:
                return 'Desabilitado';
            case 20:
                return 'Habilitado';
            default:
                return 'Status desconhecido';
        }
    };

    const getColorStatus = (status_id) => {
        switch (status_id) {
            case 1:
                return '#ec3434';
            case 2:
                return '#009D61';
            case 3:
                return '#fbcc2e';
            case 4:
                return '#2caccc';
            case 5:
                return '#ec3434';
            case 6:
                return '#009D61';
            case 14:
                return '#ec3434';
            case 15:
                return '#ec3434';
            case 16:
                return '#fbcc2e';
            case 19:
                return '#fbcc2e';
            case 20:
                return '#009D61';
            default:
                return '';
        }
    };

    const getStatusClass = (status_id) => {
        switch (status_id) {
            case 3:
                return 'azul-claro';
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

    return (
        <div className="area-cliente-pagina-interna">
            <div className="cabecalho-area-cliente">
                <div className="nome">Olá, {nomeExibido}</div>
                {/* Botão de menu hambúrguer */}
                <a style={{zIndex: 9999999, cursor: 'pointer'}} className="d-none-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={27} /> : <FaBars size={27} />}
                </a>

                {/* Menu de navegação */}
                <nav className={`links ${menuOpen ? "open" : ""}`}>
                    {links.map((item, i) => (
                        <Link key={i} to={item.link} onClick={() => setMenuOpen(false)}>
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="faturas-section">
                <h3 className="faturas-titulo">Minhas Faturas</h3>

                <div
                    className="faturas-campo-faturas"
                    ref={faturaRef}
                    onMouseDown={handleMouseDownFat}
                    onMouseMove={handleMouseMoveFat}
                    onMouseLeave={handleMouseUpFat}
                    onMouseUp={handleMouseUpFat}
                    style={{ cursor: isDraggingFat ? "grabbing" : "grab" }}
                >
                    {error ? (
                        <h5 style={{ color: '#072d6c' }}>{error}</h5> // Exibe mensagem de erro dentro da seção de faturas
                    ) : faturas.length === 0 ? (
                        <h5 style={{ color: '#072d6c' }}>Nenhuma fatura encontrada.</h5>
                    ) : (
                        faturas.map((fatura, i) => {
                            const dataVencimento = new Date(fatura.reg_vencimento);

                            if (i < 8) {
                                return (
                                    <div key={i} className="card-faturas">
                                        <div
                                            className="top"
                                            // onClick={() => navigate(`/realizar-pagamento/${fatura.id}`)}
                                            onClick={() => (fatura.reg_baixa == 0 ?
                                                navigate(`/realizar-pagamento/${fatura.id}`)
                                                :
                                                setIsModalOpen(true)
                                            )}
                                            style={{ cursor: "pointer", color: "#072d6c" }}
                                            title={fatura.reg_baixa == 0 ? "Ver fatura" : "Fatura paga!"}
                                        >
                                            <span>
                                                <strong>{fatura.mes_referencia}/{fatura.ano_referencia} - <small style={{ color: '#373435' }}>Mês referência</small></strong>
                                            </span>
                                            {fatura.reg_baixa == 0 ?
                                                <TbCircleArrowUpRightFilled size={35} color="#072d6c" />
                                                :
                                                <HiCheckCircle size={35} color="#072d6c" />
                                            }
                                        </div>
                                        <div className="dados-fatura">
                                            <h5>Vencimento: {dataVencimento.toLocaleDateString('pt-BR')}</h5>
                                            <h4>Valor - {fatura.reg_valor_total ? `R$ ${fatura.reg_valor_total.toFixed(2)}` : "N/A"}</h4>
                                        </div>
                                        <div className="status-fatura">
                                            {(fatura.reg_baixa == 1 || fatura.reg_baixa == 2) && (
                                                <h5 style={{
                                                    color: '#072d6c',
                                                    paddingBlock: 15,
                                                    paddingInline: 15,
                                                }}>
                                                    Valor pago - R$ {fatura.bx_valor_pago}
                                                </h5>
                                            )}
                                            <h4
                                                style={{
                                                    color: getStatusColorFatura(fatura),
                                                    paddingBlock: 15,
                                                    paddingInline: 15,
                                                }}
                                            >{getStatusTextFatura(fatura)}</h4>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    )}
                </div>
            </div>

            <div className="planos-section">
                <h3 className="planos-titulo">Meus Planos de Internet</h3>

                <div
                    className="planos-campo-planos"
                    ref={planosRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp} // Para finalizar o arrasto caso o cursor saia do contêiner
                    onMouseUp={handleMouseUp} // Para finalizar o arrasto
                    style={{ cursor: isDraggingOS ? "grabbing" : "grab" }} // Altera o cursor visual
                >
                    {cliente.plano && cliente.plano.length > 0 ? (
                        cliente.plano.map((plano, i) => {
                            return (
                                <div className="card-plano" key={i}>
                                    <div className="top">
                                        <small
                                            style={{ color: getColorStatus(plano.status_id) }}
                                            className={plano.status_id == 16 && "linha-text"}
                                        ><strong>{getStatusText(plano.status_id)}</strong></small>
                                        <IoIosGlobe size={35} color="#072d6c" />
                                    </div>
                                    <div className="dados-plano">
                                        <h3>{plano.nome.toUpperCase()}</h3>
                                        <h5>por R$ {plano.valor},00</h5>
                                        {parseInt(plano.nome.match(/\d+/)?.[0]) >= 100 && (
                                            <h4>+ 180 Canais Gratuitos</h4>
                                        )}
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <h5 style={{ color: '#072d6c' }}>Nenhum plano ativo.</h5>
                    )}
                </div>
            </div>

            <div className="ordens-servicos-section">
                <h3 className="ordens-servicos-titulo">Minhas Ordens de Serviço</h3>

                <div
                    className="ordens-servicos-campo-ordens-servicos"
                    ref={ossRef}
                    onMouseDown={handleMouseDownOS}
                    onMouseMove={handleMouseMoveOS}
                    onMouseLeave={handleMouseUpOS} // Para finalizar o arrasto caso o cursor saia do contêiner
                    onMouseUp={handleMouseUpOS} // Para finalizar o arrasto
                    style={{ cursor: isDraggingOS ? "grabbing" : "grab" }} // Altera o cursor visual
                >
                    {cliente.ordemServico.length > 0 ? (
                        cliente.ordemServico.map((os, i) => {
                            const dataCadastro = new Date(os.dataCadastro);
                            const dataExecucao = new Date(os.dataExecucao);

                            return (
                                <div className="card-os" key={i}>
                                    <div className="top">
                                        <small
                                            style={{ color: getColorStatus(os.status_id) }}
                                            className={os.status_id == 16 && "linha-text"}
                                        ><strong>{getStatusText(os.status_id)}</strong></small>
                                        <LiaCarSideSolid size={35} color="#072d6c" />
                                    </div>
                                    <div className="dados-os">
                                        <h4>Aberta em {dataCadastro.toLocaleDateString('pt-BR')}</h4>
                                        {
                                            os.status_id == 6 ?
                                                <h5>Executada em {dataExecucao.toLocaleDateString('pt-BR')}</h5>
                                                :
                                                (
                                                    os.status_id == 3 ?
                                                        <h5>Prevista para {dataExecucao.toLocaleDateString('pt-BR')}</h5>
                                                        :
                                                        (os.status_id == 4 ?
                                                            <h5>Será feita em {dataExecucao.toLocaleDateString('pt-BR')}</h5>
                                                            :
                                                            (os.status_id == 5 &&
                                                                <h5>Cancelada em {dataExecucao.toLocaleDateString('pt-BR')}</h5>
                                                            )
                                                        )
                                                )
                                        }
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <h5 style={{ color: '#072d6c' }}>Nenhuma OS registrada.</h5>
                    )}
                </div>
            </div>
            <ModalAlerta isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
