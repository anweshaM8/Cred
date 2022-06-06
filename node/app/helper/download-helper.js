const download  = require('download');

const downloadHelper = {

    commonDownload: async function (path,importUrl) {
        let targetPath = path ? path : Public('csv-upload');  
             
        await download(importUrl).then(data => {
            _fs.writeFileSync(targetPath, data);
        });
        if(!_fs.existsSync(targetPath)){
            return false;
        }

        return targetPath;
    }
}

module.exports = downloadHelper;