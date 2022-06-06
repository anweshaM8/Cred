const htmlToExcel = Helper('html-to-excel');
const fs = require('fs')
const logger = require('../../config/winston');
let path  = require('path')
const CronLog = Model('CronLog');
const moment = require('moment');

const TestController = {

	index: async function (req, res, next) {
		


	},
	excelConvert: async function (req, res, next) {

	// 	htmlToExcel
	// 	.conversion(`<table><tr><td>cell value</td></tr></table>`)
	// 	.then(function (response) {
	// })
	// .catch((err)=>{
	// 	console.log(err);
	// })
		
		const stream = await htmlToExcel(`<h2>A basic HTML table</h2>

		<table style="width:100%">
		  <tr>
			<th>Company</th>
			<th>Contact</th>
			<th>Country</th>
		  </tr>
		  <tr>
			<td>Alfreds Futterkiste</td>
			<td>Maria Anders</td>
			<td>Germany</td>
		  </tr>
		  <tr>
			<td>Centro comercial Moctezuma</td>
			<td>Francisco Chang</td>
			<td>Mexico</td>
		  </tr>
		</table>
		
		<p>To undestand the example better, we have added borders to the table.</p>`)
		const tmpHtmlPath2 = path.join(path.resolve('./log'), 'output1.xlsx')
  		stream.pipe(fs.createWriteStream(tmpHtmlPath2))

		return res.status(200).json(res.fnSuccess('' , 'Response Successfully', 200 ));

	},

	cronCheck: async function (req, res, next) {
		
		let dataSet = {
            name: 'update status api cron',          
            run_on :  moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        
 
        new CronLog().createData(dataSet)      
            .then((response) => {       
               
                // logger.infoLogger.info({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method: "CronLog.create",
                //     message: response,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })
				return 'Response Successfully';
                //return res.status(200).json(res.fnSuccess(dataSet, 'Response Successfully', 200));
            })
            .catch((errors) => {
                // logger.errorLogger.error({
                //     loggedInUserName: 'admin',
                //     ip: req.client._peername.address,
                //     method: "CronLog.create",
                //     message: errors,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // })
				return 'Internal Server Error';
                //return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
            });

	},
	


}

module.exports = TestController;