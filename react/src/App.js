import React, { Suspense } from 'react';
import './App.css';
import { store } from './storage/store';
import { Router, Switch, Route, withRouter, BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.scss';

import routes from './routes/routes';
import { history } from './helpers/history';
import { pdfjs } from 'react-pdf';

import { LastLocationProvider } from 'react-router-last-location';
let loadRoutes = routes();



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
	localStorage.setItem('lang', 'en');
	return (
		<Suspense fallback={null}>
			<BrowserRouter getUserConfirmation={(message, callback) => {
				// this is the default behavior
				const allowTransition = window.confirm(message);
				callback(allowTransition);
			}} 
			>
				<Router history={history}>				
					<LastLocationProvider>
						<Switch>							
							{loadRoutes}
						</Switch>
					</LastLocationProvider>					
				</Router>
			</BrowserRouter>
		</Suspense>
	);
}

export default App;
