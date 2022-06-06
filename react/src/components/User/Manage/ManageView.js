import React, { useState } from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faUsers } from '@fortawesome/free-solid-svg-icons';


const ManageView = (props) => {
    const [defaultUserType, setDefaultUserType] = useState("");
    const [isActiveCustomerBankName, setIsActiveCustomerBankName] = useState(false);
    const getRole = (id) => {
        console.log('role id--->',id)
        if (id == 'BO') {
            setIsActiveCustomerBankName(true)
            props.handleChange('userType', id);
           

        }
        else {
            setIsActiveCustomerBankName(false);
            props.handleChange('notBOuserType', id);
        }
        setDefaultUserType(id);

        // switch (id) {
        //     case '3':
        //         setDefaultUserType('Sub');
        //         break;
        //     case '2':
        //         setDefaultUserType('A');
        //         break;
        //     case '1':
        //         setDefaultUserType('');
        //     default:
        //         setDefaultUserType('')
        // }

      

        let roleDetails = props.dataDetails.filter(each => each.short_code == id);
        if(roleDetails.length>0)
        {
            props.setroleIDInComp(roleDetails[0].id);
        }
        
    }

    const getUserType = (value) => {
        if (value == 'BO') {
            props.handleChange('userType', value);
            setIsActiveCustomerBankName(true)

        }
        else {
            setIsActiveCustomerBankName(false);
        }
        setDefaultUserType(value);
    }
console.log(typeof props.editDataList.head_office_user_id ,'props.editDataList.headOfficeUser.userDetail.head_office_user_id')
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            //role_id: props.defaultUserTypeTitle!=""?props.defaultUserTypeTitle:"",
            name: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.userDetail.name : "",
            branch_office_code: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.branch_office_code : "",
            user_type:  props.defaultUserTypeTitle!=""?props.defaultUserTypeTitle:"",
            user_name: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.user_name : "",
            phone_number: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.phone_number : "",
            phone_code: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.phone_code : "",
            country_id: props.currentCountry!=null?props.currentCountry.toString():"",
            city_id: props.currentCity!=null?props.currentCity.toString():"",
            state_id: props.currentState!=null?props.currentState.toString():"",
            address: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.userDetail.address : "",
            zip_code: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.userDetail.zip_code : "",
            head_office_user_id: ((Object.keys(props.editDataList).length) > 0) ? parseInt(props.editDataList.head_office_user_id) : ""

        }
    });

    console.log('props to page',props,'errors',errors,'isActiveCustomerBankName',isActiveCustomerBankName,'defaultUserTypeTitle',props.defaultUserTypeTitle)

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUsers} pageTitle="Manage User" />
            <MetaTagsView title="Manage User" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Role<span className="asterisk">*</span></label>
                                    <select className="form-control"  onChange={(e) => { getRole(e.target.value) }} name="user_type" ref={register({ required: "Required" })} disabled={((Object.keys(props.editDataList).length) > 0) ? true:false}
                                    value={props.defaultUserTypeTitle!=""?props.defaultUserTypeTitle:""}>
                                        <option value="">--Select Role--</option>
                                        {props.dataDetails.length > 0 && props.dataDetails.map((_item, _index) => (
                                            <option value={_item.short_code} key={_index}>{_item.name}</option>
                                        ))}

                                    </select>
                                    {errors.user_type && <p className="error">{errors.user_type.message}</p>}
                                </div>
                                {/* <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Type<span className="asterisk">*</span></label>
                                    <select className="form-control" onChange={(e) => { getUserType(e.target.value) }} value={(defaultUserType) ? defaultUserType : (props.editDataList.user_type) ? props.editDataList.user_type : ""} name="user_type" ref={register({
                                        required: "Required"
                                    })}>
                                        <option value="">--Select Type--</option>
                                        {props.clientType.length > 0 && props.clientType.map((_item, _index) => (
                                            <option value={_item.id} key={_index}>{_item.name}</option>
                                        ))}

                                    </select>
                                    {errors.user_type && <p className="error">{errors.user_type.message}</p>}

                                </div> */}

                                {
                                    (props.hoUserDataist.length>0 || props.editDataList.user_type == 'BO') ? <div className="form-group col-12 col-md-6">
                                        <label className="mb-1">Customer Bank name<span className="asterisk">*</span></label>
                                        <select className="form-control"  name="head_office_user_id" ref={register({
                                            required: "Required"
                                        })} value={parseInt(props.currentCustomerName)} onChange={(e) => { props.setttingCurrentCustomerName(e.target.value) }}>
                                            <option value="">--Select--</option>
                                            {props.hoUserDataist.length > 0 && props.hoUserDataist.map((_item, _index) => (
                                                <option value={_item.id} key={_index}>{_item.userDetail.name}</option>
                                            ))}

                                        </select>

                                        {errors.head_office_user_id && <p className="error">{errors.head_office_user_id.message}</p>}

                                    </div> : ""
                                }
                                {
                                    (props.hoUserDataist.length>0 || props.editDataList.user_type == 'BO') ?
                                    <div className="form-group col-12 col-md-4">
                                        <label className="mb-1">Branch Code<span className="asterisk">*</span></label>
                                        <input className="inp form-control" type="text" name="branch_office_code" ref={register({
                                            required: "Required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9_.-]*$/,
                                                message: "Alpabets/Numbers/Underscore/Dot/Dash are allowed without any space "
                                            }
                                        })} value={props.currentUserListValues.branch_office_code} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                        {errors.branch_office_code && <p className="error">{errors.branch_office_code.message}</p>}

                                    </div>:""}
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Name<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="name" ref={register({
                                        required: "Required",
                                        pattern: {
                                            value: /^[a-zA-Z][a-zA-Z\s]*$/,
                                            message: "Name contains atleast one character without any number and any space in the begining"
                                        }
                                    })} value={props.currentUserListValues.name} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                    {errors.name && <p className="error">{errors.name.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Email<span className="asterisk">*</span></label>


                                    {
                                        (Object.keys(props.editDataList).length > 0)
                                            ?
                                            <input className="inp form-control" readOnly={true} type="email" name="user_name" ref={register({
                                                required: "Required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "invalid email address"
                                                }
                                            })} value={props.currentUserListValues.user_name} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                            : <input className="inp form-control" type="email" name="user_name" ref={register({
                                                required: "Required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "invalid email address"
                                                }
                                            })} value={props.currentUserListValues.user_name} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                    }


                                    {errors.user_name && <p className="error">{errors.user_name.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <div className='row'>
                                        <div className='col-12 col-md-4'>
                                            <label className="mb-1">Code<span className="asterisk">*</span></label>

                                            <select name="phone_code" className='form-control' ref={register({
                                                required: "Required" 
                                            })} value={props.currentUserListValues.phone_code} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} >
                                                <option value=""></option>
                                                {props.phoneCodeList.length > 0 && props.phoneCodeList.map((_item, _index) => (
                                                    <option value={`+${_item.phonecode}`}>+{_item.phonecode}</option>
                                                ))}
                                            </select>
                                            {errors.phone_code && <p className="error">{errors.phone_code.message}</p>}
                                        </div>
                                        <div className='col-12 col-md-8'>
                                            <label className="mb-1">Phone Number<span className="asterisk">*</span></label>
                                            <input className="inp form-control" type="tel" name="phone_number" ref={register({
                                                required: "You must specify phone number",
                                                minLength: {
                                                    value: 10,
                                                    message: "At least 10 digits required"
                                                },
                                                maxLength: {
                                                    value: 20,
                                                    message: "Max 20 digits applicable"
                                                }
                                            })} value={props.currentUserListValues.phone_number} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                            {errors.phone_number && <p className="error">{errors.phone_number.message}</p>}
                                        </div>
                                    </div>


                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Country<span className="asterisk">*</span></label>
                                    <select name="country_id" onChange={(e) => { props.handleChange('country', e.target.value) }} className='form-control' ref={register({
                                        required: "Required"
                                    })} value={props.currentCountry!=null?props.currentCountry:""} >
                                        <option value=""></option>
                                        {props.countryDataList!=null && props.countryDataList.length > 0 && props.countryDataList.map((_item, _index) => (
                                            <option key={_item.id} value={`${_item.id}`} >{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.country_id && <p className="error">{errors.country_id.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">State<span className="asterisk">*</span></label>
                                    <select name="state_id" onChange={(e) => { props.handleChange('state', e.target.value) }} className='form-control' ref={register({
                                        required: "Required"
                                    })} value={props.currentState!=null?props.currentState:""} >
                                        <option value=""></option>
                                        {props.stateDataList!=null && props.stateDataList.length > 0 && props.stateDataList.map((_item, _index) => (
                                            <option key={_item.id} value={`${_item.id}`} >{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.state_id && <p className="error">{errors.state_id.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">City<span className="asterisk">*</span></label>
                                    <select name="city_id" onChange={(e) => { props.handleChange('city', e.target.value) }} className='form-control' ref={register({
                                        required: "Required"
                                    })} value={props.currentCity!=null?props.currentCity:""}>
                                        <option value=""></option>
                                        {props.cityDataList!=null && props.cityDataList.length > 0 && props.cityDataList.map((_item, _index) => (
                                            <option key={_item.id} value={`${_item.id}`} >{_item.name}</option>
                                        ))}
                                    </select>
                                    {errors.city_id && <p className="error">{errors.city_id.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Address</label>
                                    <input className="inp form-control" type="text" name="address" ref={register({
                                        pattern: {
                                            value: /^[a-zA-Z0-9][a-zA-Z0-9\s]*$/,
                                            message: "Address contains atleast one character/number without any space in the begining"
                                        }
                                    })} value={props.currentUserListValues.address} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                    {errors.address && <p className="error">{errors.address.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Zip Code</label>
                                    <input className="inp form-control" type="text" name="zip_code" ref={register({
                                        pattern: {
                                            value: /^[a-zA-Z0-9][a-zA-Z0-9]*$/,
                                            message: "Alpabets/Numbers are allowed without any space"
                                        }
                                    })} value={props.currentUserListValues.zip_code} onChange={(e) => { props.handleUpdate(e.target.name,e.target.value) }} />
                                    {errors.zip_code && <p className="error">{errors.zip_code.message}</p>}

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

    );

}
export default ManageView;