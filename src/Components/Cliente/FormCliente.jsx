import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { formatCpfCnpj, formatarCEP, formataTelefoneFixoInput, formataCelularInput, formatDataNascimento } from '../../assets/js/utils';

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000"
const API_BASE_URL = `${api_url}/customers`;

const FormCliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState({
    nome: '', cpfcnpj: '', dataNascimento: '', telefone: '', telefoneCelular: '', 
    email: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '',
    createdAt: '', createdBy: '', updatedAt: '', updatedBy: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/getCustomerById/${id}`)
        .then((res) => res.json())
        .then((data) => { setCliente({ data,
            id: data.id,
            cpfcnpj: data.cpfcnpj,
            identidade: data.identidade,
            nome: data.nome,
            email: data.email,
            dataNascimento: data.dataNascimento,
            cep: data.cep,
            telefone: data.telefone,
            telefoneCelular: data.telefoneCelular,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            uf: data.uf,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy            
          });
        })
        .catch(() => {
          setModalType('error');
          setModalMessage('Erro ao carregar dados do cliente.');
          setShowModal(true);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const limparFormulario = () => {
    setCliente({
      nome: '',
      cpfcnpj: '',
      identidade: '',
      dataNascimento: '',
      telefone: '',
      telefoneCelular: '',
      email: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      createdAt: '',
      createdBy: '',
      updatedAt: '',
      updatedBy: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('TokenCerimonial');
    const url = cliente.id !== undefined && cliente.id !== null && cliente.id !== "" ? `${API_BASE_URL}/saveCustomer` : `${API_BASE_URL}/createCustomer`;
    //const metodo = cliente.id !== "" || cliente.id !== undefined? 'PUT' : 'POST';

    console.log(url + ' - ' + cliente.id);

    try {
      // Futuramente substituir a URL abaixo para sua API real
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cliente, null, 2),
      });

      const data = await response.json().catch(() => null); // evita erro no .json()

      console.log(JSON.stringify(cliente, null, 2));

      if (response.ok) {
        setModalType('success');
        setModalMessage(cliente.id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
        if (!cliente.id) {
          //limparFormulario(); // só limpa se for cadastro
          setCliente({ data,
            id: data.id,
            cpfcnpj: data.cpfcnpj,
            identidade: data.identidade,
            nome: data.nome,
            email: data.email,
            dataNascimento: data.dataNascimento,
            cep: data.cep,
            telefone: data.telefone,
            telefoneCelular: data.telefoneCelular,
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            uf: data.uf,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy            
          });
        }
      } else {
        //const errorData = await response.json();
        // Aqui você acessa a mensagem de erro
        setModalType('error');
        setModalMessage(data?.error || 'Erro ao salvar cliente.');
      }
    } catch (error) {
      console.error('Erro no fetch:', error);
      setModalType('error');
      setModalMessage('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const getModalVariant = () => (modalType === 'success' ? 'success' : 'danger');

  const handleInputCpfChange = (e) => {
    handleChange(e);
    const formatted = formatCpfCnpj(e.target.value);
    setCliente((prev) => ({ ...prev, cpfcnpj: formatted }));
  };
  
  const handleInputCepChange = (e) => {
    handleChange(e);
    const formatted = formatarCEP(e.target.value);
    setCliente((prev) => ({ ...prev, cep: formatted }));
  };
  
  const handleInputTelefoneChange = (e) => {
    handleChange(e);
    const formatted = formataTelefoneFixoInput(e.target.value);
    setCliente((prev) => ({ ...prev, telefone: formatted }));
  };

  const handleInputCelularChange = (e) => {
    handleChange(e);
    const formatted = formataCelularInput(e.target.value);
    setCliente((prev) => ({ ...prev, telefoneCelular: formatted }));
  };

  return (
    <>
     <section>
     <form onSubmit={handleSubmit}>
      <div className="row p-1 px-3">
          <div className="d-flex justify-content-end" >
              <Link to="/ClienteIndex" className="btn btn btn-outline-dark btn-md px-4 mt-1 mb-1 me-2">
                <i className="fa fa-reply"></i> <span className="hidden-xs"> Voltar Filtro </span>
              </Link>
              <button id="btnSalvar" type="submit" className="btn btn-primary btn-md px-5 mt-1 mb-1">
                  <i className="fa fa-check"></i><span className="hidden-xs">Salvar</span>
              </button>
          </div>
      </div>
    
      <div className="container mt-1">
        <h4 className="text-start p-1 px-3 mb-3 mt-3 titulo text-light" style={{ backgroundColor: "#00385e", borderRadius: "5px" }} >
            <a className="btn" data-bs-toggle="collapse" href="#formCliente" role="button" aria-expanded="true" aria-controls="formCliente">
                <i className="fa fa-arrow-circle-o-right"></i><span className="text-light">Cadastro do cliente</span>
            </a>
        </h4>
        <div className="collapse show" id="formCliente">
          <div className="card card-body">
            
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor='nome'>Nome</label>
                  <div className="input-group mb-3">
                      <input type="text"
                              className="form-control"
                              id="nome"
                              name = "nome"
                              aria-describedby = "basic-addon2"
                              value = {cliente.nome}
                              onChange = {handleChange}
                      />
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor='cpfcnpj'>CPF</label>
                  <div className="input-group mb-3">
                    <input type="text"
                      className="form-control"
                      id="cpfcnpj"
                      name="cpfcnpj"
                      aria-describedby="basic-addon1"
                      maxLength="18"
                      value = {cliente.cpfcnpj}
                      onChange = {handleInputCpfChange}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <label htmlFor='identidade'>Nº de Identidade</label>
                    <div className="input-group mb-3">
                      <input type="text"
                        className="form-control"
                        id="identidade"
                        name="identidade"
                        aria-describedby="basic-addon1"
                        maxLength="18"
                        value = {cliente.identidade}
                        onChange = {handleChange}
                      />
                    </div>
                </div>

                <div className="form-group col-md-3">
                  <label htmlFor='dataNascimento'>Data nascimento</label>
                  <div className="input-group mb-3">
                      <input type="date"
                              className="form-control"
                              id="dataNascimento"
                              name="dataNascimento"
                              aria-describedby="basic-addon3 basic-addon4"
                              value = {cliente.dataNascimento}
                              onInput={handleChange}
                      />
                  </div>
                </div>
              </div>

              <hr></hr>
              
              <div className="row">
                <div id="app" className="form-group col-md-2">
                  <label htmlFor='cep'>CEP</label>
                  <div className="input-group mb-3">
                    <input type="text"
                          className="form-control"
                          id="cep"
                          name="cep"
                          maxLength="9"
                          value = {cliente.cep}
                          onChange={handleInputCepChange}
                      />
                  </div>
                </div>
                
                <div className="form-group col-md-8">
                  <label htmlFor='logradouro'>Endereço</label>
                  <div className="input-group mb-3">
                    <input type="text"
                          className="form-control"
                          id="logradouro"
                          name="logradouro"
                          value = {cliente.logradouro}
                          onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group col-md-2">
                  <label>Número</label>
                  <div className="input-group mb-3">
                    <input type="text"
                            className="form-control"
                            id="numero"
                            name="numero"
                            value = {cliente.numero}
                            onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <label htmlFor='complemento'>Complemento</label>
                  <div className="input-group mb-3">
                      <input type="text"
                              className="form-control"
                              id="complemento"
                              name="complemento"
                              value = {cliente.complemento}
                              onChange={handleChange}
                      />
                  </div>
                </div>

                <div className="col-md-3">
                  <label>Bairro</label>
                  <div className="input-group mb-3">
                      <input type="text"
                              className="form-control"
                              id="bairro"
                              name="bairro"
                              value = {cliente.bairro}
                              onChange={handleChange}
                      />
                  </div>
                </div>
                
                <div className="col-md-3">
                  <label>Cidade</label>
                  <div className="input-group">
                      <input type="text"
                              className="form-control"
                              id="cidade" 
                              name="cidade"
                              value = {cliente.cidade}
                              onChange={handleChange}
                      />
                  </div>
                </div>
                <div className = "col-md-2">
                  <label>Estado</label>
                  <div className = "input-group mb-3">
                    <select 
                      id = "estado" 
                      className = "form-select .inner.show{ max-height: 450px !important; }" 
                      name = "uf"
                      value = {cliente.uf} 
                      onChange={handleChange}
                    >
                      <option value=""></option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr></hr>

              <div className="row">
                <div className="col-md-5">
                  <label htmlFor='email'>E-mail</label>
                  <div className="input-group">
                      <input type="text"
                              className="form-control"
                              id="email" 
                              name="email"
                              value = {cliente.email}
                              onChange={handleChange}
                      />
                  </div>
                </div>

                <div className="col-md-2">
                  <label htmlFor='telefone'>Telefone</label>
                  <div className="input-group mb-3">
                      <input type="tel"
                              className="form-control"
                              id="telefone"
                              name="telefone"
                              maxLength="14"
                              value = {cliente.telefone}
                              onChange={handleInputTelefoneChange}
                      />
                  </div>
                </div>

                <div className="col-md-2">
                  <label htmlFor='telefoneCelular'>Celular</label>
                  <div className="input-group mb-3">
                      <input type="tel"
                              className="form-control"
                              id="telefoneCelular"
                              name="telefoneCelular"
                              maxLength="15"
                              value = {cliente.telefoneCelular}
                              onChange={handleInputCelularChange}
                      />
                  </div>
                </div>
              </div>
              <input type="hidden" value={cliente.id} />
              <input type="hidden" value={cliente.createdAt} />
              <input type="hidden" value={cliente.createdBy} />
              <input type="hidden" value={cliente.updatedAt} />
              <input type="hidden" value={cliente.updatedBy} />
          </div>
        </div>

        {/* Modal de Retorno */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className={`bg-${getModalVariant()} text-white`}>
            <Modal.Title>
              {modalType === 'success' ? 'Sucesso' : 'Erro'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMessage}
          </Modal.Body>
          <Modal.Footer>
            <Button variant={getModalVariant()} onClick={handleCloseModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      </form>
    </section>
    
    </>
  );
};

export default FormCliente;
