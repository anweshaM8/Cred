import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faChevronLeft, faFileUpload,faUsers } from '@fortawesome/free-solid-svg-icons';

const ManageView = ({ formSubmitData, dataDetails, editDataList }) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            name: (editDataList.name) ? editDataList.name : "",
            short_code: (editDataList.short_code) ? editDataList.short_code : ""
        }
    });
    var permissionData = [];
    if (editDataList.permission_roles) {
        permissionData = editDataList.permission_roles.map((key, values) => editDataList.permission_roles[values].permission_id);

    }
    else {
        permissionData = [];
    }

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserCog} pageTitle="Manage Role" />
            <MetaTagsView title="Manage Role" />
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <div className="form-ui-wrapper white-panel">


                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="inner-container">
                                    <div className="f-20 section-title col pl-0">
                                        <div>
                                            <form className="form-style" onSubmit={handleSubmit(formSubmitData)}>

                                                <div className="form-group">
                                                    <label className="mb-1">Name<span>*</span></label>
                                                    <input  className="inp form-control" type="text" placeholder="Name" name="name" ref={register({
                                                        required: "Required"
                                                    })} />
                                                    {errors.name && <p className="error">{errors.name.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-1">Short Code<span>*</span></label>
                                                    <input  className="inp form-control" type="text" placeholder="Short Code" name="short_code" ref={register({
                                                        required: "Required"
                                                    })} />
                                                    {errors.short_code && <p className="error">{errors.short_code.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                        <label className="mb-1">Permission </label>
                                                        </div>
                                                        {dataDetails.length > 0 && dataDetails.map((item, index) => (
                                                            <div className="col-sm-4 mb-4 card_box" key={index}>
                                                                <div className="card">
                                                                    <div className="card-header">{item.name}</div>
                                                                    {item.permissions.length > 0 && item.permissions.map((_item, _index) => (
                                                                        <div className="card-body" key={_index}>
                                                                            <div className="livtBlock" >
                                                                                {(permissionData.indexOf(parseInt(_item.id)) >= 0) ?
                                                                                    <input id={`checkbox_${_item.id}`} type="checkbox" defaultChecked={true} name="input_permission" value={_item.id} ref={register({})} className='mangechkbox' />
                                                                                    :
                                                                                    <input id={`checkbox_${_item.id}`} type="checkbox" name="input_permission" value={_item.id} ref={register({})} className='mangechkbox' />
                                                                                }
                                                                                <label>{_item.display_name}</label>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                </div>
                                                            </div>
                                                        ))}


                                                    </div>
                                                </div>                                                
                                                <div className="form-group">
                                                    {/* <div className="row">
                                                        <div className="col-sm-6 col-md-6">
                                                            <Link to="/role" className="text-left"> Back</Link>
                                                        </div>
                                                        <div className="text-right col-sm-6 col-md-6">
                                                            <input className=" w-100 p-2 btn btn-success" type="submit" value="Submit" />

                                                        </div>
                                                    </div> */}
                                                    <div class="mt-4 d-flex align-items-center btn__back__to-hld">
                                                    {/* <Link to="/role" className="text-left"> Back</Link>
                                                    <input className=" w-100 p-2 btn btn-success" type="submit" value="Submit" /> */}

                                                    <Link className="ml-auto btn backBtn mr-4" to="/user"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
                                                    <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


        </div>

    );

}
export default ManageView;