export function Dialog({ children }) {
    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
}

export function DialogTrigger({ children, onClick }) {
    return (
        <button type="button" className="btn btn-primary" onClick={onClick}>
            {children}
        </button>
    );
}

export function DialogContent({ children }) {
    return <div className="modal-body">{children}</div>;
}

export function DialogHeader({ children }) {
    return <div className="modal-header">{children}</div>;
}

export function DialogFooter({ children }) {
    return <div className="modal-footer">{children}</div>;
}

export function DialogTitle({ children }){
    return <div className="modal-footer">{children}</div>;
}