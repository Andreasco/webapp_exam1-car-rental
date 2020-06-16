import React, {Component} from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

class Showroom extends Component {
    createCard = (car) =>{
        return(
            <Card key={car.model} className="m-1 car-card">
                <Card.Body>
                    <Card.Title>{car.model}</Card.Title>
                    <Card.Text>
                        <b>Brand: </b> {car.brand} <br/>
                        <b>Category: </b> {car.category}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    {this.props.cars.map(this.createCard)}
                </Row>
            </Container>
        );
    }
}

export default Showroom;
