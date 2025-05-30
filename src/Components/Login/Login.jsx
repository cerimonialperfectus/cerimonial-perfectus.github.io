import { useNavigate } from 'react-router-dom';
import axios from "axios";
import React, { useState } from "react";
import NavBar from '../Shared/Navlink';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../assets/css/Login.css';
import ModalMensagem from "../Modal/ModalMensagem"; // Importa o Modal

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000"
const API_BASE_URL = `${api_url}/users`;

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setUserName] = useState("");
    const [senha, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a exibição da senha

    // Estado do modal
    const [modalShow, setModalShow] = useState(false);
    const [modalTitulo, setModalTitulo] = useState("");
    const [modalMensagem, setModalMensagem] = useState("");
    const [modalTipo, setModalTipo] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password: senha });

            localStorage.setItem("TokenCerimonial", response.data.token);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);

            setModalTitulo("Login realizado!");
            setModalMensagem("Você foi autenticado com sucesso.");
            setModalTipo("sucesso");
            setModalShow(true);

            setIsAuthenticated(true); // Fala para o App que agora está autenticado
            navigate("/Dashboard"); // Redireciona para a tela de clientes

        } catch (err) {
            let titulo = "Erro";
            let mensagem = "Erro desconhecido.";
            let tipo = "erro";

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        mensagem = "Requisição inválida. Verifique os dados informados.";
                        break;
                    case 401:
                        mensagem = "Credenciais inválidas.";
                        break;
                    case 500:
                        mensagem = "Erro interno no servidor. Tente novamente mais tarde.";
                        break;
                    default:
                        mensagem = err.response.data.error || "Erro desconhecido.";
                }
            } else if (err.request) {
                mensagem = "O servidor não respondeu. Verifique sua conexão.";
            } else {
                mensagem = err.message;
            }

            setModalTitulo(titulo);
            setModalMensagem(mensagem);
            setModalTipo(tipo);
            setModalShow(true);
        }
      };

    return (
        <>
            <div className='.login-wrapper'>
                <div className='navbar-default'>
                    <NavBar />
                </div>
                <div className="container area-login">
                    <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center">
                        <form className="plnLogin rounded shadow p-5 mb-4" onSubmit={handleLogin}>
                            <img
                                src="/src/assets/undraw_fingerprint_login_re_t71l.svg"
                                className="img-fluid mb-2 img-logo"
                                alt="Login" />
                            <h3 className="text-white fw-bolder fs-4 mb-2">Acesse a Plataforma</h3>
                            <p className="text-white">Faça o seu login para ter acesso ao sistema.</p>

                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setUserName(e.target.value)} />
                                <label htmlFor="floatingInput">E-mail</label>
                            </div>
                            <div className="form-floating">
                                <input
                                    type={showPassword ? "text" : "password"} // Alterna entre "text" e "password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    required
                                    value={senha}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <label htmlFor="floatingPassword">Senha</label>
                            </div>
                            <div className="form-check text-white text-start mt-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="flexCheckDefault"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)} // Alterna o estado
                                />
                                <label className="form-check-label" htmlFor="flexCheckDefault">Mostrar Senha</label>
                            </div>
                            <button className="btn btn-primary btn-acessar w-100 my-4" type="submit">Login</button>

                            <div className="text-center text-uppercase mb-3">
                                <p className="text-white">ou</p>
                            </div>
                            <div>
                                <a href="#" className="text-decoration-none">Esqueceu sua senha?</a>
                            </div>
                        </form>
                    </div>

                    {/* Componente ModalMensagem */}
                    <ModalMensagem 
                        show={modalShow}
                        onClose={() => setModalShow(false)}
                        titulo={modalTitulo}
                        mensagem={modalMensagem}
                        tipo={modalTipo}
                    />
                </div>
            </div>
        </>
    );
};

export default Login;