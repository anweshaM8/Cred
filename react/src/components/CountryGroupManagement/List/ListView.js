import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faSearch, faUserShield, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Pagination from "react-js-pagination";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { useForm } from "react-hook-form";
import Switch from "react-switch";
import Select from 'react-select'

const renderUserType = (type)=>{
    switch (type){
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
const ListView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            search: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.search : "",
            group_type: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.group_type : "",
            country_code: ((Object.keys(props.submitedData).length) > 0) ? props.submitedData.country_code : "",
        }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Country Group Management List" />
            <MetaTagsView title="Country Group Management List" />
            <form className="form-ui-wrapper mb-4" onSubmit={handleSubmit(props.formSubmitData)}>
                <div className="row">
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Search</label>
                        <input className="form-control" type="text" name="search" placeholder="Search By Name..." ref={register({})} />
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Group Type</label>
                        <select className="form-control" name="group_type" ref={register({})}>
                            <option value="">--Select Group Type--</option>
                            <option value="FI">Fresh Investigation</option>
                            <option value="ON">Online Investigation</option>

                        </select>
                    </div>
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Country</label>
                            <Select className="searchable-select" options={props.dataCountryList} isSearchable={true} onChange={props.handleChangeCountry} value={props.particularCountry}/>
                        {/* <select className="form-control" name="country_code" ref={register({})}>
                            <option value="">--Select Country--</option>
                            {props.dataCountryList.length > 0 && props.dataCountryList.map((_item, _index) => (
                                <option value={_item.id} key={_index}>{_item.name}</option>
                            ))}

                        </select> */}

                    </div>
                    {/* <div className="form-group col-md-4 col-lg-3">
                        <label>User Type</label>
                        <select className="form-control" name="user_type" ref={register({})}>
                            <option>--Select Type--</option>
                            {props.clientType.length > 0 && props.clientType.map((_item, _index) => (
                                <option value={_item.id} key={_index}>{_item.name}</option>
                            ))}
                        </select>
                    </div> */}
                   
                    {/* <div className="form-group col-md-4 col-lg-3">
                        <label>Status</label>
                        <select className="form-control" name="role_id" ref={register({})}>
                            <option>--Select Status--</option>
                            <option>Active</option>
                            <option>InActive</option>
                        </select>
                    </div> */}
                    <div className="form-group col-md-auto col-12 align-self-center form-submit-btn pt-4">
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
                            (props.addContentPermission) ? <Link to="/country-group-management/manage" className="btn btn-sm btn-success mr-3">Add <FontAwesomeIcon icon={faPlus} /></Link> : " "
                        }

                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Group Name</th>
                                <th>Group Type</th>
                                <th>Country</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.dataList.length > 0 && props.dataList.map((_item, _index) => (
                                <tr key={_index}>
                                    <td>{_item.id}</td>
                                    <td>{_item.group_name}</td>
                                    <td>{_item.group_type=="FI"?"Fresh Investigation":"Online Investigation"}</td>
                                    <td>{_item.country.name}</td>
                                    <td>
                                        {
                                            (props.editContentPermission) ? <><Link to={`/country-group-management/manage/${_item.id}`} className="ml-3 btn-edit-rouned">  <FontAwesomeIcon icon={faPencilAlt} title="Edit" /></Link></> : "-"
                                        }
                                    </td>
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