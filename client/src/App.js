import React, {Component} from 'react';
import './App.css';
import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SideBar from "./components/SideBar";
import Row from "react-bootstrap/Row";
import Showroom from "./components/Showroom";
import {Switch} from 'react-router';
import {Redirect, Route} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import InteractiveConfiguration from "./components/InteractiveConfiguration";
import UserDashboard from "./components/UserDashboard";
import LoginNotice from "./components/LoginNotice";
import API from './api/API';

class App extends Component {

    constructor(props)  {
        super(props);
        this.state = {
            allCars: [],
            filteredCars : [],
            brands: [],
            categories_checkbox : {
                "A" : false,
                "B" : false,
                "C" : false,
                "D" : false,
                "E" : false
            },
            brands_checkbox : {}, //for clarity
            authUser : null,
            authErr : null
        };
    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState({authUser: user});
            }
        ).catch((err) => {
            this.setState({authErr: err.errorObj});
        });

        API.getCars()
            .then((c) => {
                this.setState({
                    allCars : c,
                    filteredCars : c
                });
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });

        API.getBrands()
            .then((b) => {
                // creation of the brands_checkbox in the state
                const brands_checkbox = {};
                b.forEach((brand) => {
                    brands_checkbox[brand] = false;
                });

                this.setState({
                    brands : b,
                    brands_checkbox : brands_checkbox,
                });
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({authErr: err.errorObj});
                this.props.history.push("/");
            }
        }
    }

    login = (username, password) => {
        API.userLogin(username, password).then(
            (user) => {
                this.setState({autghUser: user, authErr: null});
                this.props.history.push("/");
            }
        ).catch(
            (errorObj) => {
                const err0 = errorObj.errors[0];
                this.setState({authErr: err0});
            }
        );
    }

    logout = () => {
        API.userLogout().then(() => {
            this.setState({authUser: null,authErr: null});
            API.getReservations().catch((errorObj)=>{this.handleErrors(errorObj)}); //TODO capire perchè si fa, probabilmente per chiamare volutamente la catch
        });
    }

    filter = () => {
        const activeCategories = [];
        const activeBrands = [];
        for (const category in this.state.categories_checkbox){
            if (this.state.categories_checkbox[category]) {
                activeCategories.push(category);
            }
        }

        for (const brand in this.state.brands_checkbox){
            if (this.state.brands_checkbox[brand]) {
                activeBrands.push(brand);
            }
        }

        if (activeCategories.length === 0 && activeBrands.length === 0){
            this.setState({filteredCars : [...this.state.allCars]}); //no active filter so i have to show all the cars
        }
        else {
            //there's some active filter so i have to filter the cars, I could have simplified the if using only this part
            //without any loss of performance but i keep it in this way for clarity
            const newFilteredCars = this.state.allCars.filter((car) => {
                //if there are no categories or brands filters then every category or brand is ok
                let categoryOk = activeCategories.length === 0;
                let brandOk = activeBrands.length === 0;

                //i can avoid to check if there are not active categories or brands, just for efficiency
                if (activeCategories.length !== 0){
                    categoryOk = activeCategories.includes(car.category);
                }

                if (activeBrands.length !== 0){
                    brandOk = activeBrands.includes(car.brand);
                }

                return categoryOk && brandOk;
            });

            this.setState({filteredCars: newFilteredCars});
        }
    }

    setCheckedCategories = (event) => {
        const newCategories = {...this.state.categories_checkbox};
        newCategories[event.target.name] = event.target.checked;
        this.setState({categories_checkbox : newCategories}, this.filter);
    }

    setCheckedBrands = (event) => {
        const newBrands = {...this.state.brands_checkbox};
        newBrands[event.target.name] = event.target.checked;
        this.setState({brands_checkbox : newBrands}, this.filter);
    }

    render () {
        // values to save in the context
        const value = {
            authUser: this.state.authUser,
            authErr: this.state.authErr,
            loginUser: this.login,
            logoutUser: this.logout
        }

        return(
            <AuthContext.Provider value={value}>

                <Header/>

                <Container fluid>
                    <Switch>
                        <Route path="/login">
                            <Row className="vheight-100">
                                <Col sm={12} className="below-nav">
                                    <LoginNotice/>
                                </Col>
                            </Row>
                        </Route>

                        <Route path="/showroom">
                            <Row className="vheight-100">
                                <Col sm={4} bg="light" id="left-sidebar" className="col-12 col-md-3 col-xl-2 below-nav">
                                    <SideBar onCheckCategories = {this.setCheckedCategories}
                                             onCheckBrands = {this.setCheckedBrands}
                                             categories_checkbox = {this.state.categories_checkbox}
                                             brands_checkbox = {this.state.brands_checkbox}
                                             brands = {this.state.brands}
                                    />
                                </Col>

                                <Col sm={10} className="below-nav">
                                    <Showroom cars={this.state.filteredCars}/>
                                </Col>
                            </Row>
                        </Route>

                        <Route path="/booking">
                            <Row className="vheight-100">
                                <Col sm={12} className="below-nav">
                                    <InteractiveConfiguration onError={this.handleErrors}/>
                                </Col>
                            </Row>
                        </Route>

                        <Route path="/user/:username">
                            <Row className="vheight-100">
                                <Col sm={12} className="below-nav">
                                    <UserDashboard/>
                                </Col>
                            </Row>
                        </Route>

                        <Route>
                            <Redirect to="/showroom" />
                        </Route>

                    </Switch>
                </Container>
            </AuthContext.Provider>
        );
    }
}

export default withRouter(App);
