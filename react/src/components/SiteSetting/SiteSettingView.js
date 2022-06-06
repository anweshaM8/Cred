import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import './SiteSettingStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faCogs } from '@fortawesome/free-solid-svg-icons';

const SiteSettingView = ({ formSubmitData, dataDetails, countryDataList }) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            website_name: (dataDetails.length > 0) ? dataDetails[0].value : "",
            contact_mail: (dataDetails.length > 0) ? dataDetails[1].value : "",
            phone_number: (dataDetails.length > 0) ? dataDetails[2].value : "",
            address: (dataDetails.length > 0) ? dataDetails[3].value : "",
            contact_person: (dataDetails.length > 0) ? dataDetails[4].value : "",
            country_code: (dataDetails.length > 0) ? dataDetails[5].value : "",
            city: (dataDetails.length > 0) ? dataDetails[6].value : "",
            state: (dataDetails.length > 0) ? dataDetails[7].value : "",
            country: (dataDetails.length > 0) ? dataDetails[8].value : "",
            postal_code: (dataDetails.length > 0) ? dataDetails[9].value : "",

        }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faCogs} pageTitle="Site Setting" />
            <MetaTagsView title="Site Setting" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(formSubmitData)}>
                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Website Name<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="website_name" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.website_name && <p className="error">{errors.website_name.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Country Code<span className="asterisk">*</span></label>
                                    <select name="country_code" className='form-control' ref={register({
                                        required: "Required"
                                    })}>
                                        <option value=""></option>
                                        {countryDataList.length > 0 && countryDataList.map((_item, _index) => (
                                            <option value={`+${_item.phonecode}`}>+{_item.phonecode}</option>
                                        ))}
                                    </select>
                                    {errors.country_code && <p className="error">{errors.country_code.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Phone Number<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="phone_number" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.phone_number && <p className="error">{errors.phone_number.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Contact Person<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="contact_person" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.contact_person && <p className="error">{errors.contact_person.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Address<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="address" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.address && <p className="error">{errors.address.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Contact Mail<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="contact_mail" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.contact_mail && <p className="error">{errors.contact_mail.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Country<span className="asterisk">*</span></label>

                                    <select name="country" className='form-control' ref={register({
                                        required: "Required"
                                    })}>
                                        <option value=""></option>
                                        {countryDataList.length > 0 && countryDataList.map((_item, _index) => (
                                            <option value={`${_item.name}`}>{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.country && <p className="error">{errors.country.message}</p>}

                                    
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">State<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="state" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.state && <p className="error">{errors.state.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">City<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="city" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.city && <p className="error">{errors.city.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Pin Code<span className="asterisk">*</span></label>
                                    <input className="form-control" type="text" name="postal_code" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.postal_code && <p className="error">{errors.postal_code.message}</p>}
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
export default SiteSettingView;