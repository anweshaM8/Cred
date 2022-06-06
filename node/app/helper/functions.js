/*
|--------------------------------------------------------------------------
| Application Variable Define
|--------------------------------------------------------------------------
|
*/
global._ = require('lodash');
global._fs = require('fs');
const moment = require('moment');
const CryptoJS = require("crypto-js");
 
/*
|--------------------------------------------------------------------------
| Application PATH Define Function
|--------------------------------------------------------------------------
|
*/
global.Config = function (config) {
    return require(`../../config/${config}`);
}

global.Model = function (Model) {
    return require(`../model/${Model}`);
}

global.Route = function (Route) {
    return require(`../../routes/${Route}`);
}

global.Helper = function (Helper) {
    return require(`../helper/${Helper}`);
}

global.Middleware = function (Middleware) {
    return require(`../middleware/${Middleware}`);
}

global.Controller = function (Controller) {
    return require(`../controller/${Controller}`);
}

global.Mail = function (mail) {
    return require(`../mail/${mail}`);
}

global.Root = function (path) {
    return `../../${path}/`;
}

global.Public = function (path) {
    return (`public/${path}`)
}

/*
|--------------------------------------------------------------------------
| Config Helper Function
|--------------------------------------------------------------------------
|
*/
global.getConfig = function (string) {

    try {
        if (!_.contain(string, '.')) {
            return Config(string);
        }
    } catch (e) {
        return null;
    }

    let stringAr = _.split(string, '.');
    let fileName = _.head(stringAr);
    let objPath = _.pull(stringAr, fileName);

    try {
        let fileObject = Config(fileName);

        _.each(objPath, (key) => {
            if (_.isEmpty(fileObject[key])) {
                fileObject = null;
            } else {
                fileObject = fileObject[key];
            }
        });

        return fileObject;
    } catch (e) {
        return null;
    }
}

global.appKey = function () {
    return getConfig('app.key');
}

global.dd = function (data) {
    if (getConfig('app.env') === 'development') {
        console.log(data);
    }
}

global.getEnv = function (key) {
    require('dotenv').config();
    return process.env[key];
}

global.generateRandomString = function (length) {
    var result = '';
    var characters = this.process.env.STATIC_RANDOM_CHARACTERS;
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; 
}
global.generateRandomNumber = function (length) {
    var result = '';
    var characters = this.process.env.STATIC_RANDOM_NUMBER;
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


/*
|--------------------------------------------------------------------------
| Application Global Helper Function
|--------------------------------------------------------------------------
|
*/

global.isJSONString = function (string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
} 

global.encrypt = function (string) {
    var text = string;
    var secret = process.env.ENCRYPTION_KEY;
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(text, CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32, iterations: 100 }) /* key */, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
    var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return encodeURIComponent(transitmessage);
}

global.decrypt = function (string) {   
    var secret = process.env.ENCRYPTION_KEY;
    var text = string;
    var key = CryptoJS.PBKDF2(secret, CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
    var decrypted = CryptoJS.AES.decrypt(text.substring(64) /* encrypted */, key, { iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })

    return decrypted.toString(CryptoJS.enc.Utf8);
}

global.encryption = function (text) {
    var secret =  process.env.ENCRYPTION_KEY;
	var salt = CryptoJS.lib.WordArray.random(128 / 8);
	var iv = CryptoJS.lib.WordArray.random(128 / 8);
	var encrypted = CryptoJS.AES.encrypt(text, CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32, iterations: 100 }) /* key */, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
	var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
	return transitmessage;
}

