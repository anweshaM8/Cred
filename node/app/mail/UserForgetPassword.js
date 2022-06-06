const Mail = Helper('mail');
const EmailContent = Model('EmailContent');

module.exports = async function (userInfo, forget_password_link) {

// console.log(userInfo,'userInfouserInfo')
    let response = await new EmailContent().fetchOne('slug', 'forget-pwd');


    let emailContentDat = response.toJSON();
   // console.log(emailContentDat,'emailContentDat')
    if (emailContentDat) {

        console.log('email',userInfo.user_name,'name',userInfo.userDetail.name)
        
        var message = emailContentDat.content.replace(/#USER_NAME#/g, userInfo.userDetail.name);
        message = message.replace(/#FORGET_PASSWORD_LINK#/g, forget_password_link);
       
        console.log(message,'message')
        const mailOptions = {
            to: userInfo.user_name,
            subject: emailContentDat.title,
            template: {
                path: 'forget-pwd',
                data: { content: message }
            }
        };
        return Mail(mailOptions);

    }
    else {
        return false;
    }


}