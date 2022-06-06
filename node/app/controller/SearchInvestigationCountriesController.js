const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const SearchInvestigationCountries = Model('SearchInvestigationCountries');


const SearchInvestigationCountriesController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;

        let searchInvestigationCountries = new SearchInvestigationCountries();

        if (has_pagination) {
            searchInvestigationCountries = searchInvestigationCountries.fetchPageData(limit, page);
        }
        else {
            searchInvestigationCountries = searchInvestigationCountries.fetchAllData();
        }

        searchInvestigationCountries.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "SearchInvestigationCountriesController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "SearchInvestigationCountriesController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

         
        let validation = new Validator(formData, {
            country_name: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        
        let dataSet = {
            country_name: formData.country_name,          
        }
        
 
        new SearchInvestigationCountries().createData(dataSet)      
            .then((response) => {       
               
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationCountriesController.create",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationCountriesController.create",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },

    show: function (req, res, next) {

        let findFor = req.params.id; 

        new SearchInvestigationCountries().fetchOne('id', findFor)
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationCountriesController.show",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationCountriesController.show",
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
            country_name: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }


        let dataSet = {
            country_name: formData.country_name,          
        }

        new SearchInvestigationCountries({
            'id': editId
        }).save(dataSet)           
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationCountriesController.update", 
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationCountriesController.update",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });

    },

    destroy: function (req, res, next) {

    },
}

module.exports = SearchInvestigationCountriesController;
