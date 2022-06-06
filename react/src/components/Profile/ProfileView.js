import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import './ProfileStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faUser } from '@fortawesome/free-solid-svg-icons';

const ProfileView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            name: (props.dataDetails.userDetail) ? props.dataDetails.userDetail.name : "",
            user_name: (props.dataDetails) ? props.dataDetails.user_name : "",
            phone_number: (props.dataDetails.phone_number) ? props.dataDetails.phone_number : "",
            address: (props.dataDetails.userDetail) ? props.dataDetails.userDetail.address : "",
            phone_code: (props.dataDetails) ? props.dataDetails.phone_code : "",
            country_id: (props.dataDetails.userDetail) ? props.dataDetails.userDetail.country_id : "",
            state_id: (props.dataDetails.userDetail) ? props.dataDetails.userDetail.state_id : "",
            city_id: (props.dataDetails.userDetail) ? props.dataDetails.userDetail.city_id : "",
            zip_code: (props.dataDetails.userDetail) ? props.dataDetails.userDetail.zip_code : "",
            user_type: ((Object.keys(props.dataDetails).length) > 0) ? props.dataDetails.user_type : "",
            role_id: (props.dataDetails.role != undefined) ? props.dataDetails.role.role_id : "",
        }
    });
    return (
        <div className="list-details">
            <MetaTagsView title="My Profile" />
            <Breadcrumb pageTitleIcon={faUser} pageTitle="My Profile" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">

                        <form className="form-style"  onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Name<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="name" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.name && <p className="error">{errors.name.message}</p>}
                                    <input className="inp form-control" type="hidden" name="user_type" ref={register({
                                    })} />
                                    <input className="inp form-control" type="hidden" name="role_id" ref={register({
                                    })} />

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Email<span className="asterisk">*</span></label>
                                    <input className="inp form-control" readOnly={true} type="text" name="user_name" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.user_name && <p className="error">{errors.user_name.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <div className='row'>
                                        <div className='col-12 col-md-4'>
                                            <label className="mb-1">Code<span className="asterisk">*</span></label>

                                            <select name="phone_code" className='form-control' ref={register({
                                                required: "Required"
                                            })}>
                                                <option value=""></option>
                                                {props.phoneCodeList.length > 0 && props.phoneCodeList.map((_item, _index) => (
                                                    <option value={`+${_item.phonecode}`}>+{_item.phonecode}</option>
                                                ))}
                                            </select>
                                            {errors.phone_code && <p className="error">{errors.phone_code.message}</p>}
                                        </div>
                                        <div className='col-12 col-md-8'>
                                            <label className="mb-1">Phone Number<span className="asterisk">*</span></label>
                                            <input className="inp form-control" type="text" name="phone_number" ref={register({
                                                required: "Required"
                                            })} />
                                            {errors.phone_number && <p className="error">{errors.phone_number.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Country<span className="asterisk">*</span></label>
                                    <select name="country_id" onChange={(e) => { props.handleChange('country', e.target.value) }} className='form-control' ref={register({
                                        required: "Required"
                                    })}>
                                        <option value=""></option>
                                        {props.countryDataList.length > 0 && props.countryDataList.map((_item, _index) => (
                                            <option value={`${_item.id}`}>{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.country_id && <p className="error">{errors.country_id.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">State<span className="asterisk">*</span></label>
                                    <select name="state_id" onChange={(e) => { props.handleChange('state', e.target.value) }} className='form-control' ref={register({
                                        required: "Required"
                                    })}>
                                        <option value=""></option>
                                        {props.stateDataList.length > 0 && props.stateDataList.map((_item, _index) => (
                                            <option value={`${_item.id}`}>{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.state_id && <p className="error">{errors.state_id.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">City<span className="asterisk">*</span></label>
                                    <select name="city_id" className='form-control' ref={register({
                                        required: "Required"
                                    })}>
                                        <option value=""></option>
                                        {props.cityDataList.length > 0 && props.cityDataList.map((_item, _index) => (
                                            <option value={`${_item.id}`}>{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.city_id && <p className="error">{errors.city_id.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Address</label>
                                    <input className="inp form-control" type="text" name="address" ref={register({})} />
                                    {errors.address && <p className="error">{errors.address.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Zip Code</label>
                                    <input className="inp form-control" type="text" name="zip_code" ref={register({})} />
                                    {errors.zip_code && <p className="error">{errors.zip_code.message}</p>}

                                </div>


                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                <Link className="ml-auto btn backBtn mr-4" to="/dashboard"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
                                <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                            </div>


                        </form>



                    </div>
                </div>
            </div>


        </div>

    );

}
export default ProfileView;