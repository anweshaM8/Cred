const updateHelper = Helper('update-helper');
const logger = require('../../config/winston');
const moment = require('moment');

const StatusChangeController = {

    statusChange: async function (req, res, next) {
       
        if (req.body.model === 'user') {
            new updateHelper.statusUpdate({ is_active: req.body.is_active, id: req.params.id }, "cre_users")
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "StatusChangeController.statusChange",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                }) 
                return res.status(200).json(res.fnSuccess(response[0][1][0] , 'Status successfully updated', 200 ));   
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "errors.statusChange",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                }) 
                return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
            })
        }
    },

    downloadStatusChange: async function (req, res, next) {
       
        if (req.body.model === 'user') {
            new updateHelper.downloadstatusUpdate({ download_status: req.body.download_status, id: req.params.id }, "cre_users")
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "StatusChangeController.downloadStatusChange",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                }) 
                return res.status(200).json(res.fnSuccess(response[0][1][0] , 'Status successfully updated', 200 ));   
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "errors.downloadStatusChange",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                }) 
                return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
            })
        }
    },
    

}

module.exports = StatusChangeController;