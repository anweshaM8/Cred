import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faSearch, faUserShield, faArrowDown,faArrowCircleDown,faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
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
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Customer Payment Info" />
            <MetaTagsView title="Customer Payment Info" />
           
            
            
            <div className="table-wrapper">
               

                <div className="table-container">
                <table className="table">
                
                    <Accordion>
                        { props.dataCustomerReportLogList.length > 0 && props.dataCustomerReportLogList.map((_item, _index) => (
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey={_index.toString()}>
                                    {/* <thead> */}
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th><FontAwesomeIcon icon={faAngleDoubleDown} /></th>
                                        </tr>
                                    {/* </thead> */}
                                    <tbody>
                                        <tr key={_index}>
                                            <td>{_item.id}</td>
                                            <td>{_item.user_details.name}</td>
                                            <td>{_item.user.user_name}</td>
                                            
                                        </tr>
                                    </tbody>
                                </Accordion.Toggle>

                                <Accordion.Collapse eventKey={_index.toString()}>
                                    <Card.Body>
                                   
                                    {
                                        _item.monthwiseCustomerReportLog.map(function(_item1, _index1){
                                            var date = new Date(_item1.invoice_date);
                                            date.setMonth(date.getMonth() - 1);
                                            let curmonth = date.getMonth();
                                            let curfullyear = date.getFullYear();

                                            return (
                                                    <div key={_index1} >
                                                        <h3>{props.months[curmonth]+' '+curfullyear }</h3>
                                                        <p className='py-2'>
                                                            <span className='px-5'>Total Amount:{_item1.total_amount}</span>
                                                            {
                                                               _item1.payment_approve_status=='0'?<Button type="primary" onClick={()=>props.updatePaymentInfo(_item1.id,'payment_approve')}>Mark as paid</Button> :<Badge bg="success" style={{backgroundColor: "greenyellow"}}>Paid</Badge>
                                                            }
                                                        </p>
                                                        <p className='py-2'>
                                                            <span className='px-5'>Rebate Amount:{_item1.rebate_amount}</span>
                                                            {
                                                               _item1.rebate_approve_status=='0'?<Button type="primary" onClick={()=>props.updatePaymentInfo(_item1.id,'rebate_approve')}>Mark as paid</Button> :<Badge bg="success" style={{backgroundColor: "greenyellow"}} >Paid</Badge>
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                        })
                                    }
                                    </Card.Body>
                                
                                </Accordion.Collapse>
                            </Card>
                         ))}

                    </Accordion>
                    {props.dataCustomerReportLogList.length <= 0 && <tr><td colSpan="10" className="text-center">No Record Found</td></tr>}
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
            </div>




        </div>

    );

}
export default ListView;