module.exports = function(req, res, next){
    var CryptoJS = require("crypto-js");
    switch(req.method) {
        case 'POST':
            dd('POST===');
            if(process.env.APP_ENV === 'production' || process.env.APP_ENV === 'staging'){
                var text = decodeURIComponent(req.body.inputs);
                var secret = process.env.ENCRYPTION_KEY;
                
                var key = CryptoJS.PBKDF2(secret, CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
                var decrypted = CryptoJS.AES.decrypt(text.substring(64) /* encrypted */, key, { iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
                
                req.body = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
                next();
            }
            else{
                req.body = req.body;
                next(); 
            }
        break;
        case 'PUT':
            dd('PUT');

            if(process.env.APP_ENV === 'production' || process.env.APP_ENV === 'staging'){
                var text = decodeURIComponent(req.body.inputs);
                var secret = process.env.ENCRYPTION_KEY;
                
                var key = CryptoJS.PBKDF2(secret, CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
                var decrypted = CryptoJS.AES.decrypt(text.substring(64) /* encrypted */, key, { iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
                
                req.body = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
                next();
            }
            else{
                req.body = req.body;
                next(); 
            }   
        break;
        case 'DELETE':
            dd('DELETE');
            next();
        break;
        default:            
        dd('default');
        next();
    }
} 