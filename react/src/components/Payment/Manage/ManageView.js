import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faLock } from '@fortawesome/free-solid-svg-icons';

const ManageView = (props) => {
    console.log(props.userAddressDataList.country_id,'props.userAddressDataList.country_id')
    
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            first_name : (props.userAddressDataList) ? props.userAddressDataList.first_name : "",
            last_name : (props.userAddressDataList) ? props.userAddressDataList.last_name : "",
            email : (props.userAddressDataList) ? props.userAddressDataList.email : "",
            phone_number : (props.userAddressDataList) ? props.userAddressDataList.phone_number : "",
            address : (props.userAddressDataList) ? props.userAddressDataList.address : "",
            state : (props.userAddressDataList) ? props.userAddressDataList.state : "",
            city : (props.userAddressDataList) ? props.userAddressDataList.city : "",
            zip_code : (props.userAddressDataList) ? props.userAddressDataList.zip_code : "",
        }
        
    });

    return (
        <div className="list-details">
            <Breadcrumb pageTitle="Payment" />
            <MetaTagsView title="Payment" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper ">

                        <div className='row'>
                            <div className='col-8'>
                                <div className='row'>
                                    <div className='white-panel'>
                                        <h1>Billing Information</h1>
                                        <p>We use this information to register products, secure your identity and calculate taxes and fees.</p>

                                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitdata)}>
                                            <div className="row">
                                                <div className="form-group col-12">
                                                    <label className="mb-1">Country<span className="asterisk">*</span></label>
                                                    <select className="form-control" defaultValue={(props.userAddressDataList.country_id) ? props.userAddressDataList.country_id : ""} name="country_id" ref={register({
                                                        required: "Required"
                                                    })}>
                                                        <option value="">--Select Country--</option>
                                                        {props.countryDataList.length > 0 && props.countryDataList.map((_item, _index) => (
                                                            <option value={_item.id} key={_index}>{_item.name}</option>
                                                        ))}

                                                    </select>
                                                    {errors.country_id && <p className="error">{errors.country_id.message}</p>}

                                                </div>
                                                <div className="form-group col-12 col-sm-6">
                                                    <label className="mb-1">First Name<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="first_name" ref={register({
                                                        required: "Required"
                                                    })} />
                                                    {errors.first_name && <p className="error">{errors.first_name.message}</p>}

                                                </div>
                                                <div className="form-group col-12 col-sm-6">
                                                    <label className="mb-1">Last Name<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="last_name" ref={register({ required: "Required" })} />
                                                    {errors.last_name && <p className="error">{errors.last_name.message}</p>}

                                                </div>
                                                <div className="form-group col-12 col-sm-6">
                                                    <label className="mb-1">Email<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="email" ref={register({ required: "Required" })} />
                                                    {errors.email && <p className="error">{errors.email.message}</p>}

                                                </div>
                                                <div className="form-group col-12 col-sm-6">
                                                    <label className="mb-1">Phone Number<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="phone_number" ref={register({ required: "Required" })} />
                                                    {errors.phone_number && <p className="error">{errors.phone_number.message}</p>}

                                                </div>
                                                <div className="form-group col-12">
                                                    <label className="mb-1">Address<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="address" ref={register({ required: "Required" })} />
                                                    {errors.address && <p className="error">{errors.address.message}</p>}

                                                </div>


                                                <div className="form-group col-12 col-md-6">
                                                    <label className="mb-1">State<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="state" ref={register({ required: "Required" })} />
                                                    {errors.state && <p className="error">{errors.state.message}</p>}

                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="mb-1">City<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="city" ref={register({ required: "Required" })} />
                                                    {errors.city && <p className="error">{errors.city.message}</p>}

                                                </div>
                                                <div className="form-group col-12 col-md-6">
                                                    <label className="mb-1">Postal Code<span className="asterisk">*</span></label>
                                                    <input className="inp form-control" type="text" name="zip_code" ref={register({ required: "Required" })} />
                                                    {errors.zip_code && <p className="error">{errors.zip_code.message}</p>}

                                                </div>

                                            </div>
                                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">

                                                <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='white-panel'>
                                        <div className='col-12'>
                                            <h1>Payment Method</h1>
                                            <div className='row'>
                                                <div className="col-12">
                                                   <Link to=""> Pay Now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className='col-4'>
                                <div className='white-panel row'>
                                    <h1>Order Summary</h1>
                                    <div className='col-12'>

                                        {props.orderInfo.itemDetail && <>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    {parseInt((props.orderInfo.itemDetail) ? 1 : 0) + parseInt(props.orderInfo.addAddonItem.length)} items
                                                </div>
                                            </div>
                                            <hr />
                                            <div className='row'>
                                                <div className='col-6'>
                                                    Sub Total :
                                                </div>
                                                <div className='col-6'>
                                                    {(parseFloat(props.orderInfo.totalAmt.payableAmt) + parseFloat(props.orderInfo.totalAmt.youSave)).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    You Save :
                                                </div>
                                                <div className='col-6'>
                                                    {parseFloat(props.orderInfo.totalAmt.youSave).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    Discount :
                                                </div>
                                                <div className='col-6'>
                                                    0.00
                                                </div>
                                            </div>
                                            <hr />
                                            <div className='row'>
                                                <div className='col-6'>
                                                    Total :
                                                </div>
                                                <div className='col-6'>
                                                    {parseFloat(props.orderInfo.totalAmt.payableAmt).toFixed(2)}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className='col-12 text-center'>
                                                <span>
                                                    <span>
                                                        <b>Nice!</b>
                                                        "You Saved {parseFloat(props.orderInfo.totalAmt.youSave).toFixed(2)} on your order"
                                                    </span>
                                                </span>
                                            </div>

                                        </>}
                                    </div>

                                </div>
                                <div className='row text-center mt-5'>
                                    <div className='col-12'>
                                        <FontAwesomeIcon icon={faLock} /> Secure Payment
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div >

    );

}
export default ManageView;