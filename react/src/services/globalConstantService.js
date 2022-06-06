class globalConstantService {
	static apiModules = {
		'moduleList': {
			url: process.env.REACT_APP_BASEURL + '/utility/module-list',
			methods: [				
				{ name: 'list', type: 'get', url: '' },
			]
		},
		'getUserListCount': {
			url: process.env.REACT_APP_BASEURL + '/utility/get-user-list-count',
			methods: [				
				{ name: 'list', type: 'get', url: '' },
			]
		},
		'uploadOrder': {
			url: process.env.REACT_APP_BASEURL + '/utility/upload-order',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},
		'updateCreditScore': {
			url: process.env.REACT_APP_BASEURL + '/utility/update-credit-score',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},
		'customerCreditCount': {
			url: process.env.REACT_APP_BASEURL + '/utility/customer-credit-count',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},
		'role': {
			url: process.env.REACT_APP_BASEURL + '/role',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'user': {
			url: process.env.REACT_APP_BASEURL + '/user',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'countryGroupManagement': {
			url: process.env.REACT_APP_BASEURL + '/country-group-management',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'customerOrderPriceManagement': {
			url: process.env.REACT_APP_BASEURL + '/customer-order-price-management',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'statusChange': {
			url: process.env.REACT_APP_BASEURL + '/status-change',
			methods: [		
				{ name: 'update', type: 'put', url: '' }
			]
		},
		'downloadstatusChange': {
			url: process.env.REACT_APP_BASEURL + '/download-status-change',
			methods: [		
				{ name: 'update', type: 'put', url: '' }
			]
		},
		'log': {
			url: process.env.REACT_APP_BASEURL + '/log',
			methods: [								
				{ name: 'list', type: 'get', url: '' },
			]
		},
		'siteSetting': {
			url: process.env.REACT_APP_BASEURL + '/site-setting',
			methods: [								
				{ name: 'create', type: 'post', url: '' },
				{ name: 'list', type: 'get', url: '' },
				
			]
		},
		'login': {
			url: process.env.REACT_APP_BASEURL + '/authentication/login',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'setPassword': {
			url: process.env.REACT_APP_BASEURL + '/authentication/set-password',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'logout': {
			url: process.env.REACT_APP_BASEURL + '/authentication/logout',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'changePassword': {
			url: process.env.REACT_APP_BASEURL + '/authentication/change-password',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'forgetPassword': {
			url: process.env.REACT_APP_BASEURL + '/authentication/forget-password',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'resetPassword': {
			url: process.env.REACT_APP_BASEURL + '/authentication/reset-password',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		
		'emailContent': {
			url: process.env.REACT_APP_BASEURL + '/email-content',
			methods: [
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'country': {
			url: process.env.REACT_APP_BASEURL + '/country',
			methods: [
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
			]
		},
		'state': {
			url: process.env.REACT_APP_BASEURL + '/state',
			methods: [
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
			]
		},
		'city': {
			url: process.env.REACT_APP_BASEURL + '/city',
			methods: [
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
			]
		},
		'contactUs': {
			url: process.env.REACT_APP_BASEURL + '/contact-us',
			methods: [
				{ name: 'list', type: 'get', url: '' },
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'searchInvestigation': {
			url: process.env.REACT_APP_BASEURL + '/search-investigation',
			methods: [
				{ name: 'list', type: 'get', url: '' },
				{ name: 'create', type: 'post', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'update', type: 'put', url: '' },
			]
		},
		'wallet': {
			url: process.env.REACT_APP_BASEURL + '/wallet',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'customerReportLog': {
			url: process.env.REACT_APP_BASEURL + '/customer-report-log',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'getCustomerReportLogForAdmin': {
			url: process.env.REACT_APP_BASEURL + '/utility/report-log-for-customer-admin',
			methods: [				
				{ name: 'list', type: 'get', url: '' },
			]
		},
		'getInvoiceList': {
			url: process.env.REACT_APP_BASEURL + '/utility/getInvoiceList',
			methods: [				
				{ name: 'list', type: 'get', url: '' },
			]
		},	
		'updatePaymentInfoForAdmin': {
			url: process.env.REACT_APP_BASEURL + '/utility/update-payment-info',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},
		'getProbeEntitiesByName': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/get-entities-by-name',
			methods: [				
				{ name: 'list', type: 'get', url: '' },
			]
		},
		'onlineSearchDetails': {
			url: process.env.REACT_APP_BASEURL + '/online-search-details',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'getProbeCompanyDetails': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/get-comprehensive-data',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
			]
		},	
		'updatereportcontent': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/update-report-content',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},
		'generatepdfreport': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/generatePdfReportOnlineSearch',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},	
		'sendmailreport': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/sendreportmail',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},	
		
		'sendmailinvoice': {
			url: process.env.REACT_APP_BASEURL + '/utility/sendmailinvoice',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},	
		'riskScoreUpdate': {
			url: process.env.REACT_APP_BASEURL + '/utility/risk-score-update',
			methods: [				
				{ name: 'update', type: 'put', url: '' },
			]
		},

		'importexceltoreport': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/importexceltoreport',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
			]
		},	

		'getMyInvoiceList': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/myinvoicelog',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
			]
		},
		'SearchInvestigationCountries': {
			url: process.env.REACT_APP_BASEURL + '/search-investigation-countries',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		'updateProbeStatusApi': {
			url: process.env.REACT_APP_BASEURL + '/probe-api/update-probe-status-api',
			methods: [				
				{ name: 'list', type: 'get', url: '' },
			]
		},
		'searchFinancialDocs': {
			url: process.env.REACT_APP_BASEURL + '/search-financial-docs',
			methods: [				
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},	
	}; 

}
export default globalConstantService; 