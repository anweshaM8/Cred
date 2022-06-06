// Newest1 - Start
const axios = require('axios');
const CircularJSON = require('circular-json');
const ProbeApiDatas = Model('ProbeApiDatas');
const headers = {
  'x-api-key':process.env.PROBE_KEY,
  'x-api-version':'1.3',
  'accept': 'application/json'
  };

const ProbeApiController = {
    getEntitiesByName:  function (req, res, next) {

        let entityName = _.toBoolean(req.query.entityName) ? req.query.entityName: false;

        console.log(' req.params',req.query)   

        const params = {
          'limit':25,
          'filters':{"nameStartsWith":`${entityName}`}
          };
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/entities',
            headers:headers,
            params: params,
          })
          .then(function (response) {
           // let api_result_data=response.data.data.entities;
            //console.log(CircularJSON.stringify(response.data));
            let api_result_data=response.data.data.entities;
            //console.log(CircularJSON.stringify(response.data));
            //console.log(api_result_data);
                    
                let probeApi_data = {
                  api_type        :   'search_api',
                  api_name        :   'entities',
                  api_request        :   JSON.stringify(req.query),
                  api_params      :  JSON.stringify(params),
                  api_headers     :   JSON.stringify(headers),
                  api_result        :   CircularJSON.stringify(response.data),                           
              }

              new ProbeApiDatas().createData(probeApi_data)             
              .then((response)=>{
                  // logger.infoLogger.info({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method: "ProbeApiDatasController.create",
                  //     message: saveRoleData,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })
                  //return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
              
                  return res.status(200).json(res.fnSuccess(api_result_data , 'Response Successfully', 200 ));               
              })
              .catch((errors)=>{     
                  // logger.errorLogger.error({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method:  "ProbeApiDatasController.create",
                  //     message: errors,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })       
                  return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
              });
            
            
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },
    getCompaniesComprehensiveDetails:  function (req, res, next) {

        let CinOrPan = _.toBoolean(req.query.CinOrPan) ? req.query.CinOrPan: false;
        let identifier_type = _.toBoolean(req.query.identifier_type) ? req.query.identifier_type: false;

        console.log(' req.params',req.query)

        // const params = {
        //   'limit':25,
        //   'filters':{"nameStartsWith":`${entityName}`}
        //   };
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/companies/'+CinOrPan+'/comprehensive-details',
            headers:headers,
            // params: {
            //     'limit':25,
            //     },
          })

          .then(function (response) {
            console.log(CircularJSON.stringify(response.data));

              let probeApi_data = {
                api_type        :   'comprehensive_api',
                api_name        :   'companies_comprehensive_details',
                api_request        :   JSON.stringify(req.query),
                api_params      :  '',
                api_headers     :   JSON.stringify(headers),
                api_result        :   CircularJSON.stringify(response.data),                           
            }

            new ProbeApiDatas().createData(probeApi_data)             
            .then((response)=>{
                // logger.infoLogger.info({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method: "ProbeApiDatasController.create",
                //     message: saveRoleData,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })
                return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));                
            })
            .catch((errors)=>{     
                // logger.errorLogger.error({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method:  "ProbeApiDatasController.create",
                //     message: errors,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })       
                return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
            });
            
           // return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },
    getllpsComprehensiveDetails:  function (req, res, next) {

        let LlpinOrPan = _.toBoolean(req.query.LlpinOrPan) ? req.query.LlpinOrPan: false;
        let identifier_type = _.toBoolean(req.query.identifier_type) ? req.query.identifier_type: false;

        console.log(' req.params',req.query)
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/llps/'+LlpinOrPan+'/comprehensive-details',
            headers:headers,
            // params: {
            //     'limit':25,
            //     },
          })

          .then(function (response) {
            console.log(CircularJSON.stringify(response.data));

            
                let probeApi_data = {
                  api_type        :   'comprehensive_api',
                  api_name        :   'llps_comprehensive_details',
                  api_request        :   JSON.stringify(req.query),
                  api_params      :  '',
                  api_headers     :   JSON.stringify(headers),
                  api_result        :   CircularJSON.stringify(response.data),                           
              }

              new ProbeApiDatas().createData(probeApi_data)             
              .then((response)=>{
                  // logger.infoLogger.info({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method: "ProbeApiDatasController.create",
                  //     message: saveRoleData,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })
                  return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));                
              })
              .catch((errors)=>{     
                  // logger.errorLogger.error({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method:  "ProbeApiDatasController.create",
                  //     message: errors,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })       
                  return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
              });
            
            //return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },
    getCompaniesreports:  function (req, res, next) {

        let CinOrPan = _.toBoolean(req.query.CinOrPan) ? req.query.CinOrPan: false;
        let type = _.toBoolean(req.query.type) ? req.query.type: 'pdf';
        let client_name = _.toBoolean(req.query.client_name) ? req.query.client_name: 'probe';
        let identifier_type = _.toBoolean(req.query.identifier_type) ? req.query.identifier_type: false;

        console.log(' req.params',req.query)

          const params = {
            'type':type,
            'client_name':client_name
            };
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/companies/'+CinOrPan+'/comprehensive-details',
            headers:headers,
            params: params,
          })

          .then(function (response) {
            console.log(CircularJSON.stringify(response.data));

                let probeApi_data = {
                  api_type        :   'comprehensive_api',
                  api_name        :   'companies_reports',
                  api_request        :   JSON.stringify(req.query),
                  api_params      :  JSON.stringify(params),
                  api_headers     :   JSON.stringify(headers),
                  api_result        :   CircularJSON.stringify(response.data),                           
              }

              new ProbeApiDatas().createData(probeApi_data)             
              .then((response)=>{
                  // logger.infoLogger.info({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method: "ProbeApiDatasController.create",
                  //     message: saveRoleData,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })
                  return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));                
              })
              .catch((errors)=>{     
                  // logger.errorLogger.error({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method:  "ProbeApiDatasController.create",
                  //     message: errors,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })       
                  return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
              });
            
            //return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },
    getllpsReports:  function (req, res, next) {

        let LlpinOrPan = _.toBoolean(req.query.LlpinOrPan) ? req.query.LlpinOrPan: false;
        let type = _.toBoolean(req.query.type) ? req.query.type: 'pdf';
        let client_name = _.toBoolean(req.query.client_name) ? req.query.client_name: 'probe';
        let identifier_type = _.toBoolean(req.query.identifier_type) ? req.query.identifier_type: false;


        console.log(' req.params',req.query)

        const params = {
          'type':type,
          'client_name':client_name
          };
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/llps/'+LlpinOrPan+'/comprehensive-details',
            headers:{
                'x-api-key':process.env.PROBE_KEY,
                'x-api-version':'1.3',
                'accept': 'application/json'
                },
                params: {
                    'type':type,
                    'client_name':client_name
                    },
          })

          .then(function (response) {
            console.log(CircularJSON.stringify(response.data));

                let probeApi_data = {
                  api_type        :   'comprehensive_api',
                  api_name        :   'llps_reports',
                  api_request        :   JSON.stringify(req.query),
                  api_params      :  JSON.stringify(params),
                  api_headers     :   JSON.stringify(headers),
                  api_result        :   CircularJSON.stringify(response.data),                           
              }

              new ProbeApiDatas().createData(probeApi_data)             
              .then((response)=>{
                  // logger.infoLogger.info({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method: "ProbeApiDatasController.create",
                  //     message: saveRoleData,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })
                  return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));                
              })
              .catch((errors)=>{     
                  // logger.errorLogger.error({
                  //     loggedInUserName: 'admin',
                  //     ip: req.client._peername.address,
                  //     method:  "ProbeApiDatasController.create",
                  //     message: errors,
                  //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                  // })       
                  return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
              });
            
            //return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },
    getCompaniesDatastatus:  function (req, res, next) {

        let CinOrPan = _.toBoolean(req.query.CinOrPan) ? req.query.CinOrPan: false;
        let identifier_type = _.toBoolean(req.query.identifier_type) ? req.query.identifier_type: false;

        console.log(' req.params',req.query)
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/companies/'+CinOrPan+'/datastatus',
            headers:headers,
            // params: {
            //     'type':type,
            //     'client_name':client_name
            //     },
          })

          .then(function (response) {
            console.log(CircularJSON.stringify(response.data));

              let probeApi_data = {
                api_type        :   'status_api',
                api_name        :   'companies_datastatus',
                api_request        :   JSON.stringify(req.query),
                api_params      :  '',
                api_headers     :   JSON.stringify(headers),
                api_result        :   CircularJSON.stringify(response.data),                           
            }

            new ProbeApiDatas().createData(probeApi_data)             
            .then((response)=>{
                // logger.infoLogger.info({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method: "ProbeApiDatasController.create",
                //     message: saveRoleData,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })
                return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));                
            })
            .catch((errors)=>{     
                // logger.errorLogger.error({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method:  "ProbeApiDatasController.create",
                //     message: errors,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })       
                return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
            });
            
            //return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },
    getllpsDatastatus:  function (req, res, next) {

        let LlpinOrPan = _.toBoolean(req.query.LlpinOrPan) ? req.query.LlpinOrPan: false;
        let identifier_type = _.toBoolean(req.query.identifier_type) ? req.query.identifier_type: false;


        console.log(' req.params',req.query)
        
        axios({
            method: 'get',
            url: process.env.PROBE_API_URL+'/llps/'+LlpinOrPan+'/datastatus',
            headers:headers,
                // params: {
                //     'type':type,
                //     'client_name':client_name
                //     },
          })

          .then(function (response) {
            console.log(CircularJSON.stringify(response.data));

              let probeApi_data = {
                api_type        :   'status_api',
                api_name        :   'llps_datastatus',
                api_request        :   JSON.stringify(req.query),
                api_params      :  '',
                api_headers     :   JSON.stringify(headers),
                api_result        :   CircularJSON.stringify(response.data),                           
            }

            new ProbeApiDatas().createData(probeApi_data)             
            .then((response)=>{
                // logger.infoLogger.info({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method: "ProbeApiDatasController.create",
                //     message: saveRoleData,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })
                return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));                
            })
            .catch((errors)=>{     
                // logger.errorLogger.error({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method:  "ProbeApiDatasController.create",
                //     message: errors,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })       
                return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
            });
            
            //return res.status(200).json(res.fnSuccess(CircularJSON.stringify(response.data) , 'Response Successfully', 200 ));  
          })
          .catch(function (error) {
            console.log(error);

            return res.status(200).json(res.fnError(error, 'Internal Server Error', 500));
          })
    },

  
   
};

module.exports = ProbeApiController;
