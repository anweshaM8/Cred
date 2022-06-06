var passport    = require('passport');
var CryptoJS = require("crypto-js");
const jwt         = require('jsonwebtoken');
var AuthMiddleware = {

    Auth:function(ExceptRoute = null){

        return function(req, res, next){

            if(ExceptRoute.filter(v=>(_.isPatternMatch(req.originalUrl,v) || req.originalUrl === v)).length > 0){
                return next();
            }

            if(req.headers.api_key){
                return next();
            }
            else{
                return res.status(403).json({'status':'error','message':'Token mismatch or unauthorize access.'})
            }
        }
    },
    UserToken:function(req,res,next){
        try{
            if(req.headers.authorization){                   
                let token = req.headers.authorization.split("jwt ");
               
                var decoded = jwt.verify(token[1], process.env.APP_KEY);    

                console.log(decoded.sub_admin_access)
                if(!_.isEmpty(decoded.sub_admin_access)){                  
                    req.header["specific_data"] = true;
                    req.header["access_data"] = decoded.sub_admin_access;                 
                    next();
                }
                else{
                    req.header["specific_data"] = false;
                    req.header["access_data"] = "";
                    next(); 
                }            
            } 
            else{
                req.header["specific_data"] = false;
                req.header["access_data"] = "";
                next(); 
            }           
        }
        catch(e){
            console.log(e)
            return res.status(401).json(res.fnError('This token is invalid.'));
        }        
    }
}


module.exports = AuthMiddleware;