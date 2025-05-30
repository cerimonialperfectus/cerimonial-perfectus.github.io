import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Painel = () => {
  return (
    <>
      <div className="container mt-2 mb-5">
        {/* Área de Negócios */}
        <div className="row">
          <h4 className="text-start p-1 px-3 mb-3 mt-3 title text-light" style={{ backgroundColor: "#00385e", borderRadius: "5px" }}>
            <button className="btn" data-bs-toggle="collapse" data-bs-target="#servicos" aria-expanded="true" aria-controls="servicos">
              <i className="fa fa-arrow-circle-o-right"></i> <span className="text-light"> Área de negócios </span>
            </button>
          </h4>

          <div className="collapse show" id="servicos">
            <div className="card card-body">
              <div className="row">
                {/* Card 1 */}
                <div className="col-md-4">
                  <div className="card" style={{ width: "100%", border: "1px solid #D9B2A9" }}>
                    <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Agenda</h5>
                    <div className="card-body">
                      <p className="card-text">Agenda dos eventos</p>
                      <Link to="/Agenda" className="btn btn-primary">Acessar</Link>
                    </div>
                  </div>
                </div>

                {/* Repete estrutura para os demais cards */}
                <div className="col-md-4">
                  <div className="card" style={{ width: "100%", border: "1px solid #D9B2A9" }}>
                    <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Lista de verificação</h5>
                    <div className="card-body">
                      <p className="card-text">Check List dos eventos confirmados</p>
                      <Link to="/CheckList" className="btn btn-primary">Acessar</Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card" style={{ width: "100%", border: "1px solid #D9B2A9" }}>
                    <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Eventos</h5>
                    <div className="card-body">
                      <p className="card-text">Cadastro de eventos</p>
                      <Link to="/events" className="btn btn-primary">Acessar</Link>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Painel;
