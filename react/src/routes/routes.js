import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { commonJsFuncModule as commonJsObj } from '../utils/commonFunc';

import { AuthGuard as Auth,AuthGuardForInactive } from '../guards/AuthGuard'

import MainLayout from '../components/Layout/MainLayout';
import LoginLayout from '../components/Layout/LoginLayout';
import DefaultLayout from '../components/Layout/DefaultLayout';


const SignInComponent = lazy(() => import('../components/SignIn/SignInComponent'));
const DashboardComponent = lazy(() => import('../components/Dashboard/DashboardComponent'));
const ContactUsComponent = lazy(() => import('../components/ContactUs/ManageComponent'));

const UserListComponent = lazy(() => import('../components/User/List/ListComponent'));
const UserManageComponent = lazy(() => import('../components/User/Manage/ManageComponent'));

const RoleListComponent = lazy(() => import('../components/Role/List/ListComponent'));
const RoleManageComponent = lazy(() => import('../components/Role/Manage/ManageComponent'));

const EmailListComponent = lazy(() => import('../components/EmailContent/List/ListComponent'));
const EmailManageComponent = lazy(() => import('../components/EmailContent/Manage/ManageComponent'));

const ProfileManageComponent = lazy(() => import('../components/Profile/ProfileComponent'));
const MyProfileManageComponent = lazy(() => import('../components/MyProfile/MyProfileComponent'));
const SiteSettingComponent = lazy(() => import('../components/SiteSetting/SiteSettingComponent'));
const SetPasswordComponent = lazy(() => import('../components/SetPassword/SetPasswordComponent'));
const ChangePasswordComponent = lazy(() => import('../components/ChangePassword/ChangePasswordComponent'));

const ForgetPasswordComponent = lazy(() => import('../components/ForgetPassword/ForgetPasswordComponent'));
const ResetPasswordComponent = lazy(() => import('../components/ResetPassword/ResetPasswordComponent'));
const SearchListComponent = lazy(() => import('../components/Search/List/ListComponent'));
const SearchPlaceFreshInvigationManage = lazy(() => import('../components/Search/Manage/ManageComponent'));
const SearchDetailComponent = lazy(() => import('../components/Search/Detail/DetailComponent'));
const OnlineSearchDetailComponent = lazy(() => import('../components/Search/OnlineSearchDetail/OnlineSearchDetailComponent'));

const SearchReportComponent = lazy(() => import('../components/Search/SearchReport/SearchReportComponent'));

const SearchReportComponentManageComponent = lazy(() => import('../components/Search/SearchReport/Manage/ManageComponent'));
const SearchReportManageReportFieldComponent = lazy(() => import('../components/Search/SearchReport/ManageReportField/ManageReportFieldComponent'));

const CountryGroupManagementListComponent = lazy(() => import('../components/CountryGroupManagement/List/ListComponent'));
const CountryGroupManagementManageComponent = lazy(() => import('../components/CountryGroupManagement/Manage/ManageComponent'));

const CustomerOrderPriceManagementListComponent = lazy(() => import('../components/CustomerOrderPriceManagement/List/ListComponent'));
const CustomerOrderPriceManagementManageComponent = lazy(() => import('../components/CustomerOrderPriceManagement/Manage/ManageComponent'));

const CustomerReportLogListComponent = lazy(() => import('../components/CustomerReportLog/List/ListComponent'));

const MyInvoiceLogListComponent = lazy(() => import('../components/Myinvoicelog/List/ListComponent'));

const SearchInvestigationCountriesListComponent = lazy(() => import('../components/SearchInvestigationCountries/List/ListComponent'));
const SearchInvestigationCountriesManageComponent = lazy(() => import('../components/SearchInvestigationCountries/Manage/ManageComponent'));

const FinancialInfoComponent = lazy(() => import('../components/Search/SearchReport/FinancialInfo/FinancialInfoComponent'));


const ErrorComponent = lazy(() => import('../components/Error/ErrorComponent'));


const Main = ({ component: Component, ...rest }) => {
	if (rest.guard) {
		if (commonJsObj.isGuardValid(rest.guard)) {
			return (
				<Route {...rest} render={matchProps => (
					<MainLayout >
						<Component {...matchProps} />
					</MainLayout>
				)} />
			)

		} else {
			return (
				<Route {...rest} render={matchProps => (
					<Redirect to={{ pathname: '/', state: { from: matchProps.location } }} />
				)} />
			)
		}
	}
	return (
		<Route {...rest} render={matchProps => (
			<MainLayout>
				<Component {...matchProps} />
			</MainLayout>
		)} />
	);

};
const Login = ({ component: Component, ...rest }) => {
	return (
		<Route {...rest} render={matchProps => (
			localStorage.getItem('creAdminUser') ? <Redirect to={{ pathname: '/dashboard', state: { from: matchProps.location } }} /> :
				<LoginLayout>
					<Component {...matchProps} />
				</LoginLayout>
		)} />
	);
};

