import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faSearch, faUserShield, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { refreshIcon } from '../../Common/svgIconList';

import Pagination from "react-js-pagination";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { useForm } from "react-hook-form";
import Switch from "react-switch";



const renderUserType = (type) => {
    switch (type) {
        case 'A':
            return 'Agent';
            break;
        case 'Sub':
            return 'Sub Admin';
            break;
        case 'I':
            return 'Individual User';
            break;
        case 'HO':
            return 'Head Office';
            break;
        case 'BO':
            return 'Branch Office';
            break;
        default:
            console.log('sss');
    }
}
const renderUserRegistrationType = (type) => {
    switch (type) {
        case 'SR':
            return 'Self registered';
            break;
        case 'AR':
            return 'Admin registered';
            break;
        default:
            console.log('sss');
    }
}
const ListView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {   
            search: (props.searchData != undefined) ? props.searchData.search : "",
            registration_type: (props.searchData != undefined) ? props.searchData.registration_type : "",
            customer_type: (props.searchData != undefined) ? props.searchData.customer_type : "",
            status: (props.searchData != undefined) ? props.searchData.status : ""
        }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle={props.heading} />
            <MetaTagsView title={props.heading} />
            <form className="form-ui-wrapper mb-4" onSubmit={handleSubmit(props.searchFormSubmitData)}>
                <div className="row">
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Search</label>
                        <input className="form-control" type="text" name="search" placeholder="Search By Registration number, Bank Name, Customer User Name,Email,Phone Number..." ref={register({})} />
                    </div>
                    {props.contentPermission  ? <><div className="form-group col-md-4 col-lg-3">
                        <label>Registration Type</label>
                        <select className="form-control" name="registration_type" ref={register({})}>
                            <option value="">--Select Type--</option>
                            <option value="AR">Admin Resistered</option>
                            <option value="SR">Self Resistered</option>
                        </select>
                    </div>

                        <div className="form-group col-md-4 col-lg-3">
                            <label>User Type</label>
                            <select className="form-control" name="customer_type" ref={register({})}>
                                <option value="">--User Type--</option>
                                {props.clientType.length > 0 && props.clientType.map((_item, _index) => (
                                    <option value={_item.id} key={_index}>{_item.name}</option>
                                ))}
                            </select>
                        </div>

                        </>
                        : ""
                    }
                    <div className="form-group col-md-4 col-lg-3">
                            <label>Status</label>
                            <select className="form-control" name="status" ref={register({})}>
                                <option value="">--Select Status--</option>
                                <option value="1">Active</option>
                                <option value="0">InActive</option>
                            </select>
                        </div>
                    <div className="form-group col-md-auto col-12 align-self-end form-submit-btn mb-23">
                        <button className="btn btn-success" type="submit" >Search <FontAwesomeIcon icon={faSearch} /></button>  &nbsp;
                        {
                            (props.searchDataSetIdentify) ? <button onClick={props.resetSearch} className="btn btn-success" type="submit" >Reset <FontAwesomeIcon icon={faSyncAlt} /></button>  /*<span className="refreshIconHldr" onClick={props.resetSearch}>{refreshIcon} </span>*/ : ""
                        }
                    </div>
                </div>
            </form>


            <div className="table-wrapper">
                <div className="table-heading bg-white">
                    <div className="d-flex align-items-center">
                        <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(props.dataList.length > 0) ? props.paginationData.rowCount : 0} items</span>
                        {
                            (props.addContentPermission) ? <Link to="/user/manage" className="btn btn-sm btn-success mr-3">Add <FontAwesomeIcon icon={faPlus} /></Link> : " "
                        }

                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                {
                                    props.currentUserType=="SA"?<th>Status</th>:""
                                }
                                {
                                    props.currentUserType=="SA"?<th>Disable Download</th>:""
                                }                               
                                <th>Registration number</th>
                                <th>Bank Name</th>
                                <th>Customer User Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Registration Type</th>
                                <th>Customer Type</th>
                                <th>Created At</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {props.dataList.length > 0 && props.dataList.map((_item, _index) => (
                                <tr key={_index}>
                                    <td>
                                        {
                                            (props.editContentPermission) ? <><Link to={`/user/manage/${_item.id}`} className="ml-3 btn-edit-rouned">  <FontAwesomeIcon icon={faPencilAlt} title="Edit" /></Link></> : "-"
                                        }
                                    </td>
                                    {
                                        props.currentUserType=="SA"?
                                        <td>
                                        {

                                            (_item.is_active == 1) ? <Switch onColor="#27ae60" checked={true} height={22} width={44} onChange={(e) => props.activeStatusChangeHandler(_item.id, 0)} /> : <Switch offColor="#95a5a6" height={22} width={44} checked={false} onChange={(e) => props.activeStatusChangeHandler(_item.id, 1)} />

                                        }
                                        </td>:""
                                    }
                                    
                                    {
                                        props.currentUserType=="SA"?
                                        <td>
                                        {

                                            (_item.download_status == 0) ? <Switch onColor="#27ae60" checked={true} height={22} width={44} onChange={(e) => props.activeDownloadStatusChangeHandler(_item.id, '1')} /> : <Switch offColor="#95a5a6" height={22} width={44} checked={false} onChange={(e) => props.activeDownloadStatusChangeHandler(_item.id, '0')} />

                                        }
                                        </td>:""

                                    }
                                    <td>{_item.unique_id}</td>
                                    <td>{(_item.headOfficeUser) ? _item.headOfficeUser.userDetail.name : "-"}</td>
                                    <td>{_item.userDetail.name}</td>
                                    <td>{_item.user_name}</td>
                                    <td>{_item.phone_code}{_item.phone_number}</td>
                                    <td>{renderUserRegistrationType(_item.registration_type)}</td>
                                    <td>{renderUserType(_item.user_type)}</td>
                                    <td> {(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
                                   
                                    

                                </tr>
                            ))}
                            {props.dataList.length === 0 && <tr><td colSpan="10" className="text-center">No Record Found</td></tr>}
                        </tbody>

                    </table>
                </div>

            </div>
            <div className="col-12 px-0 pagination-tbl-btm mt-2">
                {(props.dataList.length > 0 && props.paginationPageCount > 0) ?
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