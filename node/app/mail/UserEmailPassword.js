const Mail = Helper('mail');
const EmailContent = Model('EmailContent');

module.exports = async function (userInfo, email_link, pwdGenerate) {

// console.log(userInfo,'userInfouserInfo')
    let response = await new EmailContent().fetchOne('slug', 'account-temp-pwd');


    let emailContentDat = response.toJSON();
   // console.log(emailContentDat,'emailContentDat')
    if (emailContentDat) {
        
        var message = emailContentDat.content.replace(/#USER#/g, userInfo.name);
        message = message.replace(/#USER_NAME#/g, userInfo.user_name);
        message = message.replace(/#PASSWORD#/g, pwdGenerate);
       
        message = message.replace(/#URL#/g, email_link);
        console.log(message,'message')
        const mailOptions = {
            to: userInfo.user_name,
            subject: emailContentDat.title,
            template: {
                path: 'account-temp-pwd',
                data: { content: message }
            }
        };
        return Mail(mailOptions);

    }
    else {
        return false;
    }


}