import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

const RentalForm = (props) => {

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>Organize your rental!</Card.Title>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="startingDay">
                                <Form.Label>Starting day</Form.Label>
                                <Form.Control type="date"
                                              name="startingDay"
                                              value={props.state.startingDay}
                                              min={props.state.today}
                                              max={props.state.endingDay}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="endingDay">
                                <Form.Label>Ending day</Form.Label>
                                <Form.Control type="date"
                                              name="endingDay"
                                              value={props.state.endingDay}
                                              min={props.state.startingDay}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="carCategory">
                                <Form.Label>Car category</Form.Label>
                                <Form.Control as="select" defaultValue=""
                                              name="carCategory"
                                              value={props.state.carCategory}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                >
                                    <option/>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>C</option>
                                    <option>D</option>
                                    <option>E</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="driverAge">
                                <Form.Label>Driver's age</Form.Label>
                                <Form.Control as="select" defaultValue=""
                                              name="driverAge"
                                              value={props.state.driverAge}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                >
                                    <option/>
                                    <option>Under 25</option>
                                    <option>25-65 years old</option>
                                    <option>Over 65</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="kilometersPerDay">
                                <Form.Label>Estimated kilometers per day</Form.Label>
                                <Form.Control as="select" defaultValue=""
                                              name="kilometersPerDay"
                                              value={props.state.kilometersPerDay}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                >
                                    <option/>
                                    <option>Less than 50km</option>
                                    <option>Less than 150km</option>
                                    <option>Unlimited</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="extraDrivers">
                                <Form.Group controlId="extraDrivers">
                                    <Form.Label>Number of extra drivers</Form.Label>
                                    <Form.Control as="select" defaultValue="0"
                                                  name="extraDrivers"
                                                  value={props.state.extraDrivers}
                                                  onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                    >
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row id="checkbox-row">
                            <Form.Group controlId="extraInsurance">
                                <Form.Check type="checkbox"
                                            label="Extra insurance"
                                            name="extraInsurance"
                                            checked={props.state.extraInsurance}
                                            onChange={(ev) => props.onChange(ev.target.name, ev.target.checked)}
                                />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export default RentalForm;
