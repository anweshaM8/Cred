import React from 'react';
import './SetPasswordStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import logo from '../../assets/images/logo.png';

const SetPasswordView = ({ formSubmitData }) => {

    const { register, handleSubmit, errors, getValues } = useForm({})


    return (
        <div className="login py-4">
            <MetaTagsView title="Set Password" />
            <div className="login-page">
                <div className="container App">
                    <div className="row align-items-center">
                        <div className="col-md-7 login-logo">
                            <img
                                alt="interlinkages"
                                src={logo}
                            />
                        </div>
                        <div className="d-flex login-form bg-white p-5 col-md-5 m-auto flex-column">
                            <h3 className="f-24 pb-2">Set Password</h3>
                            <form className="form-style" onSubmit={handleSubmit(formSubmitData)}>

                                <div className="form-group">
                                    <label className="mb-1">Current Password<span>*</span></label>
                                    <input className="inp form-control" type="password" placeholder="Current Password" name="current_password" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.current_password && <p className="error">{errors.current_password.message}</p>}

                                </div>
                                <div className="form-group">
                                    <label className="mb-1">New Password<span>*</span></label>
                                    <input className="inp form-control" type="password" placeholder="New Password" name="new_password" ref={register({
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
                                <div className="form-group">
                                    <label className="mb-1">Confirm Password<span>*</span></label>
                                    <input className="inp form-control" type="password" placeholder="Confirm Password" name="confirm_password" ref={register({
                                        required: "Required",
                                        validate: value =>
                                            value === getValues("new_password") || "The passwords do not match"
                                    })} />
                                    {errors.confirm_password && <p className="error">{errors.confirm_password.message}</p>}

                                </div>

                                <div className="form-group">
                                    <div className="row">

                                        <div className="text-right col-sm-12 col-md-12">
                                            <input className=" w-100 p-2 btn btn-success" type="submit" value="Submit" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );

}
export default SetPasswordView;