import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './assets/css/App.css'; // ou './App.css' dependendo da estrutura

// Componentes comuns
const Login = lazy(() => import('./Components/Login/Login'));

// Eventos e Fornecedores
const EventScreen = lazy(() => import('./Components/Event/EventScreen'));
const SupplierScreen = lazy(() => import('./Components/Suppliers/SupplierScreen'));

// Dashboard e Clientes
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));
const Layout = lazy(() => import('./Components/Shared/Layout'));
const ClienteIndex = lazy(() => import('./Components/Cliente/ClienteIndex'));
const ClienteForm = lazy(() => import('./Components/Cliente/FormCliente'));

// Módulos ainda não desenvolvidos
const Agenda = lazy(() => import('./Components/Agenda/Agenda'));
const CheckList = lazy(() => import('./Components/CheckList/CheckList'));
const Orcamentos = lazy(() => import('./Components/Orcamentos/Orcamentos'));
const ResumoFinanceiro = lazy(() => import('./Components/ResumoFinanceiro/ResumoFinanceiro'));
const TipoServicos = lazy(() => import('./Components/TipoServicos/TipoServicos'));
const SiteManagementScreen = lazy(() => import('./Components/SiteManagement/SiteManagementScreen'));
const ResetPasswordScreen = lazy(() => import("./Components/Login/ResetPassword"));

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null || localStorage.getItem('Token gerado') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  return (
    <Router>
      <Suspense fallback={<div>Carregando...</div>}>
        {/* Aqui você pode adicionar um componente de carregamento, se necessário */}
        <div>
          <Routes>
            {/* Redireciona da raiz "/" para "/login" */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rota da tela de login */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuth} />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout setIsAuthenticated={setIsAuth} />
                </PrivateRoute>
              }
            >
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/ClienteIndex" element={<ClienteIndex />} />
              <Route path="/FormCliente" element={<ClienteForm />} />
              <Route path="/FormCliente/:id" element={<ClienteForm />} />
              <Route path="/events" element={<EventScreen />} />
              <Route path="/suppliers" element={<SupplierScreen />} />
              <Route path="/resetPassword" element={<ResetPasswordScreen />} />
              <Route path="/Agenda" element={<Agenda />} />
              <Route path="/CheckList" element={<CheckList />} />
              <Route path="/Orcamentos" element={<Orcamentos />} />
              <Route path="/TipoServicos" element={<TipoServicos />} />
              <Route path="/ResumoFinanceiro" element={<ResumoFinanceiro />} />
              <Route path="/siteManagement" element={<SiteManagementScreen />} />
            </Route>

            {/* Se não encontrar a rota, cai aqui */}
            <Route path="*" element={<h2>Página não encontrada</h2>} />
          </Routes>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;