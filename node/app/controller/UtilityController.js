const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const Module = Model('Module');
const SearchInvestigation = Model('SearchInvestigation');
const User = Model('User');
const CustomerOrderPriceManagement = Model('CustomerOrderPriceManagement');
const _ = require("lodash");
const OrderLink = Mail('OrderLink');
const CircularJSON = require('circular-json');
const { debug } = require('winston');
const OnlineSearchDetails = Model('OnlineSearchDetails');

const Wallet = Model('Wallet');
const CustomerWalletLog = Model('CustomerWalletLog');

const invoiceGeneration = Helper('invoice-generation');
const CustomerReportLog = Model('CustomerReportLog');

const CompanyProbeinfo = Model('CompanyProbeinfo');

const CreditinvoiceMail = Mail('Creditinvoice');


const UtilityController = {
 
    getModuleList : async function(req,res,next){
        new Module().fetchAllData()
        .then((response)=>{
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "UtilityController.getModuleList",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            }) 
                   
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })
        .catch((errors)=>{
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "UtilityController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        })
    },
    //order pdf from admin in order list    
    // uploadOrder : async function(req,res,next){

    //     let searchId = req.params.id;
    //     let formData = req.body;
    //     console.log('req.params',req.params,'req.body',req.body)

    //      let validation = new Validator(formData, {
    //         user_id: 'required',
    //         order_link: 'required',
    //         status: 'required|string',
    //     });

    //     let matched = await validation.check();
    //     if (!matched) {
    //         return res.status(200).json(res.fnError(validation.errors, '', 400));
    //     }

    //     let setData = {
    //         user_id : formData.user_id,          
    //         order_link:formData.order_link,
    //         status:formData.status
    //     }

    //     new CustomerOrderPriceManagement().fetchOne('user_id',formData.user_id)           
    //     .then((response) => {               
            
    //         new SearchInvestigation({
    //             'id': searchId
    //         }).save(setData)           
    //         .then((response) => {
    //             logger.infoLogger.info({
    //                 loggedInUserName: 'admin',
    //                 ip: req.client._peername.address,
    //                 method: "UtilityController.uploadOrder",
    //                 message: response,
    //                 dataTime: moment().format('YYYY-MM-DD hh:m:s')
    //             })
    
    //             new SearchInvestigation().fetchOne(searchId).then((result) => {
    
    //                 result=result.toJSON();
    
    //                 //console.log('result',result)

    //                   new User().fetchOne('id', `${result.user_id}`).then((user) => {
    
    //                     user=user.toJSON();
        
    //                     //console.log('user',user)

    //                      const orderLink = formData.order_link;
    
    //                      OrderLink(result,user,orderLink );
        
            
            
    //                      return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
        
                        
    //                 }).catch((errors) => {
    //                     return res.status(200).json(res.fnError(errors, 'User not found', 500));
    //                 });
    
                    
    //                 //return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
    //             }).catch((errors) => {
    //                 return res.status(200).json(res.fnError(errors, 'No order list found to update', 500));
    //             });
    
    //             // return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
    //         })
    //         .catch((errors) => {
    //             logger.errorLogger.error({
    //                 loggedInUserName: 'admin',
    //                 ip: req.client._peername.address,
    //                 method: "UtilityController.uploadOrder",
    //                 message: errors,
    //                 dataTime: moment().format('YYYY-MM-DD hh:m:s')
    //             })
    //             return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
    //         });
    //     })
    //     .catch((errors) => {
          
    //         return res.status(200).json(res.fnError(errors, 'can\'t upload order if no price list exist on this user', 500));
    //     });


    // },   

    /****modified with pdf genertion code *******/

    uploadOrder : async function(req,res,next){

        let searchId = req.params.id;
        let formData = req.body;
        //console.log('req.params',req.params,'req.body',req.body)

         let validation = new Validator(formData, {
            user_id: 'required',
            order_link: 'required',
            status: 'required|string',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        try {
        let setData = {
            user_id : formData.user_id,          
            order_link:formData.order_link,
            status:formData.status
        }
        new SearchInvestigation().fetchOne(searchId).then(async function (result){
    
            result=result.toJSON();

            //console.log('result',result);
            //let search_investigation_id=result.id;
            let search_type=result.type;
            //console.log('User_id',formData.user_id);
            let user_id=formData.user_id;
           
        /************************** For BO user check its HO price********************************************/
        let price_user_id=user_id;
        let usertypeInfo = await User.where('id', user_id).fetch();
        //console.log(usertypeInfo);
        let curUserInfo=usertypeInfo.toJSON();
        let curUserType=curUserInfo.user_type;
        if(curUserType=="BO")
        {
            price_user_id=curUserInfo.head_office_user_id;
        } 
        //console.log("TYPE",curUserType);
        //console.log("ID",price_user_id);
        /************************************************************************************************* */
        new CustomerOrderPriceManagement().where({user_id: price_user_id,order_type:search_type}).fetch()        
        .then((response) => {               
            //console.log("RESPONSE",response);
            let customer_order_price=response.toJSON();
            //console.log("CustomerOrderPriceManagement",customer_order_price);
            new SearchInvestigation({
                'id': searchId
            }).save(setData)  
            
            //will save to log table for date and report we r sending to customer
    
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.uploadOrder",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
    
                

                      new User().fetchOne('id', `${user_id}`).then((user) => {
    
                        user=user.toJSON();
        
                        //console.log('user',user)
                        //console.log('user---')

                         const orderLink = formData.order_link;
    
                         OrderLink(result,user,orderLink );
        
                         new Wallet().fetchOne('user_id', `${price_user_id}`).then((wallet_row) => {
                            wallet_row=wallet_row.toJSON();
                            //console.log("WALLET++++++++");
                            let existing_total_amount=wallet_row.total_amount;
                            let existing_rebate_amount=wallet_row.rebet_amount;
                            let cost_per_report=customer_order_price.cost_per_report;
                            let rebate_amout=customer_order_price.rebate_amout;
                            let existing_no_of_report=wallet_row.no_of_report;
                            //console.log(existing_total_amount+'--'+existing_rebate_amount+'--'+cost_per_report+'--'+rebate_amout);
                            let save_data = {
                                total_amount: existing_total_amount+cost_per_report,
                                rebet_amount:existing_rebate_amount+rebate_amout,
                                no_of_report:existing_no_of_report+1,          
                            }
                
                            // console.log('save_data',save_data,'userid',user.id)
                
                            //  logger.infoLogger.info({
                            //     loggedInUserName: 'admin',
                            //     ip: req.client._peername.address,
                            //     method: "UtilityController.customerCreditCount",
                            //     message: formData,
                            //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                            // })
                            
                            new Wallet({
                                        'id': wallet_row.id
                                    }).save(save_data)
                                    .then((response) => {
                                        //save to wallet log table
                                        let setData_wallet_log = {
                                            user_id: price_user_id,
                                            search_investigation_id:searchId,
                                            type:search_type,
                                            total_amount:cost_per_report,
                                            rebet_amount:rebate_amout,
                                        }
                                        new CustomerWalletLog().createData(setData_wallet_log)
                                        .then((response) => {
                                        return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                                        })
                                        .catch((errors1) => {
                                            return res.status(200).json(res.fnError(errors1, 'Failed to insert wallet log', 500));
                                        });
                                    }).catch((errors1) => {
                                        return res.status(200).json(res.fnError(errors1, 'Internal Server Error', 500));
                                    });
                
                
                        }).catch((errors) => {
                            return res.status(200).json(res.fnError(errors, 'No Walet records found', 500));
                        });
            
                        
                        
                    }).catch((errors) => {
                        return res.status(200).json(res.fnError(errors, 'User not found', 500));
                    });
    
                    
                    //return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                }).catch((errors) => {
                    return res.status(200).json(res.fnError(errors, 'can\'t upload order if no price list exist on this user', 500));
                });

                
    
                // return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
        }
        catch(errors) {
          
            return res.status(200).json(res.fnError(errors, 'No order list found to update', 500));
        }


    },

     /****save Credit Score *******/

     saveCreditScore : async function(req,res,next){

        let search_investigation_id = req.params.id;
        let formData = req.body;
        console.log('req.params',req.params,'req.body',req.body)

         let validation = new Validator(formData, {
            credit_score: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        try {
        let setData = {
            credit_score : Number(formData.credit_score),          
        }

       
        new OnlineSearchDetails().fetchOne('search_investigation_id',search_investigation_id)           
        .then((response1) => {   
            
            response1=response1.toJSON();
            
            new OnlineSearchDetails({
                'id': response1.id
            }).save(setData) 
            .then((response2) => {

                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));

            }).catch((errors) => {
                return res.status(200).json(res.fnError(errors, 'Not updated', 500));
            });
        }).catch((errors) => {
            return res.status(200).json(res.fnError(errors, 'Online search details not found', 500));
        });
      
        }
        catch(errors) {
          
            return res.status(200).json(res.fnError(errors, 'can\'t upload order if no price list exist on this user', 500));
        }


    },

    //user list count
    userListCount : async function(req,res,next){
        let userType = _.toBoolean(req.query.type) ? req.query.type : false;
        let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;

        let headOfficUserId = _.toBoolean(req.query.head_office_user_id) ? req.query.head_office_user_id : false;

        let userData = new User();

        
            userData = userData.count(userType, isActive, headOfficUserId);

            userData.then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.userListCount",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            }).catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.userListCount",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },

      //calculate customer credit on download click

    customerCreditCount: async function (req, res, next) {
        let user_id = req.body.user_id;
        let order_id = req.body.order_id;
        let order_link = req.body.order_link;
        let formData = req.body;
        console.log('req.body',req.body)
        let validation = new Validator(formData, {
            user_id: 'required',
            order_link: 'required',
            order_id: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        

        try {
             new Wallet().fetchOne('user_id', user_id).then((wallet_row) => {
                wallet_row=wallet_row.toJSON();
                //console.log(wallet_row);
                let existing_total_amount=wallet_row.total_amount;
                let existing_rebate_amount=wallet_row.rebet_amount;
                let cost_per_report=wallet_row.CustomerOrderPriceManagement.cost_per_report;
                let rebate_amout=wallet_row.CustomerOrderPriceManagement.rebate_amout;
                //console.log(existing_total_amount+'--'+existing_rebate_amount+'--'+cost_per_report+'--'+rebate_amout);
                let save_data = {
                    total_amount: existing_total_amount+cost_per_report,
                    rebet_amount:existing_rebate_amount+rebate_amout            
                }
    
                // console.log('save_data',save_data,'userid',user.id)
    
                 logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.customerCreditCount",
                    message: formData,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                
                new Wallet({
                            'id': wallet_row.id
                        }).save(save_data)
                        .then((response) => {
                            return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                        }).catch((errors1) => {
                            return res.status(200).json(res.fnError(errors1, 'Internal Server Error', 500));
                        });


            }).catch((errors) => {
                return res.status(200).json(res.fnError(errors, 'No Walet records found', 500));
            });
            
          
        }
        catch (e) {
            return res.status(200).json(res.fnError('', 'Error Occured', 422));
        }
    },

    /******generate monthly invoice for individula customer************ */
    generateCreditReport:async function(req, res, next){
        let user_id=req.params.user_id;
        console.log(user_id);
        let walletInfo = await Wallet.where('user_id', user_id).fetch({withRelated: ["user","user_details","CustomerOrderPriceManagement","country_details","state_details","city_details","group_details"]});
        let invoicedata=walletInfo.toJSON();
        let invoice_no=Math.floor(100000 + Math.random() * 900000);
        console.log(invoice_no);

        let due_date="";
        if(invoicedata.CustomerOrderPriceManagement.payment_terms>0)
        {
            due_date=moment().add(7, 'days').format('DD/MM/YYYY');
            //console.log(due_date);
        }
        else
        {
            due_date=moment().format('DD/MM/YYYY');
        }
        
        if(due_date)
        {
            if(invoicedata)
            {
                invoicedata.due_date=due_date;
                invoicedata.invoice_no=invoice_no;
                //console.log(invoicedata);
                invoiceGeneration.invoice(invoicedata); 
                //invoiceGeneration.sendmailtest(walletInfo.toJSON());

                return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
            }
            else
            {
                return res.status(200).json(res.fnError('', 'Error Occured', 422));
            }
            
            
        }
        
        //console.log(walletInfo.toJSON());

        

        // if(walletInfo)
        //     invoiceGeneration.invoice(walletInfo.toJSON()); 
        //     invoiceGeneration.sendmailtest(walletInfo.toJSON());
        
    },


    /******generate monthly invoice will execute by cronjob monthly************ */
    monthly_invoice:async function(req, res, next){
        //console.log('INVOICE');

        const date = new Date();
               
        let range_start_date = new Date(date.getFullYear(), date.getMonth() - 1, 1);//first day of previous month
        let range_end_date =date.setDate(0); // 0 will result in the last day of the previous month
    
        //let range_start_date =date.setDate(1);// 1 will result in the first day of the present month
        var range_start=false; var range_end= false;
        
       if(range_start_date && range_end_date)
       {
            range_start= moment(new Date(range_start_date).toISOString()).format('YYYY-MM-DD')+' 00:00:00';
            range_end= moment(new Date(range_end_date).toISOString()).format('YYYY-MM-DD')+' 00:00:00'; 
       }
            
        // get all users who have more than 0 wallet balance
        new Wallet().where('total_amount','>',0).fetchAll({columns: ['user_id']}).then((userdata) => {
           
            let userList = userdata.map((c) => {
            c=c.toJSON();
            //console.log("USERS",c);
            if(c)
            {   
                let user_id=c.user_id;   
                let curUserId=user_id;
                //console.log("USER ID",user_id);
                new Wallet().where('user_id', user_id).fetch({withRelated: ["user","user_details","CustomerOrderPriceManagement","CustomerOrderPriceManagementOnline","country_details","state_details","city_details","group_details"]}).then(async function(walletInfo){
                
                let invoicedata=walletInfo.toJSON();
                //console.log("WALLET",invoicedata);
                let fi_price_each=0;
                let on_price_each=0;
                
                let custpriceAll=invoicedata.CustomerOrderPriceManagementOnline;
                if(custpriceAll)
                {
                    custpriceAll.forEach(function(price_obj) {
                        if(price_obj.order_type=='FI')
                        {
                            fi_price_each=price_obj.cost_per_report;
                        }

                        if(price_obj.order_type=='ON')
                        {
                            on_price_each=price_obj.cost_per_report;
                        }
                    });
                }
               
                invoicedata.fi_price_each=fi_price_each;
                invoicedata.on_price_each=on_price_each;

                //console.log("FI Price", invoicedata.fi_price_each);
                //console.log("ON Price", invoicedata.on_price_each);
               //get user type of logged in user
               //console.log(user_id);
               let usertypeInfo = await User.where('id', user_id).fetch();
               //console.log(usertypeInfo);
               
               let curUserType=usertypeInfo.toJSON().user_type;
               //let curUserType='HO';
               //console.log(curUserType);
               var allHoBoUser = null;
               if(curUserType=='HO')
                {
                    allHoBoUser = await new User().fetchAllUsersUnderHO(curUserId);
                    allHoBoUser=allHoBoUser.toJSON();
                    allHoBoUser = _.map(allHoBoUser, 'id');
                    allHoBoUser.push(Number(curUserId))
                    //console.log('allHoBoUser',allHoBoUser)
                }
              
                //console.log('range_start',range_start,'range_end',range_end,'user_id',user_id)
                let searchInvestigation = new SearchInvestigation();
                let searchInvestigationInfo = await searchInvestigation.fetchAllDataReport(range_start,range_end,curUserType,user_id,allHoBoUser);
                
                let invoiceDetaildata=searchInvestigationInfo.toJSON();

                //console.log("INVOICEDETAAIL",invoiceDetaildata);
                
                let invoice_no=Math.floor(100000 + Math.random() * 900000);
                //console.log(invoice_no);

                 let due_date="";
                if(invoicedata.CustomerOrderPriceManagement.payment_terms>0)
                {
                    due_date=moment().add(7, 'days').format('DD/MM/YYYY');
                    //console.log(due_date);
                }
                else
                {
                    due_date=moment().format('DD/MM/YYYY');
                }
                
                if(due_date)
                {
                    if(invoicedata)
                    {
                        invoicedata.due_date=due_date;
                        invoicedata.invoice_no=invoice_no;
                        //console.log(invoicedata);
                        invoiceGeneration.invoice(invoicedata,invoiceDetaildata,user_id); 
                        

                        //return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
                    }
                    else
                    {
                        //return res.status(200).json(res.fnError('', 'Error Occured', 422));
                    }
                    
                    
                }
                });
            }
        });
       
        logger.infoLogger.info({
            loggedInUserName: 'cronjob',
            ip: "server",
            method: "UtilityController.monthly_invoice",
            message: "invoice send",
            dataTime: moment().format('YYYY-MM-DD hh:m:s')
        })
        console.log('response successfully');
        //return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
    }).catch((errors) => {
        
        logger.errorLogger.error({
            loggedInUserName: 'cronjob',
            ip: "server",
            method: "UtilityController.monthly_invoice",
            message: errors,
            dataTime: moment().format('YYYY-MM-DD hh:m:s')
        })
        console.log('Invoice gen Error');
        //return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
    });
        
        
        //console.log(walletInfo.toJSON());

        

        // if(walletInfo)
        //     invoiceGeneration.invoice(walletInfo.toJSON()); 
        //     invoiceGeneration.sendmailtest(walletInfo.toJSON());
        
    },

    //customer report log for admin
    customerReportLogForAdmin :async function(req, res, next){

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let groupByUser = _.toBoolean(req.query.groupByUser) ? req.query.groupByUser : false;
        let groupByInvoiceDate = _.toBoolean(req.query.groupByInvoiceDate) ? req.query.groupByInvoiceDate : false;
        let checkPaymentDate = _.toBoolean(req.query.checkPaymentDate) ? req.query.checkPaymentDate : false;
        let checkPaymentOrRebateApprovedate = _.toBoolean(req.query.checkPaymentOrRebateApprovedate) ? req.query.checkPaymentOrRebateApprovedate : false;
        let user_id = _.toBoolean(req.query.user_id) ? req.query.user_id : false;

        let customerReportLog = new CustomerReportLog();

        if (has_pagination) {
            customerReportLog = await customerReportLog.fetchPageData(limit, page,groupByUser,false,checkPaymentDate,checkPaymentOrRebateApprovedate,false);
        }
        else {
            customerReportLog = await customerReportLog.fetchAllData(groupByUser,false,checkPaymentDate,checkPaymentOrRebateApprovedate,false);
        }
        var customerReportLogCopy=customerReportLog;
        customerReportLog=customerReportLog.toJSON()

        var response=[]; 

        if(customerReportLog)
        {
            for (const key in customerReportLog) {

                     var monthwiseCustomerReportLog = await new CustomerReportLog().fetchAllData(false,groupByInvoiceDate,false,checkPaymentOrRebateApprovedate,customerReportLog[key].user_id);
                     monthwiseCustomerReportLog=monthwiseCustomerReportLog.toJSON()

                     //console.log('monthwiseCustomerReportLog for'+customerReportLog[key].user_id,monthwiseCustomerReportLog)

                response.push(
                    {
                        'id': customerReportLog[key].id,
                        'user':customerReportLog[key].user,
                        'user_details':customerReportLog[key].user_details,
                        'monthwiseCustomerReportLog':monthwiseCustomerReportLog
                    }
                )
                response.pagination=customerReportLogCopy.pagination;

               }
            
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }
        else
        {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "UtilityController.customerReportLogForAdmin",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'No details found', 500));
        }



    },

    //update customer report log for admin
    updatePaymentInfoForAdmin :async function(req, res, next){

        let id = req.params.id;
        let formData = req.body;

        if(req.body.apiType == 'payment_approve')
        {
            var validationRules = {           
                payment_approve_status: 'required',
                payment_approve_date: 'required',             
            }       
        }
        else
        {
            var validationRules = {           
                rebate_approve_status: 'required',
                rebate_approve_date: 'required',                 
            }       
        }

       

        let validation = new Validator(formData, validationRules);

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        if(req.body.apiType == 'payment_approve')
        {
            var update_data = {
                payment_approve_status: formData.payment_approve_status,
                payment_approve_date: formData.payment_approve_date,
            }      
        }
        else
        {
            var update_data = {
                rebate_approve_status: formData.rebate_approve_status,
                rebate_approve_date: formData.rebate_approve_date,
            }       
        }


        new CustomerReportLog({	
            'id': id    
        }).save(update_data)            
        .then((response)=>{      
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "UtilityController.updatePaymentInfoForAdmin",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })          
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
        })         
        .catch((errors) => {   
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "UtilityController.updatePaymentInfoForAdmin",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })         
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });

    },

    /******generate online search report CIN company************ */
    generateReportCIN:async function(req, res, next){
        let company_no=req.params.company_no.replace(/\s/g, '');      
        //let companyInfo = await CompanyProbeinfo.where('cin_no',company_no).fetch();
        //let companyInfo = await CompanyProbeinfo.forge().query({debug:true,where:{cin_no:company_no}}).fetch();
        let companyInfo = await CompanyProbeinfo.forge().query({where:{cin_no:company_no}}).fetch();
        //console.log(companyInfo);
        let companydata=companyInfo.toJSON();
        let invoicedata=JSON.parse(companydata.comprehensive_data)
        //console.log(invoicedata);
        let invoice_no=Math.floor(100000 + Math.random() * 900000);
         if(invoicedata)
            {
                //return res.status(200).json(res.fnSuccess(invoicedata, 'Response Successfully', 200));
                var getRes = await invoiceGeneration.report_cin(invoicedata); 

                return res.status(200).json(res.fnSuccess(getRes, 'Response Successfully', 200));
            }
            else
            {
                return res.status(200).json(res.fnError('', 'Error Occured', 422));
            }
        
    },

     /******generate online search report LLP company************ */
     generateReportLLP:async function(req, res, next){
        let llp_no=req.params.llp_no.replace(/\s/g, '');      
        //let companyInfo = await CompanyProbeinfo.where('cin_no',llp_no).fetch();
        //let companyInfo = await CompanyProbeinfo.forge().query({debug:true,where:{cin_no:llp_no}}).fetch();
        let companyInfo = await CompanyProbeinfo.forge().query({where:{llp_no:llp_no}}).fetch();
        //console.log(companyInfo);
        let companydata=companyInfo.toJSON();
        let invoicedata=JSON.parse(companydata.comprehensive_data)
        //console.log(invoicedata);
       // return res.status(200).json(res.fnSuccess(invoicedata, 'Response Successfully', 200));
        
        let invoice_no=Math.floor(100000 + Math.random() * 900000);
         if(invoicedata)
            {
                var getRes = await invoiceGeneration.report_llp(invoicedata); 

                return res.status(200).json(res.fnSuccess(getRes, 'Response Successfully', 200));
                 

                return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
            }
            else
            {
                return res.status(200).json(res.fnError('', 'Error Occured', 422));
            }
        
    },

      /******generate online search report CIN company************ */
      generateReportJSONDATACIN:async function(req, res, next){
        let company_no=req.params.company_no.replace(/\s/g, '');      
        //let companyInfo = await CompanyProbeinfo.where('cin_no',company_no).fetch();
        //let companyInfo = await CompanyProbeinfo.forge().query({debug:true,where:{cin_no:company_no}}).fetch();
        let companyInfo = await CompanyProbeinfo.forge().query({where:{cin_no:company_no}}).fetch();
        //console.log(companyInfo);
        let companydata=companyInfo.toJSON();
        let invoicedata=JSON.parse(companydata.comprehensive_data)
        //console.log(invoicedata);
        let invoice_no=Math.floor(100000 + Math.random() * 900000);
         if(invoicedata)
            {
                //return res.status(200).json(res.fnSuccess(invoicedata, 'Response Successfully', 200));
                var getRes = await invoiceGeneration.report_cin_test(invoicedata); 

                return res.status(200).json(res.fnSuccess(getRes, 'Response Successfully', 200));
            }
            else
            {
                return res.status(200).json(res.fnError('', 'Error Occured', 422));
            }
        
    },

     /******generate online search report LLP company************ */
     generateReportJSONDATALLP:async function(req, res, next){
        let llp_no=req.params.llp_no.replace(/\s/g, '');      
        //let companyInfo = await CompanyProbeinfo.where('cin_no',llp_no).fetch();
        //let companyInfo = await CompanyProbeinfo.forge().query({debug:true,where:{cin_no:llp_no}}).fetch();
        let companyInfo = await CompanyProbeinfo.forge().query({where:{llp_no:llp_no}}).fetch();
        //console.log(companyInfo);
        let companydata=companyInfo.toJSON();
        let invoicedata=JSON.parse(companydata.comprehensive_data)
        //console.log(invoicedata);
       // return res.status(200).json(res.fnSuccess(invoicedata, 'Response Successfully', 200));
        
        let invoice_no=Math.floor(100000 + Math.random() * 900000);
         if(invoicedata)
            {
                var getRes = await invoiceGeneration.report_llp_test(invoicedata); 

                return res.status(200).json(res.fnSuccess(getRes, 'Response Successfully', 200));
                 

                return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
            }
            else
            {
                return res.status(200).json(res.fnError('', 'Error Occured', 422));
            }
        
    },

    /*********************new fn fr generating multitab excel fr single customer**********************/
    generateExcel:async function(req, res, next){
        let user_id=req.params.user_id;
        let curUserId=user_id;
        //console.log(curUserId);
        let walletInfo = await Wallet.where('user_id', user_id).fetch({debug:true,withRelated: ["user","user_details","CustomerOrderPriceManagement","country_details","state_details","city_details","group_details"]});
        //let walletInfo = await Wallet.where('user_id', user_id).fetch({debug:true,withRelated: ["user","user_details","country_details"]});
        let invoicedata=walletInfo.toJSON();
        console.log(invoicedata);
        let invoice_no=Math.floor(100000 + Math.random() * 900000);
        //console.log(invoice_no);

        /************************for detail excel report *************************** */
        //search investigation row for a particular month
        //user and user details
        //wallet log info fr price of each report
        
        //let range_start_date = _.toBoolean(req.query.range_start_date) ? req.query.range_start_date : false;
        //let range_end_date = _.toBoolean(req.query.range_end_date) ? req.query.range_end_date : false;
       
        
        const date = new Date();
        let range_start_date = new Date(date.getFullYear(), date.getMonth() - 1, 1);//first day of previous month
        let range_end_date =date.setDate(0); // 0 will result in the last day of the previous month

        //let range_start_date =date.setDate(1);// 1 will result in the first day of the present month
       var range_start=false; var range_end= false;
        
       if(range_start_date && range_end_date)
       {
            range_start= moment(new Date(range_start_date).toISOString()).format('YYYY-MM-DD')+' 00:00:00';
            range_end= moment(new Date(range_end_date).toISOString()).format('YYYY-MM-DD')+' 00:00:00'; 
       }

       //get user type of logged in user
       //console.log(user_id);
       let usertypeInfo = await User.where('id', user_id).fetch();
       //console.log(usertypeInfo);
       
       let curUserType=usertypeInfo.toJSON().user_type;
       //let curUserType='HO';
       //console.log(curUserType);
       var allHoBoUser = null;
       if(curUserType=='HO')
        {
            allHoBoUser = await new User().fetchAllUsersUnderHO(curUserId);
            allHoBoUser=allHoBoUser.toJSON();
            allHoBoUser = _.map(allHoBoUser, 'id');
            allHoBoUser.push(Number(curUserId))
            //console.log('allHoBoUser',allHoBoUser)
        }
      
        //console.log('range_start',range_start,'range_end',range_end,'user_id',user_id)
        let searchInvestigation = new SearchInvestigation();
        let searchInvestigationInfo = await searchInvestigation.fetchAllDataReport(range_start,range_end,curUserType,user_id,allHoBoUser);
        
        let invoiceDetaildata=searchInvestigationInfo.toJSON();
        //console.log(invoiceDetaildata);
        /**************************************************************************** */

        let due_date="";
        if(invoicedata.CustomerOrderPriceManagement.payment_terms>0)
        {
            due_date=moment().add(7, 'days').format('DD/MM/YYYY');
            //console.log(due_date);
        }
        else
        {
            due_date=moment().format('DD/MM/YYYY');
        }
        
        if(due_date)
        {
            if(invoicedata)
            {
                invoicedata.due_date=due_date;
                invoicedata.invoice_no=invoice_no;
            
                //console.log(invoicedata);
                invoiceGeneration.generate_excel(invoicedata,invoiceDetaildata,user_id); 

            }
        }

            return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
           
    },

    /*******************fn to get all invoice list with user data */

    getInvoiceList : async function(req,res,next){
        new CustomerReportLog().fetchAllData()
        .then((response)=>{
            // logger.infoLogger.info({
            //     loggedInUserName: 'admin',
            //     ip: req.client._peername.address,
            //     method: "UtilityController.getModuleList",
            //     message: response,
            //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
            // }) 
                   
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })
        .catch((errors)=>{
            // logger.errorLogger.error({
            //     loggedInUserName: 'admin',
            //     ip: req.client._peername.address,
            //     method:  "UtilityController.list",
            //     message: errors,
            //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
            // })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        })
    },

    /*******************send invoice attachment mail**************** */
    sendmailinvoice:async function(req, res, next){
    let id=req.params.id;
    console.log(id);
    let invoiceInfo = await new CustomerReportLog().fetchOne('id',id);
    let invoicedata=invoiceInfo.toJSON();
    //console.log(invoicedata);

    if(invoicedata)
        {
            
            let resmail=await CreditinvoiceMail(invoicedata); 
  
            return res.status(200).json(res.fnSuccess(resmail, 'Response Successfully', 200));
         
        }
        else
        {
            return res.status(200).json(res.fnError('', 'Error Occured', 422));
        }
    
  },
  /****Risk score update in Online serach Details *******/

    riskScoreUpdate : async function (req, res, next) { 

        let id = req.params.id;
        let formData = req.body;

        // let validationRules = {           
        //     risk_score        :   'required',
        //     explanation        :   'required',
        //     comment_on_risk_score        :   'required',
        //     maximum_credit_limit        :   'required',
        //     litigation        :   'required',
        //     comment        :   'required',            
        // }       

        // let validation = new Validator(formData, validationRules);

        // let matched = await validation.check();

        // if (!matched) {
        //     return res.status(200).json(res.fnError(validation.errors,'',400));
        // }

        
        let onlineSearchDetailsApi_data = {
            risk_score        :   formData.risk_score,
            explanation        :   formData.explanation,
            comment_on_risk_score        :   formData.comment_on_risk_score,
            maximum_credit_limit        :   formData.maximum_credit_limit,
            litigation        :   formData.litigation,
            comment        :   formData.comment,     
        }   

        new OnlineSearchDetails({	
            'id': id    
        }).save(onlineSearchDetailsApi_data)             
        .then((response)=>{      
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "utilityController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })          
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
        })         
        .catch((errors) => {   
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "utilityController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })         
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });

    },
}

 

module.exports = UtilityController;


