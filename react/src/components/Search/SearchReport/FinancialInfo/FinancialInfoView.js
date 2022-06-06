import React, {useState} from 'react';
import Breadcrumb from '../../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Pagination from "react-js-pagination";
import { Card,Button,Modal,Badge } from 'react-bootstrap';
import './FinancialInfoStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { MetaTagsView } from '../../../Common/meta-tags/MetaTagsView';
import {   faDownload, faFileInvoice,faEnvelope, faSyncAlt, faPencilAlt, faBatteryHalf, faBatteryFull,faPlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const FinancialInfoView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        // defaultValues: {
        //     company_name: (props.search_company_input) ? props.search_company_input : "",
        //     company_address: (props.search_address_input) ? props.search_address_input : ""
        // }
    });
   
 

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Financial Informations" />
            <MetaTagsView title="Financial Informations" />
            {/* <form className="form-ui-wrapper mb-4" onSubmit={handleSubmit(props.formSubmitData)}>
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
                        {/* <button className="btn btn-success" type="submit" >Search <FontAwesomeIcon icon={faSearch} /></button>  &nbsp;
                       
                    </div>
                </div>
            </form> */} 


           

            
            {
                props.searchFinancialDataList.length>0 ? <><div className="table-wrapper">
                    <div className="table-heading bg-white">
                        <div className="d-flex align-items-center">
                            <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(props.searchFinancialDataList.length > 0) ? props.searchFinancialDataList.length : 0} items</span>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>CIN or LLPIN</th>
                                    <th>Type</th>
                                    <th>Doc Id</th>
                                    <th>Doc Type</th>
                                    <th>Financial Year</th>
                                    <th>File</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.searchFinancialDataList.length > 0 && props.searchFinancialDataList.map((_item, _index) => (

                                    <tr key={_index}>
                                        <td>{_item.id}</td>
                                        <td>{_item.cin_or_llp_id}</td>
                                        <td>{_item.company_type}</td>
                                        <td>{_item.doc_id	}</td>
                                        <td>{_item.doc_type}</td>
                                        <td>{new Date(_item.financial_year).getFullYear()}</td>
                                        <td>                              
                                        { 
                                            (_item.file_link!=null) ?  <a href={_item.file_link} target="_blank" ><FontAwesomeIcon icon={faDownload} /></a> : "-" 
                                        }
                                        </td>
                                        <td> {(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
                                     

                                    </tr>
                                ))}
                                {props.searchFinancialDataList.length <= 0 && <tr><td colSpan="4" className="text-center">No Record Found</td></tr>}
                            </tbody>
                        </table>


                    </div>
                </div>
                    <div className="col-12 px-0 pagination-tbl-btm mt-2">
                        {(props.searchFinancialDataList.length > 0 && props.paginationPageCount > 0) ?
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


        </div>

    );

}
export default FinancialInfoView;