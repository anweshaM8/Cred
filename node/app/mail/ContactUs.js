const Mail = Helper('mail');
const EmailContent = Model('EmailContent');

module.exports = async function (formData) {

    let response = await new EmailContent().fetchOne('slug', 'contact-us');

    let emailContentDat = response.toJSON();

    if (emailContentDat) {
        
        var message = emailContentDat.content.replace(/#NAME#/g, formData.name);
        message = message.replace(/#EMAIL#/g, formData.email);
        message = message.replace(/#EMAIL#/g, formData.email);
        message = message.replace(/#PHONE_NUMBER#/g, formData.phone_number);
        message = message.replace(/#MESSAGE#/g, formData.message);

        console.log(message,'message')
        const mailOptions = {
            to: process.env.SUPPORT_MAIL,
            subject: emailContentDat.title,
            template: {
                path: 'contact-us',
                data: { content: message }
            }
        };
        return Mail(mailOptions);

    }
    else {
        return false;
    }


}