import React from 'react'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import LoginHeaderComponent from '../Common/header/LoginHeaderComponent';


const LoginLayout= (props) => {
    return (
        <React.Fragment>
            <main className="cr-app bg-light login-cont">
                <LoginHeaderComponent /> 
                <div className="cr-content container-fluid">                           
                        {props.children}
                </div>
            </main>
            <ToastsContainer
                        store={ToastsStore}
                        position={ToastsContainerPosition.TOP_CENTER}
                    />
        </React.Fragment>
    );
}

export default LoginLayout
