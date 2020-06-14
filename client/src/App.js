import React, {Component} from 'react';
import './App.css';
import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideBar from "./components/SideBar";
import Row from "react-bootstrap/Row";

async function getBrands() { //fake loading, as it was an API call
    return new Promise( resolve => {
        const cars = ['Fiat', 'Audi', 'BMW'];
        resolve(cars);
    })
}

class App extends Component {

    constructor(props)  {
        super(props);
        this.state = {
            cars: [],
            brands: [],
            categories_checkbox : {
                "A" : false,
                "B" : false,
                "C" : false,
                "D" : false,
                "E" : false
            },
            brands_checkbox : {} //for clarity
        };
    }

    componentDidMount() {
        getBrands().then((b) => {
            this.setState({ brands: b });

            // creation of the brands_checkbox in the state
            const brands_checkbox = {};
            b.forEach((brand) => {
                brands_checkbox[brand] = false;
            })
            this.setState({brands_checkbox : brands_checkbox})
        });

    }

    setCheckedCategories = (event) => {
        const newCategories = this.state.categories_checkbox;
        newCategories[event.target.name] = event.target.checked;
        this.setState({categories_checkbox : newCategories});
    }

    setCheckedBrands = (event) => {
        const newBrands = this.state.brands_checkbox;
        newBrands[event.target.name] = event.target.checked;
        this.setState({brands_checkbox : newBrands});
    }

    log = () => {
        for (const key in this.state.categories_checkbox) {
            console.log(`key = ${key} value = ${this.state.categories_checkbox[key]}`);
        }
    }

    render () {
        // values to save in the context
        const value = {
            authUser: this.state.authUser,
            authErr: this.state.authErr,
            //TODO loginUser: this.login,
            //TODO logoutUser: this.logout
        }

        return(
            <AuthContext.Provider value={value}>

                <Header/>

                <Container fluid>
                    <Row className="vheight-100">
                        <Col sm={4} bg="light" id="left-sidebar" className="col-12 col-md-3 col-xl-2 below-nav">
                            <SideBar onLog = {this.log} onCheckCategories = {this.setCheckedCategories}
                                     onCheckBrands = {this.setCheckedBrands}
                                     categories_checkbox = {this.state.categories_checkbox}
                                     brands_checkbox = {this.state.brands_checkbox}
                                     brands = {this.state.brands}
                            />
                        </Col>
                    </Row>

                </Container>
            </AuthContext.Provider>
        );
    }
}

export default App;
