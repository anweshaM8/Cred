const ejsToHtml = Helper('ejs-to-html');
const htmlToPDF = Helper('html-to-pdf');
const htmlToExcel = Helper('html-to-excel');
const moment = require('moment');
const AWS = require('aws-sdk');
//const { resolve } = require('path/posix');
const Bucket = getEnv('AWS_BUCKET');
const ACL = getEnv('AWS_ACL');
const CreditinvoiceMail = Mail('Creditinvoice');
const Wallet = Model('Wallet');
const CustomerReportLog = Model('CustomerReportLog');
const email_config = Config('application').email
const OnlineSearchDetails = Model('OnlineSearchDetails');
const SearchInvestigation = Model('SearchInvestigation');
const InvoiceExcelLog = Model('InvoiceExcelLog');

AWS.config.update({
    accessKeyId: getEnv('AWS_ACCESS_KEY'),
    secretAccessKey: getEnv('AWS_SECRATE_KEY')
});

const generateInvoice = {

    invoice: async function (dataObj, dataObjDetail, user_id) {
        //console.log(dataObj,'dataObj');
        //console.log('Modified Excel');
        let invoice_pdf = '';
        let invoice_excel = '';

        /************added for brk up FI and ON no and price in summary**********/
        let fi_count = 0;
        let on_count = 0;
        let total_report = 0;
        let total_report_cost = 0;
        /************************************************************************/
        /*********************added for invoice details excel*************/
        var branchrelatedinfo = [];
        var searchInvestigationdata = [];

        await dataObjDetail.map(function (si_data) {
            //console.log(si_data.id);

            //calculate total cost of report sum of wallet log
            if (si_data.walletLog.total_amount) {
                total_report_cost = si_data.walletLog.total_amount + total_report_cost;
            }

            ///////////////////////////////////////////////////////
            if (si_data.type == 'FI') {
                fi_count = fi_count + 1;
            }
            else {
                on_count = on_count + 1;
            }

            let obj = branchrelatedinfo.find((o, i) => {
                if (o.user_id == si_data.user_id) {
                    //console.log("ID",si_data.id);
                    var branch_report_info = [];
                    var branch_report_info = o.details;
                    branch_report_info.push(si_data);
                    //console.log("DEtails",branch_report_info);
                    branchrelatedinfo[i] = { 'user_id': o.user_id, 'branch_name': o.branch_name, 'details': branch_report_info };
                    return true; // stop searching
                }

            });

            if (typeof obj == 'undefined') {
                searchInvestigationdata = [];
                searchInvestigationdata.push(si_data);
                var cseq = {
                    'user_id': si_data.user_id,
                    'branch_name': si_data.userDetail.name,
                    'details': searchInvestigationdata
                }

                branchrelatedinfo.push(cseq);
            }

        });

        total_report = fi_count + on_count;
        //console.log('FI',fi_count);
        //console.log('ON',on_count);
        //console.log('Total',total_report);
        dataObj.fi_count = fi_count;
        dataObj.on_count = on_count;
        dataObj.total_report = total_report;
        dataObj.total_report_cost = total_report_cost;

        //console.log(branchrelatedinfo);
        /****************************************************************** */
        dataObjDetail.branchrelatedinfo = branchrelatedinfo;
        let html1 = await ejsToHtml.toHTML('./views/invoice-excel.ejs', { details: dataObj, moment: moment })
        let html2 = await ejsToHtml.toHTML('./views/invoice-detail-excel.ejs', { detailsinv: dataObjDetail, moment: moment })
        //var html_all=html1+html2;
        let options_excel = '';
        let excel_invoice = 'credence_invoice_details' + moment().format('YYYYMMDDHHmmSS') + '.xlsx'
        let savePath_excel = Public(`invoice/` + excel_invoice);

        //console.log('Excel');
        //const stream = await htmlToExcel(html_all);
        //stream.pipe(_fs.createWriteStream(savePath_excel));

        const HtmlTableToJson = require('html-table-to-json');
        let jsonTables1 = HtmlTableToJson.parse(html1);
        let jsonTables2 = HtmlTableToJson.parse(html2);

        let json_sheet1 = jsonTables1.results[0];
        let json_sheet2 = jsonTables2.results[0];

        var excel = require('excel4node');

        // Create a new instance of a Workbook class
        var workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var worksheet = workbook.addWorksheet('Invoice');
        var worksheet1 = workbook.addWorksheet('Annexure to invoice');

        // Style for headers
        var style = workbook.createStyle({
            font: {
                //color: '#EA3A14',
                color: '#000000',
                size: 18,
                weight: 'bold'
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        var styleForData = workbook.createStyle({
            font: {
                //color: '#47180E',
                color: '#000000',
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        function generateExcelSheetModified1(data, worksheet) {
            let row = 4;//Row starts from 2 as 1st row is for headers.
            let rowIndex = 4;
            let styleforcell = styleForData;
            data.forEach(record => {
                let columnIndex = 1;
                if (rowIndex == 2 || rowIndex == 10) {
                    styleforcell = style;
                }
                else {
                    styleforcell = styleForData;
                }
                Object.keys(record).forEach(columnName => {
                    if (columnName == 'Grand total') {
                        styleforcell = style;
                    }
                    else {
                        styleforcell = styleForData;
                    }
                    worksheet.cell(rowIndex, columnIndex++)
                        .string(record[columnName]).style(styleforcell);
                });
                rowIndex++;
            });
        }

        function generateExcelSheetModified2(data, worksheet) {
            let row = 4;//Row starts from 2 as 1st row is for headers.
            let rowIndex = 4;
            data.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    worksheet.cell(rowIndex, columnIndex++)
                        .string(record[columnName]).style(styleForData);
                });
                rowIndex++;
            });
        }

        //Write Data in Excel file



        generateExcelSheetModified1(json_sheet1, worksheet);

        generateExcelSheetModified2(json_sheet2, worksheet1);
        worksheet.addImage({
            path: 'logo.png',
            type: 'picture',
            position: {
                type: 'twoCellAnchor',
                from: {
                    col: 1,
                    colOff: 0,
                    row: 1,
                    rowOff: 0,
                },
                to: {
                    col: 4,
                    colOff: 0,
                    row: 3,
                    rowOff: 0,
                },
            },
        });

        worksheet1.addImage({
            path: 'logo.png',
            type: 'picture',
            position: {
                type: 'twoCellAnchor',
                from: {
                    col: 1,
                    colOff: 0,
                    row: 1,
                    rowOff: 0,
                },
                to: {
                    col: 4,
                    colOff: 0,
                    row: 3,
                    rowOff: 0,
                },
            },
        });

        workbook.write(savePath_excel);
        /**********excel invoice ends pdf started******************* */
        ejsToHtml
            .toHTML('./views/invoice.ejs', { details: dataObj, moment: moment })
            .then((html) => {
                let options = {
                    format: 'Letter', orientation: "portrait", quality: 75, fitToPage: true,
                    "border": {
                        "top": "2mm",            // default is 0, units: mm, cm, in, px
                        "right": "5mm",
                        "bottom": "2mm",
                        "left": "10mm"
                    },
                };
                let pdf_file_name = 'credence_invoice' + moment().format('YYYYMMDDHHmmSS') + '.pdf';
                let savePath = Public(`invoice/` + pdf_file_name);
                //console.log(pdf_file_name);
                htmlToPDF
                    .toPDF(html, options, savePath)
                    .then(function (response) {

                        if (!_.isNull(response.filename)) {

                            //insert into cre_customer_report_log
                            let invoice_data = {
                                user_id: dataObj.user_id,
                                invoice_no: dataObj.invoice_no,
                                invoice_link: pdf_file_name,
                                invoice_excel: excel_invoice,
                                total_amount: dataObj.total_amount,
                                rebate_amount: dataObj.rebet_amount
                            }
                            //console.log(invoice_data);
                            new CustomerReportLog().createData(invoice_data);


                            //update to wallet table no of report 0 and pay now enable paid_status=1 fr this cust id
                            new Wallet({
                                'id': dataObj.id
                            }).save({ "no_of_report": 0, "paid_status": 1, });
                        }
                    }, function (error) {
                        console.error(error);
                        logger.errorLogger.error({
                            loggedInUserName: 'INVOICE GEN1',
                            ip: "server",
                            method: "UtilityController.monthly_invoice",
                            message: error,
                            dataTime: moment().format('YYYY-MM-DD hh:m:s')
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                logger.errorLogger.error({
                    loggedInUserName: 'INVOICE GEN2',
                    ip: "server",
                    method: "UtilityController.monthly_invoice",
                    message: err,
                    dataTime: moment().format('YYYY-MM-DD hh:m:s')
                });
            })
        console.log('Done');
    },

    invoice_original: async function (dataObj, dataObjDetail, user_id) {
        //console.log(dataObj,'dataObj');

        let invoice_pdf = '';
        let invoice_excel = '';
        /*********************8added for invoice details excel*************/
        var branchrelatedinfo = [];
        var searchInvestigationdata = [];

        await dataObjDetail.map(function (si_data) {
            //console.log(si_data.id);

            let obj = branchrelatedinfo.find((o, i) => {
                if (o.user_id == si_data.user_id) {
                    //console.log("ID",si_data.id);
                    var branch_report_info = [];
                    var branch_report_info = o.details;
                    branch_report_info.push(si_data);
                    //console.log("DEtails",branch_report_info);
                    branchrelatedinfo[i] = { 'user_id': o.user_id, 'branch_name': o.branch_name, 'details': branch_report_info };
                    return true; // stop searching
                }

            });

            if (typeof obj == 'undefined') {
                searchInvestigationdata = [];
                searchInvestigationdata.push(si_data);
                var cseq = {
                    'user_id': si_data.user_id,
                    'branch_name': si_data.userDetail.name,
                    'details': searchInvestigationdata
                }

                branchrelatedinfo.push(cseq);
            }

        });

        //console.log(branchrelatedinfo);
        /****************************************************************** */
        dataObjDetail.branchrelatedinfo = branchrelatedinfo;
        let html1 = await ejsToHtml.toHTML('./views/invoice-excel.ejs', { details: dataObj, moment: moment })
        let html2 = await ejsToHtml.toHTML('./views/invoice-detail-excel.ejs', { detailsinv: dataObjDetail, moment: moment })
        var html_all = html1 + html2;
        let options_excel = '';
        let excel_invoice = 'credence_invoice_details' + moment().format('YYYYMMDDHHmmSS') + '.xlsx'
        let savePath_excel = Public(`invoice/` + excel_invoice);

        //console.log('Excel');
        const stream = await htmlToExcel(html_all);
        stream.pipe(_fs.createWriteStream(savePath_excel));

        ejsToHtml
            .toHTML('./views/invoice.ejs', { details: dataObj, moment: moment })
            .then((html) => {
                let options = { format: 'Letter', orientation: "portrait", quality: 75, fitToPage: false };
                let pdf_file_name = 'credence_invoice' + moment().format('YYYYMMDDHHmmSS') + '.pdf';
                let savePath = Public(`invoice/` + pdf_file_name);
                console.log(pdf_file_name);
                htmlToPDF
                    .toPDF(html, options, savePath)
                    .then(function (response) {

                        if (!_.isNull(response.filename)) {

                            //insert into cre_customer_report_log
                            let invoice_data = {
                                user_id: dataObj.user_id,
                                invoice_no: dataObj.invoice_no,
                                invoice_link: pdf_file_name,
                                invoice_excel: excel_invoice,
                                total_amount: dataObj.total_amount,
                                rebate_amount: dataObj.rebet_amount
                            }
                            //console.log(invoice_data);
                            new CustomerReportLog().createData(invoice_data);


                            //update to wallet table no of report 0 and pay now enable paid_status=1 fr this cust id
                            new Wallet({
                                'id': dataObj.id
                            }).save({ "no_of_report": 0, "paid_status": 1, });
                        }
                    }, function (error) {
                        console.error(error);
                        // logger.errorLogger.error({
                        //     loggedInUserName: 'PDF GEN',
                        //     ip: "server",
                        //     method: "UtilityController.monthly_invoice",
                        //     message: error,
                        //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                        // });
                    });
            })
            .catch((err) => {
                console.log(err);
                // logger.errorLogger.error({
                //     loggedInUserName: 'HTML GEN',
                //     ip: "server",
                //     method: "UtilityController.monthly_invoice",
                //     message: err,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // });
            })
    },

    sendmailtest: function (dataObj) {
        //console.log(dataObj,'dataObj');
        //let attatchmentLink="Public(`images/invoice/${'cred-report' + moment().format('YYYYMMDDHHmmSS') + '.pdf'}`);";
        //let attatchmentLink="Public(`images/invoice/${'cred-report20220130161885.pdf'});";
        let attatchmentLink = "https://s3-ap-south-1.amazonaws.com/credencemum/2022/2/invoice/cred-report20220210132298.pdf";
        CreditinvoiceMail(dataObj, attatchmentLink);
    },

    ///////Report for cIN company
    report_cin: function (dataObj) {
        //console.log(dataObj,'dataObj');
        var chargeSequence = []; var casesFiledByCorporatesPending = []; var casesFiledByCorporatesDisposed = [];
        var consolidationOfCorporateAffairsPending = []; var consolidationOfCorporateAffairsDisposed = [];
        var casesFiledAgainstCorporatesPending = []; var casesFiledAgainstCorporatesDisposed = [];
        var creditRatingList = []; var creditRatingKeys = [];

        let standaloneFinancials = dataObj.financials.filter(function (value) {
            return value.nature == "STANDALONE";
        });

        let consolidatedFinancials = dataObj.financials.filter(function (value) {
            return value.nature == "CONSOLIDATED";
        });


        let promoterShareHoldingEquity = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "promoter" && value.category == "equity";
        });

        let promoterShareHoldingPreference = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "promoter" && value.category == "preference";
        });

        let publicShareHoldingEquity = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "public" && value.category == "equity";
        });

        let publicShareHoldingPreference = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "public" && value.category == "preference";
        });


        dataObj.charge_sequence.map(function (el3) {
            var det = [];

            let obj = chargeSequence.find((o, i) => {
                if (o.id == el3.charge_id && el3.status!='Satisfaction') {
                    var det1 = o.details;
                    det1.push(el3)
                    chargeSequence[i] = { 'id': el3.charge_id, 'details': det1 };
                    return true; // stop searching
                }
            });

            if (typeof obj == 'undefined' && el3.status!='Satisfaction') {
                det.push(el3)
                var cseq = {
                    'id': el3.charge_id,
                    'details': det
                }

                chargeSequence.push(cseq);
            }

        });

        dataObj.legal_history.map(function (el4) {

            if (el4.case_type == "Cases Filed By This Corporate" && el4.case_status == "Pending") {
                casesFiledByCorporatesPending.push(el4);
            }

            if (el4.case_type == "Cases Filed By This Corporate" && el4.case_status == "Disposed") {
                casesFiledByCorporatesDisposed.push(el4);
            }

            if (el4.case_type == "Cases for Consolidation of Corporate affairs" && el4.case_status == "Pending") {
                consolidationOfCorporateAffairsPending.push(el4);
            }

            if (el4.case_type == "Cases for Consolidation of Corporate affairs" && el4.case_status == "Disposed") {
                consolidationOfCorporateAffairsDisposed.push(el4);
            }

            if (el4.case_type == "Cases Filed Against This Corporate" && el4.case_status == "Pending") {
                casesFiledAgainstCorporatesPending.push(el4);
            }

            if (el4.case_type == "Cases Filed Against This Corporate" && el4.case_status == "Disposed") {
                casesFiledAgainstCorporatesDisposed.push(el4);
            }

        });

        dataObj.credit_ratings.map(function (el5) {

            if (creditRatingKeys.includes(el5.rating_agency) == false) {
                creditRatingKeys.push(el5.rating_agency);

                var ratingDate = el5.rating_date;

                let getDatas = dataObj.credit_ratings.filter(function (value) {
                    return value.rating_date == ratingDate && value.rating_agency == el5.rating_agency;
                });

                var finalData = {
                    'rating_agency': el5.rating_agency,
                    'rating_date': ratingDate,
                    'details': getDatas
                }

                creditRatingList.push(finalData);

            }


        });


        dataObj.standaloneFinancials = standaloneFinancials.slice(0, 3).reverse();
        dataObj.consolidatedFinancials = consolidatedFinancials.slice(0, 3).reverse();

        dataObj.standaloneFinancials1 = standaloneFinancials;
        dataObj.consolidatedFinancials1 = consolidatedFinancials;

        dataObj.promoterShareHoldingEquity = promoterShareHoldingEquity;
        dataObj.promoterShareHoldingPreference = promoterShareHoldingPreference;
        dataObj.publicShareHoldingEquity = publicShareHoldingEquity;
        dataObj.publicShareHoldingPreference = publicShareHoldingPreference;
        dataObj.chargeSequence = chargeSequence;

        dataObj.casesFiledByCorporatesPending = casesFiledByCorporatesPending;
        dataObj.casesFiledByCorporatesDisposed = casesFiledByCorporatesDisposed;
        dataObj.consolidationOfCorporateAffairsPending = consolidationOfCorporateAffairsPending;
        dataObj.consolidationOfCorporateAffairsDisposed = consolidationOfCorporateAffairsDisposed;
        dataObj.casesFiledAgainstCorporatesPending = casesFiledAgainstCorporatesPending;
        dataObj.casesFiledAgainstCorporatesDisposed = casesFiledAgainstCorporatesDisposed;
        dataObj.creditRatingList = creditRatingList;

        //return dataObj;

        // ejsToHtml
        // .toHTML('./views/cin-report.ejs',{details:dataObj,moment:moment}) 
        // .then((html)=>{

        ejsToHtml
            .toHTML('./views/cin-report-modified.ejs', { details: dataObj, moment: moment })
            .then((html) => {

                // ejsToHtml
                // .toHTML('./views/cin-report-modified-html.ejs',{details:dataObj,moment:moment}) 
                // .then((html)=>{


                let savePathHtml = Public('report_cin.html');
                _fs.writeFileSync(savePathHtml, html, 'utf8');
                // let options = { format: 'Letter',orientation:"portrait", quality:75,fitToPage:true,"border": {
                //     "top": "2mm",            // default is 0, units: mm, cm, in, px
                //     "right": "1mm",
                //     "bottom": "2mm",
                //     "left": "15mm"
                //   },
                //   "header": {
                //     "height": "25mm",
                //     "contents": '<div style="text-align: right;"><img src="'+email_config.logo +'" alt="Logo" style="width: 139px;height: 24px;"/></div>'
                //   },};

                let options = {
                    format: 'Letter', orientation: "portrait", quality: 75, fitToPage: true, "border": {
                        "top": "2mm",            // default is 0, units: mm, cm, in, px
                        "right": "5mm",
                        "bottom": "2mm",
                        "left": "10mm"
                    },
                    "header": {
                        "height": "25mm",
                        "contents": '<div style="text-align: right;"><img src="' + email_config.logo + '" alt="Logo" style="width: 139px;height: 24px;"/></div>'
                    }, footer: {
                        height: '10mm',
                        contents: {
                            default:
                                '<div id="pageFooter" style="text-align: center; font-size: 12px;">{{page}}/{{pages}}</div>',
                        },
                    },
                };

                let savePath = Public(`images/invoice/${'cin-report' + moment().format('YYYYMMDDHHmmSS') + '.pdf'}`);

                htmlToPDF
                    .toPDF(html, options, savePath)
                    .then(function (response) {

                        if (!_.isNull(response.filename)) {

                            return new Promise(function (resolve, reject) {
                                resolve(response.filename);
                                //             // if(!_fs.existsSync(response.filename)){
                                //             //     reject('File not found!');
                                //             // } 

                                //             // _fs.readFile(response.filename, (err, data) => { 
                                //             //     if(err){
                                //             //         reject(err);
                                //             //     }

                                //             //     let fileName        = _.last(_.split(savePath,'/'));                        
                                //             //     let base64data      = new Buffer.alloc(data, 'binary');

                                //             //     //resolve(fileName);


                                //             //     let s3 = new AWS.S3();                        
                                //             //     s3.putObject({
                                //             //         Bucket: Bucket,
                                //             //         Key:  `${new Date().getFullYear()}/${new Date().getMonth()+1}/invoice/${fileName}`,
                                //             //         Body: base64data,
                                //             //         ACL:   ACL  
                                //             //     },function (error, data) {
                                //             //         if(error){
                                //             //             reject(error);
                                //             //         }else{   

                                //             //             _fs.unlinkSync(savePath);  

                                //             //             let attatchmentLink = `https://s3-${getEnv('AWS_REGION')}.amazonaws.com/${Bucket}/${new Date().getFullYear()}/${new Date().getMonth()+1}/invoice/${fileName}`;
                                //             //             //console.log(attatchmentLink);

                                //             //             //console.log(dataObj.id,'dataObj.id',attatchmentLink,'attatchmentLink')

                                //             //            //insert into cre_customer_report_log
                                //             //     let invoice_data = {
                                //             //         user_id: dataObj.user_id,
                                //             //         invoice_no:dataObj.invoice_no,
                                //             //         invoice_link: attatchmentLink ,
                                //             //         total_amount : dataObj.total_amount,
                                //             //         rebate_amount: dataObj.rebet_amount
                                //             //     }
                                //             //     //console.log(invoice_data);
                                //             //     new CustomerReportLog().createData(invoice_data);


                                //             //     //update to wallet table no of report 0 fr this cust id
                                //             //     new Wallet({	
                                //             //         'id': dataObj.id 
                                //             //          }).save({"no_of_report":0});

                                //             //          _fs.unlinkSync(savePath);  


                                //             //             CreditinvoiceMail(dataObj,attatchmentLink);

                                //             //             resolve(attatchmentLink);
                                //             //         }
                                //             //     });                       
                                //             // });

                            })
                        }
                    }, function (error) {
                        console.error(error);
                    });
            })
            .catch((err) => {
                console.log(err);
            })
    },

    ///////Report for LLP company
    report_llp: function (dataObj) {
        //console.log(dataObj,'dataObj');

        var chargeSequence = []; var creditRatingList = []; var creditRatingKeys = [];


        dataObj.charge_sequence.map(function (el3) {
            var det = [];

            let obj = chargeSequence.find((o, i) => {
                if (o.id == el3.charge_id && el3.status!='Satisfaction') {
                    var det1 = o.details;
                    det1.push(el3)
                    chargeSequence[i] = { 'id': el3.charge_id, 'details': det1 };
                    return true; // stop searching
                }
            });

            if (typeof obj == 'undefined' && el3.status!='Satisfaction') {
                det.push(el3)
                var cseq = {
                    'id': el3.charge_id,
                    'details': det
                }

                chargeSequence.push(cseq);
            }

        });

        dataObj.credit_ratings.map(function (el5) {

            if (creditRatingKeys.includes(el5.rating_agency) == false) {
                creditRatingKeys.push(el5.rating_agency);

                var ratingDate = el5.rating_date;

                let getDatas = dataObj.credit_ratings.filter(function (value) {
                    return value.rating_date == ratingDate && value.rating_agency == el5.rating_agency;
                });

                var finalData = {
                    'rating_agency': el5.rating_agency,
                    'rating_date': ratingDate,
                    'details': getDatas
                }

                creditRatingList.push(finalData);

            }


        });

        dataObj.financials1 = dataObj.financials.slice(0, 3).reverse();
        dataObj.chargeSequence = chargeSequence;
        dataObj.creditRatingList = creditRatingList;

        //return dataObj;


        // ejsToHtml
        // .toHTML('./views/llp-report.ejs',{details:dataObj,moment:moment}) 
        // .then((html)=>{

        ejsToHtml
            .toHTML('./views/llp-report-modified.ejs', { details: dataObj, moment: moment })
            .then((html) => {

                let savePathHtml = Public('report_llp.html');
                _fs.writeFileSync(savePathHtml, html, 'utf8');
                let options = {
                    format: 'Letter', orientation: "portrait", quality: 75, fitToPage: true, "border": {
                        "top": "2mm",            // default is 0, units: mm, cm, in, px
                        "right": "5mm",
                        "bottom": "2mm",
                        "left": "10mm"
                    },
                    "header": {
                        "height": "25mm",
                        "contents": '<div style="text-align: right;"><img src="' + email_config.logo + '" alt="Logo" style="width: 139px;height: 24px;"/></div>'
                    }, footer: {
                        height: '10mm',
                        contents: {
                            default:
                                '<div id="pageFooter" style="text-align: center; font-size: 12px;">{{page}}/{{pages}}</div>',
                        },
                    },
                };

                let savePath = Public(`images/invoice/${'llp-report' + moment().format('YYYYMMDDHHmmSS') + '.pdf'}`);

                htmlToPDF
                    .toPDF(html, options, savePath)
                    .then(function (response) {

                        if (!_.isNull(response.filename)) {

                            return new Promise(function (resolve, reject) {
                                resolve(response.filename);
                                //             // if(!_fs.existsSync(response.filename)){
                                //             //     reject('File not found!');
                                //             // } 

                                //             // _fs.readFile(response.filename, (err, data) => { 
                                //             //     if(err){
                                //             //         reject(err);
                                //             //     }

                                //             //     let fileName        = _.last(_.split(savePath,'/'));                        
                                //             //     let base64data      = new Buffer.alloc(data, 'binary');

                                //             //     //resolve(fileName);


                                //             //     let s3 = new AWS.S3();                        
                                //             //     s3.putObject({
                                //             //         Bucket: Bucket,
                                //             //         Key:  `${new Date().getFullYear()}/${new Date().getMonth()+1}/invoice/${fileName}`,
                                //             //         Body: base64data,
                                //             //         ACL:   ACL  
                                //             //     },function (error, data) {
                                //             //         if(error){
                                //             //             reject(error);
                                //             //         }else{   

                                //             //             _fs.unlinkSync(savePath);  

                                //             //             let attatchmentLink = `https://s3-${getEnv('AWS_REGION')}.amazonaws.com/${Bucket}/${new Date().getFullYear()}/${new Date().getMonth()+1}/invoice/${fileName}`;
                                //             //             //console.log(attatchmentLink);

                                //             //             //console.log(dataObj.id,'dataObj.id',attatchmentLink,'attatchmentLink')

                                //             //            //insert into cre_customer_report_log
                                //             //     let invoice_data = {
                                //             //         user_id: dataObj.user_id,
                                //             //         invoice_no:dataObj.invoice_no,
                                //             //         invoice_link: attatchmentLink ,
                                //             //         total_amount : dataObj.total_amount,
                                //             //         rebate_amount: dataObj.rebet_amount
                                //             //     }
                                //             //     //console.log(invoice_data);
                                //             //     new CustomerReportLog().createData(invoice_data);


                                //             //     //update to wallet table no of report 0 fr this cust id
                                //             //     new Wallet({	
                                //             //         'id': dataObj.id 
                                //             //          }).save({"no_of_report":0});

                                //             //          _fs.unlinkSync(savePath);  


                                //             //             CreditinvoiceMail(dataObj,attatchmentLink);

                                //             //             resolve(attatchmentLink);
                                //             //         }
                                //             //     });                       
                                //             // });

                            })
                        }
                    }, function (error) {
                        console.error(error);
                    });
            })
            .catch((err) => {
                console.log(err);
            })
    },

    /*********************new fn to save HTML for CIN report */
    report_cin_html: function (dataObj) {
        //console.log(dataObj,'dataObj');
        var chargeSequence = []; var casesFiledByCorporatesPending = []; var casesFiledByCorporatesDisposed = [];
        var consolidationOfCorporateAffairsPending = []; var consolidationOfCorporateAffairsDisposed = [];
        var casesFiledAgainstCorporatesPending = []; var casesFiledAgainstCorporatesDisposed = [];
        var creditRatingList = []; var creditRatingKeys = [];

        let standaloneFinancials = dataObj.financials.filter(function (value) {
            return value.nature == "STANDALONE";
        });

        let consolidatedFinancials = dataObj.financials.filter(function (value) {
            return value.nature == "CONSOLIDATED";
        });


        let promoterShareHoldingEquity = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "promoter" && value.category == "equity";
        });

        let promoterShareHoldingPreference = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "promoter" && value.category == "preference";
        });

        let publicShareHoldingEquity = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "public" && value.category == "equity";
        });

        let publicShareHoldingPreference = dataObj.shareholdings.filter(function (value) {
            return value.shareholders == "public" && value.category == "preference";
        });


        dataObj.charge_sequence.map(function (el3) {
            var det = [];

            let obj = chargeSequence.find((o, i) => {
                if (o.id == el3.charge_id && el3.status!='Satisfaction') {
                    var det1 = o.details;
                    det1.push(el3)
                    chargeSequence[i] = { 'id': el3.charge_id, 'details': det1 };
                    return true; // stop searching
                }
            });

            if (typeof obj == 'undefined' && el3.status!='Satisfaction') {
                det.push(el3)
                var cseq = {
                    'id': el3.charge_id,
                    'details': det
                }

                chargeSequence.push(cseq);
            }

        });

        dataObj.legal_history.map(function (el4) {

            if (el4.case_type == "Cases Filed By This Corporate" && el4.case_status == "Pending") {
                casesFiledByCorporatesPending.push(el4);
            }

            if (el4.case_type == "Cases Filed By This Corporate" && el4.case_status == "Disposed") {
                casesFiledByCorporatesDisposed.push(el4);
            }

            if (el4.case_type == "Cases for Consolidation of Corporate affairs" && el4.case_status == "Pending") {
                consolidationOfCorporateAffairsPending.push(el4);
            }

            if (el4.case_type == "Cases for Consolidation of Corporate affairs" && el4.case_status == "Disposed") {
                consolidationOfCorporateAffairsDisposed.push(el4);
            }

            if (el4.case_type == "Cases Filed Against This Corporate" && el4.case_status == "Pending") {
                casesFiledAgainstCorporatesPending.push(el4);
            }

            if (el4.case_type == "Cases Filed Against This Corporate" && el4.case_status == "Disposed") {
                casesFiledAgainstCorporatesDisposed.push(el4);
            }

        });

        dataObj.credit_ratings.map(function (el5) {

            if (creditRatingKeys.includes(el5.rating_agency) == false) {
                creditRatingKeys.push(el5.rating_agency);

                var ratingDate = el5.rating_date;

                let getDatas = dataObj.credit_ratings.filter(function (value) {
                    return value.rating_date == ratingDate && value.rating_agency == el5.rating_agency;
                });

                var finalData = {
                    'rating_agency': el5.rating_agency,
                    'rating_date': ratingDate,
                    'details': getDatas
                }

                creditRatingList.push(finalData);

            }


        });


        dataObj.standaloneFinancials = standaloneFinancials.slice(0, 3).reverse();
        dataObj.consolidatedFinancials = consolidatedFinancials.slice(0, 3).reverse();

        dataObj.standaloneFinancials1 = standaloneFinancials;
        dataObj.consolidatedFinancials1 = consolidatedFinancials;

        dataObj.promoterShareHoldingEquity = promoterShareHoldingEquity;
        dataObj.promoterShareHoldingPreference = promoterShareHoldingPreference;
        dataObj.publicShareHoldingEquity = publicShareHoldingEquity;
        dataObj.publicShareHoldingPreference = publicShareHoldingPreference;
        dataObj.chargeSequence = chargeSequence;

        dataObj.casesFiledByCorporatesPending = casesFiledByCorporatesPending;
        dataObj.casesFiledByCorporatesDisposed = casesFiledByCorporatesDisposed;
        dataObj.consolidationOfCorporateAffairsPending = consolidationOfCorporateAffairsPending;
        dataObj.consolidationOfCorporateAffairsDisposed = consolidationOfCorporateAffairsDisposed;
        dataObj.casesFiledAgainstCorporatesPending = casesFiledAgainstCorporatesPending;
        dataObj.casesFiledAgainstCorporatesDisposed = casesFiledAgainstCorporatesDisposed;
        dataObj.creditRatingList = creditRatingList;

        ejsToHtml
            .toHTML('./views/cin-report-html.ejs', { details: dataObj, moment: moment })
            .then((html) => {

                let savePathHtml = Public('report_draft.html');
                _fs.writeFileSync(savePathHtml, html, 'utf8');
                //update HTML to online serach table for customer report pdf
                let html_content = html;
                //console.log(html_content);
                //let html_content=html;
                new OnlineSearchDetails({
                    'id': dataObj.online_search_id
                }).save({ "draft_html": html_content });
                //console.log('done');

            })
            .catch((err) => {
                console.log(err);
            })
    },

    /*********************new fn to save HTML for LLP report */
    report_llp_html: function (dataObj) {
        //console.log(dataObj,'dataObj');
        var chargeSequence = []; var creditRatingList = []; var creditRatingKeys = [];


        dataObj.charge_sequence.map(function (el3) {
            var det = [];

            let obj = chargeSequence.find((o, i) => {
                if (o.id == el3.charge_id && el3.status!='Satisfaction') {
                    var det1 = o.details;
                    det1.push(el3)
                    chargeSequence[i] = { 'id': el3.charge_id, 'details': det1 };
                    return true; // stop searching
                }
            });

            if (typeof obj == 'undefined' && el3.status!='Satisfaction') {
                det.push(el3)
                var cseq = {
                    'id': el3.charge_id,
                    'details': det
                }

                chargeSequence.push(cseq);
            }

        });

        dataObj.credit_ratings.map(function (el5) {

            if (creditRatingKeys.includes(el5.rating_agency) == false) {
                creditRatingKeys.push(el5.rating_agency);

                var ratingDate = el5.rating_date;

                let getDatas = dataObj.credit_ratings.filter(function (value) {
                    return value.rating_date == ratingDate && value.rating_agency == el5.rating_agency;
                });

                var finalData = {
                    'rating_agency': el5.rating_agency,
                    'rating_date': ratingDate,
                    'details': getDatas
                }

                creditRatingList.push(finalData);

            }


        });

        dataObj.financials1 = dataObj.financials.slice(0, 3).reverse();
        dataObj.chargeSequence = chargeSequence;
        dataObj.creditRatingList = creditRatingList;

        ejsToHtml
            .toHTML('./views/llp-report-html.ejs', { details: dataObj, moment: moment })
            .then((html) => {

                //let savePathHtml = Public('report.html');
                //_fs.writeFileSync(savePathHtml, html, 'utf8');
                //update HTML to online serach table for customer report pdf
                let html_content = html;
                //console.log(html_content);
                //let html_content=html;
                new OnlineSearchDetails({
                    'id': dataObj.online_search_id
                }).save({ "draft_html": html_content });
                //console.log('done');

            })
            .catch((err) => {
                console.log(err);
            })
    },

    //generate pdf from saved html
    htmltopdfreport: async function (dataObj, search_investigation_id, online_search_id, username) {
        //console.log(dataObj,'dataObj');

        //let html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Report</title></head><body>'+dataObj+'</body></html>';
        let html = await ejsToHtml.toHTML('./views/final_report.ejs', { dataObj: dataObj, moment: moment, username });
        //html=html+dataObj.draft_html+dataObj.import_html;
        // _fs.writeFile('new_report.html', html, (err) => {
        //   if (err) throw err;
        //   console.log('\n' +'Your tables have been created in');
        // });
        // console.log('TEST2222'); 
        //let html='';
        //let options = { format: 'Letter',orientation:"portrait", quality:75,fitToPage:false};
        let options = {
            format: 'Letter', orientation: "portrait", quality: 75, timeout: 800000, fitToPage: true, "border": {
                "top": "2mm",            // default is 0, units: mm, cm, in, px
                "right": "5mm",
                "bottom": "2mm",
                "left": "10mm"
            },
            "header": {
                "height": "25mm",
                "contents": '<div style="text-align: right;"><img src="' + email_config.logo + '" alt="Logo" style="width: 110px;height: 19px;"/></div>'
            }, footer: {
                height: '10mm',
                contents: {
                    default:
                        '<table  cellspacing="0" cellpadding="10" style="border: 0; margin: -4px auto 30px auto; width: 90%; position:relative;top:-4px;" id="pageFooter"><tr style="font-family: Arial; font-size: 6pt; color: #2e2e2e; "><td style="text-align: left;width:33%;">For: ' + username + '</td><td style="text-align: center;width:33%;">' + moment().format('DD/MM/YYYY') + '</td><td style="text-align: right;width:33%;"> {{page}}</td></tr></table>'
                },
            },
        };


        let savePath = Public(`onlinesearchreports/${'cred-report' + moment().format('YYYYMMDDHHmmSS') + '.pdf'}`);
        //console.log(savePath);
        htmlToPDF
            .toPDF(html, options, savePath)
            .then(function (response) {

                if (!_.isNull(response.filename)) {

                    return new Promise(function (resolve, reject) {

                        if (!_fs.existsSync(response.filename)) {
                            console.log('File not found!');
                            //reject('File not found!');
                        }

                        _fs.readFile(response.filename, (err, data) => {
                            if (err) {
                                console.log(err);
                                //reject(err);
                            }

                            let fileName = _.last(_.split(savePath, '/'));
                            //let base64data      = new Buffer.alloc(15,data, 'binary');
                            //let base64data      = new Buffer(data, 'binary');
                            let base64data = data;
                            //resolve(fileName);


                            let s3 = new AWS.S3();
                            s3.putObject({
                                Bucket: Bucket,
                                Key: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/onlineReport/${fileName}`,
                                Body: base64data,
                                ACL: ACL
                            }, function (error, data) {
                                if (error) {
                                    // logger.errorLogger.error({
                                    //     loggedInUserName: 'S3 GEN',
                                    //     ip: "server",
                                    //     method: "UtilityController.monthly_invoice",
                                    //     message: error,
                                    //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                                    // })
                                    reject(error);
                                } else {
                                    // if (_fs.existsSync(savePath)) {
                                    // _fs.unlinkSync(savePath);  
                                    // }

                                    let attatchmentLink = `https://s3-${getEnv('AWS_REGION')}.amazonaws.com/${Bucket}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/onlineReport/${fileName}`;
                                    //console.log(attatchmentLink);
                                    //console.log(search_investigation_id);
                                    //console.log(dataObj.id,'dataObj.id',attatchmentLink,'attatchmentLink')
                                    new SearchInvestigation({
                                        'id': search_investigation_id
                                    }).save({ "order_link": attatchmentLink, "status": "C" });

                                    resolve(attatchmentLink);
                                }
                            });
                        });

                    })
                }
            }, function (error) {
                console.error(error);
                // logger.errorLogger.error({
                //     loggedInUserName: 'PDF GEN',
                //     ip: "server",
                //     method: "UtilityController.monthly_invoice",
                //     message: error,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // });
            });

    },

    //generate excel
    generate_excel: async function (dataObj, dataObjDetail, user_id) {
        //console.log(dataObj,'dataObj');
        /*********************8added for invoice details excel*************/
        var branchrelatedinfo = [];
        var searchInvestigationdata = [];

        await dataObjDetail.map(function (si_data) {
            //console.log(si_data.id);

            let obj = branchrelatedinfo.find((o, i) => {
                if (o.user_id == si_data.user_id) {
                    //console.log("ID",si_data.id);
                    var branch_report_info = [];
                    var branch_report_info = o.details;
                    branch_report_info.push(si_data);
                    //console.log("DEtails",branch_report_info);
                    branchrelatedinfo[i] = { 'user_id': o.user_id, 'branch_name': o.branch_name, 'details': branch_report_info };
                    return true; // stop searching
                }

            });

            if (typeof obj == 'undefined') {
                searchInvestigationdata = [];
                searchInvestigationdata.push(si_data);
                var cseq = {
                    'user_id': si_data.user_id,
                    'branch_name': si_data.userDetail.name,
                    'details': searchInvestigationdata
                }

                branchrelatedinfo.push(cseq);
            }

        });

        //console.log(branchrelatedinfo);
        /****************************************************************** */
        dataObjDetail.branchrelatedinfo = branchrelatedinfo;
        //console.log("0---",dataObjDetail.branchrelatedinfo[0].details);
        //console.log("1---",dataObjDetail.branchrelatedinfo[1].details);
        let html1 = await ejsToHtml.toHTML('./views/invoice-excel.ejs', { details: dataObj, moment: moment })
        let html2 = await ejsToHtml.toHTML('./views/invoice-detail-excel.ejs', { detailsinv: dataObjDetail, moment: moment })
        //console.log(html2);
        //let html1="<table><tr><td>cell value1</td></tr></table>";
        //let html2="<table><tr><td>cell value2</td></tr></table>";
        var html_all = html1 + html2;
        //let html='<table style="width: 800px; border: 1px solid #d1d1d1; padding: 15px; font-family: Arial, Helvetica, sans-serif;"> <tr style="padding-bottom: 10px;"> <td style="width:5%; font-weight: bold;">Date:</td> <td style="width:95%;">12.10.2022</td> </tr> <tr> <td colspan="2" style="padding-top: 10px;"> <table style="width: 100%;"> <tr> <td style="width: 50%;"> <p style="margin:0;padding:5px 0;"><strong>To</strong></p> <p style="margin:0;padding:5px 0;">Customer Name</p> <p style="margin:0;padding:5px 0; line-height: 20px; font-size: 15px;">Kemp House, 160 city Road,<br> London, EC1V2NX.</p> </td> <td style="width: 50%;"> <p style="margin:0;padding:5px 0;"><strong>From</strong></p> <p style="margin:0;padding:5px 0;">Interlinkages Ltd.</p> <p style="margin:0;padding:5px 0; line-height: 20px; font-size: 15px;"> 9/F Amtel Building,<br> 148 Des Voeux Road Central<br> Hong Kong </p> </td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding-top: 10px;"> <table style="width: 100%;"> <tr> <td><strong>Invoice number:</strong> 23546587 </td> </tr> <tr> <td><strong>Issued:</strong> 01.02.2022 </td> </tr> <tr> <td><strong>Due:</strong>Issued date + payment terms </td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding-top: 10px;"> <table style="width: 100%; border: 1px solid #d1d1d1; padding: 0; margin: 0; border-collapse: collapse;"> <tr> <th style="padding: 10px; width:10%;"><strong>S. No.</strong></th> <th style="padding: 10px; text-align: left; width:30%;"><strong>Description</strong></th> <th style="padding: 10px;"><strong>Number of reports</strong></th> <th style="padding: 10px;"><strong>Price per report USD</strong></th> <th style="padding: 10px;"><strong>Total Value USD</strong></th> </tr> <tr> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">1</td> <td style="padding: 10px; border-bottom: 1px solid #d1d1d1;">Credit reports - Category A</td> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">3</td> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">80</td> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">240</td> </tr> <tr> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">2</td> <td style="padding: 10px; border-bottom: 1px solid #d1d1d1;">Credit reports - Category B</td> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">2</td> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">60</td> <td style="padding: 10px; text-align: center; border-bottom: 1px solid #d1d1d1;">120</td> </tr> <tr> <td style="padding: 10px; width: 60%;" colspan="3">&nbsp;</td> <td style="padding: 10px; text-align: center;">Total due (USD)</td> <td style="padding: 10px; text-align: center;">360</td> </tr> <tr> <td style="padding: 10px; width: 60%;" colspan="3">&nbsp;</td> <td style="padding: 10px; text-align: center;">Tax (0%)</td> <td style="padding: 10px; text-align: center;">0</td> </tr> <tr> <td style="padding: 10px; width: 60%;" colspan="3">&nbsp;</td> <td style="padding: 10px; text-align: center;"><strong>Grand total (USD)</strong></td> <td style="padding: 10px; text-align: center;"><strong>360</strong></td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding-top: 10px;"> <table style="width: 100%;"> <tr> <td style="width:200px;">Please make Payment to</td> <td></td> </tr> <tr> <td>Beneficiary</td> <td>Interlinkages Limited</td> </tr> <tr> <td>Beneficiary Bank</td> <td>HSBC, Hong Kong</td> </tr> <tr> <td>Beneficiary Branch</td> <td>1 Queens Road Central, Hong Kong</td> </tr> <tr> <td>Account number</td> <td>741069280838</td> </tr> <tr> <td>SWIFT Code</td> <td>HSBCHKHHHKH</td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding-top: 20px;"> Thank you for your business. </td> </tr> <tr> <td colspan="2"> Best Regards </td> </tr> </table>';
        let options = '';
        //savePath='';
        //</td>/const stream = await htmlToExcel(`<table><tr><td>cell value</td></tr></table>`);
        //const stream1 = await htmlToExcel(html1);
        //const stream2 = await htmlToExcel(html2);

        let savePath = Public(`images/invoice/${'cred-excel-report' + moment().format('YYYYMMDDHHmmSS') + '.xlsx'}`);
        console.log('savePath', savePath);
        console.log('Excel');
        const stream = await htmlToExcel(html_all);
        stream.pipe(_fs.createWriteStream(savePath));
        console.log('done');

        if (!_.isNull(savePath)) {

            return new Promise(function (resolve, reject) {

                if (!_fs.existsSync(savePath)) {
                    console.log('File not found!');
                    //reject('File not found!');
                }

                _fs.readFile(savePath, (err, data) => {
                    if (err) {
                        console.log(err);
                        //reject(err);
                    }

                    let fileName = _.last(_.split(savePath, '/'));
                    //let base64data      = new Buffer.alloc(15,data, 'binary');
                    //let base64data      = new Buffer(data, 'binary');
                    let base64data = data;
                    //resolve(fileName);


                    let s3 = new AWS.S3();
                    s3.putObject({
                        Bucket: Bucket,
                        Key: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/onlineReport/${fileName}`,
                        Body: base64data,
                        ACL: ACL
                    }, function (error, data) {
                        if (error) {
                            // logger.errorLogger.error({
                            //     loggedInUserName: 'S3 GEN',
                            //     ip: "server",
                            //     method: "UtilityController.monthly_invoice",
                            //     message: error,
                            //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                            // })
                            reject(error);
                        } else {
                            if (_fs.existsSync(savePath)) {
                                _fs.unlinkSync(savePath);
                            }

                            let attatchmentLink = `https://s3-${getEnv('AWS_REGION')}.amazonaws.com/${Bucket}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/onlineReport/${fileName}`;
                            console.log('attatchmentLink', attatchmentLink);

                            //console.log(dataObj.id,'dataObj.id',attatchmentLink,'attatchmentLink')

                            //insert into cre_customer_report_log
                            let invoice_data = {
                                user_id: user_id,
                                invoice_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                                invoice_no: dataObj.invoice_no,
                                invoice_link: attatchmentLink,
                            }
                            console.log('invoice_data', invoice_data);
                            new InvoiceExcelLog().createData(invoice_data);


                            //update to wallet table no of report 0 and pay now enable paid_status=1 fr this cust id
                            // new Wallet({	
                            //     'id': dataObj.id 
                            //      }).save({"no_of_report":0,"paid_status":1,});

                            //      //_fs.unlinkSync(savePath);  


                            //         CreditinvoiceMail(dataObj,attatchmentLink);

                            resolve(attatchmentLink);
                        }
                    });
                });

            })
        }

    },
    sendinvoicemail: function (dataObj, pdf_link, excel_link) {
        //console.log(dataObj,'dataObj');
        //let attatchmentLink="Public(`images/invoice/${'cred-report' + moment().format('YYYYMMDDHHmmSS') + '.pdf'}`);";
        //let attatchmentLink="Public(`images/invoice/${'cred-report20220130161885.pdf'});";
        //let attatchmentLink="https://s3-ap-south-1.amazonaws.com/credencemum/2022/2/invoice/cred-report20220210132298.pdf";
        CreditinvoiceMail(dataObj, pdf_link, excel_link);
    },

    //generate pdf ....................

    htmltopdftest: async function () {
        //console.log(dataObj,'dataObj');

        //let html=await _fs.readFile('report.html');

        //_fs.readFile('converted_html.html', (err, data) => { 
        let html = await ejsToHtml.toHTML('./views/test_html.ejs', {})
        //let options = { format: 'Letter',orientation:"portrait", quality:75,fitToPage:false};
        let options = {
            format: 'Letter', orientation: "portrait", quality: 75, timeout: 540000, fitToPage: true, "border": {
                "top": "2mm",            // default is 0, units: mm, cm, in, px
                "right": "5mm",
                "bottom": "2mm",
                "left": "10mm"
            },
            "header": {
                "height": "25mm",
                "contents": '<div style="text-align: right;"><img src="' + email_config.logo + '" alt="Logo" style="width: 139px;height: 24px;"/></div>'
            }, footer: {
                height: '10mm',
                contents: {
                    default:
                        '<div id="pageFooter" style="text-align: center; font-size: 12px;">{{page}}/{{pages}}</div>',
                },
            },
        };


        let savePath = Public(`onlinesearchreports/${'cred-report' + moment().format('YYYYMMDDHHmmSS') + '.pdf'}`);
        //console.log(savePath);
        htmlToPDF
            .toPDF(html, options, savePath)
            .then(function (response) {
                console.log('done');
            }, function (error) {
                console.error(error);
                // logger.errorLogger.error({
                //     loggedInUserName: 'PDF GEN',
                //     ip: "server",
                //     method: "UtilityController.monthly_invoice",
                //     message: error,
                //     dataTime: moment().format('YYYY-MM-DD hh:m:s')
                // });
            });
        //});

    },

    //excel to HTML table conversion
    exceltohtml: function (file_name, online_search_id) {
        //console.log(file_name,'file_name');
        // /***************************for excel to html ***************/
        var fs = require('fs');
        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(file_name);
        //var workbook = XLSX.readFile(file_link);
        //var workbook = buff;
        var sheets = workbook.Sheets;
        var htmlFile = '';
        return new Promise(function (resolve, reject) {
            // Iterate through each worksheet in the workbook
            for (var sheet in sheets) {
                // Start building a new table if the worksheet has entries
                if (typeof sheet !== 'undefined') {
                    htmlFile += '<div style="page-break-after: always;"></div><table style="font-size:9px;font-family: Arial, Helvetica, sans-serif;">' + '\n' + '<thead>';
                    // Iterate over each cell value on the sheet
                    for (var cell in sheets[sheet]) {
                        // Protect against undefined values
                        if (typeof sheets[sheet][cell].w !== 'undefined') {
                            //The first row in the table
                            if (cell === 'A1') {
                                htmlFile += '\n' + '<tr>' + '\n' + '<th>' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</th>';
                            } else {
                                //The second row in the table closes the thead element
                                if (cell === 'A2') {
                                    htmlFile += '\n' + '</tr>' + '\n' + '</thead>' + '\n' + '<tr>' + '\n' + '<th>' + '<a href="">' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</a>' + '</th>';
                                } else {
                                    // The first cell in each row
                                    if (cell.slice(0, 1) === 'A') {
                                        htmlFile += '\n' + '</tr>' + '\n' + '<tr>' + '\n' + '<th>' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash;') + '</th>';
                                        //All the other cells
                                    } else {
                                        htmlFile += '\n' + '<td>' + sheets[sheet][cell].w.replace('&', '&amp;').replace('-', '&ndash;').replace('–', '&mdash') + '</td>';
                                    }
                                }
                            }
                        }
                    }
                    // Close the tags
                    htmlFile += '\n' + '</tr>' + '\n' + '</table>';
                }
            }


            // save generated html to DB
            new OnlineSearchDetails({
                'id': online_search_id
            }).save({ "import_html": htmlFile });

            console.log('updated');
            //del added excel file
            if (_fs.existsSync(file_name)) {
                _fs.unlinkSync(file_name);
            }

            fs.writeFile('import.html', htmlFile, (err) => {
                if (err) throw err;
                console.log('\n' + 'Your tables have been created in');
            });

        });


        // let newFileName="converted_html.html"; 
        // fs.writeFile(newFileName, htmlFile, (err) => {
        //   if (err) throw err;
        //   console.log('\n' +'Your tables have been created in', newFileName);
        // });

    },
}

module.exports = generateInvoice;

