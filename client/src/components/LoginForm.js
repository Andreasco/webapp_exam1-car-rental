import React, {Component} from 'react';
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {AuthContext} from "../auth/AuthContext";
import Alert from "react-bootstrap/Alert";

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
    }

    onChangeHandler = (event) => {
        this.setState({[event.target.name] : event.target.value});
    };

    submitHandler = (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.username, this.state.password);
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authErr &&
                        <Alert className="mr-2" variant="danger">
                            {context.authErr.msg}
                        </Alert>
                        }

                        <Form inline method="POST" onSubmit={(event) => this.submitHandler(event, context.loginUser)}>
                            <FormControl type="text" name="username" placeholder="Username"
                                         className="mr-sm-2" value = {this.state.username}
                                         onChange={(event => this.onChangeHandler(event))} required/>
                            <FormControl type="password" name="password" placeholder="Password"
                                         className="mr-sm-2" value = {this.state.password}
                                         onChange={(event => this.onChangeHandler(event))} required/>
                            <Button variant="outline-light" type="submit">Login</Button>
                        </Form>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default LoginForm;
