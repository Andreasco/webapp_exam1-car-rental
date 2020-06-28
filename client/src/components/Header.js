import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav";
import LoginForm from "./LoginForm";
import Image from "react-bootstrap/Image";
import {NavLink} from 'react-router-dom';
import {AuthContext} from "../auth/AuthContext";
import LoggedUser from "./LoggedUser";


const Header = () => {
    return(
        <AuthContext.Consumer>
            {(context) => (
                <Navbar fixed="top" variant="dark" bg="primary"  expand="lg">
                    <Navbar.Brand>
                        <NavLink to={"/"}>
                            <Image width="200" height="30" className="img-logo" src="/svg/logo_white.svg"/>
                        </NavLink>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavLink className="nav-link" to="/showroom">Showroom</NavLink>
                            <NavLink className="nav-link" to="/booking">Booking</NavLink>
                        </Nav>
                        {context.authUser ? <LoggedUser/> : <LoginForm/>}
                    </Navbar.Collapse>
                </Navbar>
            )}
        </AuthContext.Consumer>
    );
}

export default Header;
