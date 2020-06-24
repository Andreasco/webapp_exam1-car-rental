import React from 'react';
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const ReservationAlertFailure = (props) => {
    return (
        <>
            <Alert show={props.show} variant="danger">
                <Alert.Heading>Something's wrong!</Alert.Heading>
                <p>
                    Sorry but we couldn't reserve your rental. <br/>
                    Sometimes our servers are lazy! Try again to make a reservation.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={props.closeAlert} variant="outline-success">
                        Got it!
                    </Button>
                </div>
            </Alert>
        </>
    );
};

export default ReservationAlertFailure;
