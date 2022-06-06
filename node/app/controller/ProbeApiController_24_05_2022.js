// Newest1 - Start
const axios = require('axios');
const CircularJSON = require('circular-json');
const ProbeApiDatas = Model('ProbeApiDatas');
const headers = {
  'x-api-key':process.env.PROBE_KEY,
  'x-api-version':'1.3',
  'accept': 'application/json'
  };

const Validator = Helper('validator');
const moment = require('moment');
const { debug } = require('winston');
const logger = require('../../config/winston');

const CompanyProbeinfo = Model('CompanyProbeinfo');
const OnlineSearchDetails = Model('OnlineSearchDetails');
const SearchInvestigation = Model('SearchInvestigation');
const invoiceGeneration = Helper('invoice-generation');
const OrderLink = Mail('OrderLink');
const User = Model('User');
const UserDetail = Model('UserDetail');

const CustomerOrderPriceManagement = Model('CustomerOrderPriceManagement');
const Wallet = Model('Wallet');
const CustomerWalletLog = Model('CustomerWalletLog');
const CustomerReportLog = Model('CustomerReportLog');


const ProbeApiController = {

  /********need to add user id here and will return search inv id */
    getEntitiesByName:  async function (req, res, next) {

        let entityName = _.toBoolean(req.query.entityName) ? req.query.entityName: false;
        let user_id = _.toBoolean(req.query.user_id) ? req.query.user_id: "";

        //console.log(' req.params',req.query)   
        //console.log('userID'+user_id);
        let validation = new Validator(req.query, {
          user_id: 'required',
          entityName: 'required'
      });

      let matched = await validation.check();
      if (!matched) {
          return res.status(200).json(res.fnError(validation.errors, '', 400));
      }
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

              //new ProbeApiDatas().createData(probeApi_data) 
              //save to search table
              //fetch user name and email to be saved in search table
              new User().fetchOne('id', `${user_id}`).then((user) => {
    
                let userInfo=user.toJSON();
                //console.log('USER++++'+userInfo.user_name);
                console.log('USER++++'+userInfo.userDetail.name);
              let search_data = {
                user_id        :   user_id,
                type        :   'ON',
                company_name        :  entityName,
                contact_email        :  userInfo.user_name,
                contact_name        :  userInfo.userDetail.name                        
            }
              new SearchInvestigation().createData(search_data)           
              .then((response)=>{
                let search_row=response.toJSON();
                let search_id=search_row.id;
                //console.log(search_id);
                api_result_data.search_id=search_id;
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
            .catch((errors)=>{     
                // logger.errorLogger.error({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method:  "ProbeApiDatasController.create",
                //     message: errors,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })       
                return res.status(200).json(res.fnError(errors,'No user found',500));
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

    /***************************API to fetch comprehensive deatils from DB else from api */
     getComprehensiveData: async function (req, res, next) {
 
      let formData = req.body;    
      let company_id =req.body.company_id;
      let company_type = req.body.company_type;
      let user_id=req.body.user_id;
      let search_investigation_id=req.body.search_investigation_id;
      let internal_reference_no=req.body.internal_reference_no;
      let validation = new Validator(formData, {
        company_id: 'required',
        company_type: 'required'
      });
      let matched = await validation.check();
        if (!matched) {
            return res.status(200).json(res.fnError(validation.errors, '', 400));
        }

      /********************update to search investigation table if internal ref no is not empty*** */
      /*************intiate var company name,address and status *************/
      let company_name="";
      let company_address="";
      let company_address_line1="";
      let company_address_line2="";
      let company_address_line3="";
      let company_status="";
      let lei_no="";
      
      /******************************************************************* */
      /***********************search DB - cre_company_probeinfo if this company data available */
      let whereData =''; 
      if(company_type=='cin')
      {
        whereData ={
          comapny_type:company_type,
          cin_no:company_id
        }
      }
      else if(company_type=='llp')
      {
        whereData ={
          comapny_type:company_type,
          llp_no:company_id
        }
      }
      else{
        return res.status(200).json(res.fnError('', 'Invalid company type', 400));
      }
     
    let is_updated=1;
    let is_call_api=0;
    let is_exist_db=0;
    let company_info_formatted='';
    try{
        let company_info=await CompanyProbeinfo.where(whereData).fetch();
        if(company_info)
          {
            let company_info_json=company_info.toJSON();
            company_info_formatted=JSON.parse(company_info_json.comprehensive_data)
            is_exist_db=1;
            
            //chk if its not updated then also call api
            //later we will implement update checking
            if(is_updated==0)
            {
              is_call_api=1;
            }
          }
          else
          {
            is_call_api=1;
          }    
    }
    catch(e)
    {
      is_call_api=1;
    }
      
    
    
      /***********************Call API as data not available */
      if(is_call_api==1)
      {
        let api_url='';
        if(company_type=='cin')
        {
          api_url= process.env.PROBE_API_URL+'/companies/'+company_id+'/comprehensive-details';
          
        }
        else if(company_type=='llp')
        {
          api_url= process.env.PROBE_API_URL+'/llps/'+company_id+'/comprehensive-details';
          
        }

        //console.log(api_url);
          /****************save to API data table */
          try{
              let company_api_info=await axios.get(api_url,{
                headers:headers
              });
              let company_api_json=CircularJSON.stringify(company_api_info.data.data);
              company_info_formatted=JSON.parse(company_api_json);

              //console.log(CircularJSON.stringify(company_api_info.data));
            let company_api_data='';
            if(company_type=='cin')
            {
              company_api_data = {
                comapny_type        :   company_type,
                cin_no        :   company_id,
                comprehensive_data        :   company_api_json,                           
              }
            }
            else if(company_type=='llp')
            {
              company_api_data = {
                comapny_type        :   company_type,
                llp_no        :   company_id,
                comprehensive_data        :   company_api_json,                           
              }
            }
              
            if(company_api_data)
            {
              //console.log(company_api_data);
              let api_data_create=new CompanyProbeinfo(company_api_data);
              await api_data_create.save();
            }
          }
          catch(e)
          {
            return res.status(200).json(res.fnError(e, 'Probe API error', 400));
          }
          

               
      }
      /****************save to search result table table */
      if(company_info_formatted!='')
      {
        
        //let a={company:company_info_formatted.company};
      //console.log(a);
        let company_basic_info='';
        let company_financial_info='';
        let company_shareholdings='';
        let company_joint_ventures='';
        let company_securities_allotment='';
        let company_gst_details='';
        let company_all_info='';
        try{
          if(company_type=='cin')
          {
            /*************new fileds fr cover pg *************/
           if(company_info_formatted.company.legal_name)
           {
             company_name=company_info_formatted.company.legal_name;
           }
           if(company_info_formatted.company.efiling_status)
           {
             company_status=company_info_formatted.company.efiling_status;
           }

           if(company_info_formatted.company.registered_address.address_line1)
           {
            company_address_line1=company_info_formatted.company.registered_address.address_line1.toLowerCase()
           }
           if(company_info_formatted.company.registered_address.address_line2)
           {
            company_address_line2=company_info_formatted.company.registered_address.address_line2.toLowerCase()
           }
           if(company_info_formatted.company.registered_address.city)
           {
            company_address_line3=company_info_formatted.company.registered_address.city;
           }
           if(company_info_formatted.company.registered_address.state)
           {
            let company_address_line3_raw=company_address_line3+","+company_info_formatted.company.registered_address.state;
            company_address_line3=company_address_line3_raw.toLowerCase();
          }
           if(company_info_formatted.company.registered_address.pincode)
           {
            company_address_line3=company_address_line3+","+company_info_formatted.company.registered_address.pincode;
           }
           if(company_info_formatted.company.lei)
           {
            lei_no=company_info_formatted.company.lei.number;
           }
            //company_basic_info=a;
            // if ('company' in company_info_formatted) {
            //   let company_basic_info_arr={
            //     "company":company_info_formatted.company
            //   };
            //   company_basic_info=JSON.stringify(company_basic_info_arr);
            // }
  
            // if ('financials' in company_info_formatted) {
            //   let company_financial_info_arr={
            //     "financials":company_info_formatted.financials
            //   };
            //   company_financial_info=JSON.stringify(company_financial_info_arr);
            // }
  
            // if ('shareholdings' in company_info_formatted) {
            //   let company_shareholdings_arr={
            //     "shareholdings":company_info_formatted.shareholdings
            //   };
            //   company_shareholdings=JSON.stringify(company_shareholdings_arr);
            // }
  
            // if ('joint_ventures' in company_info_formatted) {
            //   let company_joint_ventures_arr={
            //     "joint_ventures":company_info_formatted.joint_ventures
            //   };
            //   company_joint_ventures=JSON.stringify(company_joint_ventures_arr);
            // }
  
            // if ('securities_allotment' in company_info_formatted) {
            //   let company_securities_allotment_arr={
            //     "securities_allotment":company_info_formatted.securities_allotment
            //   };
            //   company_securities_allotment=JSON.stringify(company_securities_allotment_arr);
            // }
  
            // if ('gst_details' in company_info_formatted) {
            //   let company_gst_details_arr={
            //     "gst_details":company_info_formatted.gst_details
            //   };
            //   company_gst_details=JSON.stringify(company_gst_details_arr);
            // }
           
            //console.log(JSON.stringify(company_basic_info_arr));
           
          }
          else if(company_type=='llp')
          {
              /*************new fileds fr cover pg *************/
           if(company_info_formatted.llp.legal_name)
           {
             company_name=company_info_formatted.llp.legal_name;
           }
           if(company_info_formatted.llp.efiling_status)
           {
             company_status=company_info_formatted.llp.efiling_status;
           }

           if(company_info_formatted.llp.registered_address.address_line1)
           {
            company_address_line1=company_info_formatted.llp.registered_address.address_line1.toLowerCase()
           }
           if(company_info_formatted.llp.registered_address.address_line2)
           {
            company_address_line2=company_info_formatted.llp.registered_address.address_line2.toLowerCase()
           }
           if(company_info_formatted.llp.registered_address.city)
           {
            company_address_line3=company_info_formatted.llp.registered_address.city;
           }
           if(company_info_formatted.llp.registered_address.state)
           {
            let company_address_line3_raw=company_address_line3+","+company_info_formatted.llp.registered_address.state;
            company_address_line3=company_address_line3_raw.toLowerCase();
          }
           if(company_info_formatted.llp.registered_address.pincode)
           {
            company_address_line3=company_address_line3+","+company_info_formatted.llp.registered_address.pincode;
           }
           if(company_info_formatted.llp.lei)
           {
            lei_no=company_info_formatted.llp.lei.number;
           }
          }

           
           
           
           /************update to search investigation table ********* */
           company_address=company_address_line1+company_address_line2+company_address_line3;
           
           let set_data_serach_investigation={
            company_name:company_name,
            company_address:company_address,
            internal_reference_no:internal_reference_no
           }
           new SearchInvestigation({	
            'id': search_investigation_id    
          }).save(set_data_serach_investigation) 
          /************************************************************************ */
          let set_data={
            user_id:user_id,
            search_investigation_id:search_investigation_id,
            company_type:company_type,
            company_basic_info:company_basic_info,
            company_financial_info:company_financial_info,
            company_shareholdings:company_shareholdings,
            company_joint_ventures:company_joint_ventures,
            company_securities_allotment:company_securities_allotment,
            company_gst_details:company_gst_details,
            company_other_info:company_all_info,
            company_status:company_status,
            address_line1:company_address_line1,
            address_line2:company_address_line2,
            address_line3:company_address_line3,
            lei_no:lei_no
            
          }

         
          
          /******************************************************************* */
          new OnlineSearchDetails().createData(set_data)             
            .then(async function(response){
              //console.log(response.id);
               
                //let companyInfoforReport = await CompanyProbeinfo.forge().query({where:{cin_no:company_id}}).fetch();
                //console.log(companyInfo);
                //let companydatareport=companyInfoforReport.toJSON();
                //console.log("JSON"+companydatareport.comprehensive_data);
                //let invoicedata=companydatareport.comprehensive_data;
                //let invoicedata=await JSON.parse(companydatareport.comprehensive_data);
                let invoicedata=company_info_formatted;
                invoicedata.online_search_id=response.id;
                let res_html='';
                if(company_type=='cin')
                {
                  res_html=await invoiceGeneration.report_cin_html(invoicedata);
                }
                else
                {
                  res_html=await invoiceGeneration.report_llp_html(invoicedata);
                }
                
                
                return res.status(200).json(res.fnSuccess(res_html , 'Response Successfully html', 200 ));
                      
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
        }
        catch(e)
        {
          return res.status(200).json(res.fnError(e,'Server error save to online search json',500));
        }
      }
      
      
    
  },
  
  /****************update html content of online serach report ********************* */
  update_report_content: async function (req, res, next) { 

    let id = req.params.id;
    let formData = req.body;

    let validationRules = {           
        draft_html        :   'required'                           
    }       

    let validation = new Validator(formData, validationRules);

    let matched = await validation.check();

    if (!matched) {
        return res.status(200).json(res.fnError(validation.errors,'',400));
    }

    
    let report_content = {
        draft_html        :   formData.draft_html
    }   

    new OnlineSearchDetails({	
        'id': id    
    }).save(report_content)             
    .then((response)=>{      
        logger.infoLogger.info({
            loggedInUserName: 'admin',
            ip: req.client._peername.address,
            method: "OnlineSearchDetailsController.update",
            message: response,
            dataTime: moment().format('YYYY-MM-DD hh:m:s')
        })          
        return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));     
    })         
    .catch((errors) => {   
        logger.errorLogger.error({
            loggedInUserName: 'admin',
            ip: req.client._peername.address,
            method:  "OnlineSearchDetailsController.update",
            message: errors,
            dataTime: moment().format('YYYY-MM-DD hh:m:s')
        })         
        return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
    });

},

/*******************generate pdf from saved HTML for online search report**************** */
generatePdfReportOnlineSearch:async function(req, res, next){
  let search_investigation_id=req.params.id;
  let online_search_id=req.body.online_search_id;
  //console.log(online_search_id);
  //console.log(search_investigation_id);
  let searchReportInfo = await OnlineSearchDetails.where('id', online_search_id).fetch();
  let reportdata=searchReportInfo.toJSON();

  //get company name from serach investigation table
  let searchinvestigationInfo = await SearchInvestigation.where('id', search_investigation_id).fetch();
  let searchinvestigationtdata=searchinvestigationInfo.toJSON();
  let company_name='';
  if(searchinvestigationtdata)
  {
    company_name=searchinvestigationtdata.company_name;
  }
  if(reportdata)
      {
        reportdata.company_name=company_name;
        /***************check if order price for online exist for this user or not***** */
        let search_type='ON';
        let user_id=reportdata.user_id;

        /************************** For BO user check its HO price********************************************/
        let price_user_id=user_id;
        let usertypeInfo = await User.where('id', user_id).fetch();
        //console.log(usertypeInfo);
        let curUserInfo=usertypeInfo.toJSON();
        let curUserType=curUserInfo.user_type;
        if(curUserType=="BO")
        {
            price_user_id=curUserInfo.head_office_user_id;
        } 
        //console.log("TYPE",curUserType);
        //console.log("ID",price_user_id);
        /************************************************************************************************* */
        let usertnameInfo = await UserDetail.where('user_id', price_user_id).fetch();
        /************************get the user name HO user name *******************/
        let username=usertnameInfo.toJSON().name;
        /***************************************************************************/
        new CustomerOrderPriceManagement().where({user_id: price_user_id,order_type:search_type}).fetch()        
        .then(async function (response_order_price) {
            /******************************************************************************** */
              //htmldata=reportdata.draft_html;        
              //console.log(htmldata);
              console.log('TEST'); 
              let respdf= await invoiceGeneration.htmltopdfreport(reportdata,search_investigation_id,online_search_id,username); 
              /*********check if calculation price not done update to wallet and wallet log for its price*****/
              if(reportdata.is_price_calculated==0)
              {
                  let customer_order_price=response_order_price.toJSON();
                  //wallet
                  new Wallet().fetchOne('user_id', `${price_user_id}`).then((wallet_row) => {
                    wallet_row=wallet_row.toJSON();
                        //console.log("WALLET++++++++"+wallet_row.total_amount);
                        let existing_total_amount=wallet_row.total_amount;
                        let existing_rebate_amount=wallet_row.rebet_amount;
                        let cost_per_report=customer_order_price.cost_per_report;
                        let rebate_amout=customer_order_price.rebate_amout;
                        let existing_no_of_report=wallet_row.no_of_report;
                        //console.log(existing_total_amount+'--'+existing_rebate_amount+'--'+cost_per_report+'--'+rebate_amout);
                        let save_data = {
                            total_amount: existing_total_amount+cost_per_report,
                            rebet_amount:existing_rebate_amount+rebate_amout,
                            no_of_report:existing_no_of_report+1,          
                        }
                  
                    new Wallet({
                        'id': wallet_row.id
                    }).save(save_data)
                      .then((response_wallet) => {
                  
                      //save to wallet log table
                  
                    let setData_wallet_log = {
                      user_id: price_user_id,
                      search_investigation_id:search_investigation_id,
                      type:search_type,
                      total_amount:cost_per_report,
                      rebet_amount:rebate_amout,
                    }
                  new CustomerWalletLog().createData(setData_wallet_log)
                  .then((response_wallet_log) => {            
                              
                  //update online search price calculated
                    new OnlineSearchDetails({	
                      'id': online_search_id
                      }).save({"is_price_calculated":"1"});

                      return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
                    })
                    .catch((errors1) => {
                        return res.status(200).json(res.fnError(errors1, 'Failed to insert wallet log', 500));
                    });
                  })
                  .catch((errors1) => {
                      return res.status(200).json(res.fnError(errors1, 'Failed to update wallet', 500));
                  });
                  }).catch((errors) => {
                    return res.status(200).json(res.fnError(errors, 'No Walet records found', 500));
                });
              }
              else
              {
                return res.status(200).json(res.fnSuccess(respdf, 'Response Successfully', 200));
              }
              /*******************update wallet ends here********************** */
             
        }).catch((errors) => {
          return res.status(200).json(res.fnError(errors, 'can\'t generate report if no online report price exist on this user', 500));
      });
      }
      else
      {
          return res.status(200).json(res.fnError('', 'Report content not found', 422));
      }
  
},

/*******************send mail online search report**************** */
sendreportmail:async function(req, res, next){
  let search_investigation_id=req.params.id;
  //console.log(search_investigation_id);
  let searchReportInfo = await SearchInvestigation.where('id', search_investigation_id).fetch();
  let reportdata=searchReportInfo.toJSON();
  
  if(reportdata)
      {
        new User().fetchOne('id', `${reportdata.user_id}`).then(async function(user){
    
          user=user.toJSON();
          let resmail=await OrderLink(reportdata,user,reportdata.order_link); 

          return res.status(200).json(res.fnSuccess(resmail, 'Response Successfully', 200));
        })
        .catch((errors) => {
          return res.status(200).json(res.fnError(errors, 'User not found', 500));
        });
      }
      else
      {
          return res.status(200).json(res.fnError('', 'Error Occured', 422));
      }
  
},

/*******************excel to html table**************** */
exceltohtml:async function(req, res, next){

  /***************************for excel to html ***************/
  var fs = require('fs');
  var XLSX = require('xlsx');
  var workbook = XLSX.readFile('resolutions.xlsx');
  var sheets = workbook.Sheets;
  var htmlFile = '';
   
  var fileName = 'resolutions.xlsx';
	var newFileName = fileName.slice(0, -4) + 'html';

// Iterate through each worksheet in the workbook
for (var sheet in sheets) {
	// Start building a new table if the worksheet has entries
	if (typeof sheet !== 'undefined') {
		htmlFile += '<table summary="" class="turntable">' + '\n' + '<thead>';		
		// Iterate over each cell value on the sheet
		for (var cell in sheets[sheet]) {
			// Protect against undefined values
			if (typeof sheets[sheet][cell].w !== 'undefined') {
				//The first row in the table
				if (cell === 'A1') {
					htmlFile += '\n' + '<tr>' + '\n' + '<th>' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</th>';
				} else {
					//The second row in the table closes the thead element
					if (cell === 'A2') {
						htmlFile += '\n' + '</tr>' + '\n' + '</thead>' + '\n' + '<tr>' + '\n' + '<th>' + '<a href="">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</a>' + '</th>';
					} else {
						// The first cell in each row
						if (cell.slice(0, 1) === 'A') {
							htmlFile += '\n' + '</tr>' + '\n' + '<tr>' + '\n' + '<th>' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</th>';
							//All the other cells
						} else {
							htmlFile += '\n' + '<td>' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash') + '</td>';
						}
					}
				}
			}
		}
		// Close the tags
		htmlFile += '\n' + '</tr>' + '\n' + '</table>';
	}
}
// Write htmlFile variable to the disk with newFileName as the name
// fs.writeFile(newFileName, htmlFile, (err) => {
// 	if (err) throw err;
// 	console.log('\n' +'Your tables have been created in', newFileName);
// });
  
},

/*******************table to excel generate**************** */
tabletoexcel:async function(req, res, next){
      console.log('table to excel');
      var excel = require('excel4node');

      // Create a new instance of a Workbook class
      var workbook = new excel.Workbook();

      // Add Worksheets to the workbook
      var worksheet = workbook.addWorksheet('Invoice');
      var worksheet1 = workbook.addWorksheet('Details');

      // Style for headers
      var style = workbook.createStyle({
        font: {
          color: '#EA3A14',
          size: 18
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
      });

      var styleForData = workbook.createStyle({
        font: {
          color: '#47180E',
          size: 12
        },
        alignment: {
          wrapText: true,
          horizontal: 'center',
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
      });

      // let buyOrderTypes=[
      // {name:"buy",id:"1",comment:"Normal Buy Order"},

      // {name:"sip",id:"2",comment:"Sip Buy Order"},

      // {name:"buy",id:"3",comment:"ETF Buy Order"},
      // ]

      let buyOrderTypes=[
        {
            "1": "Branch name",
            "Invoice Details": "ABC"
        },
        {
            "1": "Sr. No.",
            "3": "Client name",
            "4": "Company name",
            "5": "Country",
            "6": "Customer ref",
            "7": "Type of order",
            "8": "Price per report",
            "9": "Date of request"
        },
        {
            "1": "1",
            "3": "CUSTOMER1",
            "4": "Godrej",
            "5": "India",
            "6": "100",
            "7": "Fresh Investigation",
            "8": "10",
            "9": "17.01.2022"
        },
        {
            "1": "",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "",
            "8": "Branch Total (USD)",
            "9": "100$"
        },
        {
          "1": "Branch name",
          "Invoice Details": "ABC"
      },
      {
          "1": "Sr. No.",
          "3": "Client name",
          "4": "Company name",
          "5": "Country",
          "6": "Customer ref",
          "7": "Type of order",
          "8": "Price per report",
          "9": "Date of request"
      },
      {
          "1": "1",
          "3": "CUSTOMER1",
          "4": "Godrej",
          "5": "India",
          "6": "100",
          "7": "Fresh Investigation",
          "8": "10",
          "9": "17.01.2022"
      },
      {
          "1": "",
          "3": "",
          "4": "",
          "5": "",
          "6": "",
          "7": "",
          "8": "Branch Total (USD)",
          "9": "200$"
      },
        {
            "1": "",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "",
            "8": "Grand Total (USD)",
            "8": "400",
            "Invoice Details": ""
        }
    ]

      let sellOrderTypes=[
        {
            "1": "Date:",
            "Sales Invoice": "19/04/2022"
        },
        {
            "1": "To",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "From",
            "Sales Invoice": ""
        },
        {
            "1": "Laityn Tavion",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "Interlinkages Ltd",
            "Sales Invoice": ""
        },
        {
            "1": "abcd,, ,",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "9/F Amtel Building,148 Des Voeux Road Central,Hong Kong",
            "Sales Invoice": ""
        },
        {
            "1": "Invoice number:",
            "Sales Invoice": "787872"
        },
        {
            "1": "Issued:",
            "Sales Invoice": "19/04/2022"
        },
        {
            "1": "Due:",
            "Sales Invoice": "26/04/2022"
        },
        {
            "1": "S. No.",
            "3": "Number of reports",
            "4": "Price per report USD",
            "5": "Total Value USD",
            "Sales Invoice": "Description"
        },
        {
            "1": "1",
            "3": "0",
            "4": "50",
            "5": "300",
            "Sales Invoice": "Credit report - aa"
        },
        {
            "1": "",
            "3": "",
            "Sales Invoice": "Total due (USD)",
            "4":"300"
        },
        {
            "1": "",
            "3": "",
            "Sales Invoice": "Tax (0%)",
            "4":"2"
        },
        {
            "1": "",
            "3": "",
            "Sales Invoice": "Grand total (USD)",
            "4":"302"
        },
        {
            "1": "Please make Payment to"
        },
        {
            "1": "Beneficiary",
            "Sales Invoice": "Interlinkages Limited"
        },
        {
            "1": "Beneficiary Bank",
            "Sales Invoice": "HSBC, Hong Kong"
        },
        {
            "1": "Beneficiary Branch",
            "Sales Invoice": "1 Queens Road Central, Hong Kong"
        },
        {
            "1": "Account number",
            "Sales Invoice": "741069280838"
        },
        {
            "1": "SWIFT Code",
            "Sales Invoice": "HSBCHKHHHKH"
        },
        {
            "1": "Thank you for your business."
        },
        {
            "1": "Best Regards"
        }
    ]

      //Some logic
      // function generateExcelSheet(array,worksheet){
      //   let row=2;//Row starts from 2 as 1st row is for headers.
      //   for(let i in array){
      //     let o=1;
      //     //This depends on numbers of columns to fill.
      //     worksheet.cell(row,o).string(array[i].name).style(styleForData);
      //     worksheet.cell(row,o+1).string(array[i].id).style(styleForData);
      //     worksheet.cell(row,o+2).string(array[i].comment).style(styleForData);

      //     row=row+1;
      //   }
      // }

      function generateExcelSheet2(data,worksheet){
        let row=2;//Row starts from 2 as 1st row is for headers.
        // for(let i in array){
        //   let o=1;
        //   //This depends on numbers of columns to fill.
        //   worksheet.cell(row,o).string(array[i].name).style(styleForData);
        //   worksheet.cell(row,o+1).string(array[i].id).style(styleForData);
        //   worksheet.cell(row,o+2).string(array[i].comment).style(styleForData);

        //   row=row+1;
        // }
        let rowIndex = 2;
        data.forEach( record => {
          let columnIndex = 1;
          Object.keys(record ).forEach(columnName =>{
            worksheet.cell(rowIndex,columnIndex++)
                  .string(record [columnName])
          });
          rowIndex++;
      }); 
      }

      //Write Data in Excel file
     
     

      generateExcelSheet2(sellOrderTypes,worksheet);

      generateExcelSheet2(buyOrderTypes,worksheet1)
      workbook.write('Excel123.xlsx');
      return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));

},

/*******************html to json**************** */
htmltojson:async function(req, res, next){

  const HtmlTableToJson = require('html-table-to-json');
  //const html = '<html><body><table style="width: 800px; border: 1px solid #d1d1d1; padding: 15px; font-family: Arial, Helvetica, sans-serif;" name="Annexure to invoice"><tr style="padding-bottom: 10px;"><td style="width:5%; font-weight: bold;"></td><td style="width:95%;">Invoice Details</td></tr><tr style="padding-bottom: 10px;"><td style="width:20%; font-weight: bold;">Branch name</td><td style="width:80%;font-weight: bold;">ABC</td></tr><tr><td style="width:5%; font-weight: bold;">Sr. No.</td><td style="width:20%; font-weight: bold;">Date of request</td> <td style="width:20%; font-weight: bold;">Client name</td><td style="width:20%; font-weight: bold;">Company name</td> <td style="width:10%; font-weight: bold;">Country</td><td style="width:10%; font-weight: bold;">Customer ref</td><td style="width:5%; font-weight: bold;">Type of order</td><td style="width:10%; font-weight: bold;">Price per report</td></tr><tr><td>1</td><td>20.12.2022</td><td>User name</td><td>Address</td><td>33333</td><td>100</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td>Branch Total (USD)</td><td>100$</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td>Grand Total (USD)</td><td>200</td></tr></table></body></html>';
  //const html = '<table><tr><th>Month</th></tr><tr><td>A</td></tr></table>';
  const html='<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Invoice</title></head><body> <table style="width: 800px; border: 1px solid #d1d1d1; padding: 15px; font-family: Arial, Helvetica, sans-serif;" name="Invoice"> <tr style="padding-bottom: 10px;"> <td style="vertical-align: middle;text-align: center;" colspan="2"> <img src="http://65.2.8.152/static/media/logo.6d5446be.png" alt="Logo" style="width: 139px;height: 24px;"/> </td><td style="width:95%;font-weight: bold;">Sales Invoice</td></tr><tr style="padding-bottom: 10px;"> <td style="width:5%; ">Date:</td><td style="width:95%;font-weight: bold;">19/04/2022</td></tr><tr> <td>To</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>From</td></tr><tr> <td>Laityn Tavion</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>Interlinkages Ltd</td></tr><tr> <td style="width:95%;">abcd,, , </td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td style="width:95%;">9/F Amtel Building,148 Des Voeux Road Central,Hong Kong </td></tr><tr> <td style="width:60%;font-weight: bold;">Invoice number:</td><td style="width:40%;font-weight: bold;">787872</td></tr><tr> <td>Issued: </td><td>19/04/2022 </td></tr><tr> <td>Due:</td><td>26/04/2022 </td></tr><tr> <td style="padding: 10px; width:10%;font-weight: bold;">S. No.</td><td style="padding: 10px; text-align: left; width:30%;font-weight: bold;">Description</td><td style="padding: 10px;font-weight: bold;width:20%;">Number of reports</td><td style="padding: 10px;font-weight: bold;width:20%;">Price per report USD</td><td style="padding: 10px;font-weight: bold;width:20%;">Total Value USD</td></tr><tr> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;width:10%;">1</td><td style="padding: 10px; border-bottom: 1px solid #d1d1d1;width:30%;">Credit report - aa</td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;width:20%;">0</td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;width:20%;">50</td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;width:20%;">300</td></tr><tr> <td style="padding: 10px; width: 60%;" colspan="3">&nbsp;</td><td style="padding: 10px; text-align: center;width:200px;">Total due (USD)</td><td style="padding: 10px; text-align: center;width:20%;">300</td></tr><tr> <td style="padding: 10px; width: 60%;" colspan="3">&nbsp;</td><td style="padding: 10px; text-align: center;width:200px;">Tax (0%)</td><td style="padding: 10px; text-align: center;width:20%;">2</td></tr><tr> <td style="padding: 10px; width: 60%;" colspan="3">&nbsp;</td><td style="padding: 10px; text-align: center;width:200px;">Grand total (USD)</td><td style="padding: 10px; text-align: center;width:20%;">302</td></tr><tr> <td style="width:200px;">Please make Payment to</td></tr><tr> <td>Beneficiary</td><td>Interlinkages Limited</td></tr><tr> <td>Beneficiary Bank</td><td>HSBC, Hong Kong</td></tr><tr> <td>Beneficiary Branch</td><td>1 Queens Road Central, Hong Kong</td></tr><tr> <td>Account number</td><td>741069280838</td></tr><tr> <td>SWIFT Code</td><td>HSBCHKHHHKH</td></tr><tr><td colspan="2" style="padding-top: 20px;"> Thank you for your business. </td></tr><tr><td colspan="2"> Best Regards </td></tr></table> </body></html>';
  const jsonTables = HtmlTableToJson.parse(html);
 
//console.log(jsonTables.results);

  return res.status(200).json(res.fnSuccess(jsonTables.results, 'Response Successfully', 200));
  
  
},

htmltopdftest:async function(req, res, next){

  //   const HtmlTableToJson = require('html-table-to-json');
  //   const html = '<html><body><table style="width: 800px; border: 1px solid #d1d1d1; padding: 15px; font-family: Arial, Helvetica, sans-serif;" name="Annexure to invoice"><tr style="padding-bottom: 10px;"><td style="width:5%; font-weight: bold;"></td><td style="width:95%;">Invoice Details</td></tr><tr style="padding-bottom: 10px;"><td style="width:20%; font-weight: bold;">Branch name</td><td style="width:80%;font-weight: bold;">ABC</td></tr><tr><td style="width:5%; font-weight: bold;">Sr. No.</td><td style="width:20%; font-weight: bold;">Date of request</td> <td style="width:20%; font-weight: bold;">Client name</td><td style="width:20%; font-weight: bold;">Company name</td> <td style="width:10%; font-weight: bold;">Country</td><td style="width:10%; font-weight: bold;">Customer ref</td><td style="width:5%; font-weight: bold;">Type of order</td><td style="width:10%; font-weight: bold;">Price per report</td></tr><tr><td>1</td><td>20.12.2022</td><td>User name</td><td>Address</td><td>33333</td><td>100</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td>Branch Total (USD)</td><td>100$</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td>Grand Total (USD)</td><td>200</td></tr></table></body></html>';
  //   //const html = '<table><tr><th>Month</th></tr><tr><td>A</td></tr></table>';
  //   const jsonTables = HtmlTableToJson.parse(html);
   
  // console.log(jsonTables.results);
  invoiceGeneration.htmltopdftest();
    //return res.status(200).json(res.fnSuccess(jsonTables.results, 'Response Successfully', 200));
    return res.status(200).json(res.fnSuccess('', 'Response Successfully', 200));
    
  },


/**********************API fn to import uploaded excel and convert to HTML****************** */
importexceltoreport : async function(req,res,next){

  //let online_search_id = req.params.id;
  let formData = req;
  let online_search_id = req.body.onlinesearchid;
  let encoded_file=req.body.file_link;
  let file_name=req.body.file_name;
  

  //  let validation = new Validator(formData, {
  //     file_link: 'required'
  // });

  // let matched = await validation.check();
  // if (!matched) {
  //     return res.status(200).json(res.fnError(validation.errors, '', 400));
  // }
  try {
    let buff = new Buffer(encoded_file, 'base64');
    _fs.writeFileSync(file_name, buff);
    //let file_name="sampleimport.xlsx"; //for testing
    
         //await invoiceGeneration.exceltohtml(file_name,online_search_id);
         
         /***************************for excel to html ***************/
        var fs = require('fs');
        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(file_name);
        //var workbook = XLSX.readFile(file_link);
        //var workbook = buff;
        var sheets = workbook.Sheets;
        var htmlFile = '<div style="font-family:Arial;padding: 8px 15px 8px 0;background-color: #FFF;color: #FF5000;border-bottom: 1px solid #D1D1D1; font-weight: bold;font-size: 9pt;">Past Export Data</div>';

        //var count_sheet=sheets.length;
        //var count_sheet=1;
        //console.log('COUNT',count_sheet);

        // // Iterate through each worksheet in the workbook
        var count=0;
        for (var sheet in sheets) {
        // Start building a new table if the worksheet has entries
            if (typeof sheet !== 'undefined') {
                htmlFile += '<table summary="" class="turntable" cellpadding="0" cellspacing="0" style="font-family: Arial; font-size: 6pt;>' + '\n';		
                //heading
                //htmlFile += '<tr><td style="font-family:Arial;padding: 8px 15px 8px 0;background-color: #FFF;color: #FF5000;border-bottom: 1px solid #D1D1D1; font-weight: bold;font-size: 9pt;">Past Export Data</td></tr>';
               
                // Iterate over each cell value on the sheet
                for (var cell in sheets[sheet]) {
                // Protect against undefined values
                if (typeof sheets[sheet][cell].w !== 'undefined') {
                    //The first row in the table
                    if (cell === 'A1') {
                      htmlFile += '<tr style="font-size: 6pt;background-color: #e0e0e0;font-weight: bold;"><td style="border-bottom: 1px solid #d1d1d1;border-right: 1px solid #ececec;border-top: 1px solid #d1d1d1;background-color: #e0e0e0;font-weight: bold;padding: 1px;">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') +'</td>';
                      } else {
                      // //The second row in the table closes the thead element
                      // if (cell === 'A2') {
                      //     //htmlFile += '\n' + '</tr>' + '\n' + '</thead>' + '\n' + '<tr>' + '\n' + '<th>' + '<a href="">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</a>' + '</th>';
                      // } else {
                          // The first cell in each row
                          if (cell.slice(0, 1) === 'A') {
                          htmlFile += '</tr>' + '\n' + '<tr style="font-size: 6pt;"><td style="border-bottom: 1px solid #d1d1d1;border-right: 1px solid #ececec;padding: 1px;">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;')+'</td>';
                          //All the other cells
                          } else {
                            if (cell=='B1'||cell=='C1'||cell=='D1'||cell=='E1'||cell=='F1'||cell=='G1'||cell=='H1'||cell=='I1'||cell=='J1'||cell=='K1'||cell=='L1') 
                              {
                                htmlFile +='<td style="border-top: 1px solid #d1d1d1;border-bottom: 1px solid #d1d1d1;border-right: 1px solid #ececec;background-color: #e0e0e0;font-weight: bold;padding: 1px;">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash') +'</td>';
                              }
                              else
                              {
                                htmlFile +='<td style="border-bottom: 1px solid #d1d1d1;border-right: 1px solid #ececec;padding: 1px;">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash') +'</td>';
                              }
                          
                          }
                      }
                      //}
                  }
                  }
                // Close the tags
                htmlFile += '\n' + '</tr>' + '\n' + '</table>';
            }

            var count=count+1;
        } 

        //console.log('FinalCount',count);
        //console.log('COUNT',count_sheet);
        // if(count==count_sheet)
        // {
          // save generated html to DB
         new OnlineSearchDetails({	
          'id': online_search_id 
          }).save({"import_html":htmlFile});

          fs.writeFile('import.html', htmlFile, (err) => {
            if (err) throw err;
            console.log('\n' +'Your tables have been created in');
          });
          
        //}
         
        //   console.log(htmlFile);
        // //del added excel file
        // if (_fs.existsSync(file_name)) {
        //   _fs.unlinkSync(file_name);  
        //   }

        
        return res.status(200).json(res.fnSuccess('', 'Table Imported Successfully', 200));

  }
  catch(errors) {
    
      return res.status(200).json(res.fnError(errors, 'No excel file received', 500));
  }


},

 /*******************fn to get all invoice list with user data */

 myinvoicelog : async function(req,res,next){
   let user_id=req.body.user_id;
  new CustomerReportLog().where('user_id', user_id).orderBy('id', 'DESC').fetchAll({debug:true})
  .then((response)=>{
      // logger.infoLogger.info({
      //     loggedInUserName: 'admin',
      //     ip: req.client._peername.address,
      //     method: "UtilityController.getModuleList",
      //     message: response,
      //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
      // }) 
             
      return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 )); 
  })
  .catch((errors)=>{
      // logger.errorLogger.error({
      //     loggedInUserName: 'admin',
      //     ip: req.client._peername.address,
      //     method:  "UtilityController.list",
      //     message: errors,
      //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
      // })
      return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
  })
},


/********************************************************************************************* */

};

module.exports = ProbeApiController;