const Default = ({ component: Component, ...rest }) => {
	return (
		<Route {...rest} render={matchProps => (
			// localStorage.getItem('creAdminUser') ? <Redirect to={{ pathname: '/dashboard', state: { from: matchProps.location } }} /> :
				<DefaultLayout>
					<Component {...matchProps} />
				</DefaultLayout>
		)} />
	);
};

const routeArr = [
	{ path: '', component: SignInComponent, layout: 'Login' },
	{ path: 'login', component: SignInComponent, layout: 'Login' },
	{ path: 'set-password/:uniqueId', component: SetPasswordComponent, layout: 'Login' },
	{ path: 'forget-password', component: ForgetPasswordComponent, layout: 'Login' },
	{ path: 'reset-password/:uniqueId', component: ResetPasswordComponent, layout: 'Login' },
	{ path: 'contact-us', component: ContactUsComponent, layout: 'Main', guards: [AuthGuardForInactive] },

	{ path: 'dashboard', component: DashboardComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	{ path: 'change-password/:uniqueId?', component: ChangePasswordComponent, layout: 'Main', guards: [AuthGuardForInactive] },

	{ path: 'user', component: UserListComponent, layout: 'Main', guards: [AuthGuardForInactive] },	
	{ path: 'user/manage/:id?', component: UserManageComponent, layout: 'Main', guards: [AuthGuardForInactive] },	

	{ path: 'branch-office-listing', component: UserListComponent, layout: 'Main', guards: [AuthGuardForInactive] },	

	
	{ path: 'role', component: RoleListComponent, layout: 'Main', guards: [Auth] },
	{ path: 'role/manage/:id?', component: RoleManageComponent, layout: 'Main', guards: [Auth] },

	{ path: 'search-countries', component: SearchInvestigationCountriesListComponent, layout: 'Main', guards: [Auth] },
	{ path: 'search-countries/manage/:id?', component: SearchInvestigationCountriesManageComponent, layout: 'Main', guards: [Auth] },

	{ path: 'email-content', component: EmailListComponent, layout: 'Main', guards: [Auth] },
	{ path: 'email-content/manage/:id', component: EmailManageComponent, layout: 'Main', guards: [Auth] },

	{ path: 'edit-profile', component: ProfileManageComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	{ path: 'my-profile', component: MyProfileManageComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	{ path: 'site-setting', component: SiteSettingComponent, layout: 'Main', guards: [Auth] },

	{ path: 'search', component: SearchListComponent, layout: 'Main', guards: [AuthGuardForInactive] },	
	{ path: 'search/view/:id?', component: OnlineSearchDetailComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	{ path: 'search-list', component: SearchDetailComponent, layout: 'Main', guards: [AuthGuardForInactive] },		
	{ path: 'place-fresh-investigation', component: SearchPlaceFreshInvigationManage, layout: 'Main', guards: [AuthGuardForInactive] },	
	{ path: 'search/financial-info/:id?', component: FinancialInfoComponent, layout: 'Main', guards: [AuthGuardForInactive] },

	{ path: 'searchreport/view/:id?', component: SearchReportComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	{ path: 'searchreport/edit/:id?', component: SearchReportComponentManageComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	{ path: 'searchreport/edittable/:id?', component: SearchReportManageReportFieldComponent, layout: 'Main', guards: [AuthGuardForInactive] },
	
	{ path: 'country-group-management', component: CountryGroupManagementListComponent, layout: 'Main', guards: [Auth] },	
	{ path: 'country-group-management/manage/:id?', component: CountryGroupManagementManageComponent, layout: 'Main', guards: [Auth] },

	{ path: 'customer-order-price-management', component: CustomerOrderPriceManagementListComponent, layout: 'Main', guards: [Auth] },	
	{ path: 'customer-order-price-management/manage/:id?', component: CustomerOrderPriceManagementManageComponent, layout: 'Main', guards: [Auth] },

	{ path: 'customer-log-report', component: CustomerReportLogListComponent, layout: 'Main', guards: [Auth] },
	{ path: 'my-invoice-list', component: MyInvoiceLogListComponent, layout: 'Main', guards: [Auth] },
	

	{ path: '*', component: ErrorComponent, layout: 'Main', guards: [Auth] }

];

const routes = () => {
	let routes = [];
	routeArr.forEach((item, index) => {

		if (item.layout == "Main") {
			routes.push(
				<Main key={index}
					guard={item.guards ? item.guards : ''}
					path={'/' + item.path}
					exact
					component={item.component}
				/>);
		}
		if (item.layout === "Login") {
			routes.push(
				<Login key={index}
					guard={item.guards ? item.guards : ''}
					path={'/' + item.path}
					exact
					component={item.component}
				/>);
		}
		if (item.layout === "Default") {
			routes.push(
				<Default key={index}
					guard={item.guards ? item.guards : ''}
					path={'/' + item.path}
					exact
					component={item.component}
				/>);
		}
	});
	return routes;
}

export default routes
    