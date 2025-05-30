import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Orcamentos = () => {
    return (
      <>
        <div className="container mt-2 mb-5">
          <div className="row">
            <h4 className="text-start p-1 px-3 mb-3 mt-3 titulo text-light" style={{ backgroundColor: "#00385e", borderRadius: "5px" }} >
              <a className="btn" data-bs-toggle="collapse" href="#orcamento" role="button" aria-expanded="true" aria-controls="orcamento">
                <i className="fa fa-arrow-circle-o-right"></i><span className="text-light">Módulo Orçamentos em desenvolvimento</span>
              </a>
            </h4>

            <div className="collapse show" id="orcamento">
              <div className='row'>
                <div className="col-md-4">
                  <img src="/src/assets/EmDesenvolvimento.jpg" style={{width: "1268px", height: "600px"}}></img>
                </div>
              </div>
            </div>     
          </div>
        </div>
      </> 
    );
};

export default Orcamentos;