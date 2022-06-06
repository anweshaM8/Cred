const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const FinancialDocs = Model('FinancialDocs');

const FinancialDocsController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let searchInvestigationId = _.toBoolean(req.query.search_investigation_id) ? req.query.search_investigation_id : false;

        let financialDocs = new FinancialDocs();

        if (has_pagination) {
            financialDocs = financialDocs.fetchPageData(limit, page,searchInvestigationId);
        }
        else {
            financialDocs = financialDocs.fetchAllData(searchInvestigationId);
        }

        financialDocs.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "FinancialDocsController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "FinancialDocsController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

         
        let validation = new Validator(formData, {
            search_investigation_id: 'required',
            cin_or_llp_id: 'required',
            company_type: 'required',
            doc_id: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        
        let dataSet = {
            search_investigation_id: formData.search_investigation_id,          
            cin_or_llp_id : formData.cin_or_llp_id,
            company_type: formData.company_type,
            doc_id: formData.doc_id,
            doc_type:formData.doc_type,
            financial_year:formData.financial_year,
            file_link:formData.file_link
        }
        
 
        new FinancialDocs().createData(dataSet)      
            .then((response) => {       
               
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "FinancialDocsController.create",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "FinancialDocsController.create",
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

module.exports = FinancialDocsController;


