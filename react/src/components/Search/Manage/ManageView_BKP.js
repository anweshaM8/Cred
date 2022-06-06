import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faSearch, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const ManageView = (props) => {

    const { register, handleSubmit, errors } = useForm();
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faSearch} pageTitle="Place Fresh Investigation" />
            <MetaTagsView title="Place Fresh Investigation" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">


                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Company Name<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="company_name" ref={register({
                                        required: "Required",
                                        pattern: {
                                            value: /^[a-zA-Z][a-zA-Z\s]*$/,
                                            message: "Name contains atleast one character without any space in the begining"
                                        }
                                    })} />
                                    {errors.company_name && <p className="error">{errors.company_name.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Company Address<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="company_address" ref={register({
                                        required: "Required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9][a-zA-Z0-9\s\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\>\=\?\@\[\]\{\}\\\\\^\_\`\~]*$/,
                                            message: "Alpabets/Numbers/special characters are allowed without any space in the begining"
                                        }
                                    })} />
                                    {errors.company_address && <p className="error">{errors.company_address.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Country<span className="asterisk">*</span></label>
                                    <Select  className="searchable-select" styles={{ position: 'relative', zIndex: '999' }} options={props.dataCountryList} isSearchable={true} onChange={props.handleChangeCountry} value={props.particularCountry} ref={register({
                                        required: "Required",
                                    })}/>
                                    {/* {props.particularCountryError!=''?<p className="error">{props.particularCountryError}</p>:""} */}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Company Contact</label>
                                    <input className="inp form-control" type="text" name="company_contact" ref={register(
                                        {
                                            pattern: {
                                                value: /^(\+\d{1,3}[- ]?)?\d{10}$/i,
                                                message: "invalid company contact"
                                            }
                                        }
                                    )} />
                                    {errors.company_contact && <p className="error">{errors.company_contact.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Postal Code</label>
                                    <input className="inp form-control" type="text" name="postal_code" ref={register()} />
                                    {errors.postal_code && <p className="error">{errors.postal_code.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Contact Email</label>


                                    <input className="inp form-control" type="email" name="contact_email" ref={register({
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "invalid email address"
                                        }
                                    })} />

                                    {errors.contact_email && <p className="error">{errors.contact_email.message}</p>}
                                </div>  
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Any other information such as GST/VAT/Registration Number</label>
                                    <input className="inp form-control" type="text" name="gst_vat_reg_number" ref={register({})} />
                                    {errors.gst_vat_reg_number && <p className="error">{errors.gst_vat_reg_number.message}</p>}

                                </div>  
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Upload PI</label>
                                    <input className="inp form-control" type="file" name="pi_link" ref={register({})}  accept="application/pdf,application/msword,
  application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/jpg, image/jpeg,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={props.onFileChange} />
                                    {errors.pi_link  && <p className="error">{errors.pi_link.message}</p>}
                                    {props.fileError?<p className="error">Please upload proper format</p>:''}

                                </div> 
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Your internal reference number</label>
                                    <input className="inp form-control" type="text" name="internal_reference_no" ref={register()} />
                                    {errors.internal_reference_no && <p className="error">{errors.internal_reference_no.message}</p>}

                                </div>
                                                           
                              
                                
                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                <Link className="ml-auto btn backBtn mr-4" to="/search"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
                                <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </div>

    );

}
export default ManageView;