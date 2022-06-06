const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const CustomerOrderPriceManagement = Model('CustomerOrderPriceManagement');
const Wallet = Model('Wallet');


const CustomerOrderPriceManagementController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let search = _.toBoolean(req.query.search) ? req.query.search : '';
        let order_type = _.toBoolean(req.query.order_type) ? req.query.order_type : false;
        let user_id = _.toBoolean(req.query.user_id) ? req.query.user_id : false;
        let group_id = _.toBoolean(req.query.group_id) ? req.query.group_id : false;
       
        let customerOrderPriceManagement = new CustomerOrderPriceManagement();

        if (has_pagination) {
            customerOrderPriceManagement = customerOrderPriceManagement.fetchPageData(limit, page, search, order_type, user_id, group_id);
        }
        else {
            customerOrderPriceManagement = customerOrderPriceManagement.fetchAllData(search ,order_type, user_id, group_id);
        }

        customerOrderPriceManagement.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerOrderPriceManagementController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerOrderPriceManagementController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

        let validation = new Validator(formData, {
            user_id: 'required|integer',
            group_id: 'required|integer',
            order_type: 'required|string',
            cost_per_report: 'required|decimal',
            rebate_amout: 'required|decimal',
            payment_terms:'required|integer',
            tax: 'required|decimal',
        });
       

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        let setData = {
            user_id: formData.user_id,
            group_id: formData.group_id,
            order_type: formData.order_type,
            cost_per_report: formData.cost_per_report,
            rebate_amout: formData.rebate_amout,
            payment_terms:formData.payment_terms,
            tax: formData.tax,
            //created_by:formData.created_by,
        }
 
        new CustomerOrderPriceManagement().createData(setData)           
            .then((response) => {    
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CustomerOrderPriceManagementController.create",
                    message: formData,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                //added to insert wallet row
                let setData_wallet = {
                    user_id: formData.user_id
                   
                }
                new Wallet().createData(setData_wallet).then((response) => {

                    return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                })
                
                
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CustomerOrderPriceManagementController.create",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },


    show: function (req, res, next) {

        let findFor = req.params.id;
        console.log('findFor',findFor)
        new CustomerOrderPriceManagement().fetchOne('id', findFor)
            .then((response) => {
                console.log('response',response)
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CustomerOrderPriceManagementController.show",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CustomerOrderPriceManagementController.show",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },


    update: async function (req, res, next) {

        let searchId = req.params.id;
        let formData = req.body;
        let validation = new Validator(formData, {
            user_id: 'required|integer',
            group_id: 'required|integer',
            order_type: 'required|string',
            cost_per_report: 'required|decimal',
            rebate_amout: 'required|decimal',
            payment_terms:'required|integer',
            tax: 'required|decimal',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        let setData = {
            user_id: formData.user_id,
            group_id: formData.group_id,
            order_type: formData.order_type,
            cost_per_report: formData.cost_per_report,
            rebate_amout: formData.rebate_amout,
            payment_terms:formData.payment_terms,
            tax: formData.tax,
            //created_by:formData.created_by,
            updated_at: new Date()
        }

      console.log('setData',setData)
        new CustomerOrderPriceManagement({
            'id': searchId
        }).save(setData)           
        .then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerOrderPriceManagementController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
        })
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CustomerOrderPriceManagementController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    destroy: function (req, res, next) {

    },
}

module.exports = CustomerOrderPriceManagementController;


