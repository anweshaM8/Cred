const Mail = Helper('mail');
const EmailContent = Model('EmailContent');

module.exports = async function (orderInfo,userInfo,orderLink) {

    let response = await new EmailContent().fetchOne('slug', 'order-update');
    let emailContentDat = response.toJSON();
    if (emailContentDat) {

        var message = emailContentDat.content.replace(/#USER_NAME#/g, userInfo.userDetail.name);
        message = message.replace(/#COMPANY_NAME#/g, orderInfo.company_name);
        //message = message.replace(/#ORDER_LINK#/g, orderLink);
       
        //console.log(message,'message')
        var attachments_arr=[];
        if(orderLink!=null&&orderLink!='')
        {
            attachments_pdf={
                            filename:`credence-search-report-${moment().format('YYYYMMDD')}.pdf`,
                            path:'public/invoice/'+orderLink
                            }
            attachments_arr.push(attachments_pdf);
        }
        
        const mailOptions = {
            to: userInfo.user_name,
            subject: emailContentDat.title,
            template: {
                path: 'order-update', 
                data: { content: message }
            },
            attachments:attachments_arr
        };
        return Mail(mailOptions);

    }
    else {
        return false;
    }


}