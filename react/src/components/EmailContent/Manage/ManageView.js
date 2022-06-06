import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import CKEditor from 'ckeditor4-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const ManageView = (props) => {
    const { register, handleSubmit, errors, control } = useForm({
        defaultValues: {
            title: (props.editDataList.title) ? props.editDataList.title : "",

        }
    });

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faEnvelope} pageTitle="Manage Email Content" />
            <MetaTagsView title="Manage Email Content" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">

                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">Title<span className="asterisk">*</span></label>
                                    <input className="inp form-control" type="text" name="title" ref={register({
                                        required: "Required"
                                    })} />
                                    {errors.title && <p className="error">{errors.title.message}</p>}

                                </div>

                                <div className="form-group col-12">
                                    <label className="mb-1">Description
                                        <p><small>(Please dont not change the macro value)</small></p>
                                    </label>
                                    <CKEditor
                                        data={(props.editDataList.content) ? props.editDataList.content : ""}
                                        onBlur={evt => props.getEditorValue(evt)}
                                        onChange={evt => props.getEditorValue(evt)}
                                    />

                                </div>
                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                <Link className="ml-auto btn backBtn mr-4" to="/email-content"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
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