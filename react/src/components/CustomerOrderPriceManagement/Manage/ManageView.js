import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { encrypdycrypService } from '../../../helpers/encryp-dycryp';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faUserShield } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'

const ManageView = (props) => {

    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            user_id: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.user_id : "",
            group_id: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.group_id : "",
            order_type: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.order_type : "",
            cost_per_report: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.cost_per_report : "",
            rebate_amout: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.rebate_amout : "",
            payment_terms: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.payment_terms : "",
            tax: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.tax : "",
        }
    });
    console.log('user',props.changedUser)
    console.log('group',props.changedCountryGroup)

    console.log('errors',errors)

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Manage Customer Order Price Management" />
            <MetaTagsView title="Manage Customer Order Price Management" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">User<span className="asterisk">*</span></label>
                                        <Select className="searchable-select" options={props.dataUserList} isSearchable={true} defaultValue={((Object.keys(props.editDataList).length) > 0)?props.editDataList.userDet:null}  onChange={props.handleUserChange} value={props.changedUser!==0?props.changedUser:null} />
                                    {props.userError && <p className="error">Please add a user</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Group Type<span className="asterisk">*</span></label>
                                        <Select className="searchable-select" options={props.dataCountryGroupList} isSearchable={true} defaultValue={((Object.keys(props.editDataList).length) > 0)?props.editDataList.groupDet:null} onChange={props.handleCountryGroupChange} value={props.changedCountryGroup!==0?props.changedCountryGroup:null} />
                                    {props.countryGroupError && <p className="error">Please add a group type</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Order Type<span className="asterisk">*</span></label>
                                    <select className="form-control" name="order_type" ref={register({
                                        required: "Required"
                                    })}>
                                        <option value="">--Select Group Type--</option>
                                        <option value="FI">Fresh Investigation</option>
                                        <option value="ON">Online Investigation</option>
                                    </select>
                                    {errors.order_type && <p className="error">{errors.order_type.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Cost Per Report(In USD)<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="number" step=".02" name="cost_per_report" ref={register({
                                        required: "Required",
                                        pattern:/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/i
                                    })} />
                                    {errors.cost_per_report && errors.cost_per_report.type === 'required'?<p className="error">Cost Per Report is required</p>:""}
                                    {errors.cost_per_report && errors.cost_per_report.type === 'pattern'?<p className="error">Cost Per Report Should have positive float value</p>:""}
                                  

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Rebate Amount(In USD)<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="number" step=".01" name="rebate_amout" ref={register({
                                        required: "Required",
                                        pattern:/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/i
                                    })} />
                                    {errors.rebate_amout && errors.rebate_amout.type === 'required'?<p className="error">Rebate Amount is required</p>:""}
                                    {errors.rebate_amout && errors.rebate_amout.type === 'pattern'?<p className="error">Rebate Amount Should have positive float value</p>:""}
                                  
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Payment Terms(No of days)<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="number" step=".01" name="payment_terms" ref={register({
                                        required: "Required",
                                        pattern:/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/i
                                    })} />
                                    {errors.payment_terms && errors.payment_terms.type === 'required'?<p className="error">Payment Term is required</p>:""}
                                    {errors.payment_terms && errors.payment_terms.type === 'pattern'?<p className="error">Payment Term Should have positive float value</p>:""}
                                  
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Tax(in %)<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="number" step=".01" name="tax" ref={register({
                                        required: "Required",
                                        pattern:/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/i
                                    })} />
                                    {errors.tax && errors.tax.type === 'required'?<p className="error">Tax is required</p>:""}
                                    {errors.tax && errors.tax.type === 'pattern'?<p className="error">Tax Should have positive float value</p>:""}
                                  
                                </div>

                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                <Link className="ml-auto btn backBtn mr-4" to="/customer-order-price-management"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
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