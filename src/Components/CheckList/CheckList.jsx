// src/Checklist.jsx
import React, { useState, useEffect } from "react";
import { saveAs } from 'file-saver';

function Checklist() {
  const [titulo, setTitulo] = useState("Meu Checklist");
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [eventos, setEventos] = useState(["Evento A", "Evento B"]);
  const [eventoSelecionado, setEventoSelecionado] = useState("");
  const [historico, setHistorico] = useState([]);

  // Carrega dados ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("checklistCategorias");
    if (saved) setCategorias(JSON.parse(saved));

    const savedTitle = localStorage.getItem("checklistTitulo");
    if (savedTitle) setTitulo(savedTitle);

    const savedEvento = localStorage.getItem("checklistEvento");
    if (savedEvento) setEventoSelecionado(savedEvento);

    const savedHistorico = localStorage.getItem("checklistHistorico");
    if (savedHistorico) setHistorico(JSON.parse(savedHistorico));
  }, []);

  // Salva alterações
  useEffect(() => {
    localStorage.setItem("checklistCategorias", JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem("checklistTitulo", titulo);
  }, [titulo]);

  useEffect(() => {
    localStorage.setItem("checklistEvento", eventoSelecionado);
  }, [eventoSelecionado]);

  const adicionarCategoria = () => {
    if (!novaCategoria.trim()) return;
    setCategorias([
      ...categorias,
      { nome: novaCategoria, sessoes: [], novaSessao: "" },
    ]);
    setNovaCategoria("");
  };

  const editarCategoria = (index, novoNome) => {
    const novaLista = [...categorias];
    novaLista[index].nome = novoNome;
    setCategorias(novaLista);
  };

  const excluirCategoria = (index) => {
    setCategorias(categorias.filter((_, i) => i !== index));
  };

  const adicionarSessao = (index) => {
    const novaLista = [...categorias];
    const categoria = novaLista[index];
    if (!categoria.novaSessao.trim()) return;
    categoria.sessoes.push({ nome: categoria.novaSessao, feita: false });
    categoria.novaSessao = "";
    setCategorias(novaLista);
  };

  const editarSessao = (catIndex, sessaoIndex, novoNome) => {
    const novaLista = [...categorias];
    novaLista[catIndex].sessoes[sessaoIndex].nome = novoNome;
    setCategorias(novaLista);
  };

  const excluirSessao = (catIndex, sessaoIndex) => {
    const novaLista = [...categorias];
    novaLista[catIndex].sessoes.splice(sessaoIndex, 1);
    setCategorias(novaLista);
  };

  const marcarFeito = (catIndex, sessaoIndex) => {
    const novaLista = [...categorias];
    novaLista[catIndex].sessoes[sessaoIndex].feita =
      !novaLista[catIndex].sessoes[sessaoIndex].feita;
    setCategorias(novaLista);
  };

  const limparChecklist = () => {
    setCategorias([]);
    localStorage.removeItem("checklistCategorias");
  };

  const salvarChecklist = () => {
    const data = {
      titulo,
      evento: eventoSelecionado,
      categorias,
      data: new Date().toLocaleString(),
    };
    const novoHistorico = [data, ...historico];
    setHistorico(novoHistorico);
    localStorage.setItem("checklistHistorico", JSON.stringify(novoHistorico));
    alert("Checklist salvo!");
  };

  const exportarCSV = () => {
    let csv = `Título: ${titulo}\nEvento: ${eventoSelecionado}\n\n`;
    categorias.forEach((cat) => {
      csv += `Categoria: ${cat.nome}\n`;
      cat.sessoes.forEach((s) => {
        csv += `- ${s.nome} [${s.feita ? "Feito" : "Pendente"}]\n`;
      });
      csv += `\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${titulo.replace(/\s+/g, "_")}.csv`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      

      {/* Título do checklist */}
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="text-2xl font-semibold border rounded px-4 py-2 w-full"
      />

      {/* Seleção de evento */}
      <select
        value={eventoSelecionado}
        onChange={(e) => setEventoSelecionado(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="">Vincular a evento (opcional)</option>
        {eventos.map((ev, i) => (
          <option key={i} value={ev}>{ev}</option>
        ))}
      </select>

      {/* Ações principais */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Nova Categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={adicionarCategoria}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar Categoria
        </button>
        <button
          onClick={salvarChecklist}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Salvar Checklist
        </button>
        <button
          onClick={exportarCSV}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Exportar Planilha
        </button>
        <button
          onClick={limparChecklist}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Limpar
        </button>
      </div>

      {/* Categorias e sessões */}
      {categorias.map((cat, i) => (
        <div key={i} className="border p-4 bg-gray-50 rounded space-y-2">
          <input
            value={cat.nome}
            onChange={(e) => editarCategoria(i, e.target.value)}
            className="text-lg font-semibold border-b w-full"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Adicionar sessão"
              value={cat.novaSessao || ""}
              onChange={(e) => {
                const novaLista = [...categorias];
                novaLista[i].novaSessao = e.target.value;
                setCategorias(novaLista);
              }}
              className="border px-3 py-1 rounded flex-1"
            />
            <button
              onClick={() => adicionarSessao(i)}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Adicionar
            </button>
            <button
              onClick={() => excluirCategoria(i)}
              className="bg-red-600 text-white px-3 rounded"
            >
              Excluir
            </button>
          </div>
          <ul className="space-y-1">
            {cat.sessoes.map((sessao, j) => (
              <li key={j} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sessao.feita}
                  onChange={() => marcarFeito(i, j)}
                />
                <input
                  value={sessao.nome}
                  onChange={(e) => editarSessao(i, j, e.target.value)}
                  className={`flex-1 px-2 py-1 border rounded ${
                    sessao.feita ? "line-through text-gray-500" : ""
                  }`}
                />
                <button
                  onClick={() => excluirSessao(i, j)}
                  className="text-red-500 hover:underline"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Histórico de checklists */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Histórico de Checklists</h2>
        <ul className="space-y-2">
          {historico.map((h, i) => (
            <li key={i} className="border rounded p-2 bg-white shadow-sm">
              <strong>{h.titulo}</strong> - {h.evento || "Sem evento"} ({h.data})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Checklist;
