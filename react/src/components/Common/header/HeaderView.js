import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { hamburgerIcon } from '../svgIconList';
import './header.scss';
import logo from '../../../assets/images/logo.png';


const HeaderView = (props) => {

    const handleSidebarControlButton = (event) => {
        event.preventDefault();
        document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
        document.querySelector('.cr-header__navbar__tglBtn').classList.toggle('cr_sidebar--active');
    };

    return (
        <nav className="cr-header navbar bg-white">
             {
                props.type!=='default'?
                <span className="cr-header__navbar__tglHld">
                    <button className="cr-header__navbar__tglBtn cr_sidebar--active" type="button" onClick={(e) => handleSidebarControlButton(e)} aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        {hamburgerIcon}
                    </button>
                </span>
             :
             "" 
            }
            <Link className="cr-header__navbar-brand" to="/"> <img alt="credence" src={logo} className="brand-logo" /></Link>
            <ul className="cr-header__nav-right navbar-nav">
                <li className="nav-item">
                {
                    props.type!=='default'?
                    <Dropdown className="user-btn">
                        <Dropdown.Toggle id="dropdown-basic">
                            <FontAwesomeIcon icon={faUserCircle} />
                        </Dropdown.Toggle>

                       
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/edit-profile">Edit Profile</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/change-password">Change Password</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/logout" onClick={(e) => props.logoutHandler(e)}>Logout</Dropdown.Item>

                            </Dropdown.Menu>
                    </Dropdown>
                    :
                    "" 
                }

                </li>
            </ul>
        </nav>
    );
};


export default withRouter(HeaderView);
