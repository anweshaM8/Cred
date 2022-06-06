const result = require('dotenv').config({path: './envs/.env-local'});
const port = process.env.APP_PORT || 8000;
const host = process.env.APP_HOST || 'http://127.0.0.1';
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const fs = require('fs');
const moment = require('moment');
const morgan = require('morgan');

require('./app/helper/functions');
require('./app/helper/string');
require('./app/helper/date');
require('./app/console/scheduler');

const logger = require('./config/winston');
const generateFolder = Helper('generate-folder');

/*
|--------------------------------------------------------------------------
| Application Log Generation
|--------------------------------------------------------------------------
|
*/
var accessLogStream = fs.createWriteStream(  
    path.join(__dirname, `${generateFolder.generateLogFolder()}/access-${moment().format('YYYY-MM-DD')}.log`), { flags: 'a' }
)

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(function(err, req, res, next) {
    logger.error(`${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`);
    next(err)
})  
 require('./test.js');

/*
|--------------------------------------------------------------------------
| Application Http Request Installation
|--------------------------------------------------------------------------
|
*/
var corsOptions = {
    origin: process.env.CORS_ALLOW_URL,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'x-www-form-urlencoded' ,
        'x-access-token'
    ],
    credentials: true
};
app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({
//   extended: true
// }));

//for sending large payload like report HTML 
const maxRequestBodySize = '10000mb';
app.use(express.json({limit: maxRequestBodySize}));
app.use(express.urlencoded({limit: maxRequestBodySize, extended: true}));

/*
|--------------------------------------------------------------------------
| Application Sattic path  Installation
|--------------------------------------------------------------------------
|
*/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources',express.static(path.join(__dirname, 'log')));



/*
|--------------------------------------------------------------------------
| Application  View engine Installation
|--------------------------------------------------------------------------
|
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
|--------------------------------------------------------------------------
| Application Provider Registration
|--------------------------------------------------------------------------
|
*/
require('./app/provider/RouteServiceProvider')(app);

/*
|--------------------------------------------------------------------------
| Application Node Server Installation
|--------------------------------------------------------------------------
|
*/
if (_.toBoolean(getConfig('app.secure'))) {
    var options = {
        key: fs.readFileSync(process.env.SSLKEY),
        cert: fs.readFileSync(process.env.SSLPEM),
        requestCert: true,
        rejectUnauthorized: false
    };
    var server = require('https').createServer(options, app);
    server.listen(port, (req, res, next) => {
        console.log("\x1b[32m%s\x1b[0m", `Node server started on : <${host}:${port}>`);
    });
} else {
    var server = require('http').createServer(app);
    server.listen(port, (req, res, next) => {
        console.log("\x1b[32m%s\x1b[0m", `Node server started on : <${host}:${port}>`);
    });
}