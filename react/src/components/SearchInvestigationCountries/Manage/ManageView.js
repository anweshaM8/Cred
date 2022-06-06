import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import CKEditor from 'ckeditor4-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faEnvelope,faFlag } from '@fortawesome/free-solid-svg-icons';


const ManageView = (props) => {
    const { register, handleSubmit, errors, control } = useForm({
        defaultValues: {
            country_name: (props.editDataList.country_name) ? props.editDataList.country_name : "",

        }
    });

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faFlag} pageTitle="Manage Search Investigation Country" />
            <MetaTagsView title="Manage Search Investigation Country" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">

                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Country Name<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="country_name" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.country_name && <p className="error">{errors.country_name.message}</p>}

                                </div>
                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                <Link className="ml-auto btn backBtn mr-4" to="/search-countries"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
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