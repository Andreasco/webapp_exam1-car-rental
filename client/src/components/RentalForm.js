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
                                <Form.Control as="select"
                                              name="carCategory"
                                              value={props.state.carCategory}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                >
                                    <option/>
                                    <option value={0}>A</option>
                                    <option value={1}>B</option>
                                    <option value={2}>C</option>
                                    <option value={3}>D</option>
                                    <option value={4}>E</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="driverAge">
                                <Form.Label>Driver's age</Form.Label>
                                <Form.Control as="select"
                                              name="driverAge"
                                              value={props.state.driverAge}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                >
                                    <option/>
                                    <option value={0}>Under 25</option>
                                    <option value={1}>25-65 years old</option>
                                    <option value={2}>Over 65</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="kilometersPerDay">
                                <Form.Label>Estimated kilometers per day</Form.Label>
                                <Form.Control as="select"
                                              name="kilometersPerDay"
                                              value={props.state.kilometersPerDay}
                                              onChange={(ev) => props.onChange(ev.target.name, ev.target.value)}
                                >
                                    <option/>
                                    <option value={0}>Less than 50km</option>
                                    <option value={1}>50-150km</option>
                                    <option value={2}>Unlimited</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="extraDrivers">
                                <Form.Group controlId="extraDrivers">
                                    <Form.Label>Number of extra drivers</Form.Label>
                                    <Form.Control as="select"
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
