import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import './OnlineSearchDetailStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Tabs,Tab } from 'react-bootstrap';

const OnlineSearchDetailView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {

        }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faCogs} pageTitle="Search Details" />
            <MetaTagsView title="Search Details" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <Tabs defaultActiveKey="company_basic_info" id="uncontrolled-tab-example" className="mb-3">
                            <Tab eventKey="company_basic_info" title="Basic Info">
                                <div className='row p-5'>
                                    <h2>Company Basic Details</h2>
                                    <div className="col-md-12">
                                        <b>Legal Name: </b>{props.onlineSearchDetails.company_basic_info.company.legal_name}(CIN:{props.onlineSearchDetails.company_basic_info.company.cin})
                                    </div>
                                    <div className="col-md-12">
                                        <b>Registered Address: </b>{props.onlineSearchDetails.company_basic_info.company.registered_address.address_line1+','+
                                        props.onlineSearchDetails.company_basic_info.company.registered_address.address_line1+','+
                                        props.onlineSearchDetails.company_basic_info.company.registered_address.address_line2+','+
                                        props.onlineSearchDetails.company_basic_info.company.registered_address.city+','+
                                        props.onlineSearchDetails.company_basic_info.company.registered_address.state+'-'+
                                        props.onlineSearchDetails.company_basic_info.company.registered_address.pincode
                                        }
                                    </div>
                                    <div className="col-md-12">
                                        <b>email: </b>{props.onlineSearchDetails.company_basic_info.company.email}
                                    </div>
                                    <div className="col-md-12">
                                        <b>Authorized Capital: </b>{props.onlineSearchDetails.company_basic_info.company.authorized_capital.toLocaleString("en-US")}
                                    </div>
                                    <div className="col-md-12">
                                        <b>Paid Up Capital: </b>{props.onlineSearchDetails.company_basic_info.company.paid_up_capital.toLocaleString("en-US")}
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="company_financial_info" title="Financial Info">
                                <div className='row p-5'>
                                    <h2>Company Financial Details</h2>
                                    <div className="col-md-12">
                                        <div className='table-responsive'>
                                        <table style = {{width:'100%'}}>
                                            <thead>
                                                <tr>
                                                    <th>Year</th>
                                                    <th>Capital WIP</th>
                                                    <th>Net Fixed Assets</th>
                                                    <th>Total Current Assets</th>
                                                    <th>Total Current Liabilities</th>
                                                    <th>Total Debt</th>
                                                    <th>Total Equity</th>
                                                    <th>Total Non Current Liabilities</th>
                                                    <th>Total Other Non Current Assets</th>
                                                    <th>Filing Standard</th>
                                                    <th>Filing Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.onlineSearchDetails.company_financial_info.financials.length > 0 && props.onlineSearchDetails.company_financial_info.financials.map((_item, _index) => (
                                                <tr key={_index}>
                                                    <td>{_item.year}</td>
                                                    <td>{_item.bs.subTotals.capital_wip.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.net_fixed_assets.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.total_current_assets.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.total_current_liabilities.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.total_debt.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.total_equity.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.total_non_current_liabilities.toLocaleString("en-US")}</td>
                                                    <td>{_item.bs.subTotals.total_other_non_current_assets.toLocaleString("en-US")}</td>
                                                    <td>{_item.filing_standard}</td>
                                                    <td>{_item.filing_type}</td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="company_gst_details" title="Gst Details" >
                                <div className='row p-5'>
                                    <h2>Company GST Details</h2>
                                    <div className="col-md-12">
                                        <div className='table-responsive'>
                                        <table style = {{width:'100%'}}>
                                            <thead>
                                                <tr>
                                                    <th>GSTIN</th>
                                                    <th>Center Jurisdiction</th>
                                                    <th>Nature of Business Activities</th>
                                                    <th>State</th>
                                                    <th>State Jurisdiction</th>
                                                    <th>Taxpayer Type </th>
                                                    <th>Date of Registration</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.onlineSearchDetails.company_gst_details.gst_details.length > 0 && props.onlineSearchDetails.company_gst_details.gst_details.map((_item, _index) => (
                                                <tr key={_index}>
                                                    <td>{_item.gstin}</td>
                                                    <td>{_item.centre_jurisdiction}</td>
                                                    <td>{_item.nature_of_business_activities}</td>
                                                    <td>{_item.state}</td>
                                                    <td>{_item.state_jurisdiction}</td>
                                                    <td>{_item.taxpayer_type}</td>
                                                    <td>{_item.date_of_registration}</td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="company_joint_ventures" title="Joint Ventures" >
                                <div className='row p-5'>
                                    <h2>Joint Ventures</h2>
                                    <br/>
                                    {
                                        props.onlineSearchDetails.company_joint_ventures.joint_ventures.hasOwnProperty('company')?
                                        <div className="col-md-12">
                                            <h5>Company Joint Ventures</h5>
                                            <div className='table-responsive'>
                                            <table style = {{width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>Legal Name</th>
                                                        <th>Paid Up Capital</th>
                                                        <th>Share Holding Percentage</th>
                                                        <th>Sum of Charges</th>
                                                        <th>Incorporation Date</th>
                                                        <th>Cirp Status </th>
                                                        <th>City</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.onlineSearchDetails.company_joint_ventures.joint_ventures.company.length > 0 && props.onlineSearchDetails.company_joint_ventures.joint_ventures.company.map((_item, _index) => (
                                                    <tr key={_index}>
                                                        <td>{_item.legal_name}</td>
                                                        <td>{_item.paid_up_capital.toLocaleString("en-US")}</td>
                                                        <td>{_item.share_holding_percentage}</td>
                                                        <td>{_item.sum_of_charges.toLocaleString("en-US")}</td>
                                                        <td>{_item.incorporation_date}</td>
                                                        <td>{_item.cirp_status}</td>
                                                        <td>{_item.city}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>:""
                                    }
                                    <br/>
                                    {
                                        props.onlineSearchDetails.company_joint_ventures.joint_ventures.hasOwnProperty('llp')?
                                        <div className="col-md-12">
                                            <h5>Llp Joint Ventures</h5>
                                            <div className='table-responsive'>
                                            <table style = {{width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>Legal Name</th>
                                                        <th>Total obligation of Contribution</th>
                                                        <th>Share Holding Percentage</th>
                                                        <th>Sum of Charges</th>
                                                        <th>Incorporation Date</th>
                                                        <th>Cirp Status </th>
                                                        <th>City</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.onlineSearchDetails.company_joint_ventures.joint_ventures.llp.length > 0 && props.onlineSearchDetails.company_joint_ventures.joint_ventures.llp.map((_item, _index) => (
                                                    <tr key={_index}>
                                                        <td>{_item.legal_name}</td>
                                                        <td>{_item.total_obligation_of_contribution.toLocaleString("en-US")}</td>
                                                        <td>{_item.share_holding_percentage}</td>
                                                        <td>{_item.sum_of_charges.toLocaleString("en-US")}</td>
                                                        <td>{_item.incorporation_date}</td>
                                                        <td>{_item.cirp_status}</td>
                                                        <td>{_item.city}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>:""
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="company_securities_allotment" title="Security Allotment" >
                                <div className='row p-5'>
                                <h2>Security Allotment</h2>
                                    {
                                        props.onlineSearchDetails.company_securities_allotment.hasOwnProperty('securities_allotment')?
                                        <div className="col-md-12">
                                            <div className='table-responsive'>
                                            <table style = {{width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>Instrument</th>
                                                        <th>Allotment Type</th>
                                                        <th>Nominal Amount Per security</th>
                                                        <th>Number of Security Allotted</th>
                                                        <th>Premium Amount Per Security</th>
                                                        <th>Total Amount Raised</th>
                                                        <th>Allotment Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.onlineSearchDetails.company_securities_allotment.securities_allotment.length > 0 && props.onlineSearchDetails.company_securities_allotment.securities_allotment.map((_item, _index) => (
                                                    <tr key={_index}>
                                                        <td>{_item.instrument}</td>
                                                        <td>{_item.allotment_type}</td>
                                                        <td>{_item.nominal_amount_per_security}</td>
                                                        <td>{_item.number_of_securities_allotted}</td>
                                                        <td>{_item.premium_amount_per_security}</td>
                                                        <td>{_item.total_amount_raised}</td>
                                                        <td>{_item.allotment_date}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>:""
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="company_shareholdings" title="Shareholding" >
                                <div className='row p-5'>
                                <h2>Shareholding</h2>
                                    {
                                        props.onlineSearchDetails.company_shareholdings.hasOwnProperty('shareholdings')?
                                        <div className="col-md-12">
                                            <div className='table-responsive'>
                                            <table style = {{width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>Category</th>
                                                        <th>Total Number of shares</th>
                                                        <th>Total Percentage of shares</th>
                                                        <th>Shareholders</th>
                                                        <th>Year</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.onlineSearchDetails.company_shareholdings.shareholdings.length > 0 && props.onlineSearchDetails.company_shareholdings.shareholdings.map((_item, _index) => (
                                                    <tr key={_index}>
                                                        <td>{_item.category}</td>
                                                        <td>{_item.total_no_of_shares}</td>
                                                        <td>{_item.total_percentage_of_shares}</td>
                                                        <td>{_item.shareholders}</td>
                                                        <td>{_item.year}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>:""
                                    }
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>

        </div>

    );

}
export default OnlineSearchDetailView;