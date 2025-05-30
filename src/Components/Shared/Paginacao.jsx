const Paginacao = ({ paginaAtual, totalPaginas, onPaginaChange }) => {
    if (totalPaginas <= 1) return null;
  
    const paginas = [];
    for (let i = 1; i <= totalPaginas; i++) {
      paginas.push(i);
    }
  
    return (
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
    );
  };

  export default Paginacao;