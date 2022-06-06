import React, { useContext,useState } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './MyProfileStyle.scss';
import { useForm } from "react-hook-form";
import { Card,Button,Modal,Badge } from 'react-bootstrap';
import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faUserShield } from '@fortawesome/free-solid-svg-icons';
import {   faDownload, faFileInvoice,faEnvelope, faSyncAlt, faPencilAlt, faBatteryHalf, faBatteryFull,faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { store } from '../../storage/store';
import Pagination from "react-js-pagination";
import { Tabs,Tab } from 'react-bootstrap';
import { Document, Page } from 'react-pdf';
import pdfLogo from '../../assets/images/pdf.png';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import Select from 'react-select';
import moment from 'moment';


const MyProfileView = (props) => {
	const { register, handleSubmit, errors } = useForm();
    const [openAdvCompanySearch, setOpenAdvCompanySearch] = useState("false");
    const handelAdvSearchClick = () => {
        setOpenAdvCompanySearch(!openAdvCompanySearch);
    };

	console.log('props.paginationDataON',props.paginationDataON,'props.paginationDataFI',props.paginationDataFI)

	return (
		<div className="list-details">
			<MetaTagsView title="My Profile" />
			<Breadcrumb pageTitleIcon={faEnvelopeOpenText} pageTitle="My Profile" />
			<div className="bank-name_list mb-5">
				<div className="row">
					<div className='col-md-12'>
						<div className='bank-name_block'>
							<h5 className='mb-3'>Personal Details</h5>
							<div className='bank-name_box'>
								<ul className='bank-name_ul'>
									<li>
										<div className='customer-details'>
											<h6 className='col'>Customer Id</h6>
											<p className='col'>{props.currentUser.unique_id}</p>
										</div>
									</li>
									<li>
										<div className='customer-details'>
											<h6 className='col'>Contact Name</h6>
											<p className='col'>{props.currentUser.userDetail.name}</p>
										</div>
									</li>
									<li>
										<div className='customer-details'>
											<h6 className='col'>Contact Telephone</h6>
											<p className='col'>{props.currentUser.phone_code+' '+props.currentUser.phone_number}</p>
										</div>	
									</li>
									<li>
										<div className='customer-details'>
											<h6 className='col'>Contact Email</h6>
											<p className='col'>{props.currentUser.user_name}</p>
										</div>	
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='order-tab'>
				<Tabs defaultActiveKey={props.curPageTab} id="uncontrolled-tab-example" className="mb-3" >
								<Tab eventKey="ON" title="Online Search" value="ON"  >
									<div className='order-tab_content'>
										<form className="form-ui-wrapper mb-4" >
											<input type="hidden" name='searchType' value='ON' />
											<div className="row">
												<div className="form-group col-md-4 col-lg-3">
													<label>Order Date Range</label>
													<DateRangePicker onEvent={props.handleDateCallbackON}
														initialSettings={{ startDate: ((Object.keys(props.submitedDataON).length) > 0) ? moment(props.submitedDataON.range_start_date).format('MM/DD/YYYY') :moment().subtract(1, 'months').format('MM/DD/YYYY'), 
														endDate: ((Object.keys(props.submitedDataON).length) > 0) ? moment(props.submitedDataON.range_end_date).format('MM/DD/YYYY') : moment().format('MM/DD/YYYY') }}
														// initialSettings={{ startDate: props.startDate, endDate:props.endDate }}
														>
															<input className="form-control" type="text" name="date_range" ref={register({})} />
													</DateRangePicker>
												</div>
												<div className="form-group col-md-4 col-lg-3">
													<label>Country</label>
													<Select  className="searchable-select" styles={{ position: 'relative', zIndex: '999' }} options={props.dataCountryList} isSearchable={true} onChange={props.handleChangeCountryON} value={props.particularCountryON} />
												</div>
												
												<div className="form-group col-md-4 col-lg-3">
													<label>Status</label>
														<select className='form-control' name="status" onChange={(e)=>props.onStatusChange(e,'ON')} value={props.statusON}>
															<option value="">--Select Status--</option>
															<option value="IP">Pending</option>
															<option value="C">Delivered</option>
													</select>
												</div>
												<div className="form-group col-md-4 col-lg-3">
													<label>Search Keyword</label>
													<input className="form-control" type="text" name="search_keyword" placeholder='Order No/Target Compny Name' onChange={(e)=>props.onSearchKeywordChange(e,'ON')} value={props.searchKeywordON} />
												</div>
											
											</div>
											<div class="row">
												<div class="form-group col-md-auto col-12 align-self-end form-submit-btn">
													<button class="btn btn-success" onClick={props.searchSubmit1} type="button">Search <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></button>  &nbsp;
													{
														(props.searchDataSetIdentifyON) ? <button onClick={()=>props.resetSearch('ON')} className="btn btn-success" type="submit" >Reset <FontAwesomeIcon icon={faSyncAlt} /></button> : ""
													}
													
												</div>
											</div>
										</form>
										{
                							(props.searchDataListForON && props.searchDataListForON.length > 0 ) ? 
												<div>
														<div className="table-heading bg-white">
															<div className="d-flex align-items-center">
																<span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {props.searchDataListForON.length} items</span>
															</div>
														</div>
														<div className="table-container">
															<table className="table">
																<thead>
																	<tr>
																		<th>Order Number</th>
																		<th>Company name</th>
																		<th>Country</th>
																		<th>Order Date</th>
																		<th>Report</th>
																		<th>Internal Reference Number,</th>
																		<th>Status</th>
																		{props.currentUserType=='HO'?<th>Search By</th>:""}
																		{props.currentUserType=='SA'?<th>Action</th>:""} 
																	</tr>
																</thead>
																<tbody>
																{props.searchDataListForON.length > 0 && props.searchDataListForON.map((_item, _index) =>{ 

																	return(
																	<tr key={_index}>
																		<td>{_item.id}</td>
																		<td>{_item.company_name}</td>
																		<td>{_item.hasOwnProperty('countrydet') && _item.countrydet!={} ?_item.countrydet.country_name:""}</td>
							
																		<td>{(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
																		
																		{
																			props.currentUserType=='SA'?
																			<td>                              
																			{ 
																				(_item.order_link!=null) ?  <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "File Not Available" 
																			}
																			</td>
																			:
																			<td>
																			{
																				(_item.order_link!=null && props.currentUserDownloadStatus=="1") ? <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "File Not Available"
																			}
																			</td>
																		}
																		<td>{_item.internal_reference_no}</td>
																		<td>{
																				(_item.status == 'IP') ?  <Badge bg="warning " className='bdWarning'>Pending</Badge> : <Badge bg="success " className='bdSuccess'>Delivered</Badge>
																			}
																		</td>
																		{props.currentUserType=='HO'?<td>{_item.userDetail.name}</td>:""}
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
																	   ) 
																	
																})}
																{props.searchDataListForON.length <= 0 && <tr><td colSpan="4" className="text-center">No Record Found</td></tr>}
																   
																</tbody>
															</table>


														</div>
								
														<div class="col-12 px-0 pagination-tbl-btm mt-2">
														{(props.searchDataListForON.length > 0 && props.paginationPageCountON > 0) ?
															<Pagination
																hideDisabled
																activePage={props.curPageON}
																itemsCountPerPage={parseInt(process.env.REACT_APP_PAGINATION_LIMIT)}
																totalItemsCount={props.paginationDataON.rowCount}
																pageRangeDisplayed={5}
																onChange={(e)=>props.handlePageChange(e,'ON')}
															/>
															:
															" "
														}
														</div>
												</div>
											:""
										}
									</div>		
								</Tab>
								<Tab eventKey="FI" title="Fresh Investigation" value="FI" >
									<div className='order-tab_content'>
									<form className="form-ui-wrapper mb-4"  onSubmit={handleSubmit(props.searchSubmit2)}>
									<input type="hidden" name='searchType' value='FI' />
											<div className="row">
												<div className="form-group col-md-4 col-lg-3">
													<label>Order Date Range</label>
													
													<DateRangePicker onEvent={props.handleDateCallbackFI}
														initialSettings={{ startDate: ((Object.keys(props.submitedDataFI).length) > 0) ? moment(props.submitedDataFI.range_start_date).format('MM/DD/YYYY') :moment().subtract(1, 'months').format('MM/DD/YYYY'), 
														endDate: ((Object.keys(props.submitedDataFI).length) > 0) ? moment(props.submitedDataFI.range_end_date).format('MM/DD/YYYY') : moment().format('MM/DD/YYYY') }}
														// initialSettings={{ startDate: props.startDate, endDate:props.endDate }}
														>
															<input className="form-control" type="text" name="date_range" ref={register({})} />
													</DateRangePicker>
												</div>
												<div className="form-group col-md-4 col-lg-3">
													<label>Country</label>
													<Select  className="searchable-select" styles={{ position: 'relative', zIndex: '999' }} options={props.dataCountryList} isSearchable={true} onChange={props.handleChangeCountryFI} value={props.particularCountryFI} />
												</div>
												
												<div className="form-group col-md-4 col-lg-3">
													<label>Status</label>
														<select className='form-control' name="status" onChange={(e)=>props.onStatusChange(e,'FI')} value={props.statusFI}>
															<option value="">--Select Status--</option>
															<option value="IP">Pending</option>
															<option value="C">Delivered</option>
													</select>
												</div>
												<div className="form-group col-md-4 col-lg-3">
													<label>Search Keyword</label>
													<input className="form-control" type="text" name="search_keyword" placeholder='Order No/Target Compny Name' onChange={(e)=>props.onSearchKeywordChange(e,'FI')} value={props.searchKeywordFI} />
												</div>
											
											</div>
											<div class="row">
												<div class="form-group col-md-auto col-12 align-self-end form-submit-btn">
													<button class="btn btn-success" type="submit">Search <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></button>  &nbsp;
													{
														(props.searchDataSetIdentifyFI) ? <button onClick={()=>props.resetSearch('FI')} className="btn btn-success" type="submit" >Reset <FontAwesomeIcon icon={faSyncAlt} /></button> : ""
													}
												</div>
											</div>
										</form>
										{
											(props.searchDataListForFI && props.searchDataListForFI.length > 0 ) ? 
												<div>
														<div className="table-heading bg-white">
															<div className="d-flex align-items-center">
																<span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {props.searchDataListForFI.length} items</span>
															</div>
														</div>
														<div className="table-container">
															<table className="table">
																<thead>
																	<tr>
																		<th>Order Number</th>
																		<th>Company name</th>
																		<th>Country</th>
																		<th>Order Date</th>
																		<th>Report</th>
																		<th>Internal Reference Number,</th>
																		<th>Status</th>
																		{props.currentUserType=='HO'?<th>Search By</th>:""}
																		{props.currentUserType=='SA'?<th>Action</th>:""} 
																	</tr>
																</thead>
																<tbody>
																{props.searchDataListForFI.length > 0 && props.searchDataListForFI.map((_item, _index) => (
																	<tr key={_index}>
																		<td>{_item.id}</td>
																		<td>{_item.company_name}</td>
																		<td>{_item.hasOwnProperty('countrydet') && _item.countrydet!={} ?_item.countrydet.country_name:""}</td>
							
																		<td>{(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
																		
																		{
																			props.currentUserType=='SA'?
																			<td>                              
																			{ 
																				(_item.order_link!=null) ?  <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "File Not Available" 
																			}
																			</td>
																			:
																			<td>
																			{
																				(_item.order_link!=null && props.currentUserDownloadStatus=="1") ? <a href={_item.order_link} target="_blank" onClick={()=>props.onOrderLink(_item.id,_item.user_id,_item.order_link)}><FontAwesomeIcon icon={faDownload} /></a> : "File Not Available"
																			}
																			</td>
																		}
																		<td>{_item.internal_reference_no}</td>
																		<td>{
																				(_item.status == 'IP') ? <Badge bg="warning " className='bdWarning'>Pending</Badge> : <Badge bg="success " className='bdSuccess'>Delivered</Badge>
																			}
																		</td>
																		{props.currentUserType=='HO'?<td>{_item.userDetail.name}</td>:""}
																		 {props.currentUserType=='SA'  && _item.user.download_status=="1"?
																			<td>
																				{
																					(_item.status == 'IP') ?
																					//  <Link onClick={() => props.modalShowHide(_item.id,_item.user_id)} className="ml-3 btn-edit-rouned">
																					//     <FontAwesomeIcon icon={faFileInvoice} />
																					// </Link> : ''

																					<button onClick={() => props.modalShowHide(_item.id,_item.user_id)} className="ml-3 btn-edit-rouned"><FontAwesomeIcon icon={faFileInvoice} /></button>: ''
																				}
																				

																			</td>
																		:<td></td>} 
																		
																		
																	</tr>
																	))}
																							{props.searchDataListForFI.length <= 0 && <tr><td colSpan="4" className="text-center">No Record Found</td></tr>}
																							
																							</tbody>
																						</table>


																					</div>

																					<div class="col-12 px-0 pagination-tbl-btm mt-2">
																					{(props.searchDataListForFI.length > 0 && props.paginationPageCountFI > 0) ?
																						<Pagination
																							hideDisabled
																							activePage={props.curPageFI}
																							itemsCountPerPage={parseInt(process.env.REACT_APP_PAGINATION_LIMIT)}
																							totalItemsCount={props.paginationDataFI.rowCount}
																							pageRangeDisplayed={5}
																							onChange={(e)=>props.handlePageChange(e,'FI')}
																						/>
																						:
																						" "
																					}
																					</div>
																			</div>
																		:""
																}	
																				
																</div>
															</Tab>
														</Tabs>
													</div>

													{
															props.showModal?
															<Modal show={props.showModal} className="searchModal" onHide={props.handleModalClose} size="lg" aria-labelledby="contained-modal-title-vcenter"
															centered>
																<Modal.Header closeButton>
																	<Modal.Title className='modelHeader'>Search Report Upload</Modal.Title>
																</Modal.Header>
																<form className="form-ui-wrapper mb-12" onSubmit={handleSubmit(props.formSubmitDataModal)}>
																	{/* <input type="hidden" name="id"  ref={register({
																							value: modalId,
																							// pattern: {
																							//     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
																							//     message: "invalid email address"
																							// }
																						})}/> */}
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
export default MyProfileView;