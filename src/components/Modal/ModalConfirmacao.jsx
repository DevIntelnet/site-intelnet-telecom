import React from "react";
import "./ModalConfirmacao.css";

export default function ModalConfirmacao({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Deseja realizar o pagamento dessa fatura?</h2>
                <div className="modal-buttons">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={onConfirm} className="btn-confirm">Sim</button>
                </div>
            </div>
        </div>
    );
}
