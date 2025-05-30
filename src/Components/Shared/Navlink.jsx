import { useState } from "react";
import { Link } from 'react-router-dom';
import "../../assets/css/Navlink.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section>
            <nav className="navbar navbar-expand-lg py-3 fixed-top" style={{ backgroundColor: "#D9B2A9" }}>
                <div className="container">
                    {/* <a className="navbar-brand mx-auto text-center" href="#">
                        <img src="/src/assets/logo.png" className="logo" alt="" />
                    </a> */}
                    <Link to="/Dashboard" className="navbar-brand mx-auto text-center">
                        <img src="/src/assets/logo.png" className="logo" alt="" loading="lazy" />
                    </Link>
                </div>
            </nav>
        </section>
    );
};

export default Navbar;
