import React from 'react';
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const ReservationAlertSuccess = (props) => {
    return (
        <>
            <Alert show={props.show} variant="success">
                <Alert.Heading>Reservation confirmed!</Alert.Heading>
                <p>
                    Thanks for choosing us for your car rental! <br/>
                    Your rental has been reserved, you can find all the information in your profile page.
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

export default ReservationAlertSuccess;
