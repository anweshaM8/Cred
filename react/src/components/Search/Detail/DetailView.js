import React, { useState } from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { Modal,Button,Badge } from 'react-bootstrap';
import moment from 'moment';

import './DetailStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope,faPencilAlt,faPlus,faSearch, faUserShield, faDownload, faFileInvoice, faSyncAlt, faBatteryHalf, faBatteryFull, faEye } from '@fortawesome/free-solid-svg-icons';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { useForm } from "react-hook-form";
import { Document, Page } from 'react-pdf';
import pdfLogo from '../../../assets/images/pdf.png';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';

const ListView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            company_name: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.company_name : "",
            company_address: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.company_address : "",
            company_contact: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.company_contact : "",
            postal_code: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.postal_code : "",
            contact_email: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.contact_email : "",
            gst_vat_reg_number: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.gst_vat_reg_number : "",
            internal_reference_no: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.internal_reference_no : "",
            status: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.status : "",
            range_start_date: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.range_start_date : new Date(),
            range_end_date: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.range_end_date : new Date(),
        }
    });

    const STATUS =[];
    STATUS["IP"]="In Progress";
    STATUS["CMP"]="Complete";

    const [showModal, setShow] = useState(false);
    const [modalId, setModalId] = useState(0);

//    const handleClose = () => {
//        setShow(false);
//        setModalId(0);
//    }
//    const handleShow = (modalId) => {
//        setShow(true);
//        setModalId(modalId);
//        console.log('modalShow')
//    }

   function handleUpdateStatus(id,status,update_requested_on) {
       console.log('------update status-------- for id:'+id,'----',status)
      if(status==1)
      {
          return <span>Pending <br/> Requested on: {moment(update_requested_on).utc().format('YYYY-MM-DD HH:mm:ss')} </span>;
      }
      else  if(status==2)
      {
          return <span>Updated</span>;
      }
      else  if(status==3)
      {
          return <span>Not Updated</span>;
      }
      else
      {
          return "";
      }
   }
   const renderSwitch =(param) => {
    switch(param) {
        case 1:
        return <td>Pending</td>
        case 2:
        return <td>Updated</td>
        case 3:
        return <td>Not Updated</td>
      default:
        return <td></td>;
    }
  }

    

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Order List" />
            <MetaTagsView title="Order List" />
            <form className="form-ui-wrapper mb-4" onSubmit={handleSubmit(props.searchSubmit)}>
                <div className="row">

                    <div className="form-group col-md-4 col-lg-3">
                        <label>Company Name</label>
                        <input className="form-control" type="text" name="company_name" ref={register({})} />
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Company Address</label>
                        <input className="form-control" type="text" name="company_address" ref={register({})} />
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Company Contact</label>
                        <input className="form-control" type="text" name="company_contact" ref={register({})} />
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Postal Code</label>
                        <input className="form-control" type="text" name="postal_code" ref={register({})} />
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Contact Email</label>
                        <input className="form-control" type="text" name="contact_email" ref={register({})} />
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>GST/VAT/Registration Number</label>
                        <input className="form-control" type="text" name="gst_vat_reg_number" ref={register({})} />
                    </div>
                    {/* <div className="form-group col-md-4 col-lg-3">
                        <label>pi_link</label>
                        <input className="form-control" type="text" name="pi_link" ref={register({})} />
                    </div> */}
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Internal Reference Number</label>
                        <input className="form-control" type="text" name="internal_reference_no" ref={register({})} />
                    </div>
                   
                    
                    <div className="form-group col-md-4 col-lg-3" >
                        <label>Status</label>
                        <select className='form-control' name="status" ref={register({})}>
                            <option value="">--Select Status--</option>
                            <option value="IP">Pending</option>
                            <option value="C">Delivered</option>
                        </select>
                    </div>

                    <div className="form-group col-md-4 col-lg-3">
                        <label>Date Range</label>
                            <DateRangePicker onEvent={props.handleDateCallback}
                             initialSettings={{ startDate: ((Object.keys(props.submitedData).length) > 0) ? moment(props.submitedData.range_start_date).format('MM/DD/YYYY') :moment().subtract(1, 'months').format('MM/DD/YYYY'), 
                             endDate: ((Object.keys(props.submitedData).length) > 0) ? moment(props.submitedData.range_end_date).format('MM/DD/YYYY') : moment().format('MM/DD/YYYY') }}
                            // initialSettings={{ startDate: props.startDate, endDate:props.endDate }}
                            >
                                <input className="form-control" type="text" name="date_range" ref={register({})} />
                            </DateRangePicker>

                            
                        
                    </div>
                    
                </div>
              



                <div className='row'>
                    <div className="form-group col-md-auto col-12 align-self-end form-submit-btn">
                        
                        <button className="btn btn-success" type="submit" >Search <FontAwesomeIcon icon={faSearch} /></button>  &nbsp;
                        {
                            (props.searchDataSetIdentify) ? <button onClick={props.resetSearch} className="btn btn-success" type="submit" >Reset <FontAwesomeIcon icon={faSyncAlt} /></button>  /*<span className="refreshIconHldr" onClick={props.resetSearch}>{refreshIcon} </span>*/ : ""
                        }
                    </div>
                </div>
            </form>


            {
                (props.noDataFound) ? <div className="table-wrapper mb-3">
                    <div className="table-heading bg-white">
                        <div className="text-center">
                            <div className="mr-auto mb-2">Sorry! No records found based on your search criteria.
                                You can place a fresh investigation by clicking on the below button.</div>


                            <Link to="/place-fresh-investigation" className="mt-2 text-center btn btn-success">Place Fresh Investigation
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-upload" class="svg-inline--fa fa-file-upload fa-w-12 ml-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"></path></svg>
                            </Link>

                        </div>
                    </div>

                </div> : ""
            }

            {
                (props.searchDataList && props.searchDataList.length > 0 && props.noDataFound==false) ? <><div className="table-wrapper">
                    <div className="table-heading bg-white">
                        <div className="d-flex align-items-center">
                            <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(props.searchDataList.length > 0) ? props.searchDataList.length : 0} items</span>
                            {props.currentUserType=='SA'?<span className="" style={{ paddingLeft:'30px' }} ><button className="btn btn-success" type="button" onClick={props.updateProbeStatusApiForAdmin} >Sync to Probe </button>  &nbsp;</span>:""}
                        </div>
                        
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Company Name</th>
                                    <th>Report Type</th>
                                    <th>Country</th>
                                    <th>Order Date</th>
                                    <th>Report</th>
                                    <th>Internal Reference Number</th>
                                    <th>Status</th>
                                    <th>Updated Status</th>
                                    {props.currentUserType=='SA'?<th>Action</th>:""}
                                    <th>Contact Name</th>
                                    <th>Contact Email</th>
                                    <th>PI</th>
                                   
                                    
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {props.searchDataList.length > 0 && props.searchDataList.map((_item, _index) => (

                                    <tr key={_index}>
                                        <td>{_item.id}</td>
                                        <td>{_item.company_name}</td>
                                        <td>{_item.type}</td>
                                        <td>{_item.hasOwnProperty('countrydet')?_item.countrydet.country_name:""}</td>
                                        <td> {(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
                                        {
                                            props.currentUserType=='SA'?
                                            <td>                              
                                            { 
                                                (_item.order_link!=null) ?  <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "-" 
                                            }
                                            </td>
                                            :
                                            <td>
                                            {
                                                (_item.order_link!=null && props.currentUserDownloadStatus=="1") ? <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "-"
                                            }
                                            </td>
                                        }
                                        <td>{_item.internal_reference_no}</td>
                                        <td>
                                            {
                                                (_item.status == 'IP') ? <Badge bg="warning " className='bdWarning'>Pending</Badge> : <Badge bg="success " className='bdSuccess'>Delivered</Badge>
                                            }
                                        </td>
                                       
                                        <td>
                                            {_item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined'?handleUpdateStatus(_item.id,_item.onlineSearchDetails.is_update_requested,_item.onlineSearchDetails.update_requested_on):""}
                                        
                                        </td>
                                        
                                        
                                        {(props.currentUserType=='SA' && _item.type=='FI') ?  
                                         <td>  
                                             { 
                                                (_item.status == 'IP' && _item.user.download_status=="1") ?
                                                

                                                <button onClick={() => props.modalShowHide(_item.id,_item.user_id)} className="ml-3 btn-edit-rouned"><FontAwesomeIcon icon={faFileInvoice} /></button>: ''
                                             }
                                            </td> 
                                        :""} 
                                          {(props.currentUserType=='SA' && _item.type=='ON') ?
                                       <td>
                                           {
                                            (_item.hasOwnProperty('onlineSearchDetails') && _item.onlineSearchDetails.draft_html!=null) ?
                                            <button title="Generate PDF" className="ml-3 btn-edit-rouned" onClick={() => props.generate_pdf(_item.id, _item.onlineSearchDetails.id)}> <FontAwesomeIcon icon={faFileInvoice} /> </button>:""
                                           }
                                            {
                                               (_item.order_link!=null) ? <button title="Send Mail" className="ml-3 btn-edit-rouned" onClick={() => props.send_mail(_item.id)}> <FontAwesomeIcon icon={faEnvelope} /> </button>:""
                                        
                                            }
                                            {
                                                (_item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined') ?<Link to={`/searchreport/edit/${_item.onlineSearchDetails.id}`} className="ml-3 btn-edit-rouned" target="_blank"><FontAwesomeIcon icon={faPencilAlt} /></Link>:""
                                            }
                                            {
                                                (_item.hasOwnProperty('financialDoc') && typeof _item.financialDoc.id !='undefined') ?<Link to={`/search/financial-info/${_item.id}`} className="ml-3 btn-edit-rouned" target="_blank"><FontAwesomeIcon icon={faEye} /></Link>:""
                                            }
                                            {
                                                (_item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined')?<button className="ml-3 btn-edit-rouned" onClick={(e) => props.ButtonClick(e,_item.onlineSearchDetails.id)}><FontAwesomeIcon icon={faPlus} /></button>:""
                                            }
                                            {
                                                (_item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined')?<input className="inp form-control browse_file" ref={props.fileInputRef} type="file" name="file_import"  accept=".xls, .xlsx" onChange={(e) => props.handleExcelfileChange(e)} hidden/>:""  
                                            }
                                   
                                        </td>
                                        :""} 
                                        {/* <td>{_item.company_contact}</td>
                                        <td>{_item.postal_code}</td> */}
                                        
                                        <td>{_item.contact_name}</td>
                                        <td>{_item.contact_email}</td>
                                        {/* <td>{_item.gst_vat_reg_number}</td> */}
                                        <td>
                                            {
                                                (_item.pi_link) ? <a href={_item.pi_link} target="_blank"><FontAwesomeIcon icon={faDownload} /></a> : "-"
                                            }
                                        </td>
                                       
                                        {/* <td>
                                            {
                                                (_item.order_link!=null && props.currentUserDownloadStatus=="1" && props.currentUserType!='SA') ? <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "-"
                                            }
                                        </td> */}
                                        
                                       
                                        
                                      
                                        
                                       
                                    </tr>
                                ))}
                                {props.searchDataList.length <= 0 && <tr><td colSpan="4" className="text-center">No Record Found</td></tr>}
                            </tbody>
                        </table>


                    </div>
                </div>
                    <div className="col-12 px-0 pagination-tbl-btm mt-2">
                        {(props.searchDataList.length > 0 && props.paginationPageCount > 0) ?
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
                    </div></> : <div className="text-center">No Record Found</div>
            }

            {
                props.showModal?
                <Modal show={props.showModal} className="searchModal" onHide={props.handleModalClose} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header closeButton>
                        <Modal.Title className='modelHeader'>Search Report Upload</Modal.Title>
                    </Modal.Header>
                    <form className="form-ui-wrapper mb-12" onSubmit={handleSubmit(props.formSubmitDataModal)}>
                           <input type="hidden" name="id"  ref={register({
                                                value: modalId,
                                                // pattern: {
                                                //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                //     message: "invalid email address"
                                                // }
                                            })}/>
                    <Modal.Body>
                       <div className="row">

                                <div className="form-group col-md-12 col-lg-12">
                                    <label><b>Upload a file</b><span className="asterisk">*</span></label>
                                    <div className="uploadDiv">
                                            <input className="form-control" type="file" name="search_result_upload" ref={register({
                                                required: "Required",                                                
                                            })}  accept=".pdf,application/pdf" onChange={props.onFileChange}/>
                                            <div style={{ width:'50px' }}>
                                                {props.url ? (
                                                    <div
                                                        style={{
                                                            // border: '1px solid rgba(0, 0, 0, 0.3)',
                                                            height: '100%',
                                                            marginTop:"10px",
                                                        }}
                                                    >
                                                         <Document width='50' height='50' file={props.url}  noData={<h4>Please select a file</h4>}>
                                                            <Page pageNumber={1} />
                                                        </Document>
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{
                                                            alignItems: 'center',
                                                            // border: '2px dashed rgba(0, 0, 0, .3)',
                                                            display: 'flex',
                                                            fontSize: '2rem',
                                                            height: '100%',
                                                            justifyContent: 'center',
                                                            width: '100%',
                                                            marginTop:"10px",
                                                        }}
                                                    >
                                                        <img src={pdfLogo} height='50' width='50' alt='pdflogo' />
                                                    </div>
                                                )}
                                            </div>
                                    </div>

                                {props.pdfError?<p className="error">Upload only pdf file</p>:''}  
                                {errors.search_result_upload && <p className="error">{errors.search_result_upload.message}</p>}
 
                                </div>

                                
                            </div>

                        


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={props.handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" className="btn btn-success" type="submit">
                            Upload
                        </Button>
                    </Modal.Footer>
                </form>
                </Modal>
                :""
            }
            



        </div>

    );

}
export default ListView;