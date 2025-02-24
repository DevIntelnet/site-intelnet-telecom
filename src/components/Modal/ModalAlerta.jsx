import React from "react";
import "./ModalAlerta.css";
import { FaCheckCircle } from "react-icons/fa";

const ModalAlerta = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <FaCheckCircle size={30} color="#28a745" />
                <h2>Esta fatura já foi paga!</h2>
                <button className="modal-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default ModalAlerta;
