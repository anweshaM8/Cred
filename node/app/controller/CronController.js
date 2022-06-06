const fs = require('fs');

let path  = require('path');
const OnlineSearchDetails = Model('OnlineSearchDetails');
const moment = require('moment');
const cronHelper = Helper('cronHelper');
const UpdateProbeStatusNotFulfilledMail = Mail('UpdateProbeStatusNotFulfilled');
const invoiceGeneration = Helper('invoice-generation');
const CronLog = Model('CronLog');

const CronController = {

	updateProbeStatus: async function (req, res, next) {
		

        let onlineSearchDetails = await new OnlineSearchDetails().fetchAllDataForUpdateProbeStatus();
        onlineSearchDetails=onlineSearchDetails.toJSON();

       //console.log('onlineSearchDetails-------------',onlineSearchDetails)

        //return onlineSearchDetails;

        //return res.status(200).json(res.fnSuccess(onlineSearchDetails , 'Response Successfully', 200 ));
         // var getUpdateStatus = await cronHelper.probeGetUpdateStatusCINORLLP(onlineSearchDetails[0].cin_or_llp_id,onlineSearchDetails[0].update_request_id,onlineSearchDetails[0].company_type); 

        //             return res.status(200).json(res.fnSuccess(getUpdateStatus , 'Response Successfully', 200 ));
        var ids= [];
        if(onlineSearchDetails.length>0)       
        {
            onlineSearchDetails.map(async function (el1) { 

                if(el1.cin_or_llp_id!=null && el1.update_request_id!=null && el1.company_type!=null)
                {
                    var getUpdateStatus = await cronHelper.probeGetUpdateStatusCINORLLP(el1.cin_or_llp_id,el1.update_request_id,el1.company_type); 

                    if(getUpdateStatus)
                    {
                        if(getUpdateStatus.status == 'FULFILLED')
                        {
                            ids.push(el1.id);
                            let res_comprehensive_api='';
                            if(el1.company_type=='cin')
                            {
                                res_comprehensive_api=await invoiceGeneration.cin_comprehensive_report(el1.cin_or_llp_id,el1.user_id,el1.search_investigation_id,el1.id,null);
                            }
                            else
                            {
                                res_comprehensive_api=await invoiceGeneration.llp_comprehensive_report(el1.cin_or_llp_id,el1.user_id,el1.search_investigation_id,el1.id,null);
                            }
                            await new OnlineSearchDetails({ id: el1.id }).save(
                                {
                                    is_update_requested:2,
                                    update_response_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                                },
                                { patch: true }
                              )
                           // await new OnlineSearchDetails().update(el1.id,{is_update_requested:2,update_response_time:moment().format('YYYY-MM-DD HH:mm:ss')})
                        }
                        // else
                        // {
                        //     ids.push(el1.id);
                        //     await new OnlineSearchDetails().update(el1.id,{is_update_requested:3,update_response_time:moment().format('YYYY-MM-DD HH:mm:ss')})
                        //     var formDataForMail = {
                        //         companyOrLlp:el1.company_type,
                        //         name:el1.searchInvestigation && Object.keys(el1.searchInvestigation).length != 0 && Object.getPrototypeOf(el1.searchInvestigation) === Object.prototype?el1.searchInvestigation.company_name:"",
                        //         id:el1.cin_or_llp_id,
                        //         requestId:el1.update_request_id

                        //     }
                        //     await UpdateProbeStatusNotFulfilledMail(formDataForMail);

                        // }
                    }

                   
                }

    
            });
           
            //return res.status(200).json(res.fnSuccess(ids , 'Response Successfully', 200 ));
        }

         let dataSet = {
            name: 'update status api cron new',          
            run_on :  moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        
 
        await new CronLog().createData(dataSet);

        //return res.status(200).json(res.fnSuccess(ids , 'Response Successfully', 200 ));
        return 'Response Successfully';
        
        
	},
    updateProbeStatusApi: async function (req, res, next) {
		

        let onlineSearchDetails = await new OnlineSearchDetails().fetchAllDataForUpdateProbeStatus();
        onlineSearchDetails=onlineSearchDetails.toJSON();

        var ids= [];
        if(onlineSearchDetails.length>0)       
        {
            onlineSearchDetails.map(async function (el1) { 

                if(el1.cin_or_llp_id!=null && el1.update_request_id!=null && el1.company_type!=null)
                {
                    var getUpdateStatus = await cronHelper.probeGetUpdateStatusCINORLLP(el1.cin_or_llp_id,el1.update_request_id,el1.company_type); 

                    if(getUpdateStatus)
                    {
                        if(getUpdateStatus.status == 'FULFILLED')
                        {
                            ids.push(el1.id);
                            let res_comprehensive_api='';
                            if(el1.company_type=='cin')
                            {
                                res_comprehensive_api=await invoiceGeneration.cin_comprehensive_report(el1.cin_or_llp_id,el1.user_id,el1.search_investigation_id,el1.id,null);
                            }
                            else
                            {
                                res_comprehensive_api=await invoiceGeneration.llp_comprehensive_report(el1.cin_or_llp_id,el1.user_id,el1.search_investigation_id,el1.id,null);
                            }
                            await new OnlineSearchDetails({ id: el1.id }).save(
                                {
                                    is_update_requested:2,
                                    update_response_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                                },
                                { patch: true }
                              )
                           // await new OnlineSearchDetails().update(el1.id,{is_update_requested:2,update_response_time:moment().format('YYYY-MM-DD HH:mm:ss')})
                        }
                        // else
                        // {
                        //     ids.push(el1.id);
                        //     await new OnlineSearchDetails().update(el1.id,{is_update_requested:3,update_response_time:moment().format('YYYY-MM-DD HH:mm:ss')})
                        //     var formDataForMail = {
                        //         companyOrLlp:el1.company_type,
                        //         name:el1.searchInvestigation && Object.keys(el1.searchInvestigation).length != 0 && Object.getPrototypeOf(el1.searchInvestigation) === Object.prototype?el1.searchInvestigation.company_name:"",
                        //         id:el1.cin_or_llp_id,
                        //         requestId:el1.update_request_id

                        //     }
                        //     await UpdateProbeStatusNotFulfilledMail(formDataForMail);

                        // }
                    }

                   
                }

    
            });
           
            //return res.status(200).json(res.fnSuccess(ids , 'Response Successfully', 200 ));
        }

         let dataSet = {
            name: 'update status api cron manually',          
            run_on :  moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        
        let dateTimeNow = moment();
        var dateTimeAfter4hour = moment(dateTimeNow).subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
        await new CronLog().createData(dataSet);

        return res.status(200).json(res.fnSuccess(dateTimeAfter4hour , 'Response Successfully', 200 ));
        //return 'Response Successfully';
        
        
	},

}

module.exports = CronController;