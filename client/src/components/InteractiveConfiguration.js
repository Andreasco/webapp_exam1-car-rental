import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from 'moment';
import RentalForm from "./RentalForm";
import PriceDialog from "./PriceDialog";

class InteractiveConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            priceTable : {
                category : [80, 70, 60, 50, 40],
                km : [-5/100, -0, +5/100],
                age : [+5/100, +0, +10/100],
                extraDrivers : +15/100,
                extraInsurance: +20/100,
                less10Vehicles : +10/100,
                frequentCustomer : -10/100
            },

            today : moment().format("YYYY-MM-DD"),

            //input fields
            startingDay: "",
            endingDay : "",
            carCategory : "",
            driverAge : "",
            kilometersPerDay : "",
            extraDrivers : "0",
            extraInsurance : false,

            //check if a field is filled
            filled : {
                startingDay: false,
                endingDay : false,
                carCategory : false,
                driverAge : false,
                kilometersPerDay : false
            },

            //show the price when the fields are filled
            showPrice : false,

            //data from the server
            numberOfCarsAvailable : "10", //tell the user how many cars are available
            totalCarsOfCategoryChosen : "", //to compute the percentage of available cars
            numberOfPastRentals : "", //to compute the discount for frequent customer

            price : "",
            fees : {}
        }
    }

    updateField = (name, value) => {
        const newBooleans = {...this.state.filled};
        newBooleans[name] = value !== "";

        this.setState({
            [name] : value,
            filled : newBooleans
        }, this.checkFields);
    }

    checkFields = () => {
        if (this.state.filled.startingDay && this.state.filled.endingDay && this.state.filled.carCategory
            && this.state.filled.driverAge && this.state.filled.kilometersPerDay){
            //API.getPossibleReservations(); intendo il numero delle auto disponibili
            //API.getNumberOfCarsAndPastRentals(); numero di prenotazioni dell'utente e numero totale delle macchine
            // servono per calcolare gli altri due campi del prezzo
            const p = this.calculatePrice();

            this.setState({
                price : p["totalPrice"],
                fees : {...p.fees},
                showPrice : true
            });
        }
        else {
            this.setState({showPrice : false});
        }
    }

    calculatePrice = () => {
        const basePrice = this.state.priceTable.category[parseInt(this.state.carCategory)] * this.calculateDuration();
        const kmFee = basePrice * this.state.priceTable.km[parseInt(this.state.kilometersPerDay)];
        const ageFee = basePrice * this.state.priceTable.age[parseInt(this.state.driverAge)];
        const extraDriversFee = basePrice * (this.state.extraDrivers === "0" ? 0 : this.state.priceTable.extraDrivers);
        const extraInsuranceFee = basePrice * (this.state.extraInsurance ? this.state.priceTable.extraInsurance : 0);

        const totalPrice = basePrice + kmFee + ageFee + extraDriversFee + extraInsuranceFee;

        //will be used to show the detail of the price
        //converted into strings because i'm using only strings data as a standard
        return {
            totalPrice : totalPrice+"",
            fees : {
                basePrice: basePrice+"",
                kmFee: kmFee+"",
                ageFee: ageFee+"",
                extraDriversFee: extraDriversFee+"",
                extraInsuranceFee: extraInsuranceFee+""
            }
        }
    }

    calculateDuration = () => {
        const a = moment(this.state.startingDay);
        const b = moment(this.state.endingDay);
        //converted into strings because i'm using only strings data as a standard
        //+1 because commonly we say 1 day rental even if we return it on the same day and so on...
        return b.diff(a, 'days') + 1 + "";
    }

    book = () => {
        //booking function
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

                            <Col sm={6}>
                                {this.state.showPrice &&
                                    <PriceDialog
                                        numberOfCarsAvailable={this.state.numberOfCarsAvailable}
                                        duration={this.calculateDuration()}
                                        carCategory={this.state.carCategory}
                                        driverAge={this.state.driverAge}
                                        kilometersPerDay={this.state.kilometersPerDay}
                                        extraDrivers={this.state.extraDrivers}
                                        extraInsurance={this.state.extraInsurance}
                                        price={this.state.price}
                                        fees={this.state.fees}
                                        book={this.book}
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
