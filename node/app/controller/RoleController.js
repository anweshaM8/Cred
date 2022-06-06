const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const Role = Model('Role');
const PermissionRole = Model('PermissionRole');

const RoleController = {
 
    index: function (req, res, next) {
        
        let has_pagination              = _.toBoolean(req.query.pagination);
        let limit                       = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page                        = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let search = _.toBoolean(req.query.search) ? req.query.search : '';

        let role = new Role();
       
        if (has_pagination) {
            role = role.fetchPageData(limit,page,search);
        }
        else{
            role = role.fetchAllData(search);
        }     
 
        role.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "RoleController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })           
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully1', 200 )); 
        }).catch((errors) => {
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

    store: async function (req, res, next) {
        let formData        = req.body;
       
        let validation      = new Validator(formData,{
            name        :   'required|unique:cre_roles,name' ,
            short_code   :   'required|unique:cre_roles,short_code' ,          
        });

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        let role_data = {
            name        :formData.name ,
            short_code  :formData.short_code                    
        }

        let saveRoleData;
        new Role().createData(role_data)        
        .then((data)=>{          
            saveRoleData = data.id;
            if(formData.input_permission){
                let permissionData = [];              
                _.each(formData.input_permission,function (value) {                  
                   permissionData.push({"role_id":data.id,"permission_id":value})
                })                
                return permissionData;               
            }
            else{
                return data;
            }              
            
        })
        .then((permissionArr)=>{
           return new PermissionRole().createOrDelete({role_id:saveRoleData},permissionArr)
        })        
        .then((response)=>{
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "RoleController.create",
                message: saveRoleData,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(saveRoleData , 'Response Successfully', 200 ));               
        })
        .catch((errors)=>{     
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "RoleController.create",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })       
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
    },
 
    show: function (req, res, next) {
        
        let findFor = req.params.id;     

        new Role().fetchOne(findFor)
        .then((response) => {        
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "RoleController.show",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })                 
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })            
        .catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "RoleController.show",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            }) 
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });
    },
  

    update: async function (req, res, next) { 

        let role_id = req.params.id;
        let formData = req.body;
        formData.id = role_id;

        console.log('formData',formData)

        let validationRules = {           
            name: 'required',
            //short_code   :   'required|unique:cre_roles,short_code,'+role_id,                     
        }       

        let validation = new Validator(formData, validationRules);

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors,'',400));
        }

        
        let role_data = {
            name: formData.name,
            short_code  :formData.short_code  
        }   

        new Role({	
            'id': role_id    
        }).save(role_data)
        .then((data)=>{              
            if(formData.input_permission){
                let permissionData = [];              
                _.each(formData.input_permission,function (value) {                  
                   permissionData.push({"role_id":role_id,"permission_id":value})
                })                                    
              new PermissionRole().createOrDelete({role_id:role_id},permissionData) ;
              return data;
            }
            else{
                return data;
            }              
        })                 
        .then((response)=>{      
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "RoleController.update",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })          
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
        })         
        .catch((errors) => {   
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "RoleController.update",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })         
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });

    },

    destroy: function (req, res, next) {
       
    },
}

module.exports = RoleController;


