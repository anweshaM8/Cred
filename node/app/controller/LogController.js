const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const Log = Model('Log');

const LogController = {
 
    index: function (req, res, next) {        

        let logData = new Log();

        let fromDate = _.toBoolean(req.query.start_date) ? new Date(req.query.start_date).format('yyyy-mm-dd') : moment().format('YYYY-MM-DD');
        let toDate = _.toBoolean(req.query.end_date) ? new Date(req.query.end_date).format('yyyy-mm-dd') : moment().format('YYYY-MM-DD');

       
        logData = logData.fetchAllData(fromDate,toDate);     

        logData.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "logController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })           
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "logController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });        
       
    },

    store: async function (req, res, next) {},
 
    show: function (req, res, next) {

        let findFor = req.params.id;     

        new Log().fetchOne('date',findFor)
        .then((response) => {        
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "LOgController.show",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })                 
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })            
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "LOgController.show",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            }) 
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
    },
  

    update: async function (req, res, next) { },

    destroy: function (req, res, next) {},
}

module.exports = LogController;


