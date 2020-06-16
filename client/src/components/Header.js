import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav";
import LoginForm from "./LoginForm";
import Image from "react-bootstrap/Image";


const Header = () => {
    return(
        <Navbar fixed="top" variant="dark" bg="primary"  expand="lg">
            <Navbar.Brand href="index.html">

                <Image width="200" height="30" className="img-logo" src="/svg/logo_white.svg"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#showroom">Showroom</Nav.Link>
                    <Nav.Link href="#booking">Booking</Nav.Link>
                </Nav>
                <LoginForm/>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
