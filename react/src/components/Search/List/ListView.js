import React, {useState} from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Pagination from "react-js-pagination";
import { Card,Button,Modal,Badge } from 'react-bootstrap';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import {   faDownload, faFileInvoice,faEnvelope, faSyncAlt, faPencilAlt, faBatteryHalf, faBatteryFull,faPlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

const ListView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            company_name: (props.search_company_input) ? props.search_company_input : "",
            company_address: (props.search_address_input) ? props.search_address_input : ""
        }
    });
    const [openAdvCompanySearch, setOpenAdvCompanySearch] = useState("false");
    const handelAdvSearchClick = () => {
        setOpenAdvCompanySearch(!openAdvCompanySearch);
    };
 

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Search Company" />
            <MetaTagsView title="Search Company" />
            <form className="form-ui-wrapper mb-4" onSubmit={handleSubmit(props.formSubmitData)}>
                <div className="row">

                    <div className="form-group col-md-4 col-lg-3">
                        <label>Company Name</label>
                        <input className="form-control" type="text" name="company_name" ref={register({})} />
                    </div>

                    <div className="form-group col-md-4 col-lg-3">
                        <label>Country</label>
                            <Select className="searchable-select" styles={{ position: 'relative', zIndex: '999' }} options={props.dataCountryList} isSearchable={true} onChange={props.handleChangeCountry} value={props.particularCountry}/>

                    </div>

                    <div className="form-group col-md-4 col-lg-3">
                        <label>Company Address</label>
                        <input className="form-control" type="text" name="company_address" ref={register({})} />
                    </div>
                </div>
                {
                    // (!openAdvCompanySearch) ? <div className='row'>

                    //     <div className="form-group col-md-4 col-lg-3">
                    //         <label>Registration number</label>
                    //         <input className="form-control" type="text" name="registration_number" ref={register({})} />
                    //     </div>
                    //     <div className="form-group col-md-4 col-lg-3">
                    //         <label>Address</label>
                    //         <input className="form-control" type="text" name="address" ref={register({})} />
                    //     </div>
                    //     <div className="form-group col-md-4 col-lg-3">
                    //         <label>City / Town</label>
                    //         <input className="form-control" type="text" name="city" ref={register({})} />
                    //     </div>
                    //     <div className="form-group col-md-4 col-lg-3">
                    //         <label>Postal code</label>
                    //         <input className="form-control" type="text" name="postal_code" ref={register({})} />
                    //     </div>
                    //     <div className="form-group col-md-4 col-lg-3">
                    //         <label>Type</label>
                    //         <select className="form-control" name="type" ref={register({})}>
                    //             <option value="">--Select Type--</option>
                    //             <option value="HO">HO</option>
                    //             <option value="Branch">Branch</option>
                    //         </select>
                    //     </div>
                    //     <div className="form-group col-md-4 col-lg-3">
                    //         <label>Status</label>
                    //         <select className="form-control" name="status" ref={register({})}>
                    //             <option value="">--Select Status--</option>
                    //             <option value="Active">Active</option>
                    //             <option value="Inactive">Inactive</option>
                    //         </select>
                    //     </div>
                    // </div> : ""
                }



                <div className='row'>
                    <div className="form-group col-md-auto col-12 align-self-end form-submit-btn">
                        {/* <div className='advSearch mb-2' onClick={evt => handelAdvSearchClick()}>Advance Search</div> */}
                        <button className="btn btn-success" type="submit" >Search <FontAwesomeIcon icon={faSearch} /></button>  &nbsp;
                       
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
               ((props.dataEntitiesByName && props.dataEntitiesByName.companies.length>0 )||(props.dataEntitiesByName && props.dataEntitiesByName.llps.length>0))?  

            <div class="onlinesearch_page_container">
                <div className="table-heading bg-white">
                     <div className="text-center">
                         <div className="mr-auto mb-2">Didn’t find what you were looking for? Leave an order for a fresh Investigation</div>


                         <Link to="/place-fresh-investigation" className="mt-2 text-center btn btn-success">Place Fresh Investigation
                             <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-upload" class="svg-inline--fa fa-file-upload fa-w-12 ml-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"></path></svg>
                         </Link>

                     </div>
                 </div>
                <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    
                                    <th>Company Name</th>
                                    <th>Company Type</th>
                                    <th>Company Number</th>
                                   
                                    <th>Status</th>
                                    
                                    
                                </tr>
                            </thead>
                            <tbody>
                            
                            {props.dataEntitiesByName.companies.length > 0 && props.dataEntitiesByName.companies.map((_item1, _index) => (   
                                <tr>
                                   <td><a class="company_name_anchor" style={props.linkStyle} onClick={(e)=>props.modalShowHide(1,_item1.cin,'cin')}>{_item1.legal_name}</a></td>
                                    <td>Company</td>
                                    <td>{_item1.cin}</td>
                                   
                                    <td>{_item1.status}</td>
                                    {/* <td><Button variant="primary" onClick={()=>props.modalShowHide(1,_item1.cin,'cin')}>Get Report</Button></td> */}
                                    
                                </tr>
                                ))}
                                
                                {props.dataEntitiesByName.llps.length > 0 && props.dataEntitiesByName.llps.map((_item2, _index) => (   
                                <tr>
                                   <td><a class="company_name_anchor" style={props.linkStyle} onClick={(e)=>props.modalShowHide(1,_item2.llpin,'llp')}>{_item2.legal_name}</a></td>
                                    <td>LLP</td>
                                    <td>{_item2.llpin}</td>
                                   
                                    <td>{_item2.status}</td>
                                    {/* <td><Button variant="primary" onClick={(e)=>props.modalShowHide(1,_item2.llpin,'llp')}>Get Report</Button> </td>*/}
                                   
                                </tr>
                                ))}
                            </tbody>
                        </table> 
                </div>
            </div>
                : ""
            }

            {
                (props.searchDataList && props.searchDataList.length > 0 && props.searchListShow==true) ? <><div className="table-wrapper">
                    <div className="table-heading bg-white">
                        <div className="d-flex align-items-center">
                            <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(props.searchDataList.length > 0) ? props.searchDataList.length : 0} items</span>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Company Name</th>
                                    <th>Order Link</th>
                                    <th>Internal Reference Number</th>
                                    {/* <th>Credit Score</th> */}
                                    <th>Contact Email</th>
                                    <th>Contact Name</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    {/* <th>View</th> */}
                                   {props.currentUserType=='SA'?<th>Action</th>:""} 
                                </tr>
                            </thead>
                            <tbody>
                                {props.searchDataList.length > 0 && props.searchDataList.map((_item, _index) => (

                                    <tr key={_index}>
                                        <td>{_item.id}</td>
                                        <td>{_item.company_name}</td>
                                        
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
                                        {/* <td>{_item.hasOwnProperty('onlineSearchDetails') && _item.onlineSearchDetails.hasOwnProperty('credit_score')?_item.onlineSearchDetails.credit_score:""}</td> */}
                                        <td>{_item.contact_email?_item.contact_email:""}</td> 
                                        <td>{_item.contact_name?_item.contact_name:""}</td> 
                                        <td>
                                            {
                                                (_item.status == 'IP') ? <Badge bg="warning " className='bdWarning'>Pending</Badge> : <Badge bg="success " className='bdSuccess'>Delivered</Badge>
                                            }
                                        </td>
                                        <td> {(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
                                       
                                        {/* <td>
                                            <Link to={`/search/view/${_item.id}`} className="ml-3 btn-edit-rouned">
                                                    <FontAwesomeIcon icon={faFileInvoice} />
                                            </Link>
                                            
                                           
                                        </td> */}
                                       
                                        {props.currentUserType=='SA' ?
                                        <td >
                                            {/* {
                                                
                                                (_item.onlineSearchDetails.draft_html!=null) ?  <Link to={`/searchreport/view/${_item.onlineSearchDetails.id}`} className="ml-3 btn-edit-rouned" target="_blank"><FontAwesomeIcon icon={faPencilAlt} /></Link> : ""
                                            } */}
                                            {
                                                //  <Link onClick={() => generate_pdf(_item.id,_item.onlineSearchDetails.id)} className="ml-3 btn-edit-rouned">
                                                //     <FontAwesomeIcon icon={faFileInvoice} />
                                                // </Link>
                                                (_item.onlineSearchDetails.draft_html!=null) ?<button title="Generate PDF" className="ml-3 btn-edit-rouned" onClick={() => props.generate_pdf(_item.id, _item.onlineSearchDetails.id)}> <FontAwesomeIcon icon={faFileInvoice} /> </button>:""
                                               
                                            }
                                             {
                                                //  <Link onClick={() => send_mail(_item.id)} className="ml-3 btn-edit-rouned">
                                                //     <FontAwesomeIcon icon={faEnvelope} />
                                                // </Link>
                                                (_item.order_link!=null) ? <button title="Send Mail" className="ml-3 btn-edit-rouned" onClick={() => props.send_mail(_item.id)}> <FontAwesomeIcon icon={faEnvelope} /> </button>:""
                                               
                                            }

                                            { _item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined'?<Link to={`/searchreport/edit/${_item.onlineSearchDetails.id}`} className="ml-3 btn-edit-rouned" target="_blank"><FontAwesomeIcon icon={faPencilAlt} /></Link>:""}

                                            {/* { _item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined'?<button className="ml-3 btn-edit-rouned" onClick={()=>props.fileInputRef.current.click()}><FontAwesomeIcon icon={faPlus} /></button>:""} */}
                                            { _item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined'?<button className="ml-3 btn-edit-rouned" onClick={(e) => props.ButtonClick(e,_item.onlineSearchDetails.id)}><FontAwesomeIcon icon={faPlus} /></button>:""} 
                                            { _item.hasOwnProperty('onlineSearchDetails') && typeof _item.onlineSearchDetails.id !='undefined'?<input className="inp form-control browse_file" ref={props.fileInputRef} type="file" name="file_import"  accept=".xls, .xlsx" onChange={(e) => props.handleExcelfileChange(e)} hidden/>:""}
                                        </td>
                                        :""} 
                                        

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
                    </div></> : <div className="text-center"></div>
            }

            {/* {
                props.showModal?
                <Modal show={props.showModal} className="searchModal" onHide={props.handleModalClose} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header closeButton>
                        <Modal.Title className='modelHeader'>Add Credit Score</Modal.Title>
                    </Modal.Header>
                    <form className="form-ui-wrapper mb-12" onSubmit={handleSubmit(props.formSubmitDataModal)}>
                           <input type="hidden" name="id"  ref={register({
                                                value: props.modalId,
                                                // pattern: {
                                                //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                //     message: "invalid email address"
                                                // }
                                            })}/>
                    <Modal.Body>
                       <div className="row">

                                <div className="form-group col-md-12 col-lg-12">
                                    <label><b>Credit Score</b><span className="asterisk">*</span></label>
                                    <div className="uploadDiv">
                                            <input className="form-control" type="number" name="credit_score" ref={register({
                                                required: "Required",                                                
                                            })}  />
                                        
                                    </div>

                                {errors.credit_score && <p className="error">{errors.credit_score.message}</p>}
 
                                </div>

                                
                            </div>

                        


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className="btn btn-success" type="submit">
                           Update
                        </Button>
                    </Modal.Footer>
                </form>
                </Modal>
                :""
            } */}

            {
                props.showModal?
                <Modal show={props.showModal} className="searchModal" onHide={props.handleModalClose} size="lg" aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header closeButton>
                        <Modal.Title className='modelHeader'>Get Report</Modal.Title>
                    </Modal.Header>
                    <form className="form-ui-wrapper mb-12" onSubmit={handleSubmit(props.onCompanySelect)}>
                           <input type="hidden" name="id"  ref={register({
                                                value: props.modalId
                                            })}/>
                         
                    <Modal.Body>
                       <div className="row">
                                  
                                <div className="form-group col-md-12 col-lg-12">
                               <div> 
                                <p>You will be charged for ordering this report. You will receive your report within one working day.</p>
                                <p>Would you like to proceed with the order?</p>

                                <p>If yes, please fill in your internal reference, if any</p>
                                </div>
                                    <div className="uploadDiv">
                                            <input className="form-control" type="text" name="internal_reference_no" ref={register({})}  />
                                        
                                    </div>

                                    {/* <div class="form-group col-md-12 col-lg-12">You will receive the report by 1 working day.It will be chargeable.Are you sure to proceed</div>         */}
 
                                </div>

                                
                            </div>

                        


                    </Modal.Body>
                    <Modal.Footer>
                    
                        <Button variant="primary" className="btn btn-success" type="submit">
                           Yes
                        </Button>
                        <Button variant="secondary" onClick={props.handleModalClose}>
                        No
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