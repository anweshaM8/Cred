const apiRoute = Route('api');
const AuthMiddleware = Middleware('AuthMiddleware');
const ApiMiddleware = Middleware('ApiMiddleware');
const RequestMiddlware = Middleware('RequestMiddlware');
const BearerTokenMiddleware = Middleware('BearerTokenMiddleware');
const PrivilegeMiddleware = Middleware('PrivilegeMiddleware');
const LogMiddleware = Middleware('LogMiddleware');
const DecryptMiddleware = Middleware('DecryptMiddleware');


const ExceptRoute = [
    '/api/login',
    '/api/generate-token'
];

module.exports = function (app) {

    app.get('/', ApiMiddleware, (req, res, next) => { 
        res.send(`Node JS Running on Port ${process.env.APP_PORT}`);
    });    

    app.use('/api/v1', [
        DecryptMiddleware,       
        ApiMiddleware,                       
       // BearerTokenMiddleware.tokenVerify(ExceptRoute),
        LogMiddleware,
        RequestMiddlware,
        PrivilegeMiddleware,
        //AuthMiddleware.Auth(ExceptRoute), 
        // AuthMiddleware.UserToken,        
    ], apiRoute);
 

    app.get('**', ApiMiddleware, (req, res, next) => {
        return res.status(400).json(res.fnError('API url is wrong. please check the documentation.'));
    });
}

