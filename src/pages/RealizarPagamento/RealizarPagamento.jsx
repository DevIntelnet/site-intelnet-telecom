import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import api from "../../services/api";
import "./RealizarPagamento.css";
import ModalConfirmacao from "../../components/Modal/ModalConfirmacao";
import QRCode from "react-qr-code";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const MySwal = withReactContent(Swal.mixin({
        buttonsStyling: false,
    }));

    function formatDate(data, formato) {
        if (formato == 'pt-br') {
            return (data.substr(0, 10).split('-').reverse().join('/'));
        } else {
            return (data.substr(0, 10).split('/').reverse().join('-'));
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

    const registrarBoleto = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await api.get(`/api/boletos/registrar/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // navigate(`/realizar-pagamento/${id}`);
                window.onload();
            } else {
                alert("Erro ao registrar o pagamento.");
            }
        } catch (error) {
            alert("Erro ao processar o pagamento. Tente novamente.");
        }
    };

    const copyToClipboard = (text) => {
        if (!navigator.clipboard) {
            console.error("Clipboard API não suportada no navegador.");
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                MySwal.fire({
                    title: "Código copiado!",
                    text: "Código PIX copiado para a área de transferência! \n\nApós o pagamento, acesse sua tela de faturas e atualize a página para confirmar o recebimento do pagamento, ok!",
                    icon: "success",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "custom-confirm-button",
                    },
                    buttonsStyling: false,
                }).then(() => {
                    navigate("/minhas-faturas");
                });
            }).catch(err => {
                console.error("Erro ao copiar o código PIX:", err);
            });
    };


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

            <div className="campo-resumo-pagamento">
                <div className="campo-resumo-pag">
                    <h2>Resumo da Fatura</h2>
                    <MdOutlineAttachMoney size={50} color="#072d6c" className="icon-pag" />

                    <div className="dados-beneficiario">
                        <span>Beneficiário:</span>
                        <span>INTELNET SERVICO DE MULTIMIDIA LTDA</span>
                        <span>CNPJ:</span>
                        <span>07.692.425/0001-58</span>
                    </div>

                    <div className="dados-boleto">
                        {boleto && (
                            <>
                                <div>
                                    <span>Mês de referência:</span>
                                    <span>{boleto.mes_referencia}/{boleto.ano_referencia}</span>
                                </div>
                                <div>
                                    <span>Vencimento:</span>
                                    <span>{formatDate(boleto.reg_vencimento, 'pt-br')}</span>
                                </div>
                                <div>
                                    <span>Valor total:</span>
                                    <span>R$ {boleto.registrado == 0 ? boleto.reg_valor : boleto.reg_valor_pos_registro}</span>
                                </div>
                            </>
                        )}

                        <small className="info-pag">O valor acima está sujeito a juros após a data de<br /> vencimento!*</small>
                    </div>

                    {boleto && boleto.entryDate !== null && (
                        <div className="campo-logo-pix">
                            <img src="/logo-pix.png" className="logo-pix" />
                        </div>
                    )}

                    {boleto && boleto.entryDate !== null && (
                        <div className="campo-qrcode">
                            <small>Leia o QRCode com o seu aplicativo do banco</small>
                        </div>
                    )}

                    {boleto && boleto.qrCodePix !== null && (
                        <div className="campo-qrcode">
                            <QRCode value={boleto.qrCodePix} size={206} />
                        </div>
                    )}

                    {boleto && boleto.entryDate !== null && (
                        <div className="campo-qrcode">
                            <small>Para usar o "Pix Copia e Cola" copie o código e cole para completar a transação.</small>
                        </div>
                    )}

                    {boleto && (boleto.reg_baixa === null || boleto.reg_baixa === 0) && boleto.registrado === 0 ?
                        <div className="btn-pagar" onClick={() => setIsModalOpen(true)}>
                            <a href="#">Pagar</a>
                        </div>
                        :
                        <>
                            <button
                                className="btn-copiar-pix"
                                onClick={() => copyToClipboard(boleto.qrCodePix)}
                            >
                                COPIAR CÓDIGO PIX
                            </button>
                            <a href={`/boletos/imprimir/${boleto.cliente_id_web}/${boleto.id}`} target="_blank" className="btn-baixar-boleto">BAIXAR BOLETO</a>
                        </>
                    }
                </div>
            </div>
            <ModalConfirmacao
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={registrarBoleto}
            />

        </div>

    );
}
