// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AreaCliente() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Bem-vindo à Área do Cliente</h1>
            <button onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
            }}>
                Sair
            </button>
        </div>
    );
}
