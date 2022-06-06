import React from 'react'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import HeaderComponent from '../Common/header/HeaderComponent';
import FooterComponent from '../Common/footer/FooterComponent';
import SidebarComponent from '../Common/sidebar/SidebarComponent';



const MainLayout = (props) => {
    return (
        <React.Fragment>
            <main className="cr-app bg-light">
                <HeaderComponent type={"Auth"} /> 
                <SidebarComponent />
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

export default MainLayout
