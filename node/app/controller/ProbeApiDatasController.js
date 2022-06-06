const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const ProbeApiDatas = Model('ProbeApiDatas');


const ProbeApiDatasController = {
 
    index: function (req, res, next) {
        
        let has_pagination              = _.toBoolean(req.query.pagination);
        let limit                       = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page                        = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let search = _.toBoolean(req.query.search) ? req.query.search : '';

        let probeApiDatas = new ProbeApiDatas();
       
        if (has_pagination) {
            probeApiDatas = probeApiDatas.fetchPageData(limit,page,search);
        }
        else{
            probeApiDatas = probeApiDatas.fetchAllData(search);
        }     
 
        probeApiDatas.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "ProbeApiDatasController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })           
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully1', 200 )); 
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "ProbeApiDatasController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });        
       
    },

    store: async function (req, res, next) {
        let formData        = req.body;
       
        let validation      = new Validator(formData,{
            api_type        :   'required',
            api_name        :   'required',
            api_request        :   'required',
            api_result        :   'required',                     
        });

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        let probeApi_data = {
            api_type        :   formData.api_type,
            api_name        :   formData.api_name,
            api_request        :   formData.api_request,
            api_result        :   formData.api_result,                           
        }

        let saveRoleData;
        new ProbeApiDatas().createData(probeApi_data)             
        .then((response)=>{
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "ProbeApiDatasController.create",
                message: saveRoleData,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(saveRoleData , 'Response Successfully', 200 ));               
        })
        .catch((errors)=>{     
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "ProbeApiDatasController.create",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })       
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
    },
 
    show: function (req, res, next) {
        
        let findFor = req.params.id;     

        new ProbeApiDatas().fetchOne(findFor)
        .then((response) => {        
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "ProbeApiDatasController.show",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })                 
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })            
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "ProbeApiDatasController.show",
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
            api_type        :   'required',
            api_name        :   'required',
            api_request        :   'required',
            api_result        :   'required',                            
        }       

        let validation = new Validator(formData, validationRules);

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        
        let probeApi_data = {
            api_type        :   formData.api_type,
            api_name        :   formData.api_name,
            api_request        :   formData.api_request,
            api_result        :   formData.api_result,   
        }   

        new ProbeApiDatas({	
            'id': id    
        }).save(probeApi_data)             
        .then((response)=>{      
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "ProbeApiDatasController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })          
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
        })         
        .catch((errors) => {   
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "ProbeApiDatasController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })         
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });

    },

    destroy: function (req, res, next) {
       
    },
}

module.exports = ProbeApiDatasController;


