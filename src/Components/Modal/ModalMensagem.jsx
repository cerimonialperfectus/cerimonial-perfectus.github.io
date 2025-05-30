import { Modal, Button } from "react-bootstrap";

const ModalMensagem = ({ show, onClose, titulo, mensagem, tipo }) => {
    // Definição das cores do modal com base no tipo de mensagem
    const cores = {
        sucesso: "success",
        erro: "danger",
        aviso: "warning"
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton className={`bg-${cores[tipo]} text-white`}>
                <Modal.Title>{titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{mensagem}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalMensagem;
