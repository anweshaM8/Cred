import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPlus, faPencilAlt, faSearch, faUserShield, faArrowDown,faArrowCircleDown,faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import Pagination from "react-js-pagination";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { useForm } from "react-hook-form";
import Switch from "react-switch";
import Select from 'react-select';
import { Accordion, Button, Card,Badge } from "react-bootstrap";

const ListView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        // defaultValues: {
        //     search: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.search : "",
        //     order_type: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.order_type : "",
        // }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Customer Invoice Info" />
            <MetaTagsView title="Customer Invoice Info" />
           
            
            {
                (props.dataCustomerReportLogList && props.dataCustomerReportLogList.length > 0) ? <>
                <div className="table-wrapper">
                    <div className="table-heading bg-white">
                        <div className="d-flex align-items-center">
                            <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(props.dataCustomerReportLogList.length > 0) ? props.dataCustomerReportLogList.length : 0} items</span>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Invoice Link</th>
                                    <th>Action</th>
                                    <th>Name</th>
                                    <th>Email</th>                                  
                                    <th>Total Amount</th>
                                    <th>Rebate Amount</th>
                                    <th>Payment Date</th>
                                    <th>Payment Confirmation</th>
                                    <th>Rebate Confirmation</th>
                                     
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {props.dataCustomerReportLogList.length > 0 && props.dataCustomerReportLogList.map((_item, _index) => (

                                    <tr key={_index}>
                                        <td>{_item.invoice_no}</td>
                                        <td>                              
                                            { 
                                                (_item.invoice_link!=null) ?  <a href={process.env.REACT_APP_ASSETURL+'invoice/'+_item.invoice_link} target="_blank" >PDF </a> : "-" 
                                            }
                                            &nbsp;
                                            { 
                                                (_item.invoice_excel!=null) ?  <a href={process.env.REACT_APP_ASSETURL+'invoice/'+_item.invoice_excel} target="_blank" >Excel </a> : "-" 
                                            }
                                            {/* { 
                                                (_item.invoice_link!=null) ?  <a href={_item.invoice_link} target="_blank" >PDF </a> : "-" 
                                            }
                                            &nbsp;
                                            { 
                                                (_item.invoice_excel!=null) ?  <a href={_item.invoice_excel} target="_blank" >Excel </a> : "-" 
                                            } */}
                                            </td>
                                        <td>
                                            {
                                                
                                                (_item.invoice_link!=null) ? <button title="Send Mail" className="ml-3 btn-edit-rouned" onClick={() => props.send_mail(_item.id)}> <FontAwesomeIcon icon={faEnvelope} /> </button>:""
                                               
                                            }
                                        </td>
                                        <td>{_item.user_details.name}</td>
                                        <td>{_item.user.user_name}</td>
                                        <td>{_item.total_amount}</td>
                                        <td>{_item.rebate_amount}</td>
                                        <td>{ 
                                                (_item.payment_date!=null) ?  (new Date(_item.payment_date)).toLocaleDateString('en-US') : "-" 
                                            }
                                        </td>
                                        <td>
                                            {
                                             _item.payment_approve_status=='0'?<Button type="primary" onClick={()=>props.updatePaymentInfo(_item.id,'payment_approve')}>Mark as paid</Button> :<Badge bg="success" style={{backgroundColor: "greenyellow"}}>Paid</Badge>
                                            }
                                        </td>
                                        <td>
                                        {
                                         _item.rebate_approve_status=='0'?<Button type="primary" onClick={()=>props.updatePaymentInfo(_item.id,'rebate_approve')}>Mark as paid</Button> :<Badge bg="success" style={{backgroundColor: "greenyellow"}} >Paid</Badge>
                                        }
                                        </td>
                                        
                                    </tr>
                                ))}
                                {props.dataCustomerReportLogList.length <= 0 && <tr><td colSpan="4" className="text-center">No Record Found</td></tr>}
                            </tbody>
                        </table>


                    </div>
                </div>
                    <div className="col-12 px-0 pagination-tbl-btm mt-2">
                        {(props.dataCustomerReportLogList.length > 0 && props.paginationPageCount > 0) ?
                            <Pagination
                                hideDisabled
                                activePage={props.curPage}
                                itemsCountPerPage={parseInt(process.env.REACT_APP_PAGINATION_LIMIT)}
                                totalItemsCount={props.paginationData.rowCount}
                                pageRangeDisplayed={5}
                                onChange={props.handlePageChange}
                            />
                            :
                            " "
                        }
                    </div></> : <div className="text-center"></div>
            }
            
            

        </div>

    );

}
export default ListView;