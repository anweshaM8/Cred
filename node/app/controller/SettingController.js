const Setting       = Model('Setting');
const Validator     = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');

const SettingController = {

    index:function(req, res,next){     

        new Setting().fetchAllData().then((response)=>{
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "RoleController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));
        }).catch((errors)=>{
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "RoleController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));           
        });
    },

    store:async function(req,res,next){
        let formData                = req.body;

        if (!_.isArray(formData)) {
            return res.status(200).json(res.fnError('','Input Data Must be in array!',400)); 
        }

        let validation = new Validator({
            items: formData           
        },
            {
                'items'                 : 'required|array',
                'items.*.access_key'    : 'required|string',
                'items.*.value'         : 'required|string'
            }
        );
        
        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }       
        
        
        Setting.where(1,1).destroy()
        .then((success)=>{
            return new Setting().batchInsert(formData)        
        })
        .then((response)=>{
            return res.status(200).json(res.fnSuccess(formData , 'Saved Successfully', 200 ));   
        })
        .catch((errors)=>{
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
        
    },

    show:function(req, res,next){       

        
    },

    update:async function(req, res,next){         
        
    },

    destroy:function(req,res,next){
        
    },
}

module.exports = SettingController;