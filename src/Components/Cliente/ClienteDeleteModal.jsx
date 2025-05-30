import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../ui/Dialog';

const ClienteDeleteModal = ({ cliente, onConfirmar, onCancelar }) => {
  return (
    <Dialog open={true} onOpenChange={onCancelar}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Deseja realmente excluir o cliente <strong>{cliente.nome}</strong>?</p>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirmar}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteDeleteModal;
