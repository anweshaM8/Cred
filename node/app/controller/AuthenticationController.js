const Validator = Helper('validator');
const User = Model('User');
const UserDetail = Model('UserDetail');
const bcrypt = require('bcryptjs');
const logger = require('../../config/winston');
const moment = require('moment');
// const encrypt = encrypt('User');
// const dencrypt = decrypt('User');

const UserForgetPassword = Mail('UserForgetPassword');


const AuthenticationController = {

    doAuthorization: async function (req, res, next) {
        let formData = req.body;

        var validationAdmin = new Validator(formData, {
            user_name: 'required|email', 
            password: 'required|string',           
        });
        let matched = await validationAdmin.check();

        
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        try {
            var user = User.where('user_name', `${formData.user_name}`);
            user
                .fetch()
                .then((user) => {
                    if (!user) {
                        return res.status(200).json(res.fnError(errors, 'No User found', 500));
                    }
                    else {
                        

                        if (!bcrypt.compareSync(formData.password, user.get('password'))) {
                            return res.status(200).json(res.fnError('', 'Password does not match.', 422));
                        }
                        if (user.get('is_first_time_login') == 1) {
                            return user;
                        }else{
                            if (user.get('is_active') == 0) {
                                return res.status(200).json(res.fnError('', 'Please active your account', 401));
                            }
                        }
                        if (user.get('is_login') == 1) {
                            new User({
                                'id': user.get('id')
                            }).save({ "token": '', "is_login": 0 })

                            // return res.status(200).json(res.fnError('', 'You have already logged in from another device', 401));
                        }
                        let generateSystemToken = generateRandomString(25);
                        return new User().getAuthorizeToken(user.get('id'), generateSystemToken);
                    }
                })
                .then((userData) => {
                    return res.status(200).json(res.fnSuccess(userData, 'Response Successfully', 200));
                })
                .catch((errors) => {
                    return res.status(200).json(res.fnError(errors, 'These credentials do not match our records', 200));
                });
        }
        catch (e) {
            return res.status(200).json(res.fnError('', 'User Not found', 422));
        }


    },
    setPassword: async function (req, res, next) {
        let formData = req.body;

        var validation = new Validator(formData, {
            current_password: 'required',
            new_password: 'required',
            unique_id: 'required'
        });
        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }
        try {
            new User().fetchOne('unique_id', formData.unique_id)
            .then(async (user) => {
                    if (!user) {
                        return res.status(200).json(res.fnError(errors, 'No User found', 500));
                    }
                    else {
                        if (!bcrypt.compareSync(formData.current_password, user.get('password'))) {
                            return res.status(200).json(res.fnError('', 'Old Password does not match.', 422));
                        }                       
                        if (user.get('is_login') == 1) {
                            return res.status(200).json(res.fnError('', 'You have already logged in from another device', 401));
                        }
                        let generateSystemToken = generateRandomString(25);
                       return await new User({	
                            'id': user.get('id')    
                        }).save({"password": bcrypt.hashSync(formData.new_password, 10),"is_first_time_login":0,"is_active":1,"is_login": 0})
                       
                        // return new User().getAuthorizeToken(user.get('id'), generateSystemToken);
                    }
                })
                .then((userData) => {
                    return res.status(200).json(res.fnSuccess(userData, 'Response Successfully', 200));
                })
                .catch((errors) => {
                    return res.status(200).json(res.fnError(errors, 'These credentials do not match our records', 200));
                });
        }
        catch (e) {
            console.log(e)
            return res.status(200).json(res.fnError('', 'User Not found', 422));
        }


    },
    ChangePassword: async function (req, res, next) {
        let formData = req.body;
        let validation = new Validator(formData, {
            user_id: 'required',
            // current_password: 'required|string|maxLength:250',
            new_password: 'required|string|maxLength:250'
        });

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        User.where('id', formData.user_id).fetch()
            .then((user) => {
                if (!user) {
                    return res.status(200).json(res.fnError('', 'These email address does not exists in our records.', 400));
                }
                if(formData.current_password){
                    if (!bcrypt.compareSync(formData.current_password, user.get('password'))) {
                        return res.status(200).json(res.fnError('', 'Old password does not match', 400));
                    }
                }
                

                let save_data = {
                    password: bcrypt.hashSync(formData.new_password, 10)
                }

                user.save(save_data, { patch: true }).then((response) => {
                    return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));
                }).catch((errors) => {
                    return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
                });
            }).catch((errors) => {
                return res.status(200).json(res.fnSuccess(errors, 'No Data Found', 200));
            })
    },
    logout: async function (req, res, next) {

        let formData = req.body;
        let validation = new Validator(formData, {
            user_id: 'required'
        });

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        new User({
            'id': formData.user_id
        }).save({ "token": "", "is_login": 0 })
            .then((user) => {
                return res.status(200).json(res.fnSuccess('', 'Logout Successfully', 200));
            })
            .catch((errors) => {
                return res.status(400).json(res.fnError(errors));
            });
    },
    ForgetPassword: async function (req, res, next) {
        let formData = req.body;

        console.log('formdata',formData)

        var validationAdmin = new Validator(formData, {
            user_name: 'required|email',           
        });
        let matched = await validationAdmin.check();

        
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        try {
             new User().fetchOne('user_name', `${formData.user_name}`).then((user) => {

                user=user.toJSON();

               

                if(user.is_login==0)
                {
                    return res.status(200).json(res.fnError('', 'Please login first', 500));
                }

                if(user.is_active==0)
                {
                    return res.status(200).json(res.fnError('', 'User is not active yet', 500));
                }

                console.log('user',user)

                const encryptedUserName =  encryption(formData.user_name);
                const forgetPasswordLink = process.env.FRONTEND_URL+`reset-password/${encryptedUserName}`;

                 UserForgetPassword(user, forgetPasswordLink );

                    logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "AuthenticationController.ForgetPassword",
                    message: formData,
                    dataTime: moment()
                });


                return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
            }).catch((errors) => {
                return res.status(200).json(res.fnError(errors, 'User not found', 500));
            });
            
        
        }
        catch (e) {
            return res.status(200).json(res.fnError('', 'User Not found', 422));
        }
    },
    ResetPassword: async function (req, res, next) {
        let formData = req.body;
        let validation = new Validator(formData, {
            user_name_enc: 'required',
            // current_password: 'required|string|maxLength:250',
            new_password: 'required|string|maxLength:250'
        });

        let matched = await validation.check();

        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

        var userName = await decryption(formData.user_name_enc);
        console.log('userName',userName)

        try {
             new User().fetchOne('user_name', `${userName}`).then((user) => {
                user=user.toJSON();

                let save_data = {
                    password: bcrypt.hashSync(formData.new_password, 10)
                }
    
                console.log('save_data',save_data,'userid',user.id)
    
                 logger.infoLogger.info({
                    loggedInUserName: 'admin',
                    ip: req.client._peername.address,
                    method: "AuthenticationController.ResetPassword",
                    message: formData,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                })
                
                new User({
                            'id': user.id
                        }).save(save_data)
                        .then((response) => {
                            return res.status(200).json(res.fnSuccess(formData, 'Response Successfully', 200));
                        }).catch((errors1) => {
                            return res.status(200).json(res.fnError(errors1, 'Internal Server Error', 500));
                        });

            }).catch((errors) => {
                return res.status(200).json(res.fnError(errors, 'No User found', 500));
            });
            
          
        }
        catch (e) {
            return res.status(200).json(res.fnError('', 'Error Occured', 422));
        }
    },



}


module.exports = AuthenticationController;