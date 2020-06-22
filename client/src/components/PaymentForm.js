import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class PaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name : "",
            surname : "",
            creditCardNumber : "",
            cvv : ""
        }
    }

    handleChange = (name, value) => {
        this.setState({[name] : value})
    }

    render() {
        return (
            <>
                <Modal backdrop="static" show={this.props.show} onHide={this.props.pay}>
                    <Modal.Header closeButton>
                        <Modal.Title>Checkout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>Total price to pay: {this.props.totalPrice}€</h2>

                        <Form>
                            <Form.Group controlId="fullName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Enter your name"
                                              name="name"
                                              value={this.state.name}
                                              onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                              required
                                              autoFocus
                                />

                                <Form.Label>Surname</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Enter your surname"
                                              name="surname"
                                              value={this.state.surname}
                                              onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                              required
                                />
                            </Form.Group>

                            <Form.Group controlId="creditCard">
                                <Form.Label>Credit card number</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Enter your credit card number"
                                              name="creditCardNumber"
                                              value={this.state.creditCardNumber}
                                              onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                              required
                                />
                                <Form.Text className="text-muted">
                                    We'll never share your credit card with anyone else.
                                </Form.Text>

                                <Form.Label>CVV</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Enter your credit card's CVV"
                                              name="cvv"
                                              value={this.state.cvv}
                                              onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                              required
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.cancelPayment}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.props.pay}>
                            Pay
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default PaymentForm;
