import React from 'react';
import './ForgetPasswordStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';

import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/logo.png';


const ForgetPasswordView = ({ formSubmitData }) => {
    const { register, handleSubmit, errors, getValues } = useForm();
    return (

        <div className="login py-4">
            <MetaTagsView title="Forget Password" />

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
                                <div className="row">
                                    <div className="form-group col-12 col-md-12">
                                        <label className="mb-1">User Email<span className="asterisk">*</span></label>
                                        <input className="inp form-control" type="email" name="user_name" ref={register({
                                             required: "Required",
                                             pattern: {
                                                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                 message: "invalid email address"
                                             }
                                        })} />
                                        {errors.user_name && <p className="error">{errors.user_name.message}</p>}

                                    </div>

                                </div>
                                <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                    <Link className="ml-auto btn backBtn mr-4" to="/user"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
                                    <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </div>


    );

}
export default ForgetPasswordView;