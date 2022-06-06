import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './SidebarStyle.scss';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import { dashboardIcon, userRoleIcon, userIcon, arrowIcon, emailContentIcon, generalIcon, contactUs, searchIcon, pinIcon, itemsIcon, hamburgerIcon } from '../svgIconList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faHome } from '@fortawesome/free-solid-svg-icons';

const SidebarView = (props) => {

    const [isGenralContent, setIsGenralContent] = useState(false);
    const [isHelpDeskContent, setIsHelpDeskContent] = useState(false);
    const [isSearchContent, setIsSearchContent] = useState(false);
    const [isBranchOfficeDetail, setisBranchOfficeDetail] = useState(false);
    const [ismyProfileContent, setIsmyProfileContent] = useState(false);

    

    const toggle = (event, type, state) => {
        event.preventDefault();
        setIsGenralContent(false);
        setIsHelpDeskContent(false);

        switch (type) {
            case 'genralContent':
                (state) === false ? setIsGenralContent(true) : setIsGenralContent(false);
                break;
            case 'helpDesk':
                (state) === false ? setIsHelpDeskContent(true) : setIsHelpDeskContent(false);
                break;
            case 'searchContent':
                (state) === false ? setIsSearchContent(true) : setIsSearchContent(false);
                break;
            case 'myProfileContent':
                    (state) === false ? setIsmyProfileContent(true) : setIsmyProfileContent(false);
                    break;
            case 'branchOfficeDetail':
                (state) === false ? setisBranchOfficeDetail(true) : setisBranchOfficeDetail(false);
                break;                
            default:
                console.log('default');
        }
    }

    let navItemsDashboard = [
        { to: '/dashboard', name: 'dashboard', exact: true, indexing: 1, permission: "read-dashboard", itemImg: dashboardIcon },
        { to: '/search-list', name: 'Order List', exact: false, indexing: 2, permission: "read-search-company", itemImg: searchIcon, itemClass: "cr-svg-mxH-20" },
        { to: '/user', name: 'User', exact: false, indexing: 4, permission: "read-user", itemImg: userIcon },
        { to: '/role', name: 'Role', exact: false, indexing: 3, permission: "read-role", itemImg: userRoleIcon },
        { to: '/email-content', name: 'Email Content', exact: false, indexing: 5, permission: "read-email-content", itemImg: emailContentIcon, itemClass: "cr-svg-mxH-20" },
        { to: '/country-group-management', name: 'Country Group Management', exact: false, indexing: 3, permission: "read-country-group-management", itemImg: itemsIcon },
        { to: '/customer-order-price-management', name: 'Customer Order Price Management', exact: false, indexing: 6, permission: "read-customer-order-price-management", itemImg: itemsIcon, },
        { to: '/customer-log-report', name: 'Customer Payment Info', exact: false, indexing: 7, permission: "read-customer-report-log", itemImg: itemsIcon, },
        
        { to: '/my-invoice-list', name: 'Invoice Info', exact: false, indexing: 8, permission: "read-my-invoice-log", itemImg: itemsIcon, },
        { to: '/search-countries', name: 'Search Investigation Countries', exact: false, indexing: 9, permission: "read-search-investigation-countries", itemImg: itemsIcon, },
    ];

    


    let navSearchContents = [
        { to: '/search', name: 'Search Company', exact: false, indexing: 5, permission: "create-search-company", itemImg: searchIcon, itemClass: "cr-svg-mxH-20" },
        // { to: '/search-list', name: 'Order List', exact: false, indexing: 5, permission: "read-search-company", itemImg: searchIcon, itemClass: "cr-svg-mxH-20" },
        { to: '/place-fresh-investigation', name: 'Place Fresh Investigation', exact: false, indexing: 5, permission: "create-search-company", itemImg: searchIcon, itemClass: "cr-svg-mxH-20" }
    ];
    let branchOfficeDetail = [
        { to: '/branch-office-listing', name: 'Branch Office Listing', exact: false, indexing: 5, permission: "read-branch-office-listing", itemImg: searchIcon, itemClass: "cr-svg-mxH-20" },
        { to: '/branch-office-transaction-detail', name: 'Branch Office Transactin Details', exact: false, indexing: 5, permission: "read-branch-office-transaction-detail", itemImg: searchIcon, itemClass: "cr-svg-mxH-20" }
    ];

    let navMyProfile = [
        { to: '/my-profile', name: 'My Profile', exact: false, indexing: 8, permission: "read-my-profile" }
    ];

    let navGeneralContents = [
        { to: '/site-setting', name: 'Site Setting', exact: false, indexing: 7, permission: "read-setting" },
       
    ];

    let helpDesk = [
        { to: '/contact-us', name: 'contact us', exact: true, indexing: 1, itemImg: contactUs },

    ];

    if (commonJsObj.getCurrentUserId() != 1) {
        navItemsDashboard = commonJsObj.checkMenuPermission(navItemsDashboard);
        navSearchContents = commonJsObj.checkMenuPermission(navSearchContents);
        navGeneralContents = commonJsObj.checkMenuPermission(navGeneralContents);
        branchOfficeDetail = commonJsObj.checkMenuPermission(branchOfficeDetail);
        navMyProfile = commonJsObj.checkMenuPermission(navMyProfile);
    }
    if (commonJsObj.getCurrentUserId() == 1) {
        branchOfficeDetail = [];
    }

    useEffect(() => {
    }, []);
    return (
        <aside className="cr-sidebar cr-sidebar--open">
            <div className="cr-sidebar__background"></div>
            <div className="cr-sidebar__content">
                <ul className="nav bg-color">
                    {navItemsDashboard.map(({ to, name, exact, itemImg }, index) => (
                        <li className="cr-sidebar__nav-item nav-item" key={`${name}-${index}`}>
                            <NavLink
                                className={`text-capitalize nav-link`}
                                to={to}
                                id={`navItem-${name}-${index}`}
                                activeClassName="active"
                                exact={exact}
                            >
                                <span className="cr-sidebar-icon">{itemImg} {name}</span>
                            </NavLink>
                        </li>
                    ))}


                    {/* Content Dropdown*/}                 

                    {navSearchContents.length > 0 &&
                        <li className="cr-sidebar__nav-item nav-item">
                            <Link className="cr-sidebar__nav-item-collapse nav-link"
                                to="/" onClick={(e) => toggle(e, 'searchContent', isSearchContent)}
                            >
                                <span className="cr-sidebar-icon cr-svg-mxH-20">{searchIcon} Search</span>
                                {arrowIcon}
                            </Link>
                        </li>
                    }

                    {navSearchContents.length > 0 && <div className={`collapse ${isSearchContent ? "show" : ""}`}>
                        {navSearchContents.map(({ to, name, exact, indexing }, index) => (
                            <li className="cr-sidebar__nav-item nav-item" key={`${name}-${index}`}>
                                <NavLink
                                    to={to}
                                    id={`navItem-${name}-${index}`}
                                    data={indexing}
                                    activeClassName="active"
                                    className={`text-capitalize nav-link`}
                                    exact={exact}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} /> {name}
                                </NavLink>
                            </li>
                        ))}
                    </div>
                    }

                     {/* branch office Dropdown*/}                 

                     {branchOfficeDetail.length > 0 &&
                        <li className="cr-sidebar__nav-item nav-item">
                            <Link className="cr-sidebar__nav-item-collapse nav-link"
                                to="/" onClick={(e) => toggle(e, 'branchOfficeDetail', isBranchOfficeDetail)}
                            >
                                <span className="cr-sidebar-icon cr-svg-mxH-20">{pinIcon} Branch Office Detail</span>
                                {arrowIcon}
                            </Link>
                        </li>
                    }

                    {branchOfficeDetail.length > 0 && <div className={`collapse ${isBranchOfficeDetail ? "show" : ""}`}>
                        {branchOfficeDetail.map(({ to, name, exact, indexing }, index) => (
                            <li className="cr-sidebar__nav-item nav-item" key={`${name}-${index}`}>
                                <NavLink
                                    to={to}
                                    id={`navItem-${name}-${index}`}
                                    data={indexing}
                                    activeClassName="active"
                                    className={`text-capitalize nav-link`}
                                    exact={exact}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} /> {name}
                                </NavLink>
                            </li>
                        ))}
                    </div>
                    }

                    
                    {/* nav profile Dropdown*/}                 

                    {navMyProfile.length > 0 &&
                        <li className="cr-sidebar__nav-item nav-item">
                            <Link className="cr-sidebar__nav-item-collapse nav-link"
                                to="/" onClick={(e) => toggle(e, 'myProfileContent', ismyProfileContent)}
                            >
                                <span className="cr-sidebar-icon cr-svg-mxH-20">{contactUs} My Profile Section</span>
                                {arrowIcon}
                            </Link>
                        </li>
                    }

                    {navMyProfile.length > 0 && <div className={`collapse ${ismyProfileContent ? "show" : ""}`}>
                        {navMyProfile.map(({ to, name, exact, indexing }, index) => (
                            <li className="cr-sidebar__nav-item nav-item" key={`${name}-${index}`}>
                                <NavLink
                                    to={to}
                                    id={`navItem-${name}-${index}`}
                                    data={indexing}
                                    activeClassName="active"
                                    className={`text-capitalize nav-link`}
                                    exact={exact}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} /> {name}
                                </NavLink>
                            </li>
                        ))}
                    </div>
                    }



                    {/* Help Desk Dropdown*/}

                    {/* {helpDesk.length > 0 &&
                        <li className="cr-sidebar__nav-item nav-item">
                            <Link className="cr-sidebar__nav-item-collapse nav-link"
                                to="/" onClick={(e) => toggle(e, 'helpDesk', isHelpDeskContent)}
                            >
                                <span className="cr-sidebar-icon cr-svg-mxH-20">{contactUs} Help Desk</span>
                                {arrowIcon}
                            </Link>
                        </li>
                    } */}

                    

                    {helpDesk.length > 0 && <div >
                        {helpDesk.map(({ to, name, exact, indexing,itemImg }, index) => (
                            <li className="cr-sidebar__nav-item nav-item" key={`${name}-${index}`}>
                                <NavLink
                                    to={to}
                                    id={`navItem-${name}-${index}`}
                                    data={indexing}
                                    activeClassName="active"
                                    className={`text-capitalize nav-link`}
                                    exact={exact}
                                >
                                    <span className="cr-sidebar-icon">{itemImg} {name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </div>
                    }


                    {/* General Dropdown*/}

                    {navGeneralContents.length > 0 &&
                        <li className="cr-sidebar__nav-item nav-item">
                            <Link className="cr-sidebar__nav-item-collapse nav-link"
                                to="/" onClick={(e) => toggle(e, 'genralContent', isGenralContent)}
                            >
                                <span className="cr-sidebar-icon cr-svg-mxH-20">{generalIcon} General</span>
                                {arrowIcon}
                            </Link>
                        </li>
                    }

                    {navGeneralContents.length > 0 && <div className={`collapse ${isGenralContent ? "show" : ""}`}>
                        {navGeneralContents.map(({ to, name, exact, indexing }, index) => (
                            <li className="cr-sidebar__nav-item nav-item" key={`${name}-${index}`}>
                                <NavLink
                                    to={to}
                                    id={`navItem-${name}-${index}`}
                                    data={indexing}
                                    activeClassName="active"
                                    className={`text-capitalize nav-link`}
                                    exact={exact}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} /> {name}
                                </NavLink>
                            </li>
                        ))}
                    </div>
                    }

                </ul>
            </div>
        </aside>
    )
}

export default SidebarView
