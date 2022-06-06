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
            group_name: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.group_name : "",
            group_type: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.group_type : "",
            country_code: ((Object.keys(props.editDataList).length) > 0) ? props.editDataList.country_code : "",
        }
    });
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserShield} pageTitle="Manage Country Group Management" />
            <MetaTagsView title="Manage Country Group Management" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Group Name<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="group_name" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.group_name && <p className="error">{errors.group_name.message}</p>}

                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Group Type<span className="asterisk">*</span></label>
                                    <select className="form-control" name="group_type" ref={register({
                                        required: "Required"
                                    })}>
                                        <option value="">--Select Group Type--</option>
                                        <option value="FI">Fresh Investigation</option>
                                        <option value="ON">Online Investigation</option>
                                    </select>
                                    {errors.group_type && <p className="error">{errors.group_type.message}</p>}
                                </div>
                                <div className="form-group col-12 col-md-12">
                                    <label className="mb-1">Country<span className="asterisk">*</span></label>
                                        <Select className="searchable-select" options={props.countryDataList} isSearchable={true} isMulti ={props.idCheck==false?true:false} defaultValue={props.particularCountry} onChange={props.handleChangeCountry} value={props.particularCountry} />
                                    {/* <select name="country_code" multiple={props.idCheck==false?true:false} className='form-control' ref={register({
                                       // required: "Required"
                                    })} >
                                        <option value=""></option>
                                        {props.countryDataList.length > 0 && props.countryDataList.map((_item, _index) => (
                                            <option value={`${_item.id}`}>{_item.name}</option>
                                        ))}
                                    </select> */}
                                    {props.countryError && <p className="error">Please add country</p>}

                                </div>

                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                <Link className="ml-auto btn backBtn mr-4" to="/country-group-management"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
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