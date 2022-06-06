const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const SearchInvestigation = Model('SearchInvestigation');
const User = Model('User');
const OrderLink = Mail('OrderLink');
const CustomerOrderPriceManagement = Model('CustomerOrderPriceManagement');
const _ = require("lodash");

const SearchInvestigationController = {

    index: async function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let type = _.toBoolean(req.query.type) ? req.query.type : false;


        let company_name = _.toBoolean(req.query.company_name) &&  req.query.company_name!=""? req.query.company_name : false;
        let company_address = _.toBoolean(req.query.company_address) && req.query.company_address!=""? req.query.company_address : false;
        let company_contact = _.toBoolean(req.query.company_contact) && req.query.company_contact!=""? req.query.company_contact : false;
        let postal_code = _.toBoolean(req.query.postal_code) && req.query.postal_code!="" ? req.query.postal_code : false;
        let contact_email = _.toBoolean(req.query.contact_email) && req.query.contact_email!=""? req.query.contact_email : false;
        let gst_vat_reg_number = _.toBoolean(req.query.gst_vat_reg_number) && req.query.gst_vat_reg_number!=""? req.query.gst_vat_reg_number : false;
        let internal_reference_no = _.toBoolean(req.query.internal_reference_no) && req.query.internal_reference_no!="" ? req.query.internal_reference_no : false;
        let status = req.query.status !=null? req.query.status : false;
        let range_start_date = _.toBoolean(req.query.range_start_date) ? req.query.range_start_date : false;
        let range_end_date = _.toBoolean(req.query.range_end_date) ? req.query.range_end_date : false;
        let curUserType = _.toBoolean(req.query.curUserType) ? req.query.curUserType : false;
        let curUserId = _.toBoolean(req.query.curUserId) ? req.query.curUserId : false;

        let country_id =  req.query.country_id!=null? req.query.country_id : false;
        let searchKeyword = req.query.searchKeyword!=null? req.query.searchKeyword : false;

        let showList = _.toBoolean(req.query.showList) ? req.query.showList : false;
        

       console.log('company_name',company_name,'company_address',company_address,'company_contact',company_contact
       ,'postal_code',postal_code,'contact_email',contact_email,'gst_vat_reg_number',gst_vat_reg_number,'internal_reference_no',internal_reference_no
       ,'status',status,'range_start_date',range_start_date,'range_end_date',range_end_date,'country_id',country_id,'searchKeyword',searchKeyword)

       var range_start=false; var range_end= false;
        
       if(range_start_date && range_end_date)
       {
            range_start= moment(new Date(range_start_date).toISOString()).format('YYYY-MM-DD')+' 00:00:00';
            range_end= moment(new Date(range_end_date).toISOString()).format('YYYY-MM-DD')+' 00:00:00'; 
       }
      
       console.log('range_start',range_start,'range_end',range_end,'curUserType',curUserType,'curUserId',curUserId)
       

       var allHoBoUser = null;
       if(curUserType=='HO')
        {
            allHoBoUser = await new User().fetchAllUsersUnderHO(curUserId);
            allHoBoUser=allHoBoUser.toJSON();
            allHoBoUser = _.map(allHoBoUser, 'id');
            allHoBoUser.push(Number(curUserId))
            console.log('allHoBoUser',allHoBoUser)
        }

        let searchInvestigation = new SearchInvestigation();

        if (has_pagination) {
            searchInvestigation = searchInvestigation.fetchPageData(limit, page,type,company_name,company_address,company_contact
                ,postal_code,contact_email,gst_vat_reg_number,internal_reference_no
                ,status,range_start,range_end,curUserType,curUserId,allHoBoUser,country_id,searchKeyword,showList);
        }
        else {
            searchInvestigation = searchInvestigation.fetchAllData(type,company_name,company_address,company_contact
                ,postal_code,contact_email,gst_vat_reg_number,internal_reference_no
                ,status,range_start,range_end,curUserType,curUserId,allHoBoUser,country_id,searchKeyword,showList);
        }

        searchInvestigation.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "SearchInvestigationController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "SearchInvestigationController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        console.log('storeSEARCH');
        let formData = req.body;

         
        let validation = new Validator(formData, {
            user_id: 'required',
            type: 'required',
            company_name: 'required|string',
            company_address : 'required',           
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        /*********************modified to add contact email and user name in search table ********/

         //fetch user name and email to be saved in search table
         let user_id=formData.user_id;
         new User().fetchOne('id', `${user_id}`).then((user) => {
    
            let userInfo=user.toJSON();
            let contact_email='';
            let contact_name='';
            if(!formData.contact_email||formData.contact_email=='')
            {
                contact_email=userInfo.user_name;              
            }
            else{
                contact_email=formData.contact_email;
            }

            contact_name=userInfo.userDetail.name;

            let setData = {
                user_id : formData.user_id,
                type: formData.type,         
                company_name : formData.company_name,
                company_address: formData.company_address,
                country_id:formData.country_id,
                company_contact:formData.company_contact,
                postal_code:formData.postal_code,
                //contact_email:formData.contact_email,
                contact_email:contact_email,
                contact_name:contact_name,
                gst_vat_reg_number:formData.gst_vat_reg_number,
                pi_link:formData.pi_link,
                order_link:formData.order_link,
                internal_reference_no:formData.internal_reference_no,
                //adding flag for order-list
                search_list:'show',
            }
            
    
            new SearchInvestigation().createData(setData)           
                .then((response) => {               
                    logger.infoLogger.info({
                        loggedInUserName: 'admin',
                        ip: req.client._peername.address,
                        method: "SearchInvestigationController.create",
                        message: formData,
                        dataTime: moment().format('YYYY-MM-DD hh:m:s')
                    })
                    return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                })
                .catch((errors) => {
                    logger.errorLogger.error({
                        loggedInUserName: 'admin',
                        ip: req.client._peername.address,
                        method: "SearchInvestigationController.create",
                        message: errors,
                        dataTime: moment().format('YYYY-MM-DD hh:m:s')
                    })
                    return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
                });

            })
            .catch((errors)=>{     
                // logger.errorLogger.error({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method:  "ProbeApiDatasController.create",
                //     message: errors,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })       
                return res.status(200).json(res.fnError(errors,'No user found',500));
            });  
    },

    show: function (req, res, next) {

        let findFor = req.params.id;

        new SearchInvestigation().fetchOne('id', findFor)
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationController.show",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationController.show",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },


    update: async function (req, res, next) {

        let searchId = req.params.id;
        let formData = req.body;
        console.log('req.params',req.params,'req.body',req.body)
        //return false;
        let validation = new Validator(formData, {
            user_id: 'required',
            type: 'required',
            company_name: 'required|string',
            company_address : 'required', 
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        let setData = {
            user_id : formData.user_id,
            type: formData.type,         
            company_name : formData.company_name,
            company_address: formData.company_address,
            country_id:formData.country_id,
            company_contact:formData.company_contact,
            postal_code:formData.postal_code,
            contact_email:formData.contact_email,
            gst_vat_reg_number:formData.gst_vat_reg_number,
            pi_link:formData.pi_link,
            order_link:formData.order_link,
            internal_reference_no:formData.internal_reference_no,
            status:formData.status
        }

                     
            
            new SearchInvestigation({
                'id': searchId
            }).save(setData)           
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationController.update",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
    
                 return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "SearchInvestigationController.update",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
        

       

    },

    destroy: function (req, res, next) {

    },
}

module.exports = SearchInvestigationController;


