import * as CryptoJS from 'crypto-js';

let encryptAES = (text) => {
	// console.log(`${process.env.REACT_APP_Encryp_Key}`,"text", text)
	var secret = `${process.env.REACT_APP_Encryp_Key}`;
	var salt = CryptoJS.lib.WordArray.random(128 / 8);
	var iv = CryptoJS.lib.WordArray.random(128 / 8);
	var encrypted = CryptoJS.AES.encrypt(text, CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32, iterations: 100 }) /* key */, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })
	var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
	return transitmessage;
};
let decryptAES = (data) => {

	var text = data;
	var secret = `${process.env.REACT_APP_Encryp_Key}`;
	var key = CryptoJS.PBKDF2(secret, CryptoJS.enc.Hex.parse(text.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
	var decrypted = CryptoJS.AES.decrypt(text.substring(64) /* encrypted */, key, { iv: CryptoJS.enc.Hex.parse(text.substr(32, 32)) /* iv */, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC })

	//console.log( decrypted.toString(CryptoJS.enc.Utf8));
	return decrypted.toString(CryptoJS.enc.Utf8);
};
export const encrypdycrypService = {
	encryptAES,
	decryptAES
};