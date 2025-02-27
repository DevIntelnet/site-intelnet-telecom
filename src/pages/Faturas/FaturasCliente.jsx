import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import './FaturasCliente.css'
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import { HiCheckCircle } from "react-icons/hi";
import ModalAlerta from "../../components/Modal/ModalAlerta";


export default function FaturasCliente() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [faturas, setFaturas] = useState([]); // Estado para armazenar os boletos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [nomeExibido, setNomeExibido] = useState("");

    const [loadingFaturas, setLoadingFaturas] = useState(false);
    const [idsFat, setIdsFat] = useState([]);
    const [numFatSincronizadas, setNumFatSincronizadas] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    async function atualizaDadosBoletos(array_ids) {

        // console.log(array_ids);

        setLoadingFaturas(true);

        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await api.get(`api/boletos/buscar/status/[${array_ids}]`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(
                response.data.resultados
            );

            setNumFatSincronizadas(response.data.tt_resultados);

            setLoadingFaturas(false);

        } catch (error) {
            console.log('Erro ao verificar o status dos boletos:', error);
            // alert('Erro', 'Ocorreu um erro na comunicação com o servidor.');

            setNumFatSincronizadas(0);

            setLoadingFaturas(false);
        }
    }

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

    let ids = [];

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

                    response.data.dados.forEach(fat => {
                        if (fat['reg_baixa'] == 0) {
                            ids.push(fat.id);
                        }
                    });

                    setIdsFat(ids);

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
        atualizaDadosBoletos(idsFat);
    }, [idsFat]);

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
        {
            title: 'Suporte',
            link: "/suporte",
        },
        { 
            title: "Perfil", 
            link: "/meu-perfil" 
        },
        { 
            title: "Área do Cliente", 
            link: "/area-cliente" 
        },
    ];

    return (
        <div className="area-cliente-pagina-interna">
            <div className="cabecalho-area-cliente">
                <div className="nome">Olá, {nomeExibido}</div>
                <a style={{zIndex: 9999999, cursor: 'pointer'}} className="d-none-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={27} /> : <FaBars size={27} />}
                </a>
                <nav className={`links ${menuOpen ? "open" : ""}`}>
                    {links.map((item, i) => (
                        <Link key={i} to={item.link} onClick={() => setMenuOpen(false)}>
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="conteudo-faturas">
                {loadingFaturas ?
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }}>
                        <h4 style={{ color: '#072d6c' }}>Sincronizando boletos...</h4>
                    </div>
                    :
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }}>
                        <h3 style={{ color: '#062c6c', marginInline: 5, fontWeight: 'bold' }}>
                            {numFatSincronizadas}
                        </h3>
                        <h4 style={{ color: '#062c6c', marginInline: 5 }}>
                            Boleto(s) sincronizado(s)!
                        </h4>
                    </div>
                }
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
                                        onClick={() => (fatura.reg_baixa == 0 ?
                                            navigate(`/realizar-pagamento/${fatura.id}`)
                                            :
                                            setIsModalOpen(true)
                                        )}
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
                                            {fatura.reg_baixa == 0 ?
                                                <TbCircleArrowUpRightFilled size={35} color="#072d6c" />
                                                :
                                                <HiCheckCircle size={35} color="#072d6c" />
                                            }
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    )
                }
            </div>

            <ModalAlerta isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}