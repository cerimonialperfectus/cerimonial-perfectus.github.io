import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../assets/css/Dashboard.css';

const Layout = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("Token gerado"); // Apaga o token
        setIsAuthenticated(false); // Atualiza o estado para deslogado
        navigate("/Login"); // Redireciona para o login
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg py-1" style={{ backgroundColor: "#D9B2A9" }}>
                <div className="container">
                    <Link className="navbar-brand" to="/Dashboard">
                        <img src="/src/assets/logo.png" className="logo" alt="" loading="lazy" />
                    </Link>
                    <button
                        className="navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navmenu"
                    >
                        <span className="toggler-icon top-bar"></span>
                        <span className="toggler-icon middle-bar"></span>
                        <span className="toggler-icon bottom-bar"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navmenu">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item m-1">
                                <Link to="/Dashboard" className="nav-link text-light fs-5">
                                    <i className="bi bi-grid"></i>
                                    <span className="span-menu mx-3">Menu</span>
                                </Link>
                            </li>

                            <li className="nav-item mt-1">
                                <div className="btn-group ms-0">
                                    <a
                                        href="#"
                                        className="nav-link fs-5 text-decoration-none text-light btn-config"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-house-gear"></i>
                                        <span className="span-menu mx-3">Serviços</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/Agenda" className="nav-link fs-5">
                                                <i className="bi bi-journal-bookmark"></i>
                                                <span className="span-menu span-menu-list mx-1"> Agenda</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/CheckList" className="nav-link fs-5">
                                                <i className="bi bi-list-check"></i>
                                                <span className="span-menu span-menu-list mx-1"> Check List Eventos</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/events" className="nav-link fs-5">
                                                <i className="bi bi-calendar-event"></i>
                                                <span className="span-menu span-menu-list mx-1"> Eventos</span>
                                            </Link>
                                        </li>
                                        
                                        <li>
                                            <Link to="/Orcamentos" className="nav-link fs-5">
                                                <i className="bi bi-cash-stack"></i>
                                                <span className="span-menu span-menu-list mx-1"> Orçamentos</span>
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/ResumoFinanceiro" className="nav-link fs-5">
                                                <i className="bi bi-cash-stack"></i>
                                                <span className="span-menu span-menu-list mx-1"> Financeiro</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item mt-1">
                                <div className="btn-group ms-0">
                                    <a
                                        href="#"
                                        className="nav-link text-light fs-5 text-decoration-none text-light btn-config"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person-fill-gear"></i>
                                        <span className="span-menu mx-3">Cadastros</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/ClienteIndex" className="nav-link fs-5">
                                                <i className="bi bi-people"></i>
                                                <span className="span-menu span-menu-list mx-1">Clientes</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/Suppliers" className="nav-link fs-5">
                                                <i className="bi bi-person-fill-gear"></i>
                                                <span className="span-menu span-menu-list mx-1">Fornecedores</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item m-1">
                                            <Link to="/users" className="nav-link fs-5">
                                                <i className="bi bi-person-circle"></i>
                                                <span className="span-menu span-menu-list mx-1">Usuário</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/TiposServicos" className="nav-link fs-5">
                                                <i className="bi bi-list-task"></i>
                                                <span className="span-menu span-menu-list mx-1">Tipos de Serviços</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/siteManagement" className="nav-link fs-5">
                                                <i className="bi bi-newspaper"></i>
                                                <span className="span-menu span-menu-list mx-1">Gestão do Site</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item mt-1">
                                <div className="btn-group ms-1">
                                    <a
                                        href="#"
                                        className="nav-link fs-5 text-decoration-none text-light btn-config"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="bi bi-person-fill-gear"></i>
                                        <span className="span-menu mx-3">Usuário</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item m-1">
                                            <Link to="/resetPassword" className="nav-link fs-5">
                                                <i className="bi bi-person-badge"></i>
                                                <span className="span-menu span-menu-list mx-1"> Alterar Senha </span>
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right"></i>
                                                <span className="span-menu span-menu-list mx-1"> Logout </span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Outlet /> {/* Aqui as páginas serão renderizadas */}
            </div>
        </>
    );
};

export default Layout;