global.decryption = function (data) {
    var text = data;
	var secret = process.env.ENCRYPTION_KEY;
	var key = CryptoJS.PBKDF2(secret, CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
	var decrypted = CryptoJS.AES.decrypt(text.substring(64) /* encrypted */, key, { iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })

	//console.log( decrypted.toString(CryptoJS.enc.Utf8));
	return decrypted.toString(CryptoJS.enc.Utf8);
}

/*
|--------------------------------------------------------------------------
| Application Router Helper Function
|--------------------------------------------------------------------------
|
*/

global.routeList = function (routes, path) {

    var routeListAr = [];
    var path = path || '';

    let getRouteList = function (routes, prefix) {
        var prefix = prefix || '';
        _.each(routes.stack, (r) => {
            if (r.route) {
                let object = {
                    path: `${path}${prefix}${r.route.path}`,
                    method: (r.route.stack[0].method).toUpperCase(),
                }
                routeListAr.push(object)

            } else {
                getRouteList(r.handle, r.handle.prefix)
            }
        })
    }
    getRouteList(routes);

    return routeListAr;
}

/*
|--------------------------------------------------------------------------
| Gate Helper Function
|--------------------------------------------------------------------------
|
*/
global.makeTree = function (array, parent, tree) {
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { id: 0 };

    var children = _.filter(array, function (child) { return child.parent_id == parent.id; });

    if (!_.isEmpty(children)) {
        if (parent.id == 0) {
            tree = children;
        } else {
            parent['children'] = children;
        }
        _.each(children, function (child) { makeTree(array, child) });
    }
    return tree;
}

/*
|--------------------------------------------------------------------------
| Gate Helper Function
|--------------------------------------------------------------------------
|
*/

global.hasPermission = function (name) {

    let jwtDecode = require('jwt-decode');
    let parentArguments = arguments.callee.caller;
    let req = parentArguments.arguments[0];
    let token = req.get('Authorization');

    if (!token) return false;

    let permissions = jwtDecode(token).permissions;
    if (!permissions) return false;

    if (name.indexOf('|') >= 0) {
        return !!name.split('|').filter(v => permissions.indexOf(v) >= 0).length;
    }

    if (name.indexOf(',') >= 0) {
        return (name.split(',').filter(v => permissions.indexOf(v) >= 0).length) === (name.split(',').length);
    }

    return permissions.indexOf(name) >= 0;
}


global.hasRole = function (name) {

    let jwtDecode = require('jwt-decode');
    let parentArguments = arguments.callee.caller;
    let req = parentArguments.arguments[0];
    let token = req.get('Authorization');

    if (!token) return false;

    let roles = jwtDecode(token).roles;

    if (!roles) return false;

    if (name.indexOf('|') >= 0) {
        return !!name.split('|').filter(v => roles.indexOf(v) >= 0).length;
    }

    if (name.indexOf(',') >= 0) {
        return (name.split(',').filter(v => roles.indexOf(v) >= 0).length) === (name.split(',').length);
    }

    return roles.indexOf(name) >= 0;
}


/*
|--------------------------------------------------------------------------
| Create Unique Slug
|--------------------------------------------------------------------------
|
*/

global.generateSlug = async function (collection, string, column) {

    if (_.isEmpty(string)) {
        return null;
    }

    string = _.toSlug(string);

    let is_exists = async function (collection, string, column) {
        let _is_exists = false;
        await collection.where((column || 'slug'), string).count().then((count) => {
            if (count > 0) {
                _is_exists = true
            }
        });
        return _is_exists;
    }

    let slug_exists = await is_exists(collection, string, column)

    if (slug_exists) {

        for (let i = 1; i <= 100; i++) {

            let stringChain = _.chain(string).split('-');
            let string_arr = stringChain.value();
            let last_item = stringChain.last().value();

            if (_.isDigit(last_item) && !_.isEmpty(last_item)) {
                string_arr[string_arr.length - 1] = i;
                string = _.join(string_arr, '-');
            } else {
                string = `${string}-${i}`;
            }
            slug_is_exists = await is_exists(collection, string, column);

            if (slug_is_exists == false) {
                return string;
            }
        }
    } else {
        return string;
    }
}

/*
|--------------------------------------------------------------------------
| Unique Value Check from the object
|--------------------------------------------------------------------------
|
*/

global.checkDuplicateInObject = async function (propertyName, inputArray) {
    let seenDuplicate = false,
        testObject = {};

    inputArray.map(function (item) {
        let itemPropertyName = item[propertyName];
        if (itemPropertyName in testObject) {
            testObject[itemPropertyName].duplicate = true;
            item.duplicate = true;
            seenDuplicate = true;
        }
        else {
            testObject[itemPropertyName] = item;
            delete item.duplicate;
        }
    });
    return seenDuplicate;
}

global.arrayChunk = async function (array, size) {
    const chunked_arr = [];
    let copied = [...array];
    const numOfChild = Math.ceil(copied.length / size);
    for (let i = 0; i < numOfChild; i++) {
        chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
}

global.getRangeDates = async function (startDate, stopDate) {
    let doWd = false;

    let dateArray = [];
    let dayNr;
    let runDateObj = moment(startDate);
    let stopDateObj = moment(stopDate);

    while (runDateObj <= stopDateObj) {
        dayNr = runDateObj.day();
        if (!doWd || (dayNr > 0 && dayNr < 6)) {
            dateArray.push(moment(runDateObj).format('YYYY-MM-DD'));
        }

        runDateObj = moment(runDateObj).add(1, 'days');
    }
    return dateArray;
}

global.groupByArr = function (objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

global.searchInArr = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}

global.generateCustomerUniqueId = function (formData, lastInsertId,getCountryDetails) {

    var setUniqueId='';

                //AA (2) – Bank (BA) / Corporate customer (CO) / Individual user (IU) (This categorisation will be done on registration)
                if(formData.user_type=='SA')
                {
                    setUniqueId=setUniqueId.concat('SA');
                }
                else if(formData.user_type=='Sub')
                {
                    setUniqueId=setUniqueId.concat('SU');
                }
                else if(formData.user_type=='A')
                {
                    setUniqueId=setUniqueId.concat('AG');
                }
                else if(formData.user_type=='BO' || formData.user_type=='HO')
                {
                    setUniqueId=setUniqueId.concat('BA');
                }
                else if(formData.user_type=='I')
                {
                    setUniqueId=setUniqueId.concat('IU');
                }
                else if(formData.user_type=='CO')
                {
                    setUniqueId=setUniqueId.concat('CO');
                }
                else
                {
                    setUniqueId=setUniqueId.concat('CR');
                }
                console.log('setUniqueId 11',setUniqueId);
                //BBB (3) – Bank / Corporate (first 4 letters of name) / XXXX for Retail customer  
                setUniqueId=setUniqueId.concat(formData.name.replace(/\s/g,'').slice(0, 4).toUpperCase());

                console.log('setUniqueId 12',setUniqueId);

                //CC (2) – Country code
                setUniqueId=setUniqueId.concat(getCountryDetails.sortname.toUpperCase());

                console.log('setUniqueId 13',setUniqueId);

                //DD (2) – Bank branch code / (00 for Corporate) / (00 for Retail customer)

                if(formData.user_type=='BO')
                {
                    setUniqueId=setUniqueId.concat(formData.branch_office_code);
                }
                else
                {
                    setUniqueId=setUniqueId.concat('00');
                }

                console.log('setUniqueId 14',setUniqueId);

                //XXXX (4) – Date of joining mm/yy
                let todayDate = new Date();
                let getMonth = ("0" + (todayDate.getMonth() + 1)).slice(-2);
                let getYear = todayDate.getFullYear().toString().substr(-2);

                setUniqueId=setUniqueId.concat(getMonth+getYear);

                console.log('setUniqueId 15',setUniqueId);

                //YYYYYY (6) – Unique user number - keep adding to the number on any new registration (+1)

                setUniqueId=setUniqueId.concat(`${lastInsertId}`.padStart(6, '0'));

                console.log('setUniqueId 16',setUniqueId);

                return setUniqueId;

}