
var multer = require('multer');
const fileTypeAllow = ['txt', 'doc', 'docs', 'pdf', 'jpg', 'png', 'gif', 'jpeg','csv'];

const uploadHelper = {

    commonUpload: function (req, res, path,model) {
        let targetPath = path ? path : Public('csv-upload');       
        const storage = multer.diskStorage({
            destination: (req, file, callback) => {                
                callback(null, targetPath);
            },
            filename: (req, file, callback) => {                
                let fileType = '';
                if (file.originalname) {
                    let fileArr = file.originalname.split(".");
                    if(model){                        
                        callback(null, file.originalname);
                    } else {
                        if (fileArr.length > 0) {
                            let totalLength = fileArr.length - 1;
                            fileType = fileArr[totalLength];
                            callback(null, Date.now() + '_file' + '.' + fileType);
                        }                        
                    }
                }               
            }
        });
        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                let fileType = '';
                if (file.originalname) {
                    let fileArr = file.originalname.split(".");
                    if (fileArr.length > 0) {
                        let totalLength = fileArr.length - 1;
                        fileType = fileArr[totalLength];
                    }
                }
                let type = fileType.toLowerCase();
                if (fileTypeAllow.indexOf(type) < 0) {
                    cb(null, false);
                    return cb(new Error('Only txt, doc, docs, pdf, jpg, png, gif, jpeg,csv format allowed!'));
                } else {
                    cb(null, true);
                }
            }
        }).any('file');
        return new Promise(function (resolve, reject) {
            upload(req, res, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    var uploadData = [];
                    req.files.map((file) => {
                        uploadData.push(file.filename);
                    });
                    resolve(uploadData);
                }
            })
        })
    }
}

module.exports = uploadHelper;