// import React, { useState } from 'react';
import { useEffect, useRef, useState } from "react";
import "./home.css";
import { FaBars, FaStar, FaTimes } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { AiOutlineFacebook } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { FaAngleDoubleRight } from "react-icons/fa";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("70246283408");
    const [senha, setSenha] = useState("926284952");
    const navigate = useNavigate();
    const [loginMessage, setLoginMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostraSenha, setMostraSenha] = useState(false);
    const [pontosComerciais, setPontosComerciais] = useState([]);
    const [selectedPonto, setSelectedPonto] = useState("");
    const [planos, setPlanos] = useState([]);

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

    const MySwal = withReactContent(Swal.mixin({

        buttonsStyling: false,
    }));

    async function handleLogin(e) {
        e.preventDefault();
        setLoginMessage("");
        setLoading(true);

        try {
            const response = await api.post("/api/login", { username, senha });

            if (response.data.error === 0) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("id_cliente", response.data.id_cliente);
                navigate("/area-cliente");
            } else {
                setLoginMessage(response.data.message || "Usuário ou senha inválidos");
            }
        } catch (error) {
            if (error.response) {
                setLoginMessage(error.response.data.message || "Erro ao fazer login.");
            } else {
                setLoginMessage("Erro ao fazer login. Tente novamente.");
            }
        } finally {
            setLoading(false); // Desativa o estado de carregamento após a requisição
        }
    }

    const links = [
        {
            title: 'Início',
            link: "/",
        },
        {
            title: 'Planos',
            link: "/",
        },
        {
            title: 'Empresa',
            link: "/",
        },
        {
            title: 'Área do Cliente',
            link: "/",
        },
    ];

    const carouselRef = useRef(null);
    const cardWidth = 300; // Largura de cada card (igual à largura definida no CSS)

    const handleNext = () => {
        const carousel = carouselRef.current;
        carousel.style.transition = "transform 0.5s ease-in-out";
        carousel.style.transform = `translateX(-${cardWidth}px)`;

        // Move o primeiro card para o final após a transição
        setTimeout(() => {
            carousel.style.transition = "none";
            const firstCard = carousel.children[0];
            carousel.appendChild(firstCard);
            carousel.style.transform = "translateX(0px)";
        }, 500); // Tempo igual à duração da transição
    };

    const handlePrev = () => {
        const carousel = carouselRef.current;
        carousel.style.transition = "none";

        // Move o último card para o início antes da transição
        const lastCard = carousel.children[carousel.children.length - 1];
        carousel.insertBefore(lastCard, carousel.children[0]);
        carousel.style.transform = `translateX(-${cardWidth}px)`;

        // Adiciona a transição para mover de volta ao início
        setTimeout(() => {
            carousel.style.transition = "transform 0.5s ease-in-out";
            carousel.style.transform = "translateX(0px)";
        }, 0);
    };

    useEffect(() => {
        async function fetchPontosComerciais() {
            try {
                setLoading(true);
                const response = await api.get("/api/pontos-comerciais");
                setPontosComerciais(response.data);
            } catch (error) {
                console.error("Erro ao buscar pontos comerciais:", error.message);
                setPontosComerciais([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPontosComerciais();
    }, []);

    const handleChange = (event) => {
        const selectedId = event.target.value;
        setSelectedPonto(selectedId);
        onChange(selectedId); // Passa o ID selecionado para o componente pai (se necessário)
    };

    useEffect(() => {
        if (!selectedPonto) return;

        async function fetchPlanos() {
            try {
                setLoading(true);

                const response = await api.get(`/api/pontos-comerciais/${selectedPonto}/planos`);

                const definirMoreInfo = (nome) => {
                    const match = nome.match(/\d+/);
                    const velocidade = match ? parseInt(match[0], 10) : 0;
                    return velocidade >= 100 ? "+ Canais Gratuitos" : "";
                };

                const planosFormatados = response.data.map((plano) => ({
                    title: plano.nome.toUpperCase(),
                    subtitle: `por R$ ${plano.valor.toFixed(2)}`,
                    moreinfo: definirMoreInfo(plano.nome),
                    link: "/",
                    colorIcon: definirCor(plano.nome),
                    descricao: plano.descricao,
                    upload: plano.upload,
                    download: plano.download,
                    cpe: plano.cpe,
                    grupo_id: plano.grupo_id
                }));

                setPlanos(planosFormatados);
            } catch (error) {
                console.error("Erro ao buscar planos:", error.message);
                setPlanos([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPlanos();
    }, [selectedPonto]);

    const handlePontoChange = (event) => {
        setSelectedPonto(event.target.value);
    };

    const definirCor = (nome) => {
        if (nome.includes("100 MEGA")) return "#ec3434";
        if (nome.includes("200 MEGA")) return "#fbcc2e";
        if (nome.includes("400 MEGA")) return "#2caccc";
        if (nome.includes("500 MEGA")) return "#042c64";
        if (nome.includes("1 GIGA")) return "#343434";
        return "#000"; // Cor padrão se não encontrar
    };

    function mostraMaisInformacoes(item) {

        console.log(item);

        MySwal.fire({
            html: <div className="modal-detalhes-plano">
                <h4>Detalhes do plano</h4>
                <h2 style={{ color: item.colorIcon }}>{item.title}</h2>
                <h3>{item.subtitle}</h3>
                <h5>{item.moreinfo}</h5>

                <small><strong>Destalhes: </strong>{item.descricao != "" ? item.descricao : "Contate nosso suporte para saber mais."}</small>

                <div className="icons-redirect">
                    <IoIosGlobe size={45} color={item.colorIcon} />
                    <TbCircleArrowUpRightFilled size={45} color="#072d6c" title="Contatar o suporte" style={{ cursor: 'pointer' }} />
                </div>
            </div>,
            showCloseButton: true,
            showConfirmButton: false,
            allowOutsideClick: false,
        })
    }

    const redirectToWhatsApp = () => {
        const numero = "5584991819502";
        const mensagem = encodeURIComponent("Olá, esqueci minha senha de acesso ao site. Poderia me ajudar?");

        const url = `https://wa.me/${numero}?text=${mensagem}`;

        window.open(url, "_blank");
    };


    const informacoes = [
        {
            title: 'Home',
            link: "/",
            hasBackground: true, // Define se esta seção terá background especial
            backgroundImage: "/src/assets/plano1.jpg", // Caminho da imagem de fundo
            content:
                <div className="home">
                    <img src="/src/assets/logo_new.png" alt="Logo Intelnet Telecom" />
                    <div className="star-icon">
                        <div className="linha-icon-star"></div>
                        <FaStar color="#373435" className="icon" size={90} />
                        <div className="linha-icon-star"></div>
                    </div>
                    <h3>Nosso Whatsapp e Instagram</h3>
                    <h4>(84) 99181 9502 - @intelnet.telecomoficial</h4>
                    <div className="linha-social">
                        <a href="#" title="Ir para o Facebook"><AiOutlineFacebook size={39} color="#0D61A9" /></a>
                        <a href="#" title="Ir para o Whatsapp"><FaWhatsapp size={36} color="#00B26E" /></a>
                        <a href="#" title="Ir para o Instagram"><FaInstagram size={36} color="#D84178" /></a>
                    </div>
                </div>
            ,
        },
        {
            title: 'Planos',
            link: "/",
            hasBackground: true, // Define se esta seção terá background especial
            backgroundImage: "/src/assets/plano7.jpg", // Caminho da imagem de fundo
            content:
                <div className="planos">
                    <div className="busca-ponto-comercial">
                        <MdLocationOn size={24} color="#042c64" />
                        <select name="pontos-comerciais" value={selectedPonto} onChange={handleChange}>
                            <option value="">Selecione uma localidade para visualizar os planos disponíveis...</option>
                            {pontosComerciais.map((ponto) => (
                                <option key={ponto.id} value={ponto.id}>
                                    {ponto.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="busca-ponto-comercial">
                        <MdLocationOn size={24} color="#042c64" />
                        <select name="pontos-comerciais" value={selectedPonto} onChange={handleChange}>
                            <option value="">Selecione selecione o tipo de plano desejado. Ex.: FIBRA, CABO, RÁDIO...</option>
                            {pontosComerciais.map((ponto) => (
                                <option key={ponto.id} value={ponto.id}>
                                    {ponto.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="busca-ponto-comercial">
                        <MdLocationOn size={24} color="#042c64" />
                        <select name="pontos-comerciais" value={selectedPonto} onChange={handleChange}>
                            <option value="">Selecione o grupo de planos ao qual deseja verificar. Ex.: RESIDENCIAL, EMPRESARIAL, FULL...</option>
                            {pontosComerciais.map((ponto) => (
                                <option key={ponto.id} value={ponto.id}>
                                    {ponto.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="planos-encontrados">
                        <div
                            className="campo-planos-encontrados"
                            ref={planosRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseUp} // Para finalizar o arrasto caso o cursor saia do contêiner
                            onMouseUp={handleMouseUp} // Para finalizar o arrasto
                            style={{ cursor: isDragging ? "grabbing" : "grab" }} // Altera o cursor visual
                        >
                            {loading ? (
                                <div className="loading">
                                    <div className="spinner"></div>
                                    <span>Carregando planos...</span>
                                </div>
                            ) : (
                                planos.map((item, i) => {

                                    return (
                                        <div key={i} className="card-planos">
                                            <div
                                                className="top"
                                                style={{ cursor: "pointer", color: "#072d6c" }}
                                                title="Contatar o suporte"
                                            >
                                                <span>
                                                    <strong>Plano</strong>
                                                </span>
                                                <TbCircleArrowUpRightFilled size={35} color="#072d6c" />
                                            </div>
                                            <div className="campo-descricao">
                                                <h1 style={{ color: item.colorIcon }}>{item.title}</h1>
                                                <h3>{item.subtitle}</h3>
                                                <h5>{item.moreinfo}</h5>
                                            </div>
                                            <div className="dados-plano">
                                                <IoIosGlobe size={25} color={item.colorIcon} />

                                                <FaAngleDoubleRight
                                                    size={24}
                                                    color="#042c64"
                                                    style={{ cursor: 'pointer' }}
                                                    title="Ver mais"
                                                    onClick={() => mostraMaisInformacoes(item)} // Chama a função para abrir/fechar
                                                />

                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            ,
        },
        {
            title: 'Sobre a Empresa',
            link: "/",
            hasBackground: false, // Sem background especial
            content:
                <div className="sobre-a-empresa">
                    <h1>Sobre a Empresa</h1>
                    <div className="star-icon">
                        <div className="linha-icon-star"></div>
                        <FaStar color="#072d6c" className="icon" size={90} />
                        <div className="linha-icon-star"></div>
                    </div>
                    <h4>Fundada em 2004, a INTELNET é uma empresa de Provivento de Acesso a Redes de Telecomunicações, nascida em Nova Cruz/RN, que se consolidou oferecendo segurança, qualidade e alta tecnologia no trânsito de dados durante as 24 horas do dia. Possui diferentes planos visando adequação a necessidade real do cliente e não abre mão de preços competitivos. Nossa equipe é composta por Técnicos e Engenheiros com as mais diversas certificações em tecnologia da informação, capaz de projetar e implementar redes de telecomunicações, sistemas de vídeo ou telefônicos baseados em IP. Mais do que um Provedor de Internet a INTELNET possui também um completo portifólio, capaz de atender clientes exigentes que necessitem de infraestrutura modernas e de qualidade. A INTELNET é uma empresa comprometida com o cliente e por esta razão, está constantemente evoluindo em infra-estrutura, equipamentos e talentos.</h4>
                </div>,
        },
        {
            title: 'Área do Cliente',
            link: "/",
            hasBackground: true, // Define se esta seção terá background especial
            backgroundImage: "/src/assets/plano2.jpg", // Caminho da imagem de fundo
            content: (
                <div className="area-cliente">
                    <h1>Acessar meu Cadastro</h1>
                    <div className="star-icon">
                        <div className="linha-icon-star"></div>
                        <FaStar color="#072d6c" className="icon" size={60} />
                        <div className="linha-icon-star"></div>
                    </div>
                    <div className="informes">
                        <span>Informe os dados abaixo para acessar seu cadastro.</span>
                    </div>
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="campo-input">
                            <input
                                type="text"
                                placeholder="CPF ou CNPJ..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading} // Desativa o campo durante o carregamento
                            />
                        </div>
                        <div className="campo-input senha">
                            <input
                                type={mostraSenha ? "text" : "password"}
                                placeholder="Senha da rede wi-fi..."
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                disabled={loading} // Desativa o campo durante o carregamento
                            />
                            <a href="#section3" onClick={() => setMostraSenha(!mostraSenha)}>
                                {mostraSenha ?
                                    <FaRegEyeSlash size={20} color="#072d6c" />
                                    :
                                    <FaRegEye size={20} color="#072d6c" />
                                }
                            </a>
                        </div>
                        <button type="submit" disabled={loading ? true : false}>
                            {loading ? (
                                <span>Um momento...</span>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                        <div className="esqueci-senha">
                            <a href="#" onClick={redirectToWhatsApp}>
                                <small>Esqueci minha senha {">>"}</small>
                            </a>
                        </div>

                        {loginMessage && <small><strong>{loginMessage}</strong></small>}
                    </form>
                </div>
            ),
        },
    ]

    return (
        <div className="container-home">
            <div className="cabecalho">
                <a href="/" className="logo-intel">
                    <img src="/src/assets/logo_new.png" alt="Logo Intelnet" />
                </a>

                {/* Botão de menu hambúrguer (aparece só no mobile) */}
                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={27} /> : <FaBars size={27} />}
                </button>

                {/* Menu de navegação */}
                <nav className={`menu ${menuOpen ? "open" : ""}`}>
                    {links.map((item, i) => (
                        <a key={i} href={"#section" + i} onClick={() => setMenuOpen(false)}>
                            {item.title}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="conteudo">
                {informacoes.map((item, i) => {
                    return (
                        <section
                            key={i}
                            className="section"
                            id={"section" + i}
                            style={{
                                // backgroundColor: (i == 1 || i == 3) && "#efefef",
                                backgroundImage: item.hasBackground ? `url(${item.backgroundImage}) , linear-gradient(rgba(239, 239, 239, 0), rgba(239, 239, 239, 0))` : "none",
                                backgroundSize: "cover",
                                backgroundBlendMode: "overlay",
                                backgroundPosition: "center",
                            }}
                        >
                            {item.content}
                        </section>
                    )
                })}
            </div>
            <div className="rodape">
                <div>
                    <h4>LOCALIZAÇÃO</h4>
                    <p>Av. Assid Chateaubriand,1082 <br /> São Sebastião, Nova Cruz/RN <br /> Cep: 59215-000</p>
                </div>
                <div>
                    <h4>REDES SOCIAIS</h4>
                    <div className="linha-social">
                        <a href="#" title="Ir para o Facebook"><AiOutlineFacebook size={39} color="#0D61A9" /></a>
                        <a href="#" title="Ir para o Whatsapp"><FaWhatsapp size={36} color="#00B26E" /></a>
                        <a href="#" title="Ir para o Instagram"><FaInstagram size={36} color="#D84178" /></a>
                    </div>
                </div>
                <div>
                    <h4>OUTROS CANAIS</h4>
                    <p>Email: atendimento@intelnet.com.br</p>
                </div>
            </div>
        </div>
    )
}