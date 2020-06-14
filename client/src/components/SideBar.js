import React, {Component} from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

class SideBar extends Component {

    createBrand = (brand) => {
        // dinamic creation of the buttons for brands
        // should be ok
        return(
            <ListGroup.Item key={brand}>
                <ButtonGroup toggle className="mb-2">
                    <ToggleButton
                        name={brand}
                        type="checkbox"
                        variant="outline-primary"
                        checked={this.props.brands_checkbox[brand]}
                        value="1"
                        onChange={(e) => this.props.onCheckBrands(e)}
                    >
                        {brand}
                    </ToggleButton>
                </ButtonGroup>
            </ListGroup.Item>
        )
    }

    render() {
        return (
            <>
                <ListGroup  variant="flush">
                    <ListGroup.Item className="p-3 list-title">
                        <b style={{fontSize: '20px'}}>Car category</b>
                    </ListGroup.Item>

                    <ListGroup.Item >
                        <div className="mb-2">
                            <Row>
                                <Col sm="4">
                                    <ButtonGroup key = "A" toggle className="mb-2">
                                        <ToggleButton
                                            name="A"
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={this.props.categories_checkbox["A"]}
                                            value="1"
                                            onChange={(e) => this.props.onCheckCategories(e)}
                                        >
                                            A
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>

                                <Col sm="4">
                                    <ButtonGroup key = "B" toggle className="mb-2">
                                        <ToggleButton
                                            name="B"
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={this.props.categories_checkbox["B"]}
                                            value="1"
                                            onChange={(e) => this.props.onCheckCategories(e)}
                                        >
                                            B
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>

                                <Col sm="4">
                                    <ButtonGroup key = "C" toggle className="mb-2">
                                        <ToggleButton
                                            name="C"
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={this.props.categories_checkbox["C"]}
                                            value="1"
                                            onChange={(e) => this.props.onCheckCategories(e)}
                                        >
                                            C
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </div>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <div className="mb-2">
                            <Row>
                                <Col sm="4">
                                    <ButtonGroup key = "D" toggle className="mb-2">
                                        <ToggleButton
                                            name="D"
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={this.props.categories_checkbox["D"]}
                                            value="1"
                                            onChange={(e) => this.props.onCheckCategories(e)}
                                        >
                                            D
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>

                                <Col sm="4">
                                    <ButtonGroup key = "E" toggle className="mb-2">
                                        <ToggleButton
                                            name="E"
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={this.props.categories_checkbox["E"]}
                                            value="1"
                                            onChange={(e) => this.props.onCheckCategories(e)}
                                        >
                                            E
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </div>
                    </ListGroup.Item>

                    <ListGroup.Item className="p-3 mt-2 list-title">
                        <b style={{fontSize: '20px'}}>Car brands</b>
                    </ListGroup.Item>

                    {this.props.brands.map(this.createBrand)}
                </ListGroup>
            </>
        );
    }
}

export default SideBar;
