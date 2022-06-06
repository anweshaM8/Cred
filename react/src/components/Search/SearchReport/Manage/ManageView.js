import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faChevronLeft, faFileUpload,faUsers } from '@fortawesome/free-solid-svg-icons';

const ManageView = ({ formSubmitData, dataDetails, editDataList }) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            risk_score: (editDataList.risk_score) ? editDataList.risk_score : "",
            explanation: (editDataList.explanation) ? editDataList.explanation : "",
            comment_on_risk_score: (editDataList.comment_on_risk_score) ? editDataList.comment_on_risk_score : "",
            maximum_credit_limit: (editDataList.maximum_credit_limit) ? editDataList.maximum_credit_limit : "",
            litigation: (editDataList.litigation) ? editDataList.litigation : "",
            comment: (editDataList.comment) ? editDataList.comment : ""
        }
    });

    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faUserCog} pageTitle="Manage Risk Score " />
            <MetaTagsView title="Manage Risk Score " />
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <div className="form-ui-wrapper white-panel">


                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <div className="inner-container">
                                    <div className="f-20 section-title col pl-0">
                                        <div>
                                            <form className="form-style" onSubmit={handleSubmit(formSubmitData)}>

                                                <div className="form-group">
                                                    <label className="mb-1">Risk Score</label>
                                                    <input  className="inp form-control" type="text" placeholder="Risk Score" name="risk_score" ref={register({
                                                        
                                                    })} />
                                                    {errors.risk_score && <p className="error">{errors.risk_score.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-1">Explanation</label>
                                                    <input  className="inp form-control" type="text" placeholder="Explanation" name="explanation" ref={register({
                                                        
                                                    })} />
                                                    {errors.explanation && <p className="error">{errors.explanation.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-1">Comment on Risk Score</label>
                                                    <textarea className="inp form-control" placeholder="Comment on Risk Score" name="comment_on_risk_score" ref={register({
                                                        
                                                    })} >

                                                    </textarea>
                                                    {errors.comment_on_risk_score && <p className="error">{errors.comment_on_risk_score.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-1">Maximum Credit Limit</label>
                                                    <input  className="inp form-control" type="text" placeholder="Maximum Credit Limit" name="maximum_credit_limit" ref={register({
                                                        
                                                    })} />
                                                    {errors.maximum_credit_limit && <p className="error">{errors.maximum_credit_limit.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-1">Litigation</label>
                                                    <input  className="inp form-control" type="text" placeholder="Litigation" name="litigation" ref={register({
                                                        
                                                    })} />
                                                    {errors.litigation && <p className="error">{errors.litigation.message}</p>}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-1">Comment</label>
                                                    <textarea className="inp form-control" placeholder="Comment" name="comment" ref={register({
                                                        
                                                    })} >

                                                    </textarea>
                                                    {errors.comment && <p className="error">{errors.comment.message}</p>}
                                                </div>
                                                                                      
                                                <div className="form-group">
                                                    
                                                    <div class="mt-4 d-flex align-items-center btn__back__to-hld">
                                                    {/* <Link to="/role" className="text-left"> Back</Link>
                                                    <input className=" w-100 p-2 btn btn-success" type="submit" value="Submit" /> */}

                                                    <Link className="ml-auto btn backBtn mr-4" to="/user"><FontAwesomeIcon className="mr-1" icon={faChevronLeft} /> Back</Link>
                                                    <button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


        </div>

    );

}
export default ManageView;