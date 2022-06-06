const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const CustomerReportLog = Model('CustomerReportLog');


const CustomerReportLogController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let groupByUser = _.toBoolean(req.query.groupByUser) ? req.query.groupByUser : false;
        let groupByInvoiceDate = _.toBoolean(req.query.groupByInvoiceDate) ? req.query.groupByInvoiceDate : false;
        let checkPaymentDate = _.toBoolean(req.query.checkPaymentDate) ? req.query.checkPaymentDate : false;
        let checkPaymentOrRebateApprovedate = _.toBoolean(req.query.checkPaymentOrRebateApprovedate) ? req.query.checkPaymentOrRebateApprovedate : false;
        let user_id = _.toBoolean(req.query.user_id) ? req.query.user_id : false;
        let startDateForPayment = _.toBoolean(req.query.startDateForPayment) ? req.query.startDateForPayment : false;
        let endDateForPayment = _.toBoolean(req.query.endDateForPayment) ? req.query.endDateForPayment : false;

        let customerReportLog = new CustomerReportLog();

        if (has_pagination) {
            customerReportLog = customerReportLog.fetchPageData(limit, page,groupByUser,groupByInvoiceDate,checkPaymentDate,checkPaymentOrRebateApprovedate,user_id,startDateForPayment,endDateForPaymentt);
        }
        else {
            customerReportLog = customerReportLog.fetchAllData(groupByUser,groupByInvoiceDate,checkPaymentDate,checkPaymentOrRebateApprovedate,user_id,startDateForPayment,endDateForPayment);
        }

        customerReportLog.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerReportLogController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerReportLogController.list",
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
            invoice_date: 'required',
            invoice_no: 'required',
            invoice_link: 'required',
            total_amount: 'required',
            rebate_amount: 'required',
            payment_date: 'required',
            payment_approve_status: 'required',
            payment_approve_date: 'required',
            rebate_approve_status: 'required',
            rebate_approve_date: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        
        let dataSet = {
            user_id: formData.user_id,
            invoice_date: formData.invoice_date,
            invoice_no: formData.invoice_no,
            invoice_link: formData.invoice_link,
            total_amount: formData.total_amount,
            rebate_amount: formData.rebate_amount,
            payment_date: formData.payment_date,
            payment_approve_status: formData.payment_approve_status,
            payment_approve_date: formData.rebate_approve_date,
            rebate_approve_status: formData.rebate_approve_status,
            rebate_approve_date: formData.rebate_approve_date,
        }
        
 
        new CustomerReportLog().createData(dataSet)      
            .then((response) => {       
                
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CustomerReportLogController.create",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CustomerReportLogController.create",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },

    show: function (req, res, next) {
        
        let findFor = req.params.id;     

        new CustomerReportLog().fetchOne('id',findFor)
        .then((response) => {        
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerReportLogController.show",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })                 
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })            
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "CustomerReportLogController.show",
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
            //user_id: 'required',
            invoice_date: 'required',
            invoice_no: 'required',
            invoice_link: 'required',
            total_amount: 'required',
            rebate_amount: 'required',
            payment_date: 'required',
            payment_approve_status: 'required',
            payment_approve_date: 'required',
            rebate_approve_status: 'required',
            rebate_approve_date: 'required',                 
        }       

        let validation = new Validator(formData, validationRules);

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        
        let update_data = {
            //user_id: formData.user_id,
            invoice_date: formData.invoice_date,
            invoice_no: formData.invoice_no,
            invoice_link: formData.invoice_link,
            total_amount: formData.total_amount,
            rebate_amount: formData.rebate_amount,
            payment_date: formData.payment_date,
            payment_approve_status: formData.payment_approve_status,
            payment_approve_date: formData.rebate_approve_date,
            rebate_approve_status: formData.rebate_approve_status,
            rebate_approve_date: formData.rebate_approve_date,
        }   

        new CustomerReportLog({	
            'id': id    
        }).save(update_data)            
        .then((response)=>{      
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerReportLogController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })          
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
        })         
        .catch((errors) => {   
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "CustomerReportLogController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })         
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });

    },

    destroy: function (req, res, next) {

    },
}

module.exports = CustomerReportLogController;


