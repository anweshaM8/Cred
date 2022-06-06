const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const Wallet = Model('Wallet');
const CustomerReportLog = Model('CustomerReportLog');

const WalletManagement = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let user_id = _.toBoolean(req.query.user_id) ? _.toInteger(req.query.user_id) : false;

        let wallet = new Wallet();

        if (has_pagination) {
            wallet = wallet.fetchPageData(limit, page,user_id);
        }
        else {
            wallet = wallet.fetchAllData(user_id);
        }

        wallet.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "WalletManagementController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "WalletManagementController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

         
        let validation = new Validator(formData, {
            user_id: 'required',
            total_amount: 'required',
            rebet_amount: 'required',
            paid_status: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        
        let dataSet = {
            user_id: formData.user_id,          
            total_amount : formData.total_amount,
            rebet_amount: formData.rebet_amount,
            paid_status: formData.paid_status,
        }
        
 
        new Wallet().createData(dataSet)      
            .then((response) => {       
                
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "WalletManagementController.create",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "WalletManagementController.create",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },

    show: function (req, res, next) {
        
        let findFor = req.params.id;     

        new Wallet().fetchOne('id',findFor)
        .then((response) => {        
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "WalletManagementController.show",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })                 
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })            
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "WalletManagementController.show",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            }) 
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
    },
  

    update: async function (req, res, next) { 

        let id = req.params.id;
        let formData = req.body;

        let validationRules = {           
           // user_id: 'required',
            total_amount: 'required',
            rebet_amount: 'required',
            paid_status: 'required',                    
        }       

        let validation = new Validator(formData, validationRules);

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        
        let update_data = {
            //user_id: formData.user_id,          
            total_amount : formData.total_amount,
            rebet_amount: formData.rebet_amount,
            paid_status: formData.paid_status,
        } 
        //update invoice payment date

        var todayDate = moment().format('YYYY-MM-DD hh:m:s');

        var startDateForPayment = moment(todayDate).startOf('month').format('YYYY-MM-DD')+' 00:00:00';

        var endDateForPayment = moment(todayDate).endOf('month').format('YYYY-MM-DD')+' 59:59:59';

        console.log('startDate',startDateForPayment,'endDate',endDateForPayment)

        try {
            var customerLogReport = await new CustomerReportLog().fetchOneWithStartEndPaymentDate('user_id',formData.user_id,startDateForPayment ,endDateForPayment) 
            
            console.log('customerLogReport',customerLogReport.toJSON())
            customerLogReport= customerLogReport.toJSON();

            new Wallet({	
                'id': id    
            }).save(update_data)            
            .then((response)=>{ 
                
                var update_dataCustomerReport = {
                    payment_date: todayDate,
                }   
        

                new CustomerReportLog({	
                    'id': customerLogReport.id    
                }).save(update_dataCustomerReport)            
                .then((response1)=>{      
                    
                    logger.infoLogger.info({
                        loggedInUserName: 'admin',
                        ip: req.client._peername.address,
                        method: "WalletManagementController.update",
                        message: response,
                        dataTime: moment().format('YYYY-MM-DD hh:m:s')
                    })          
                    return res.status(200).json(res.fnSuccess(response1 , 'Response Successfully', 200 ));      
                })         
                .catch((errors) => {   
                    logger.errorLogger.error({
                        loggedInUserName: 'admin',
                        ip: req.client._peername.address,
                        method:  "WalletManagementController.update",
                        message: errors,
                        dataTime: moment().format('YYYY-MM-DD hh:m:s')
                    })         
                    return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
                });
        
              
                   
            })         
            .catch((errors) => {   
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method:  "WalletManagementController.update",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })         
                return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
            });
            
        } catch (error1) {
            return res.status(200).json(res.fnError(error1,'Invoice is not generated for this user',500));
        }       

       

    },

    destroy: function (req, res, next) {

    },
}

module.exports = WalletManagement;


