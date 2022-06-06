let jwt = require('jsonwebtoken');

var AuthMiddleware = {

    tokenVerify:function(ExceptRoute = null){
        return function(req, res, next){          
            if(ExceptRoute.filter(v=>(_.isPatternMatch(req.originalUrl,v) || req.originalUrl === v)).length > 0){
                return next();
            }

            let token = req.headers['x-access-token'] || ''; 

            if (token) {
                let accessToken = token.split("Bearer ");
                jwt.verify(accessToken[1], process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(401).json(res.fnError('','This token is invalid.',401));
                       
                    } else {                           
                        req.decoded = decoded;                    
                        next();
                    }
                });
            } else {
                return res.status(401).json(res.fnError('','Auth token is not supplied',203));             
            }
        }
    }
}

module.exports = AuthMiddleware;