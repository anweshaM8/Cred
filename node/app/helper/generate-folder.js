const fs = require('fs');
const moment = require('moment');

const generateFolder = {

    generateLogFolder:  function () {
        const dir = `./log/${moment().format('YYYY-MM-DD')}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
        return dir;
    },
    
}

module.exports = generateFolder;

