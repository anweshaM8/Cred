const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const ContactUs = Model('ContactUs');
const ContactUsMail = Mail('ContactUs');

const ContactUsController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;

        let contactUs = new ContactUs();

        if (has_pagination) {
            contactUs = contactUs.fetchPageData(limit, page);
        }
        else {
            contactUs = contactUs.fetchAllData(isActive);
        }

        contactUs.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "ContactUsController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "ContactUsController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

         
        let validation = new Validator(formData, {
            name: 'required',
            email: 'required|string|email',
            phone_number: 'required',
            message: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        
        let dataSet = {
            name: formData.name,          
            email : formData.email,
            phone_number: formData.phone_number,
            message: formData.message,
        }
        
 
        new ContactUs().createData(dataSet)      
            .then((response) => {       
                ContactUsMail(dataSet)   ;
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "ContactUsController.create",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "ContactUsController.create",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },

    show: function (req, res, next) {

        
    },


    update: async function (req, res, next) {

       

    },

    destroy: function (req, res, next) {

    },
}

module.exports = ContactUsController;


