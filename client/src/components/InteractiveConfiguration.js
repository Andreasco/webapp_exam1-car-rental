import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext'

class InteractiveConfiguration extends Component {
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authErr && <Redirect to = "/login"/>}


                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default InteractiveConfiguration;
