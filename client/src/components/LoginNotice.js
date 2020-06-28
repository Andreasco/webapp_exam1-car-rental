import React from 'react';
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import {AuthContext} from '../auth/AuthContext'

// Fontawesome imports
import { faHandPointUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginNotice = () => {
    return (
        <AuthContext.Consumer>
            {(context) => (
                <>
                    <Jumbotron fluid>
                        <Container>
                            <h1 style={{fontSize : "3rem"}}>
                                Oops! It seams that you're not logged in yet. <FontAwesomeIcon icon={faHandPointUp} />
                            </h1>
                            <p style={{fontSize : "1.5rem"}}>Please login using the form in the upper right corner.</p>
                        </Container>
                    </Jumbotron>
                </>
            )}
        </AuthContext.Consumer>
    );
}

export default LoginNotice;
