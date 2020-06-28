import React from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

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
                {props.cars.length === 0 ?

                    <Alert variant="primary">
                        There are no cars for those filters.
                    </Alert>

                    : props.cars.map(createCard)}
            </Row>
        </Container>
    );
}

export default Showroom;
