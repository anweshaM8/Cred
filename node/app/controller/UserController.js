const Validator = Helper('validator');
const moment = require('moment');
const logger = require('../../config/winston');
const User = Model('User');
const UserDetail = Model('UserDetail');
const bcrypt = require('bcryptjs');
const UserEmailPassword = Mail('UserEmailPassword');
const RoleUser = Model('RoleUser')
const Country = Model('Country')

const UserController = {

    index: function (req, res, next) {

        let has_pagination = _.toBoolean(req.query.pagination);
        let limit = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;
        let userType = _.toBoolean(req.query.type) ? req.query.type : false;
        let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;

        let searchKeyword = _.toBoolean(req.query.search) ? req.query.search : false;
        let registrationType = _.toBoolean(req.query.registration_type) ? req.query.registration_type : false;
        let searchStatus = _.toBoolean(req.query.status) ? req.query.status : (req.query.status ==0) ? 0 :false;
        let headOfficUserId = _.toBoolean(req.query.head_office_user_id) ? req.query.head_office_user_id : false;

        let userData = new User();

        if (has_pagination) {
            userData = userData.fetchPageData(userType,limit, page, isActive, searchKeyword, registrationType, searchStatus, headOfficUserId);
        }
        else {
            userData = userData.fetchAllData(userType, isActive, searchKeyword, registrationType, searchStatus, headOfficUserId);
        }

        userData.then((response) => {
            logger.infoLogger.info({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "UserController.list",
                message: response,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
        }).catch((errors) => {
            logger.errorLogger.error({
                loggedInUserName: 'admin',
                ip: req.client._peername.address,
                method: "UserController.list",
                message: errors,
                dataTime: moment().format('YYYY-MM-DD hh:m:s')
            })
            return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
        });

    },

    store: async function (req, res, next) {
        let formData = req.body;

         
        let validation = new Validator(formData, {
            name: 'required',
            user_name: 'required|string|email|unique:cre_users,user_name',
            phone_code : 'required',
            phone_number: 'required',
            created_by: 'required',
            user_type: 'required',
            country_id : 'required',
            state_id : 'required',
            city_id : 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        
        let pwdGenerate = await generateRandomString(8);
        var passwordValue = bcrypt.hashSync(pwdGenerate, 10);
console.log(pwdGenerate,'pwdGeneratepwdGenerate')
        let userData = {
            user_name: formData.user_name,
            branch_office_code:formData.branch_office_code,
            password: passwordValue ,
            phone_code : formData.phone_code,
            phone_number: formData.phone_number,
            user_type: formData.user_type,
            created_by: formData.created_by,
            head_office_user_id:formData.head_office_user_id
        }
        console.log('userData',userData)

        var getCountryDetails = await new Country().fetchOne('id',Number(formData.country_id));
        getCountryDetails=getCountryDetails.toJSON();
        
        console.log('getCountryDetails',getCountryDetails)
 
        new User().createData(userData)
            .then(async (data) => {
                let lastInsertId = data.id;          

                let uID = await generateCustomerUniqueId(formData,lastInsertId,getCountryDetails);

                new User({
                    'id': lastInsertId
                }).save({
                    'unique_id': `${uID}`
                })

                let userDetailData = {
                    user_id: lastInsertId,
                    name: formData.name,
                    address: (formData.address ) ? formData.address : "",
                    country_id : formData.country_id,
                    state_id : formData.state_id,
                    city_id : formData.city_id,
                    zip_code : formData.zip_code,
                    
                }
                
                return new UserDetail().createData(userDetailData);
            })
            .then((response) => {
                if (formData.role_id) {
                    new RoleUser().save({ role_id: formData.role_id, user_id: response.get('user_id') });
                }
                let emailLink = process.env.FRONTEND_URL;
                UserEmailPassword(formData, emailLink,pwdGenerate );
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UserController.create",
                    message: formData,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UserController.create",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },

    show: function (req, res, next) {

        let findFor = req.params.id;

        new User().fetchOne('id', findFor)
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UserController.show",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UserController.show",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });
    },


    update: async function (req, res, next) {

        let userId = req.params.id;
        let formData = req.body;
        let validation = new Validator(formData, {
            name: 'required',
            phone_code : 'required',
            phone_number: 'required',
            created_by: 'required',
           // user_type: 'required',
            country_id : 'required',
            state_id : 'required',
            city_id : 'required',
        });

        let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }


        let userData = {
            user_name: formData.user_name,
            branch_office_code:formData.branch_office_code,
            phone_code : formData.phone_code,
            phone_number: formData.phone_number,
           // user_type: formData.user_type,
            created_by: formData.created_by,
            head_office_user_id:formData.head_office_user_id
           
        }

      
        new User({
            'id': userId
        }).save(userData)
            .then(async (data) => {
                let userDetailData = {
                    user_id: userId,
                    name: formData.name,
                    address: (formData.address ) ? formData.address : "",
                    country_id : formData.country_id,
                    state_id : formData.state_id,
                    city_id : formData.city_id,
                    zip_code : formData.zip_code,
                }
                console.log(userDetailData,'ssss')
                new UserDetail().createOrUpdate(userDetailData,["user_id","name","address","country_id","state_id","city_id","zip_code","customer_bank_name"]);
                return true;
            })
            .then((response) => {
                logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UserController.update",
                    message: response,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            })
            .catch((errors) => {
                logger.errorLogger.error({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "UserController.update",
                    message: errors,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });

    },

    destroy: function (req, res, next) {

    },
}

module.exports = UserController;


