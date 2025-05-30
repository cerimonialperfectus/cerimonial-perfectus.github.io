import { formatCpfCnpj } from '../../assets/js/utils';

const ClienteGrid = ({ clientes, paginaAtual, totalPaginas, onPaginaChange, onExcluir }) => {
  
  const handleEditar = (id) => {
    window.location.href = `/FormCliente/${id}`;
  };

  if (!clientes || clientes.length === 0) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }

  return (
    <>
      <div className="pt-3 mt-5">
        <h5 className="titulo text-light p-2 px-3 mb-3 text-start"  style={{ backgroundColor: "#00385e", borderRadius: "5px" }} >
          <span className="text-light">Clientes cadastrados</span>
        </h5>
        <div className="collapse show" id="collapseCliente">
          <div className="card card-body">
            <div className="table-responsive">
              <table className="table table-striped list">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b" width="30%">Nome</th>
                    <th className="py-2 px-4 border-b" width="15%">CPF</th>
                    <th className="py-2 px-4 border-b" width="50%">E-mail</th>
                    <th className="py-2 px-4 border-b" width="3%"></th>
                    <th className="py-2 px-4 border-b" width="3%"></th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length > 0 ? (
                    clientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td className="py-2 px-4 border-b">{cliente.nome}</td>
                        <td className="py-2 px-4 border-b">{formatCpfCnpj(cliente.cpfcnpj)}</td>
                        <td className="py-2 px-4 border-b">{cliente.email}</td>
                        <td>
                            <a href="#" onClick={() => handleEditar(cliente.id)}>
                                <i className="bi bi-pencil-square"></i>
                            </a>
                        </td>
                        <td>
                            <a href="#" onClick={() => onExcluir(cliente)}>
                                <i className="bi bi-trash" style={{color: "#c70505"}} aria-hidden="true"></i>
                            </a>
                        </td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td className="py-4 px-4 border-b text-center" colSpan="4">
                          Nenhum cliente encontrado.
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              
              <nav aria-label="Paginação">
                <ul className="pagination">
                  <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPaginaChange(paginaAtual - 1)}>Anterior</button>
                  </li>
                  {paginas.map((numero) => (
                    <li key={numero} className={`page-item ${paginaAtual === numero ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => onPaginaChange(numero)}>{numero}</button>
                    </li>
                  ))}
                  <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPaginaChange(paginaAtual + 1)}>Próximo</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};
export default ClienteGrid;
