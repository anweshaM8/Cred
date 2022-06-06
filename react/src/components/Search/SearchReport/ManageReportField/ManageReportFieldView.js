import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../Common/Breadcrumb';
import './ManageReportFieldStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../../../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faChevronLeft, faFileUpload,faUsers } from '@fortawesome/free-solid-svg-icons';

const ManageView = (props) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            // risk_score: (editDataList.risk_score) ? editDataList.risk_score : "",
            // explanation: (editDataList.explanation) ? editDataList.explanation : "",
            // comment_on_risk_score: (editDataList.comment_on_risk_score) ? editDataList.comment_on_risk_score : "",
            // maximum_credit_limit: (editDataList.maximum_credit_limit) ? editDataList.maximum_credit_limit : "",
            // litigation: (editDataList.litigation) ? editDataList.litigation : "",
            // comment: (editDataList.comment) ? editDataList.comment : ""
        }
    });

    console.log('props.editFormValues',props.editFormValues)

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
                                            <form className="form-style" onSubmit={handleSubmit(props.formSubmitData)}>

                                                {
                                                    props.editDataList.company_type=="llp"?
                                                    <div>
                                                    {props.editcompanyFinancialInfoData.map((value2, index2) => (
                                                        <div>
                                                            <div className="form-group" key={index2}>
                                                                <label className="mb-1">Contribution Received for {new Date(value2.year).getFullYear()}</label>
                                                                <input  className="inp form-control" type="text" placeholder={"Contribution Received for "+new Date(value2.year).getFullYear()} value={props.editFormValues['contribution_received'+index2]} name={'contribution_received'+index2}ref={
                                                                    register({
                                                                        
                                                                    
                                                                })} onChange={(e)=>{props.onChangeEditField()}} />
                                                                {errors.risk_score && <p className="error">{errors.risk_score.message}</p>}
                                                            </div>
                                                            <div className="form-group" key={index2}>
                                                                <label className="mb-1">Reserves and Surplus for {new Date(value2.year).getFullYear()}</label>
                                                                <input  className="inp form-control" type="text" placeholder={"Reserves and Surplus for "+new Date(value2.year).getFullYear()} value={props.editFormValues['reserves_and_surplus'+index2]} name={'reserves_and_surplus'+index2} ref={
                                                                    register({
                                                                        
                                                                    
                                                                })} onChange={(e)=>{props.onChangeEditField()}} />
                                                                {errors.risk_score && <p className="error">{errors.risk_score.message}</p>}
                                                            </div>
                                                        </div>
                                                    ))}

                                                </div>:
                                                    ""

                                                }

                                            

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