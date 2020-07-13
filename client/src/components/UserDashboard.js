import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import {AuthContext} from "../auth/AuthContext";
import {Redirect} from 'react-router-dom';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import API from "../api/API";
import moment from "moment";

class UserDashboard extends Component {
    static contextType = AuthContext; //it is used to be able to use the context also outside of render and therefore of
    // Context.Consumer, I need the context for the function that handles errors

    constructor(props) {
        super(props);

        this.state = {
            pastReservations : [],
            futureReservations : [],
            currentReservations : [],
            activeRows : {},
            selectedReservationsIds : []
        }
    }

    componentDidMount() {
        this.init();
    }

    //I need this in a separate function to be able to call it after a deletion
    init = () => {
        API.getReservations()
            .then((reservations) => {
                const pastReservations = [];
                const futureReservations = [];
                const currentReservations = [];
                reservations.forEach((reservation) => {
                    const today = moment().format("YYYY-MM-DD");
                    if (moment(reservation.endingDay).isBefore(today))
                        pastReservations.push(reservation);
                    else if (moment(reservation.startingDay).isSameOrBefore(today) &&
                                moment(reservation.endingDay).isSameOrAfter(today))
                        currentReservations.push(reservation);
                    else {
                        futureReservations.push(reservation);
                    }
                });

                this.setState({
                    pastReservations : pastReservations,
                    futureReservations : futureReservations,
                    currentReservations : currentReservations,
                })
            })
            .catch((err) => {
                this.context.handleErrors(err);
            });
    }

    createBodyFuture = (reservation, rowIndex) => {
        return (
            <tr key={rowIndex} className={this.state.activeRows[rowIndex] ? "active" : null}
                onClick={() => this.selectReservation(rowIndex)}>
                <td>{reservation.startingDay}</td>
                <td>{reservation.endingDay}</td>
                <td>{reservation.carCategory}</td>
                <td>{reservation.driverAge}</td>
                <td>{reservation.kmPerDay}</td>
                <td>{reservation.extraDrivers}</td>
                <td>{reservation.extraInsurance ? "Yes" : "No"}</td>
                <td>{reservation.price}€</td>
            </tr>
        )
    }

    createBody = (reservation, rowIndex) => {
        return (
            <tr key={rowIndex}>
                <td>{reservation.startingDay}</td>
                <td>{reservation.endingDay}</td>
                <td>{reservation.carCategory}</td>
                <td>{reservation.driverAge}</td>
                <td>{reservation.kmPerDay}</td>
                <td>{reservation.extraDrivers}</td>
                <td>{reservation.extraInsurance ? "Yes" : "No"}</td>
                <td>{reservation.price}€</td>
            </tr>
        )
    }

    selectReservation = (rowIndex) => {
        const newActiveRows = {...this.state.activeRows};
        const newSelectedReservationsIds = [...this.state.selectedReservationsIds];
        newActiveRows[rowIndex] = !newActiveRows[rowIndex];
        if (newActiveRows[rowIndex])
            newSelectedReservationsIds.push(this.state.futureReservations[rowIndex].id);
        else
            newSelectedReservationsIds.splice(newSelectedReservationsIds.indexOf(rowIndex),1);
        this.setState({
            activeRows : newActiveRows,
            selectedReservationsIds : newSelectedReservationsIds
        });
    }

    deleteReservations = () => {
        for (const reservationId of this.state.selectedReservationsIds)
            API.deleteReservation(reservationId).then(() => {
                this.init();
            });
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(!context.authUser || context.authErr) && <Redirect to = "/login" />}

                        <Jumbotron fluid>
                            <Container>
                                <h1>Hello {context.authUser ? context.authUser.name : null}! Welcome to your dashboard.</h1>
                                <p>
                                    Here you can check your past, current and future reservations, moreover you can
                                    cancel any future reservation you want.
                                </p>
                            </Container>
                        </Jumbotron>

                        <Row className="justify-content-center">
                            <Col sm={9}>
                                <h2>Past rentals</h2>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>Starting day</th>
                                        <th>Ending day</th>
                                        <th>Car category</th>
                                        <th>Driver's age</th>
                                        <th>Kilometers per day</th>
                                        <th>Extra drivers</th>
                                        <th>Extra insurance</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.pastReservations.map((r, i) => this.createBody(r, i))}
                                    </tbody>
                                </Table>

                                <h2>Current rentals</h2>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>Starting day</th>
                                        <th>Ending day</th>
                                        <th>Car category</th>
                                        <th>Driver's age</th>
                                        <th>Kilometers per day</th>
                                        <th>Extra drivers</th>
                                        <th>Extra insurance</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.currentReservations.map((r, i) => this.createBody(r, i))}
                                    </tbody>
                                </Table>

                                <h2>Future rentals</h2>
                                <Table responsive hover >
                                    <thead>
                                    <tr>
                                        <th>Starting day</th>
                                        <th>Ending day</th>
                                        <th>Car category</th>
                                        <th>Kilometers per day</th>
                                        <th>Driver's age</th>
                                        <th>Extra drivers</th>
                                        <th>Extra insurance</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.futureReservations.map((r, i) => this.createBodyFuture(r, i))}
                                    </tbody>
                                </Table>

                                <Button className="mb-5" variant="warning"
                                        disabled={this.state.selectedReservationsIds.length === 0}
                                        onClick={this.deleteReservations}>Delete selected</Button>
                            </Col>
                        </Row>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default UserDashboard;
