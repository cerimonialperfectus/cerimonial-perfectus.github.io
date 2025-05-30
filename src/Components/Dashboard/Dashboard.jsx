import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import UpcomingEventsWidget from "../Event/UpcomingEventsWidget";

const Dashboard = () => {
    return (
      <>
        <div className="container mt-2 mb-5">
          <div className="row">
            <div className="row mb-4">
              <div className="col-12">
                <UpcomingEventsWidget />
              </div>
            </div>

            <h4 className="text-start p-1 px-3 mb-3 mt-3 titulo text-light" style={{ backgroundColor: "#00385e", borderRadius: "5px" }} >
              <a className="btn" data-bs-toggle="collapse" href="#servicos" role="button" aria-expanded="true" aria-controls="servicos">
                <i className="fa fa-arrow-circle-o-right"></i><span className="text-light">Área de negócios</span>
              </a>
            </h4>

            <div className="collapse show" id="servicos">
              <div className="card card-body">
                <div className='row'>

                  <div className="col-md-4">
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Check List</h5>
                      <div className="card-body">
                        <p className="card-text">Check List dos eventos confirmados</p>
                        <Link to="/CheckList" className="btn btn-primary">Acessar</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4" >
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Eventos</h5>
                      <div className="card-body">
                        <p className="card-text">Cadastro de eventos</p>
                        <Link to="/events" className="btn btn-primary btn-sm">Acessar</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row mt-3'>
                  <div className="col-md-4">
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Orçamentos</h5>
                      <div className="card-body">
                        <p className="card-text">Gestão dos orçamentos</p>
                        <Link to="/Orcamentos" className="btn btn-primary">Acessar</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Financeiro</h5>
                      <div className="card-body">
                        <p className="card-text">Gestão Financeira</p>
                        <Link to="/ResumoFinanceiro" className="btn btn-primary">Acessar</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>    
            </div>     
          </div>

          <div className="row">
            <h4 className="text-start p-1 px-3 mb-3 mt-3 titulo text-light" style={{ backgroundColor: "#00385e", borderRadius: "5px" }} >
              <a className="btn" data-bs-toggle="collapse" href="#cadastros" role="button" aria-expanded="true" aria-controls="cadastros">
                <i className="fa fa-arrow-circle-o-right"></i><span className="text-light">Gestão dos cadastros</span>
              </a>
            </h4>

            <div className="collapse show" id="cadastros">
              <div className="card card-body">
                <div className="row">
                  <div className="col-md-4" >
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Clientes</h5>
                      <div className="card-body">
                        <p className="card-text">Cadastro de clientes do Cerimonial Perfectus</p>
                        <Link to="/ClienteIndex" className="btn btn-primary">Acessar</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Fornecedores</h5>
                      <div className="card-body">
                        <p className="card-text">Cadastro de fornecedores do Cerimonial Perfectus</p>
                        <Link to="/suppliers" className="btn btn-primary">Acessar</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Tipos de Serviços</h5>
                      <div className="card-body">
                        <p className="card-text">Cadastro dos tipos de serviços que é oferecido</p>
                        <Link to="/TipoServicos" className="btn btn-primary">Acessar</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row mt-3'>
                  <div className="col-md-4">
                    <div className="card" style={{width: "100%", height: "100%", border: "1px solid #D9B2A9"}}>
                      <h5 className="card-title p-2 px-3 text-light" style={{ backgroundColor: "#D9B2A9" }}>Gestão do Site</h5>
                      <div className="card-body">
                        <p className="card-text">Área de gestão do site Cerminial Perfectus</p>
                        <Link to="/siteManagement" className="btn btn-primary">Acessar</Link>
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
};

export default Dashboard;