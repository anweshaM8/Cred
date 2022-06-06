const Router = Helper('router');

Router.get('/', (req, res, next) => {
    res.send('Credence Node JS V1.0 API Running ........');
});


Router._post('/test','TestController@index');


Router._resource_api('/role','RoleController');
Router._resource_api('/log','LogController');
Router._resource_api('/user','UserController');
Router._resource_api('/site-setting','SettingController');

Router._resource_api('/email-content','EmailContentController');
Router._resource_api('/country','Country');
Router._resource_api('/state','State');
Router._resource_api('/city','City');
Router._resource_api('/contact-us','ContactUsController');
Router._resource_api('/search-investigation','SearchInvestigationController');
Router._resource_api('/country-group-management','CountryGroupManagementController');
Router._resource_api('/customer-order-price-management','CustomerOrderPriceManagementController');
Router._resource_api('/wallet','WalletManagement');
Router._resource_api('/customer-report-log','CustomerReportLogController');
Router._resource_api('/online-search-details','OnlineSearchDetailsController');
Router._resource_api('/search-investigation-countries','SearchInvestigationCountriesController');
Router._resource_api('/search-financial-docs','FinancialDocsController');



Router._group('/authentication',function(Router){
    Router._post('/change-password','AuthenticationController@ChangePassword');
    Router._post('/login','AuthenticationController@doAuthorization');
    Router._post('/set-password','AuthenticationController@setPassword');
    Router._post('/logout','AuthenticationController@logout');   
    Router._post('/forget-password','AuthenticationController@ForgetPassword');
    Router._post('/reset-password','AuthenticationController@ResetPassword');
});

Router._group('/utility',function(Router){
    Router._get('/module-list','UtilityController@getModuleList');
    Router._put('/upload-order/:id','UtilityController@uploadOrder'); 
    Router._put('/update-credit-score/:id','UtilityController@saveCreditScore');  
    Router._get('/get-user-list-count','UtilityController@userListCount');  

    Router._put('/customer-credit-count/:id','UtilityController@customerCreditCount');  
    Router._get('/customer-credit-report/:user_id','UtilityController@generateCreditReport'); 
    Router._get('/monthly_invoice','UtilityController@monthly_invoice'); 
    Router._get('/report-log-for-customer-admin','UtilityController@customerReportLogForAdmin');
    Router._put('/update-payment-info/:id','UtilityController@updatePaymentInfoForAdmin'); 
    
    Router._get('/company-search-report/:company_no','UtilityController@generateReportCIN'); 
    Router._get('/llp-search-report/:llp_no','UtilityController@generateReportLLP'); 

    Router._get('/company-search-report-jsondata/:company_no','UtilityController@generateReportJSONDATACIN'); 
    Router._get('/llp-search-report-jsondata/:llp_no','UtilityController@generateReportJSONDATALLP');

    Router._get('/generate_excel/:user_id','UtilityController@generateExcel');
    
    Router._get('/getInvoiceList','UtilityController@getInvoiceList');

    Router._put('/sendmailinvoice/:id','UtilityController@sendmailinvoice');
    Router._put('/risk-score-update/:id','UtilityController@riskScoreUpdate');
});

Router._group('/probe-api',function(Router){
    Router._get('/get-entities-by-name','ProbeApiController@getEntitiesByName'); 
    Router._get('/get-companies-comprehensive-details','ProbeApiController@getCompaniesComprehensiveDetails');
    Router._get('/get-llps-comprehensive-details','ProbeApiController@getllpsComprehensiveDetails');
    Router._get('/get-companies-reports','ProbeApiController@getCompaniesreports');
    Router._get('/get-llps-reports','ProbeApiController@getllpsReports');
    Router._get('/get-companies-datastatus','ProbeApiController@getCompaniesDatastatus');
    Router._post('/get-llps-datstatus','ProbeApiController@getllpsDatastatus');

    Router._post('/get-comprehensive-data','ProbeApiController@getComprehensiveData');

    Router._put('/update-report-content/:id','ProbeApiController@update_report_content');

    Router._put('/generatePdfReportOnlineSearch/:id','ProbeApiController@generatePdfReportOnlineSearch');
    Router._put('/sendreportmail/:id','ProbeApiController@sendreportmail');

    //for excel to html conversion
    Router._get('/exceltohtml','ProbeApiController@exceltohtml');

    //for table /json to multitab excel
    Router._get('/tabletoexcel','ProbeApiController@tabletoexcel');

    //for html to json
    Router._get('/htmltojson','ProbeApiController@htmltojson');

    //for html to pdf test
    Router._get('/htmltopdftest','ProbeApiController@htmltopdftest');

    //import dynamic excel to search report
    //Router._post('/importexceltoreport','ProbeApiController@importexceltoreport'); 
    Router._post('/importexceltoreport','ProbeApiController@importexceltoreport'); 

    Router._post('/myinvoicelog','ProbeApiController@myinvoicelog'); 

    //for new cron
    Router._get('/update-probe-status','CronController@updateProbeStatus');
    //for new cron api
    Router._get('/update-probe-status-api','CronController@updateProbeStatusApi');

    //for update API
    Router._post('/testUpdateReq','ProbeApiController@testUpdateReq');

    //for save doc data //not present in live
    //Router._get('/savedocdatabulk','ProbeApiController@savedocdatabulk');

    //for test by static id get pdf from probe by doc id //not present in live
    //Router._get('/getdocfromprobetest','ProbeApiController@getdocfromprobetest');

    //get pdf from probe by doc id //not present in live
    //Router._get('/probedocbyid/:id','ProbeApiController@probedocbyid');
       
});

Router._put('/status-change/:id','StatusChange@statusChange');
Router._put('/download-status-change/:id','StatusChange@downloadStatusChange');

Router._get('/excel-convert','TestController@excelConvert');

Router._get('/cron-check','TestController@cronCheck');

module.exports = Router;
