import React from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
var Breadcrumb = (pageDetail) =>{
    const headerIcon = {       
       
        role: '/assets/images/roles.png',
        manageRole: '/assets/images/manage-role.png',
        adminUserList: '/assets/images/admin-user-list.png',
        manageAdimnUser: '/assets/images/manage-admin-user.png',
       
    }
    let setIcon = headerIcon[pageDetail.pageTitleIcon];

    return (
        <div className="cr-page__header">
            <h1 className="h1 cr-page__title"><i><FontAwesomeIcon icon={pageDetail.pageTitleIcon} /></i><span>{pageDetail.pageTitle}</span></h1>           
        </div>
    );

}

export default Breadcrumb;