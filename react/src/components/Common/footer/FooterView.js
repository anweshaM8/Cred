import React from 'react';
import { withRouter } from 'react-router-dom'
import './footer.scss';


function FooterView() {

    return (
       

        <footer className="footer mt-5 pb-3">               
            <p className="copyright m-0">Credence {new Date().getFullYear()}@ All Right Reserved</p>
        </footer>

            

    )
}

export default withRouter(FooterView)
