const Log         = Model('Log');
const moment = require('moment');

module.exports = async function(req, res, next){

    let method          = req.method;
    var url             = req.url;
    let remoteAddress   = req.client._peername
    let port            = remoteAddress.port;
    let ip              = remoteAddress.address
    if (ip.substr(0, 7) == '::ffff:') {
        ip = ip.substr(7);
        ip = `${ip}:${port}`;
    }       


    new Log().fetchOne('date',moment().format('YYYY-MM-DD'))
        .then((response)=>{
            next();
        })
        .catch((e)=>{
            let data = {
                date :  moment().format('YYYY-MM-DD'),               
            }          
            new Log().createData(data);
            next();
        })
    
      
       
       
};