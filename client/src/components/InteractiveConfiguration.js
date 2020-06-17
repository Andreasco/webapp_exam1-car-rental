import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from 'moment';
import RentalForm from "./RentalForm";

class InteractiveConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            today : moment().format("YYYY-MM-DD"),
            startingDay: "",
            endingDay : "",
            carCategory : "",
            driverAge : "",
            kilometersPerDay : "",
            extraDrivers : "0",
            extraInsurance : false
        }
    }

    updateField = (name, value) => {
        this.setState({[name]: value}, this.checkFields);
    }

    checkFields = () => {

    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authErr && <Redirect to = "/login" />}
                        <Row>
                            <Col sm={6}>
                                <RentalForm state={this.state} onChange={this.updateField}/>
                            </Col>
                        </Row>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default InteractiveConfiguration;
