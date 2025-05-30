
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';

const ResumoFinanceiro = () => {
  const [aba, setAba] = useState('pagamentos');
  const [dataPgto, setData] = useState('');
  const [descricao, setDescricao] =  useState('');
  const [valor, setValor] = useState('');
  const [nome, setNome] = useState('');
  //const [tipoTransacao, setTransacao] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState('');
  const [financeiro, setFinanceiro] = useState([]);
  const [recebimentos, setRecebimentos] = useState([]);

  const URLAPIBASE = 'http://localhost:3000/financeiro';

  const fetchDados = () => {
    fetch(`${URLAPIBASE}/listarFinanceiro`)
      .then(res => res.json()).then(setFinanceiro);
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleAdicionar = () => {
    const valorNumerico = parseFloat(
      valor.replace('R$', '').replace('.', '').replace(',', '.')
    );

    const body = {
      dataPgto: dataPgto,
      descricao: descricao,
      valor: valorNumerico,
      clienteFornecedor: nome,
      tipoTransacao: tipoTransacao
    };


    fetch(`${URLAPIBASE}/criarFinanceiro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        setData('');
        setDescricao('');
        setValor('');
        setNome('');
        setTipoTransacao('');
        fetchDados();
        console.log(JSON.stringify(body, null, 2));
      });
  };

  const handleChange = (e) => {
    setTipoTransacao(e.target.value);
  };

  const totalPag = financeiro.filter(p => p.tipoTransacao === "P").reduce((acc, p) => acc + parseFloat(p.valor), 0);
  const totalRec = financeiro.filter(p => p.tipoTransacao === "R").reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const saldo = totalRec - totalPag;

  const registros = financeiro;
  
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório Financeiro - " + aba.charAt(0).toUpperCase() + aba.slice(1), 10, 10);

    const headers = ["ID", "Data", "Valor", "Cliente/Fornecedor"];
    const rows = registros.map(r => [
      r.id,
      new Date(r.dataPgto).toLocaleDateString(),
      "R$ " + parseFloat(r.valor).toFixed(2),
      r.fornecedor || r.cliente
    ]);

    doc.autoTable({ head: [headers], body: rows, startY: 20 });
    doc.save("relatorio_financeiro.pdf");
  };

  const exportarExcel = () => {
    const headers = ["ID", "Data", "Valor", "Cliente/Fornecedor"];
    const rows = registros.map(r => [
      r.id,
      new Date(r.data).toLocaleDateString(),
      parseFloat(r.valor),
      r.fornecedor || r.cliente
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, "relatorio_financeiro.xlsx");
  };

  return (

    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Resumo Financeiro</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1.5rem 0' }}>
        <div style={{ background: '#007bff', color: '#fff', padding: '1rem 2rem', borderRadius: '8px' }}>
          <strong>Total Pagamentos</strong><br />R$ {totalPag.toFixed(2)}
        </div>
        <div style={{ background: '#28a745', color: '#fff', padding: '1rem 2rem', borderRadius: '8px' }}>
          <strong>Total Recebimentos</strong><br />R$ {totalRec.toFixed(2)}
        </div>
        <div style={{ background: '#ffc107', color: '#000', padding: '1rem 2rem', borderRadius: '8px' }}>
          <strong>Saldo</strong><br />R$ {saldo.toFixed(2)}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <input type="text" placeholder="Buscar..." style={{ padding: '0.5rem', width: '200px' }} />
        <button style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', marginLeft: '1rem' }}>Exportar CSV</button>
        <button style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', marginLeft: '0.5rem' }}>Relatório PDF</button>
        <button onClick={exportarExcel} style={{ padding: '0.5rem 1rem', background: '#17a2b8', color: '#fff', marginLeft: '0.5rem' }}>Exportar Excel</button>
        <button onClick={exportarPDF} style={{ padding: '0.5rem 1rem', background: '#6f42c1', color: '#fff', marginLeft: '0.5rem' }}>Exportar PDF</button>
      </div>

      <div style={{ width: '70%', background: '#f9f9f9', padding: '1.5rem', margin: '0 auto', borderRadius: '8px' }}>
        <h2>Cadastro Financeiro</h2>
        <input type="date" placeholder="Data" value={dataPgto} onChange={e => setData(e.target.value)} style={{ margin: '0.5rem' }} />
        <input type="text" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} style={{ margin: '0.5rem' }} />
        <input type="text" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} style={{ margin: '0.5rem' }} />
        <input
          type="text"
          placeholder="Cliente / Fornecedor"
          value={nome}
          onChange={e => setNome(e.target.value)}
          style={{ margin: '0.5rem' }}
        />
        <div>
          <label style={{ display: 'inline-block', marginRight: '1rem' }}>
            <input
              type="radio"
              name="tipoTransacao"
              value="P"
              checked={tipoTransacao === 'P'}
              onChange={handleChange}
            />
            Pagamento
          </label>

          <label style={{ display: 'inline-block' }}>
            <input
              type="radio"
              name="tipoTransacao"
              value="R"
              checked={tipoTransacao === 'R'}
              onChange={handleChange}
            />
            Recebimento
          </label>

          <button onClick={handleAdicionar} style={{ marginLeft: '0.5rem', background: '#007bff', color: '#fff', padding: '0.5rem 1rem' }}>
            Adicionar
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h3 style={{ textAlign: 'center' }}>Registros de {aba}</h3>
        <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Valor</th>
              <th>"Cliente/Fornecedor"</th>
              <th>Transação</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{new Date(r.dataPgto).toLocaleDateString()}</td>
                <td>R$ {parseFloat(r.valor).toFixed(2)}</td>
                <td>{r.clienteFornecedor}</td>
                <td>{r.tipoTransacao == 'P' ? 'Pagamento' : 'Recebimento'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumoFinanceiro;