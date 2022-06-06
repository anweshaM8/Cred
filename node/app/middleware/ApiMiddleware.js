var CryptoJS = require("crypto-js");

module.exports = function(req,res,next){    

    let method          = req.method;
    let methodMessage   = {
        POST    : 'Record created successfully.',
        GET     : 'Record fetched successfully.',
        PUT     : 'Record updated successfully.',
        DELETE  : 'Record removed successfully.'
    };
    let metaData = {
        method : method,
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        at : new Date().toISOString(),
    };

    res['fnSuccess'] = function(response,message=null,code=null){

        let apidata = {status:'success'};
        apidata['code'] = code;   
        apidata['message']  = message || methodMessage[method];
        apidata['data']     = response;

        if(response && typeof response == 'object' && response.pagination){
            apidata['pagination'] = response.pagination; 
        }          

        try{            
            
            return apidata;          
            
        }
        catch(e){
            return apidata;
        }        
        
    };

    res['fnError'] = function(errors,message = null,code=null){

        if(typeof errors !== 'string'){
            dd(errors);
        }
        
        var message = (typeof errors === 'string' && message === null) ? errors : message; 

        let apidata = {status:'error'};

        apidata['code'] = code ;         
        apidata['data'] = [];

        if(message){
            apidata['message'] = message;
        }

        if(Object.keys(errors).length > 0 && typeof errors === 'object'){
            apidata['errors'] = errors;
        }
           
        try{

            /************
             * 
             * Encrypted response with private key encryption
            */

            // let encrypted = CryptoJS.AES.encrypt(JSON.stringify(apidata), process.env.ENCRYPTION_KEY);

            // let encryptedJsonStr = encrypted.toString();             
           
            // return encryptedJsonStr;

            /************
             * 
             * Normal Response
            */


            return apidata;
        }
        catch(e){
            return apidata;
        }   
    };    

    next();
}
