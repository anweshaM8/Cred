import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faSearch, faUserTag, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { useForm } from "react-hook-form";


const ListView = ({ dataList, addContentPermission, editContentPermission,submitedData ,formSubmitData,searchDataSetIdentify, resetSearch}) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            search: ((Object.keys(submitedData).length) > 0) ? submitedData.search : "",
            }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserTag} pageTitle="Role List" />
            <MetaTagsView title="Role List" />
            <form className="form-ui-wrapper mb-4" onSubmit={handleSubmit(formSubmitData)}>
                <div className="row">
                    <div className="form-group col-md-4 col-lg-3">
                        <label>Search</label>
                        <input className="form-control" type="text" name="search" placeholder="Search By Name..." ref={register({})} />
                    </div>                    
                   
                    <div className="form-group col-md-auto col-12 align-self-end form-submit-btn mb-23">
                    <button className="btn btn-success" type="submit" >Search <FontAwesomeIcon icon={faSearch} /></button>  &nbsp;
                        {
                            (searchDataSetIdentify) ? <button onClick={resetSearch} className="btn btn-success" type="submit" >Reset <FontAwesomeIcon icon={faSyncAlt} /></button>  /*<span className="refreshIconHldr" onClick={resetSearch}>{refreshIcon} </span>*/ : ""
                        }
                    </div>
                </div>
            </form>
            
            <div className="table-wrapper">
                <div className="table-heading bg-white">
                    <div className="d-flex align-items-center">
                        <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(dataList.length > 0) ? dataList.length : 0} items</span>
                        {(addContentPermission) ? <Link to="/role/manage" className="btn btn-sm btn-success mr-3"><FontAwesomeIcon icon={faPlus} />Add</Link> : " "}

                    </div>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Short Code</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.length > 0 && dataList.map((_item, _index) => (

                                <tr key={_index}>
                                    <td>{_item.id}</td>
                                    <td>{_item.name}</td>
                                    <td>{_item.short_code}</td>
                                    <td> {(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>
                                    <td>
                                        {
                                            (editContentPermission) ? <Link to={`/role/manage/${_item.id}`} className="btn-edit-rouned">  <FontAwesomeIcon icon={faPencilAlt} /></Link> : "-"
                                        }

                                    </td>
                                </tr>
                            ))}
                            {dataList.length == 0 && <tr><td colSpan="4" className="text-center">No Record Found</td></tr>}
                        </tbody>
                    </table>


                </div>
            </div>


        </div>

    );

}
export default ListView;