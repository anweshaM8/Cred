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
    Router._get('/get-user-list-count','UtilityController@userListCount');   
});

Router._put('/status-change/:id','StatusChange@statusChange');

module.exports = Router;
