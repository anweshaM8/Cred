import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import './ChangePasswordStyle.scss';
import { useForm } from "react-hook-form";

import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faFileUpload, faUnlock } from '@fortawesome/free-solid-svg-icons';
// import {  faFileUpload, faUnlock } from '@fortawesome/free-solid-svg-icons';

const ChangePasswordView = ({ formSubmitData, dataDetails, userUniqueId }) => {
    const { register, handleSubmit, errors, getValues } = useForm();
    return (

        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUnlock} pageTitle="Change Password" />
            <MetaTagsView title="Change Password" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">

                        <form className="form-style" onSubmit={handleSubmit(formSubmitData)}>
                            <div className="row">
                                {
                                    (!userUniqueId) ? <div className="form-group col-12 col-md-6">
                                        <label className="mb-1">Current Password<span className="asterisk">*</span></label>
                                        <input className="inp form-control" type="password" name="current_password" ref={register({
                                            required: "Required"
                                        })} />
                                        {errors.current_password && <p className="error">{errors.current_password.message}</p>}

                                    </div> : ""
                                }

                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">New Password<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="password" name="new_password" ref={register({
                                        required: "Required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must have at least 8 characters"
                                        },
                                        pattern: {
                                            value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                                            message: "Password must be one numberic one special character and numbers"
                                        }
                                    })} />
                                    {errors.new_password && <p className="error">{errors.new_password.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Confirm Password<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="password"  name="confirm_password" ref={register({
                                        required: "Required",
                                        validate: value =>
                                            value === getValues("new_password") || "The passwords do not match"
                                    })} />
                                    {errors.confirm_password && <p className="error">{errors.confirm_password.message}</p>}

                                </div>
                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                               
                                <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                            </div>
                        </form>



                    </div>
                </div>
            </div>


        </div>


    );

}
export default ChangePasswordView;