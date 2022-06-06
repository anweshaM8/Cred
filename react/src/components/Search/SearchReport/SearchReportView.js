import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../Common/Breadcrumb';
import './SearchReportStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import CKEditor from 'ckeditor4-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFileUpload, faEnvelope,faFileInvoice } from '@fortawesome/free-solid-svg-icons';


const SearchReportView = (props) => {
    const { register, handleSubmit, errors, control } = useForm({
        defaultValues: {
            //title: (props.editDataList.title) ? props.editDataList.title : "",

        }
    });

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faFileInvoice} pageTitle="Manage Report Content" />
            <MetaTagsView title="Manage Report Content" />
            <div className="row">
                <div className="col-12">
                    <div className="form-ui-wrapper white-panel">
                        <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>
                            <div className="row">

                                

                                <div className="form-group col-12">
                                    <label className="mb-1">Report Content
                                        <p><small></small></p>
                                    </label>
                                    <CKEditor
                                        data={(props.editDataList.draft_html) ? props.editDataList.draft_html : ""}
                                        onBlur={evt => props.getEditorValue(evt)}
                                        onChange={evt => props.getEditorValue(evt)}
                                    />

                                </div>
                            </div>
                            <div className="mt-4 d-flex align-items-center btn__back__to-hld">
                                {/* <Link className="ml-auto btn backBtn mr-4" to="/email-content"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link> */}
                                <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                            </div>


                        </form>



                    </div>
                </div>
            </div>


        </div>

    );

}
export default SearchReportView;