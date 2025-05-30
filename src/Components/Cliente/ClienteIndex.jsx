import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import ClienteFilter from '../Cliente/ClienteFilter';
import ClienteGrid from '../Cliente/ClienteGrid';
import ClienteDeleteModal from '../Cliente/ClienteDeleteModal';

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000"
const API_BASE_URL = `${api_url}/customers`;

const ClienteIndex = () => {
  
  const [clientesData, setClientesData] = useState({
    clientes: [],
    paginaAtual: 1,
    totalPaginas: 1,
  });
  const [filtro, setFiltro] = useState('');

  const [textoFiltro, setTextoFiltro] = useState({
      nome: '',
      cpfCnpj: '',
      telefone: '',
      telefoneCelular: '',
      email: ''
    });

  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    console.log('[useEffect] Chamando buscarClientes sem filtro');
    buscarClientes(textoFiltro);
  }, []);

  const buscarClientes = async (filtro, pagina = 1, limite = 5) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getCustomers`, {
        params: {
          page: pagina,
          limit: limite,
          nome: filtro.nome,
          cpfcnpj: filtro.cpfCnpj,
          email: filtro.email,
          telefoneCelular: filtro.telefoneCelular
        }});

      const data = response.data;
      
      setClientesData(
      {
        clientes: data.clientes,
        paginaAtual: data.paginaAtual,
        totalPaginas: data.totalPaginas,
      });
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handlePesquisar = async (textoFiltro) => {
    //setFiltro(textoFiltro);
    console.log(JSON.stringify(textoFiltro, null, 2));
    buscarClientes(textoFiltro, 1);
  };

  const handleConfirmarExclusao = async () => {
    const token = localStorage.getItem('TokenCerimonial');
    try {
      await fetch(`${API_BASE_URL}/deleteCustomer/${clienteParaExcluir.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setModalAberto(false);
      buscarClientes(filtro);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const abrirModalExclusao = (cliente) => {
    setClienteParaExcluir(cliente);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <div className="container mt-4">
      <div className="pb-5 mb-1">
        <Link to="/FormCliente" className="btn btn-primary px-4 mb-3 float-end">
          <i className="fa fa-reply"></i> <span className="hidden-xs"> Novo cliente </span>
        </Link>
      </div>

      <ClienteFilter onPesquisar={handlePesquisar} />

      <ClienteGrid 
        clientes={clientesData.clientes}
        paginaAtual={clientesData.paginaAtual}
        totalPaginas={clientesData.totalPaginas}
        onPaginaChange={(pagina) => buscarClientes(filtro, pagina)}
        onExcluir={abrirModalExclusao} 
      />

      {modalAberto && clienteParaExcluir && (
        <ClienteDeleteModal
          cliente={clienteParaExcluir}
          onConfirmar={handleConfirmarExclusao}
          onCancelar={fecharModal}
        />
      )}
    </div>
  );
};

export default ClienteIndex;
