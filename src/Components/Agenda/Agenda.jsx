import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Agenda = () => {
    return (
      <>
        <div className="container mt-2 mb-5">
          <div className="row">
            <h4 className="text-start p-1 px-3 mb-3 mt-3 titulo text-light" style={{ backgroundColor: "#00385e", borderRadius: "5px" }} >
              <a className="btn" data-bs-toggle="collapse" href="#agenda" role="button" aria-expanded="true" aria-controls="agenda">
                <i className="fa fa-arrow-circle-o-right"></i><span className="text-light">Módulo Agenda em desenvolvimento</span>
              </a>
            </h4>

            <div className="collapse show" id="agenda">
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

export default Agenda;