import axios from 'axios';
import globalConstantService from './globalConstantService';
import {  throwError } from 'rxjs';
import { commonJsFuncModule as commonJsObj } from './../utils/commonFunc';

class httpService {
	httpOptions = {};
	constructor(

	) {

		this.httpOptions = {
			'Content-Type': 'application/json',
			'x-access-token': ''
		};
	}

	static setModule(moduleName) {

		this.module = null;
		if (moduleName in globalConstantService.apiModules) {
			this.module = globalConstantService.apiModules[moduleName];
		}
		return this;
	}

	static async getReq(url) {
		return await axios.get(url, { headers: this.httpOptions }).then(result => {
			let response = result;
			return { err: 0, res: response };
		})
			.catch(error => {
				return { err: 8040, res: error };
			})

	}

	static async postReq(url, params) {
		return await axios.post(url, params, { headers: this.httpOptions }).then(result => {
			// return { err: 0, res: response };

			let response = result;
			return { err: 0, res: response };
		})
			.catch(error => {
				console.log(error);
				return { err: 8040, res: error };
			})
	}

	static async putReq(url, params) {
		console.log("PARAM1",params);
		return await axios.put(url, params, { headers: this.httpOptions }).then(result => {

			let response = result;
			return { err: 0, res: response };
		})
		.catch(error => {
			console.log(error);
			return { err: 8040, res: error };
		})
	}

	static async deleteReq(url) {
		console.log(url,'urlurlurlurlurlurlurl')
		return await axios.delete(url, { headers: this.httpOptions }).then(result => {
			let response = result;
			return { err: 0, res: response };
		})
		.catch(error => {
			console.log(error,'===');
			return { err: 8040, res: error };
		})
	}


	static async buildRequestByMethod(methodName, urlParamStr, paramsObj) {

		// await axios.get(`${process.env.REACT_APP_BASEURL}/generate-token`, {})
		// 	.then((result) => {

		// 		let response = result.data;
		// 		if (response.status == 'success') {
					
		// 		}

		// 	});
		// if (!this.module) {
		// 	return throwError({
		// 		error: {
		// 			message: 'Module not found!'
		// 		}
		// 	});
		// }

		const method = this.module.methods.find((el) => {
			return (el.name === methodName);
		});

		let url = this.module ? this.module.url : '';
		if (method) {
			url += method.url;
		}
		url += urlParamStr;
console.log(method,'method.typemethod.type')
		if (method) {
			switch (method.type) {
				case 'get':
					return this.getReq(url);
				case 'post':
					return this.postReq(url, paramsObj);
				case 'delete':
					return this.deleteReq(url, paramsObj);
				case 'put':
					return this.putReq(url, paramsObj);
				default:
					return throwError({
						error: {
							message: 'Definition not found in configuration'
						}
					});
			}
		} else {
			return throwError({
				error: {
					message: 'Definition not found in configuration'
				}
			});
		}
	}

	static findOne(id, optParams) {
		let url = '';
		if (!id) {
			return throwError({
				error: {
					message: 'Id not found'
				}
			});
		}
		url += '/' + id;
		const routeParams = optParams || {};
		url += commonJsObj.objectToUrl(routeParams);

		return this.buildRequestByMethod('details', url);
	}

	static search(params) {
		//console.log(params)
		let url = '';
		url += commonJsObj.objectToUrl(params);
		return this.buildRequestByMethod('list', url);

	}

	static async list(params) {
		let url = this.module ? this.module.url : '';
		if (this.module) {
			const method = this.module.methods.filter((element) => (element.name === 'list'));
			url += method[0].url;
		}
		url += commonJsObj.objectToUrl(params);
		return await axios.get(url, this.httpOptions).then(response => {
			return { err: 0, res: response.data };
		})
			.catch(error => {
				console.log(error);
				return { err: 8040, res: error };
			})
	}

	static create(params) {
		const url = '';
		return this.buildRequestByMethod('create', url, params);
	}

	static update(params) {
		let url = '';
		console.log("PARAM",params);
		if (!('id' in params)) {
			return throwError({
				error: {
					message: 'Id not found'
				}
			});
		}
		url += '/' + params['id'];
		return this.buildRequestByMethod('update', url, params);

	}

	static deleteOne(params) {
		let url = '';
		console.log(params,'params')
		if (!('id' in params)) {
			return throwError({
				error: {
					message: 'Id not found'
				}
			});
		}
		url += '/' + params['id'];
		delete params.id;
		url += commonJsObj.objectToUrl(params);
		//url +='/'+
		console.log(url,'sss');
		return this.buildRequestByMethod('delete', url, params);
	}
}
export default httpService;
