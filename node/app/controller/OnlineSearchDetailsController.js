const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const OnlineSearchDetails = Model('OnlineSearchDetails');


const OnlineSearchDetailsController = {
 
    index: function (req, res, next) {
        
        let has_pagination              = _.toBoolean(req.query.pagination);
        let limit                       = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page                        = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let search_investigation_id = _.toBoolean(req.query.search_investigation_id) ? req.query.search_investigation_id : false;

        let onlineSearchDetails = new OnlineSearchDetails();
       
        if (has_pagination) {
            onlineSearchDetails = onlineSearchDetails.fetchPageData(limit,page,search_investigation_id);
        }
        else{
            onlineSearchDetails = onlineSearchDetails.fetchAllData(search_investigation_id);
        }     
 
        onlineSearchDetails.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "OnlineSearchDetailsController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })           
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully1', 200 )); 
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "OnlineSearchDetailsController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });        
       
    },

    store: async function (req, res, next) {
        let formData        = req.body;
       
        let validation      = new Validator(formData,{
            user_id        :   'required',
            search_investigation_id        :   'required',
            company_basic_info        :   'required',
            company_financial_info        :   'required',
            company_shareholdings        :   'required',
            company_joint_ventures        :   'required',
            company_securities_allotment        :   'required',
            company_gst_details        :   'required',
            company_other_info        :   'required',                     
        });

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        let onlineSearchDetailsapi_data = {
            user_id        :   formData.user_id,
            search_investigation_id        :   formData.search_investigation_id,
            company_basic_info        :   formData.company_basic_info,
            company_financial_info        :   formData.company_financial_info,
            company_shareholdings        :   formData.company_shareholdings,
            company_joint_ventures        :   formData.company_joint_ventures,
            company_securities_allotment        :   formData.company_securities_allotment,
            company_gst_details        :   formData.company_gst_details,
            company_other_info        :   formData.company_other_info,                            
        }

        new OnlineSearchDetails().createData(onlineSearchDetailsapi_data)             
        .then((response)=>{
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "OnlineSearchDetailsController.create",
                message: saveRoleData,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(saveRoleData , 'Response Successfully', 200 ));               
        })
        .catch((errors)=>{     
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "OnlineSearchDetailsController.create",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })       
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
    },
 
    show: function (req, res, next) {
        
        let findFor = req.params.id;     

        new OnlineSearchDetails().fetchOne('id',findFor)
        .then((response) => {        
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "OnlineSearchDetailsController.show",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })                 
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })            
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "OnlineSearchDetailsController.show",
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
            user_id        :   'required',
            search_investigation_id        :   'required',
            company_basic_info        :   'required',
            company_financial_info        :   'required',
            company_shareholdings        :   'required',
            company_joint_ventures        :   'required',
            company_securities_allotment        :   'required',
            company_gst_details        :   'required',
            company_other_info        :   'required',                             
        }       

        let validation = new Validator(formData, validationRules);

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        
        let onlineSearchDetailsApi_data = {
            user_id        :   formData.user_id,
            search_investigation_id        :   formData.search_investigation_id,
            company_basic_info        :   formData.company_basic_info,
            company_financial_info        :   formData.company_financial_info,
            company_shareholdings        :   formData.company_shareholdings,
            company_joint_ventures        :   formData.company_joint_ventures,
            company_securities_allotment        :   formData.company_securities_allotment,
            company_gst_details        :   formData.company_gst_details,
            company_other_info        :   formData.company_other_info,  
        }   

        new OnlineSearchDetails({	
            'id': id    
        }).save(onlineSearchDetailsApi_data)             
        .then((response)=>{      
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "OnlineSearchDetailsController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })          
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
        })         
        .catch((errors) => {   
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "OnlineSearchDetailsController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })         
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });

    },

    destroy: function (req, res, next) {
       
    },

   
}

module.exports = OnlineSearchDetailsController;


