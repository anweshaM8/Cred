import { encrypdycrypService } from './../services/encryp-dycryp.service';
import httpService from './../services/httpService';

export const commonJsFuncModule = {

	getTimestampInMillisecondsFromDateObj: function (dateObj) {
		return dateObj.getTime();
	},

	getDateObjFromMilliseconds: function (ms) {
		let dtObj = new Date(ms);
		return dtObj;
	},
	timeStringToFloat: function (time) {
		//time = 0.75;
		let hoursMinutes = time.toString().split(/[.:]/);
		let hours = parseInt(hoursMinutes[0], 10); // get the hour
		let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0; // get the minute
		return {
			"hr": hours,
			"min": Math.round(("." + minutes) * 60) // convert decimal minute to whole number minute
		};
		//return hours + minutes / 60;
	},
	getOffsetOfLocalDateTime: function (dtObj) {

		let ofstData = -(((dtObj).getTimezoneOffset()) / 60); // convert to hours
		let getHrMnOffset = commonJsFuncModule.timeStringToFloat(ofstData);
		//console.log("=getHrMnOffset=>",getHrMnOffset);
		return getHrMnOffset;

	},
	separateKeysAndValuesInJson: function (data) {
		var keys = [];
		var values = [];
		Object.keys(data).forEach(function (key) {
			keys.push(key);
			values.push(data[key]);
		});
		var dataValue = {
			"values": values,
			"keys": keys
		}
		return dataValue
	},
	breakNumber: function (num) {
		let numb_abs = Math.abs(num)
		if (numb_abs > 999999999) { //billion
			return Math.sign(num) * ((numb_abs / 1000000000).toFixed(1)) + 'B';
		} else if (numb_abs > 999999) { //million
			return Math.sign(num) * ((numb_abs / 1000000).toFixed(1)) + 'M';
		} else if (numb_abs > 999) { //thousand
			return Math.sign(num) * ((numb_abs / 1000).toFixed(1)) + 'k';
		} else { // below thousand
			return Math.sign(num) * numb_abs;
		}

	},
	removeTokenFromLocStorage: function () {
		if (commonJsFuncModule.getUserInfo() !== null) {
			localStorage.removeItem("creAdminUser");
		}

	},

	getEndPoint: () => {
		return process.env.REACT_APP_API_ENDPOINT;
	},
	getBaseUrl: () => {
		return process.env.REACT_APP_BASE_URL;
	},
	getUserInfo: () => { 
		try {
			let wpauser = localStorage.getItem("creAdminUser");
			let decryptData = (encrypdycrypService.decryptAES(JSON.parse(wpauser).creAdminUser));
			wpauser = wpauser !== null ? JSON.parse(decryptData) : null;
			return wpauser;
		}
		catch (e) {
			return null;
		}
	},
	getRealTimeUserInfo: async() => { 
		try {
			if(commonJsFuncModule.getUserInfo()!=null)
			{
				let userData = await httpService.setModule('user').findOne(commonJsFuncModule.getUserInfo().user.id);
				if (userData.res.data.status == 'success') {

					if(userData.res.data.data.is_active==0)
					{
						let ee =await httpService.setModule('logout').create({user_id:commonJsFuncModule.getUserInfo().user.id});
						commonJsFuncModule.removeTokenFromLocStorage();
						return true
					}
					else
					{
						return false
					}

				}
				else
				{
					return false
				}

			}
			else
			{
				commonJsFuncModule.removeTokenFromLocStorage();
				return true;
			}
			

		}
		catch (e) {
			return false;
		}
	},
	getCurrentUserId: () => {
		let userObj = commonJsFuncModule.getUserInfo();
		if (userObj !== null) {
			return userObj.user.id !== null ? userObj.user.id : null;
		}
		return null;
	},
	getRole: () => {
		let userObj = commonJsFuncModule.getUserInfo();
		if (userObj !== null) {
			return userObj.roles !== null ? userObj.roles : null;
		}
		return null;
	},
	checkUrlPermission: (items) => {
		
		if (commonJsFuncModule.getCurrentUserId() == 1) {
			return true;
		} else {
			let permissions = commonJsFuncModule.getUserPermissions();
			console.log(permissions,'permissions')
			items = items.filter((el) => permissions.includes(el) );			
			if(items.length > 0){
				return true;
			}
			else{
				return false;
			}
			
		}

	},
	checkMenuPermission: (items) => {
		let permissions = commonJsFuncModule.getUserPermissions();
		items = items.filter((el) => permissions.includes(el.permission));
		return items;
	},
	getUserPermissions: () => {
		let userObj = commonJsFuncModule.getUserInfo();
		console.log("PERMISSION",userObj.permissions);
		if (userObj !== null) {
			return userObj.permissions !== null ? userObj.permissions : null;
		}
		return null;

	},
	sortArrayOfJsonByKey: (attrib, sortFlag) => {
		sortFlag = (sortFlag) ? sortFlag : 'ASC';

		return function (a, b) {
			if (a[attrib] > b[attrib]) {
				if (sortFlag === "ASC") {
					return 1;
				}
				else {
					return -1;
				}

			} else if (a[attrib] < b[attrib]) {
				if (sortFlag === "ASC") {
					return -1;
				}
				else {
					return 1;
				}
			}
			return 0;
		}
	},
	sortOnObjectPropertyKey: (objData, sortFlag) => {
		var sorted = {};
		let key = 0;
		let ar = [];

		sortFlag = (sortFlag) ? sortFlag : 'ASC';

		for (key in objData) {
			if (objData.hasOwnProperty(key)) {
				ar.push(key);
			}
		}

		ar.sort();
		if (sortFlag === 'DESC') {
			ar.reverse();
		}

		if (ar.length > 0) {
			for (key = 0; key < ar.length; key++) {
				sorted[ar[key]] = objData[ar[key]];
			}
		}
		return sorted;
	},
	getStringInitials: function (strData) {
		let acronym = "";
		if (strData !== undefined && strData !== null) {
			acronym = strData.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
			acronym = acronym.toUpperCase();
		}

		return acronym;


	},
	findElement: function (arr, propName, propValue) {
		if (arr.length > 0) {
			for (var i = 0; i < arr.length; i++)
				if (arr[i][propName] === propValue)
					return arr[i];
		}

		return null;
	},

	convertMinutueToHour: function (num) {

		let respObj = {
			"hours": "",
			"hoursDisplayText1": "",
			"hoursDisplayText2": ""
		};

		if (num !== undefined && num !== null && isNaN(num) === false) {
			let hours = Math.floor(num / 60);
			let minutes = num % 60;



			let hrFrmtTxt1 = "";
			let minFrmtTxt1 = "";

			let hrFrmtTxt2 = "";
			let minFrmtTxt2 = "";

			if (hours >= 0 && hours <= 1) {
				hrFrmtTxt1 = "0" + hours + " hr";
				hrFrmtTxt2 = "0" + hours + " Hour";

			} else if (hours > 1 && hours <= 9) {
				hrFrmtTxt1 = "0" + hours + " hrs";
				hrFrmtTxt2 = "0" + hours + " Hours";
			}
			else if (hours > 9) {
				hrFrmtTxt1 = hours + " hrs";
				hrFrmtTxt2 = hours + " Hours";
			}

			if (minutes >= 0 && minutes <= 1) {
				minFrmtTxt1 = "0" + minutes + " min";
				minFrmtTxt2 = "0" + minutes + " Min";
			} else if (minutes > 1 && minutes <= 9) {
				minFrmtTxt1 = "0" + minutes + " mins";
				minFrmtTxt2 = "0" + minutes + " Mins";

			} else if (minutes > 9 && minutes <= 59) {
				minFrmtTxt1 = minutes + " mins";
				minFrmtTxt2 = minutes + " Mins";
			}

			respObj.hours = hours + "." + minutes;
			respObj.hoursDisplayText1 = hrFrmtTxt1 + " " + minFrmtTxt1;
			respObj.hoursDisplayText2 = hrFrmtTxt2 + " " + minFrmtTxt2;

			return respObj;
		}

		return null;

	},

	getFileNameOnly: function (fileName) {
		let name = fileName.substr(0, fileName.lastIndexOf('.'));
		return name;
	},
	validateBlankSpace: function (dataToValidate) {
		let regexpData = /^ *$/;
		let chk = regexpData.test(dataToValidate);
		return chk;
	},
	isGuardValid: (guards) => {
		let guard_status = false;
		for (let index = 0; index < guards.length; index++) {
			const guard = guards[index];
			guard_status = guard();
		}

		return guard_status;
	},
	objectToUrl: (dataParams) => {
		let url = '';
		if (Object.keys(dataParams).length > 0) {
			Object.keys(dataParams).forEach((key, k) => {
				if (dataParams[key]) {
					url += (k === 0) ? '?' : '&';
					url += key + '=' + encodeURI(dataParams[key]);
				}
			});
		}
		return url;
	},
	generateRandomString : (length)=> {
		
		var result = '';
		var characters = process.env.REACT_APP_STATIC_RANDOM_CHARACTERS;
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result; 
	}
};

