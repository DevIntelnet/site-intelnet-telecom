// import React, { useState } from 'react';
import { useRef, useState } from "react";
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

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("70246283408");
    const [senha, setSenha] = useState("926284952");
    const navigate = useNavigate();
    const [loginMessage, setLoginMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostraSenha, setMostraSenha] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoginMessage("");
        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await api.post("/api/login", { username, senha });

            if (response.data.error === 0) {
                localStorage.setItem("token", response.data.token);
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

    const planos = [
        {
            title: '100 MEGA',
            subtitle: 'por R$ 60,00',
            moreinfo: '+ 180 Canais Gratuitos',
            link: "/",
            colorIcon: '#ec3434',
        },
        {
            title: '200 MEGA',
            subtitle: 'por R$ 69,90',
            moreinfo: '+ 180 Canais Gratuitos',
            link: "/",
            colorIcon: '#fbcc2e',
        },
        {
            title: '400 MEGA',
            subtitle: 'por R$ 95,00',
            moreinfo: '+ 180 Canais Gratuitos',
            link: "/",
            colorIcon: '#2caccc',
        },
        {
            title: '500 MEGA',
            subtitle: 'por R$ 130,00',
            moreinfo: '+ 180 Canais Gratuitos',
            link: "/",
            colorIcon: '#042c64',
        },
        {
            title: '1 GIGA',
            subtitle: 'CONSULTE',
            moreinfo: 'Sujeito a consulta com nosso atendimento',
            link: "/",
            colorIcon: '#343434',
        },
    ]

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
                        <a href="#" title="Ir para o Whatsapp"><FaWhatsapp size={36} color="#00B26E" /></a>
                        <a href="#" title="Ir para o Instagram"><FaInstagram size={36} color="#D84178" /></a>
                    </div>
                </div>
            ,
        },
        {
            title: 'Planos',
            link: "/",
            hasBackground: false, // Sem background especial
            content:
                <div className="planos">
                    <div className="carousel-container">
                        <button className="carousel-btn left-btn" onClick={handlePrev} title="Voltar">
                            <FaArrowLeft size={30} color="#072d6c" />
                        </button>
                        <div className="carousel-wrapper">
                            <div className="carousel" ref={carouselRef}>
                                {planos.map((item, i) => {
                                    return (
                                        <div className="card-plano" key={i}>
                                            <div className="campo-icon-plano">
                                                <IoIosGlobe size={50} color={item.colorIcon} />
                                            </div>
                                            <div className="campo-descricao">
                                                <h1 style={{ color: item.colorIcon }}>{item.title}</h1>
                                                <h3>{item.subtitle}</h3>
                                                <h5>{item.moreinfo}</h5>
                                            </div>
                                            <div className="campo-link">
                                                <a href="#" title="Ir para o Whatsapp">
                                                    <TbCircleArrowUpRightFilled size={45} color="#072d6c" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button className="carousel-btn right-btn" onClick={handleNext} title="Avançar">
                            <FaArrowRight size={30} color="#072d6c" />
                        </button>
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
                            <a href="#"><small>Esqueci minha senha {">>"}</small></a>
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
            <div>teste</div>
        </div>
    )
}