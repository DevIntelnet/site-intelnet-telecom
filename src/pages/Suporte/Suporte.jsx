import { useEffect, useState } from "react";
import { FaBars, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaMapSigns, FaPhone, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./suporte.css";
import { FiWifiOff } from "react-icons/fi";
import { RiSignalWifi1Fill } from "react-icons/ri";
import { LuWifi } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FiHelpCircle } from "react-icons/fi";
import { TbLockOff } from "react-icons/tb";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { RiSettings3Fill } from "react-icons/ri";

export default function Suporte() {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [nomeExibido, setNomeExibido] = useState("");
    const [optSelected, setOptSelected] = useState(true);

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

    const links = [
        { 
            title: 'Faturas', 
            link: "/minhas-faturas" 
        },
        { 
            title: "Perfil", 
            link: "/meu-perfil" 
        },
        { 
            title: 'Área do Cliente', 
            link: "/area-cliente" 
        },
    ];

    const opt_internet = [
        {
            icon: <FiWifiOff color="#072d6c" size={22} className="icon-opt" />,
            title: 'Sem Conexão',
            description: 'Estou sem conexão',
            link: "/"
        },
        {
            icon: <RiSignalWifi1Fill color="#072d6c" size={22} className="icon-opt" />,
            title: 'Lentidão',
            description: 'Estou com lentidão',
            link: "/"
        },
        {
            icon: <LuWifi color="#072d6c" size={22} className="icon-opt" />,
            title: 'Instabilidade',
            description: 'Estou com instabilidade',
            link: "/"
        },
        {
            icon: <GrLocation color="#072d6c" size={22} className="icon-opt" />,
            title: 'Transferência de Endereço',
            description: 'Desejo realizar uma transferência de endereço',
            link: "/"
        },
        {
            icon: <MdOutlineAttachMoney color="#072d6c" size={22} className="icon-opt" />,
            title: 'Solicitar Desconto',
            description: 'Gostaria de solicitar um desconto',
            link: "/"
        },
        {
            icon: <FiHelpCircle color="#072d6c" size={22} className="icon-opt" />,
            title: 'Ajuda',
            description: 'Preciso de ajuda',
            link: "/"
        },
    ];

    const opt_canais = [
        {
            icon: <TbLockOff color="#072d6c" size={22} className="icon-opt" />,
            title: 'Sem Acesso',
            description: 'Estou sem acesso aos canais',
            link: "/"
        },
        {
            icon: <MdOutlineDesktopWindows color="#072d6c" size={22} className="icon-opt" />,
            title: 'Instabilidade nos Canais',
            description: 'Estou com instabilidade nos canais',
            link: "/"
        },
        {
            icon: <RiSettings3Fill color="#072d6c" size={22} className="icon-opt" />,
            title: 'Instalar Canais',
            description: 'Desejo realizar a instalação dos canais',
            link: "/"
        },
        {
            icon: <FiHelpCircle color="#072d6c" size={22} className="icon-opt" />,
            title: 'Ajuda',
            description: 'Preciso de ajuda com os canais',
            link: "/"
        },
    ];

    const handleWhatsApp = (description) => {
        if (!cliente || !cliente.pessoa) return;

        const { pessoa } = cliente;
        const nome = pessoa.nome || pessoa.fantasia;
        const identificador = pessoa.cpf ? `CPF: ${pessoa.cpf}` : `CNPJ: ${pessoa.cnpj}`;
        const message = `Olá, venho do site. Nome: ${nome}, ${identificador}, ${description}`;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "5584991819502";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    };


    return (
        <div className="area-cliente-pagina-interna">
            {loading ? (
                <div className="carregando">
                    <h4 style={{ color: '#072d6c' }}>Carregando...</h4>
                </div>
            ) : (
                <>
                    <div className="cabecalho-area-cliente">
                        <div className="nome">Olá, {nomeExibido}</div>
                        <a style={{ zIndex: 9999999, cursor: 'pointer' }} className="d-none-menu" onClick={() => setMenuOpen(!menuOpen)}>
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
                    <div className="container-suporte">
                        <div className="suporte-container">

                            <h2>Suporte</h2>
                            <div className="options-suporte">
                                <a href="#" className={optSelected ? "select" : "no-select"} onClick={() => setOptSelected(!optSelected)}>Internet</a>
                                <a href="#" className={!optSelected ? "select" : "no-select"} onClick={() => setOptSelected(!optSelected)}>Canais</a>
                            </div>

                            <div className="list-opt-internet" style={{ display: optSelected ? "flex" : "none" }}>
                                {opt_internet.map((opt, i) => (
                                    <a key={i} className="opt-int" onClick={() => handleWhatsApp(opt.description)} style={{ cursor: "pointer" }}>
                                        {opt.icon}
                                        <span>{opt.title}</span>
                                    </a>
                                ))}
                            </div>

                            <div className="list-opt-canais" style={{ display: !optSelected ? "flex" : "none" }}>
                                {opt_canais.map((opt, i) => (
                                    <a key={i} className="opt-int" onClick={() => handleWhatsApp(opt.description)} style={{ cursor: "pointer" }}>
                                        {opt.icon}
                                        <span>{opt.title}</span>
                                    </a>
                                ))}
                            </div>

                        </div>
                    </div>
                </>
            )

            }
        </div>
    )
}