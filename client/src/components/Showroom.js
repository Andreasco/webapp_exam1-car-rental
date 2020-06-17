import React from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const Showroom = (props) => {

    const createCard = (car) =>{
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

    return (
        <Container fluid>
            <Row>
                {props.cars.map(createCard)}
            </Row>
        </Container>
    );
}

export default Showroom;
