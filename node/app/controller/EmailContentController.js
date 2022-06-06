const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const EmailContent = Model('EmailContent');


const EmailContentController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
       

        let emailContentData = new EmailContent();

        if (has_pagination) {
            emailContentData = emailContentData.fetchPageData(limit, page);
        }
        else {
            emailContentData = emailContentData.fetchAllData();
        }

        emailContentData.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "EmailContentController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully1', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "EmailContentController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        
    },

    show: function (req, res, next) {

        let findFor = req.params.id; 

        new EmailContent().fetchOne('id', findFor)
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "EmailContentController.show",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "EmailContentController.show",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },


    update: async function (req, res, next) {

        let editId = req.params.id;
        let formData = req.body;
        let validation = new Validator(formData, {
            title: 'required',
            content : 'required',
            created_by: 'required'
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }


        let emailContentData = {
            title : formData.title,
            content : formData.content,
            created_by: formData.created_by
        }

        new EmailContent({
            'id': editId
        }).save(emailContentData)           
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "EmailContentController.update",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "EmailContentController.update",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });

    },

    destroy: function (req, res, next) {

    },
}

module.exports = EmailContentController;


