import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RentalForm from "./RentalForm";
import PriceDialog from "./PriceDialog";
import API from "../api/API";
import ReservationAlertSuccess from "./ReservationAlertSuccess";
import ReservationAlertFailure from "./ReservationAlertFailure";

class InteractiveConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //input fields
            rentalForm : {
                startingDay: "",
                endingDay: "",
                carCategory: "",
                driverAge: "",
                kmPerDay: "",
                extraDrivers: "0",
                extraInsurance: false,
            },

            //check if a field is filled
            filled : {
                startingDay: false,
                endingDay : false,
                carCategory : false,
                driverAge : false,
                kmPerDay : false
            },

            //show the price dialog when the fields are filled
            showPrice : false,
            //show the payment modal when the user agree the price
            showPayment : false,
            //show the result of the reservation
            reservationSuccess : false,
            reservationFailure : false,

            //data from the server
            numberOfAvailableCars : "", //tell the user how many cars are available

            //data to be passed to price dialog
            totalPrice : "",
            fees : {},
            duration : ""
        }
    }

    updateField = (name, value) => {
        const newBooleans = {...this.state.filled};
        newBooleans[name] = value !== "";

        const newRentalForm = {...this.state.rentalForm};
        newRentalForm[name] = value;

        this.setState({
            rentalForm : newRentalForm,
            filled : newBooleans
        }, this.checkFilled);
    }

    checkFilled = () => {
        if (this.state.filled.startingDay && this.state.filled.endingDay && this.state.filled.carCategory
            && this.state.filled.driverAge && this.state.filled.kmPerDay){

            API.getPriceData({...this.state.rentalForm})
                .then((priceData) => {
                    this.setState({
                        duration : priceData["duration"],
                        totalPrice : priceData["totalPrice"],
                        numberOfAvailableCars : priceData["numberOfAvailableCars"],
                        fees : priceData["fees"],
                        showPrice : true
                    });
                })
                .catch((errorObj) => {
                    this.props.onError(errorObj);
                });
        }
        else {
            this.setState({showPrice : false});
        }
    }

    goToPayment = () => {
        this.setState({showPayment : true});
    }

    pay = (paymentData) => {
        const reservationWithPrice = {...this.state.rentalForm};
        reservationWithPrice.price = this.state.totalPrice;

        const data = {
            paymentData : paymentData,
            reservation : reservationWithPrice
        };

        API.verifyPayment(data)
            .then(() => { //the response should always be ok
                console.log("API.verifyPayment");
                API.addReservation(reservationWithPrice)
                    .then(() => {
                        console.log("API.addReservation");
                        this.setState({reservationSuccess : true});
                    })
                    .catch(() => {
                        this.setState({reservationFailure : true});
                    })
            })
            .catch(() => {
                this.setState({reservationFailure : true}); //i should never get here
            });
        this.setState({showPayment : false});

        /*const reservationWithPrice = this.createReservation();
        reservationWithPrice.price = this.state.totalPrice;

        const data = {
            paymentData : paymentData,
            reservation : reservationWithPrice
        };

        API.verifyPayment(data)
            .then(() => { //i don't need the response
                this.setState({reservationSuccess : true});
            })
            .catch(() => {
                this.setState({reservationFailure : true});
            });
        this.setState({showPayment : false});*/
    }

    cancelPayment = () => {
        this.setState({showPayment : false});
    }

    closeAlert = () => {
        this.setState({
            reservationSuccess : false,
            reservationFailure : false,
        });
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {(!context.authUser || context.authErr) && <Redirect to = "/login" />}
                        <ReservationAlertSuccess show={this.state.reservationSuccess} closeAlert={this.closeAlert}/>
                        <ReservationAlertFailure show={this.state.reservationFailure} closeAlert={this.closeAlert}/>
                        <Row>
                            <Col sm={6}>
                                <RentalForm state={this.state.rentalForm} onChange={this.updateField}/>
                            </Col>

                            <Col sm={6}>
                                {this.state.showPrice &&
                                    <PriceDialog
                                        numberOfCarsAvailable={this.state.numberOfAvailableCars}
                                        duration={this.state.duration}
                                        totalPrice={this.state.totalPrice}
                                        fees={this.state.fees}
                                        goToPayment={this.goToPayment}
                                        showPayment={this.state.showPayment}
                                        pay={this.pay}
                                        cancelPayment={this.cancelPayment}
                                    />
                                }
                            </Col>
                        </Row>
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default InteractiveConfiguration;
