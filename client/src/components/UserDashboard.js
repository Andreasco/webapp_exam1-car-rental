import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import {AuthContext} from "../auth/AuthContext";
import {Redirect} from 'react-router-dom';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const name = "Andrea"; //da togliere e sostituire name con context.authUser.name
async function getReservations() { //fake loading, as it was an API call
    return new Promise( resolve => {
        const reservations = [
            {
                id : 0,
                startingDay : "2020-06-12",
                endingDay : "2020-06-14",
                carCategory : "A",
                driverAge : "Under 25",
                kmPerDay : "Less than 150",
                extraDrivers : "3",
                extraInsurance : true,
                price : 100
            },
            {
                id : 1,
                startingDay : "2020-06-12",
                endingDay : "2020-06-14",
                carCategory : "A",
                driverAge : "Under 25",
                kmPerDay : "Less than 150",
                extraDrivers : "3",
                extraInsurance : true,
                price : 240
            },
            {
                id : 2,
                startingDay : "2020-06-12",
                endingDay : "2020-06-14",
                carCategory : "A",
                driverAge : "Under 25",
                kmPerDay : "Less than 150",
                extraDrivers : "3",
                extraInsurance : true,
                price : 300
            }];
        resolve(reservations);
    })
}

class UserDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reservations : [],
            activeRows : {},
            selectedReservations : []
        }
    }

    componentDidMount() {
        getReservations().then((reservations) => {
            const activeRows = {};
            reservations.forEach((reservation, index) => {
                activeRows[index] = false;
            });

            this.setState({
                reservations : reservations,
                activeRows : activeRows
            })
        });
    }

    createBodyFuture = (reservation, rowIndex) => {
        return (
            <tr key={rowIndex} className={this.state.activeRows[rowIndex] ? "active" : null}
                onClick={() => this.changeActive(rowIndex)}>
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

    createBodyPast = (reservation, rowIndex) => {
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

    changeActive = (rowIndex) => {
        const newActiveRows = {...this.state.activeRows};
        const newSelectedReservations = [...this.state.selectedReservations];
        newActiveRows[rowIndex] = !newActiveRows[rowIndex];
        if (newActiveRows[rowIndex])
            newSelectedReservations.push(rowIndex);
        else
            newSelectedReservations.splice(newSelectedReservations.indexOf(rowIndex),1);
        this.setState({
            activeRows : newActiveRows,
            selectedReservations : newSelectedReservations
        });
    }

    deleteReservations = () => {
        //TODO chiamata API per eliminare quelle prenotazioni
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
                                    Here you can check your future and past reservations, moreover you can cancel any
                                    future reservation you want.
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
                                    {this.state.reservations.map((r, i) => this.createBodyPast(r, i))}
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
                                    {this.state.reservations.map((r, i) => this.createBodyFuture(r, i))}
                                    </tbody>
                                </Table>

                                <Button className="mb-5" variant="warning" onClick={this.deleteReservations}>Delete selected</Button>
                            </Col>
                        </Row>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default UserDashboard;
