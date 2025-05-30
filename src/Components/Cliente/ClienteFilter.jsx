import React, { useState } from 'react';
import { formatCpfCnpj, formataCelularInput } from '../../assets/js/utils';

const ClienteFilter = ({ onPesquisar }) => {
  const [textoFiltro, setTextoFiltro] = useState({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    telefoneCelular: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTextoFiltro((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePesquisarClick = () => {
    onPesquisar(textoFiltro);
  };

  const [cpfCnpj, setCpfCnpj] = useState('');
  const handleInputCpfChange = (e) => {
    const formatted = formatCpfCnpj(e.target.value);
    setCpfCnpj(formatted);
    setTextoFiltro((prev) => ({ ...prev, cpfCnpj: formatted }));
  };

  const [telefoneCelular, setCelular] = useState('');
  const handleInputCelularChange = (e) => {
    const formatted = formataCelularInput(e.target.value);
    setCelular(formatted);
    setTextoFiltro((prev) => ({ ...prev, telefone: formatted }));
    setTextoFiltro((prev) => ({ ...prev, telefoneCelular: formatted }));
  };

  return (
    <>
      <section>
        <div className="mt-3 mb-5">
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="cpfCnpj">CPF</label>
              <div className="input-group mb-3">
                  <input type="text"
                      className="form-control"
                      id="cpfCnpj"
                      name="cpfCnpj"
                      aria-label="CPF"
                      aria-describedby="basic-addon1"
                      maxLength="18"
                      value={cpfCnpj}
                      onChange={handleInputCpfChange}
                    />
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="nome">Nome</label>
              <div className="input-group mb-3">
                  <input type="text" 
                          className="form-control" 
                          id="nome" 
                          name="nome"
                          maxLength="250"
                          aria-describedby="basic-addon2"
                          value={textoFiltro.nome}
                          onChange = {handleChange}
                    />
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="email">E-mail</label>
              <div className="input-group mb-3">
                  <input type="text" 
                          className="form-control" 
                          id="email"
                          name="email"
                          maxLength="250"
                          value={textoFiltro.email}
                          onChange={handleChange}
                  />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-3'>
              <label htmlFor="telefoneCelular">Telefone Celular</label>
              <div className='input-group mb-3'>
                <input type="text"
                        className='form-control' 
                        id="telefoneCelular" 
                        name="telefoneCelular"
                        maxLength="15"
                        value={telefoneCelular}
                        onChange={handleInputCelularChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button 
              className="btn btn-outline-primary btn-md px-4 mb-3 float-end"
              onClick={handlePesquisarClick}
            >
              <i className="fa fa-search" aria-hidden="true"> </i><span> Pesquisar </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClienteFilter;
