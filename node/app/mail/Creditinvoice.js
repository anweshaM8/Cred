const Mail = Helper('mail');
const EmailContent = Model('EmailContent');
const moment = require('moment');

module.exports = async function (invoiceInfo,pdf_link,excel_link) {

// console.log(invoiceInfo,'invoiceInfo')
    let response = await new EmailContent().fetchOne('slug', 'invoice');


    let emailContentDat = response.toJSON();
   // console.log(emailContentDat,'emailContentDat')
    if (emailContentDat) {

       // console.log('orderInfo',orderInfo,'userInfo',userInfo,'orderLink',orderLink)
        
        var message = emailContentDat.content.replace(/#USER_NAME#/g, invoiceInfo.user_details.name);
        //message = message.replace(/#INVOICE_LINK#/g, attachments);
        
        //console.log(message,'message')
        //console.log(invoiceInfo.user.user_name,'to_mail')
        //console.log(attachments,'attachments')
        // const mailOptions = {
        //     //to: userInfo.user_name,
        //     to: 'ishanibanerjee@matrixnmedia.com',
        //     subject: emailContentDat.title,
        //     template: {
        //         path: 'credit-report',
        //         data: { content: message }
        //     },
        //           attachments: [{
        //               filename: `invoice-${moment().format('YYYYMMDDHHmmSS')}.pdf`,
        //               path: attachments
        //           }]
        // };
        var attachments_arr=[];
        if(invoiceInfo.invoice_link!=null&&invoiceInfo.invoice_link!='')
        {
            attachments_pdf={
                            filename:`invoice-${moment().format('YYYYMMDD')}.pdf`,
                            path:'public/invoice/'+invoiceInfo.invoice_link
                            }
            attachments_arr.push(attachments_pdf);
        }
        if(invoiceInfo.invoice_excel!=null&&invoiceInfo.invoice_excel!='')
        {
            attachments_excel={
                            filename:`invoice-${moment().format('YYYYMMDD')}.xlsx`,
                            path:'public/invoice/'+invoiceInfo.invoice_excel
                            }
            attachments_arr.push(attachments_excel);
        }

        const mailOptions = {
            //to: 'ishanibanerjee@matrixnmedia.com',
            to: invoiceInfo.user.user_name,
            subject: emailContentDat.title,
            template: {
                path: 'invoice-mail', 
                data: { content: message }
            },
            attachments:attachments_arr
            // attachments: [
            //             //   {
            //             //       filename: `invoice-${moment().format('YYYYMMDD')}.pdf`,
            //             //       path: 'public/invoice/credence_invoice20220407104451.pdf'
            //             //   },
            //               {
            //                 filename: `invoice1-${moment().format('YYYYMMDD')}.pdf`,
            //                 path: 'https://s3-ap-south-1.amazonaws.com/credencemum/2022/3/invoice/cred-report20220307173323.pdf'
            //               },
            //             ]
        };
        return Mail(mailOptions);

    }
    else {
        return false;
    }


}