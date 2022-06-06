import * as S3 from 'aws-sdk/clients/s3';
import HelperFunctionService from './helper-function.service';
import * as fs from 'fs';

class S3BucketService {

	static fileUpload(file, filePath = null, previous_path = null) {

		let bucket = new S3({
			accessKeyId: `${process.env.REACT_APP_S3CREDENTIALS_ACCESSKEYID}`,
			secretAccessKey: `${process.env.REACT_APP_S3CREDENTIALS_SECRETACCESSKEY}`,
			region: `${process.env.REACT_APP_S3CREDENTIALS_REGION}`,
			ACL: `${process.env.REACT_APP_S3CREDENTIALS_ACL}`,
		});
		console.log(bucket,'bucket',file)

		//const fileExt = file.split('.').slice(-1)[0];
		const fileExt = file.name;

		const today = new Date();
		const defaultPath = `credencemum/${today.getFullYear()}/${today.getMonth() + 1}/${HelperFunctionService.UUID()}.${fileExt}`;
		filePath = `credencemum/${filePath}/${today.getFullYear()}/${today.getMonth() + 1}/${HelperFunctionService.UUID()}.${fileExt}`;
console.log(defaultPath,'ssss');

		if (fileExt === 'jpg' || fileExt === 'jpeg') {
			var params = {
				Bucket: `${process.env.REACT_APP_S3CREDENTIALS_BUCKET}`,
				Key: filePath || defaultPath,
				Body: file,
				ACL: 'public-read',
				ContentDisposition: 'inline', 
				ContentType: 'image/jpeg'
			};
			if (previous_path !== '') {
				
				var delparams = {
					Bucket: `${process.env.REACT_APP_S3CREDENTIALS_BUCKET}`,
					Key: previous_path.slice(52,)
				};
				bucket.deleteObject(delparams, function (err, data) {
					if (data) {
						//console.log("File deleted successfully");
					}
					else {
						//console.log("Check if you have sufficient permissions : "+err);
					}
				});
			}
			return bucket.upload(params);
		}
		else {
			//const fileContent = fs.readFileSync(file[0]);

			var extraParams = {
				Bucket: `${process.env.REACT_APP_S3CREDENTIALS_BUCKET}`,
				Key: filePath || defaultPath,
				Body: file,
				ACL: 'public-read'
			};
			if (previous_path !== '') {
				// console.log(previous_path,'previous_path');
				// return false;
				var delparamsPrev = {
					Bucket: `${process.env.REACT_APP_S3CREDENTIALS_BUCKET}`,
					Key: previous_path.slice(52,)
				};
				bucket.deleteObject(delparamsPrev, function (err, data) {
					if (data) {
						//console.log("File deleted successfully");
					}
					else {
						console.log("Check if you have sufficient permissions : " + err);
					}
				});
			}
			return bucket.upload(extraParams);
		}


	};



}
export default S3BucketService;