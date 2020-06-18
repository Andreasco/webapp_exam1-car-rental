import React from 'react';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

const PriceDialog = (props) => {
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title className="text-center">Price summary</Card.Title>
                    <Card.Text className="text-center">
                        There {props.numberOfCarsAvailable === "1" ? "is" : "are"} {props.numberOfCarsAvailable} {props.numberOfCarsAvailable === "1" ? "car" : "cars"} available for rent.
                    </Card.Text>
                    <Row className="justify-content-end">
                        <Col sm={6}>
                            <Row>
                                <ListGroup className="text-right" variant="flush">
                                    <ListGroup.Item><b>Duration of the rental:</b> {props.duration} day{props.duration === "1" ? "" : "s"}</ListGroup.Item>
                                    <ListGroup.Item><b>Base price:</b> {props.fees["basePrice"]}€</ListGroup.Item>
                                    {props.fees["kmFee"] !== "0" &&
                                        <ListGroup.Item><b>Kilometers fee:</b> {props.fees["kmFee"]}€</ListGroup.Item>
                                    }
                                    {props.fees["ageFee"] !== "0" &&
                                        <ListGroup.Item><b>Driver's age fee:</b> {props.fees["ageFee"]}€</ListGroup.Item>
                                    }
                                    {props.fees["extraDriversFee"] !== "0" &&
                                        <ListGroup.Item><b>Extra drivers fee:</b> {props.fees["extraDriversFee"]}€</ListGroup.Item>
                                    }
                                    {props.fees["extraInsuranceFee"] !== "0" &&
                                        <ListGroup.Item><b>Extra insurance fee:</b> {props.fees["extraInsuranceFee"]}€</ListGroup.Item>
                                    }
                                    <ListGroup.Item><b>Total price:</b> {props.price}€</ListGroup.Item>
                                </ListGroup>
                            </Row>

                            <Row className="justify-content-end mr-5 mt-2">
                                <Button variant="warning" onClick={props.book()}>Book!</Button>
                            </Row>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        </>
    );
};

export default PriceDialog;
