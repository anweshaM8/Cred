const { getMaxListeners } = require("npm");

const Mail = Helper('mail');
const EmailContent = Model('EmailContent');

module.exports = async function (formData) {

    let response = await new EmailContent().fetchOne('slug', 'update-status-not-fulfilled');

    let emailContentDat = response.toJSON();

    if (emailContentDat) {
        
        var message = emailContentDat.content.replace(/#COMPANY_OR_LLP#/g, formData.companyOrLlp);
        message = message.replace(/#NAME#/g, formData.name);
        message = message.replace(/#ID#/g, formData.id);
        message = message.replace(/#REQUEST_ID#/g, formData.requestId);

        console.log(message,'message')
        const mailOptions = {
            // to: process.env.SUPPORT_MAIL,
            to: 'anwesha@matrixnmedia.com',
            subject: emailContentDat.title,
            template: {
                path: 'update-status-not-fulfilled',
                data: { content: message }
            }
        };
        return Mail(mailOptions);

    }
    else {
        return false;
    }


}