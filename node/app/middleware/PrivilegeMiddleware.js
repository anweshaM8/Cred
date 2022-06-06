
module.exports = function(req, res, next){

    let method          = req.method;
    var url             = req.url;

    let methodMessage   = {
        POST    : 'create',
        GET     : 'read',
        PUT     : 'update',
        DELETE  : 'delete'
    };
  
    next();
    
};