const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const Module = Model('Module');
const SearchInvestigation = Model('SearchInvestigation');
const User = Model('User');
const CustomerOrderPriceManagement = Model('CustomerOrderPriceManagement');
const _ = require("lodash");
const OrderLink = Mail('OrderLink');


const UtilityController = {
 
    getModuleList : async function(req,res,next){
        new Module().fetchAllData()
        .then((response)=>{
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "UtilityController.getModuleList",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })           
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
        })
        .catch((errors)=>{
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method:  "UtilityController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        })
    },
    //order pdf from admin in order list    
    uploadOrder : async function(req,res,next){

        let searchId = req.params.id;
        let formData = req.body;
        console.log('req.params',req.params,'req.body',req.body)

         let validation = new Validator(formData, {
            user_id: 'required',
            order_link: 'required',
            status: 'required|string',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        let setData = {
            user_id : formData.user_id,          
            order_link:formData.order_link,
            status:formData.status
        }

        new CustomerOrderPriceManagement().fetchOne('user_id',formData.user_id)           
        .then((response) => {               
            
            new SearchInvestigation({
                'id': searchId
            }).save(setData)           
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.uploadOrder",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
    
                new SearchInvestigation().fetchOne(searchId).then((result) => {
    
                    result=result.toJSON();
    
                    //console.log('result',result)

                      new User().fetchOne('id', `${result.user_id}`).then((user) => {
    
                        user=user.toJSON();
        
                        //console.log('user',user)

                         const orderLink = formData.order_link;
    
                         OrderLink(result,user,orderLink );
        
            
            
                         return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
        
                        
                    }).catch((errors) => {
                        return res.status(200).json(res.fnError(errors, 'User not found', 500));
                    });
    
                    
                    //return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                }).catch((errors) => {
                    return res.status(200).json(res.fnError(errors, 'No order list found to update', 500));
                });
    
                // return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.uploadOrder",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
        })
        .catch((errors) => {
          
            return res.status(200).json(res.fnError(errors, 'can\'t upload order if no price list exist on this user', 500));
        });


    },   

    //user list count
    userListCount : async function(req,res,next){
        let userType = _.toBoolean(req.query.type) ? req.query.type : false;
        let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;

        let headOfficUserId = _.toBoolean(req.query.head_office_user_id) ? req.query.head_office_user_id : false;

        let userData = new User();

        
            userData = userData.count(userType, isActive, headOfficUserId);

            userData.then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.userListCount",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            }).catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UtilityController.userListCount",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },
}

module.exports = UtilityController;


