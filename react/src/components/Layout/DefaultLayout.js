import React from 'react'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import HeaderComponent from '../Common/header/HeaderComponent';
import FooterComponent from '../Common/footer/FooterComponent';


const DefautLayout= (props) => {
    return (
        <React.Fragment>
            <main className="cr-app bg-light">
                <HeaderComponent type={"default"} /> 
                <section className="main-content-wrapper container d-flex flex-column">                    
                    <div className="content-wrap-inner">
                        {props.children}
                    </div>
                    <FooterComponent />
                </section>           
            </main>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
        </React.Fragment>
    );
}

export default DefautLayout
