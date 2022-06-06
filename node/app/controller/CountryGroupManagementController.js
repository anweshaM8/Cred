const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const CountryGroupManagement = Model('CountryGroupManagement');


const CountryGroupManagementController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let search = _.toBoolean(req.query.search) ? req.query.search : '';
        let groupType = _.toBoolean(req.query.group_type) ? req.query.group_type : '';
        let countryCode = _.toBoolean(req.query.country_code) ? req.query.country_code : 0;
        let groupBy = _.toBoolean(req.query.groupBy) ? req.query.groupBy : false;

        let countryGroupManagement = new CountryGroupManagement();

        if (has_pagination) {
            countryGroupManagement = countryGroupManagement.fetchPageData(limit, page,groupType,countryCode,search,groupBy);
        }
        else {
            countryGroupManagement = countryGroupManagement.fetchAllData(groupType,countryCode,search,groupBy);
        }

        countryGroupManagement.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CountryGroupManagementController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CountryGroupManagementController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

        console.log('formData',formData);
       // return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));

        let validation = new Validator(formData, {
            group_name: 'required',
            group_type: 'required',
            country_code: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
       
        var formattedFormData = [];
        
        if(formData.country_code.length>0)
        {
            for(const val of formData.country_code) {
                formattedFormData.push({
                    group_name : formData.group_name,
                    group_type: formData.group_type,         
                    country_code : parseInt(val),
                    //created_by:formData.created_by,
                    updated_at: new Date()
                })
            }
        }
        else
        {
            return res.status(200).json(res.fnError('', 'Empty Country List', 500));
        }
        let setData = formattedFormData;

            let checkExistingCountry = await new CountryGroupManagement().fetchAllDataWhereIn('country_code',formData.country_code,formData.group_type);
           // console.log('checkExistingCountry',checkExistingCountry);
           if(checkExistingCountry)
           {
                return res.status(200).json(res.fnError('', 'Countries already exists', 500));
           }


        
        
        console.log('setData',setData);
        
        const bookshelf   = Config('database');
        var CountryGroupManagementCollection = bookshelf.Collection.extend({model: CountryGroupManagement});
      
        //console.log('countryGroupManagementCollection',CountryGroupManagementCollection);

        const countryGroupManagementCollection = CountryGroupManagementCollection.forge(setData);
        countryGroupManagementCollection.invokeThen('save')
        .then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CountryGroupManagementController.create",
                message: formData,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
        })
        .catch((errors) => {
                logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CountryGroupManagementController.create",
                message: countryGroupManagement,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(countryGroupManagement, 'Internal Server Error', 500));
        });
 
        // let countryGroupManagement = await countryGroupManagementCollection.bulkSave();
        console.log('countryGroupManagement',countryGroupManagement);
           
        // if(countryGroupManagement)
        // {
        //     logger.infoLogger.info({
        //         loggedInUserName: 'admin',
        //         ip: req.client._peername.address,
        //         method: "CountryGroupManagementController.create",
        //         message: formData,
        //         dataTime: moment().format('YYYY-MM-DD hh:m:s')
        //     })
        //     return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
        // }
        // else
        // {
        //     logger.errorLogger.error({
        //         loggedInUserName: 'admin',
        //         ip: req.client._peername.address,
        //         method: "CountryGroupManagementController.create",
        //         message: countryGroupManagement,
        //         dataTime: moment().format('YYYY-MM-DD hh:m:s')
        //     })
        //     return res.status(200).json(res.fnError(countryGroupManagement, 'Internal Server Error', 500));
        // }

    },

    show: function (req, res, next) {

        let findFor = req.params.id;
        console.log('findFor',findFor)
        new CountryGroupManagement().fetchOne('id', findFor)
            .then((response) => {
                console.log('response',response)
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CountryGroupManagementController.show",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "CountryGroupManagementController.show",
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
            group_name: 'required',
            group_type: 'required',
            country_code: 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        let setData = {
            group_name : formData.group_name,
            group_type: formData.group_type,         
            country_code : parseInt(formData.country_code),
        }
        console.log('setData',setData)
        try {
            let checkExistingCountry = await new CountryGroupManagement().fetchAllDataWhere(setData.country_code,setData.group_type,searchId);

            console.log('checkExistingCountry',checkExistingCountry);
            if(checkExistingCountry)
            {
                return res.status(200).json(res.fnError('', 'Countries already exists', 500));
            }
        } catch (error) {
            return res.status(200).json(res.fnError(error, error.message, 500));
        }
        
           
        new CountryGroupManagement({
            'id': searchId
        }).save(setData)           
        .then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CountryGroupManagementController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
        })
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "CountryGroupManagementController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    destroy: function (req, res, next) {

    },
}

module.exports = CountryGroupManagementController;


