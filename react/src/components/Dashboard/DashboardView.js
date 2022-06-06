import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import './DashboardStyle.scss';
import {MetaTagsView} from '../Common/meta-tags/MetaTagsView';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Card,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const DashboardView = (props) => {
    return (
        <div className="list-details">
            <MetaTagsView title="Dashboard" />
            <Breadcrumb pageTitleIcon={faThLarge} pageTitle="Dashboard" />
            
            <div className="row">        
                {
                    props.curUserType=='SA' || props.curUserType=='Sub'?
                    
                        <div className="col-lg-12 ">
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>Users: {props.userDataRowCount}</Card.Title>
                                    <Link to="/user" >Go to User List</Link>
                                </Card.Body>
                            </Card>
                        </div>
            
                    :
                   ""
                }
                {
                    props.userWalletDetails!=null && props.curUserType!='SA'?
                    <div className="col-lg-12 ">
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>Total Amount: {props.userWalletDetails.total_amount}</Card.Title>
                                    <Card.Title>Rebate Amount: {props.userWalletDetails.rebet_amount}</Card.Title>
                                    {
                                        props.userWalletDetails.paid_status==1?
                                        <Button type="primary" onClick={() => props.onPayNow(props.userWalletDetails.id)}>Pay Now</Button>
                                        :""
                                    }
                                </Card.Body>
                            </Card>
                    </div>
                    :""

                }
                

            </div>
                

        </div>

    );

}
export default DashboardView;