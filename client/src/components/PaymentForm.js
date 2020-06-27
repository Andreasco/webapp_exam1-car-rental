import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

class PaymentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form : {
                name: "",
                surname: "",
                creditCardNumber: "",
                cvv: ""
            },
            creditCardNumberError : false,
            cvvError : false,
        }
    }

    handleChange = (name, value) => {
        const newForm = {...this.state.form};
        newForm[name] = value;

        this.setState({form : newForm});
    }

    handleSubmit = (event) => {
        // simple form validation
        event.preventDefault();
        const form = event.currentTarget;

        const creditCardNumberRegex = RegExp('\\d{16}');
        const cvvRegex = RegExp('\\d{3}');

        const creditCardNumberError = !creditCardNumberRegex.test(form.creditCardNumber.value);
        const cvvError = !cvvRegex.test(form.cvv.value)

        console.log(creditCardNumberError);
        console.log(cvvError);

        if (creditCardNumberError || cvvError) //a little bit of performance check
            this.setState({
                creditCardNumberError : creditCardNumberError,
                cvvError : cvvError
            });
        else
            this.props.pay({...this.state.form});
    }

    render() {
        return (
            <>
                <Modal backdrop="static" show={this.props.show} onHide={this.props.pay}>
                    <Form onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Checkout</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert show={this.state.creditCardNumberError} variant={"danger"}>
                                Credit card number must be a 16 digit number.
                            </Alert>
                            <Alert show={this.state.cvvError} variant={"danger"}>
                                CVV must be a 3 digit number.
                            </Alert>
                            <h2>Total price to pay: {this.props.totalPrice}€</h2>

                                <Form.Group controlId="fullName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text"
                                                  placeholder="Enter your name"
                                                  name="name"
                                                  value={this.state.form.name}
                                                  onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                                  required
                                                  autoFocus
                                    />

                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text"
                                                  placeholder="Enter your surname"
                                                  name="surname"
                                                  value={this.state.form.surname}
                                                  onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                                  required
                                    />
                                </Form.Group>

                                <Form.Group controlId="creditCard">
                                    <Form.Label>Credit card number</Form.Label>
                                    <Form.Control type="text"
                                                  placeholder="Enter your credit card number"
                                                  name="creditCardNumber"
                                                  value={this.state.form.creditCardNumber}
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
                                                  value={this.state.form.cvv}
                                                  onChange={(ev) => this.handleChange(ev.target.name, ev.target.value)}
                                                  required
                                    />
                                </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.props.cancelPayment}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Pay
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default PaymentForm;
