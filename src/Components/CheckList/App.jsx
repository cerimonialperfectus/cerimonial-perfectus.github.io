import "./index.css";
import Checklist from "./Checklist";
import Painel from "./Painel";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Painel superior */}
      <Painel />

      {/* Conteúdo principal */}
      <main className="p-6">
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Novo Checklist</h2>

          {/* Campo título */}
          <input
            type="text"
            placeholder="Título do checklist"
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
          />

          {/* Lista de tarefas */}
          <Checklist />
        </section>

        {/* Histórico */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Histórico de Checklists</h2>
          <p className="text-gray-500">Nenhum checklist salvo ainda.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
