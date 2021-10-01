const config = require('config')
const { SEND_GRID } = require('../../constants').EMAIL_SERVICE
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.get("SENDGRID_API_KEY"))

module.exports = {
    sendEmail: async (to, subject, message, html = '') => {
        sgMail
            .send({
                to: to, // Change to your recipient
                from: SEND_GRID.EMAIL, // Change to your verified sender
                subject: subject,
                text: message,
                html: html,
            })
            .then((response) => {
                console.log(`SENDGRID  STATUS_CODE::::${response[0].statusCode}, HEADERS::::${response[0].headers}`)
                return
            })
            .catch((error) => {
                console.error(`SENDGRID ERROR::::${error}`)
            })
    }
}