const { NODE_MAILER } = require('../../constants').EMAIL_SERVICE
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: NODE_MAILER.EMAIL,
        pass: NODE_MAILER.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    sendEmail: async (to, subject, message, html = '') => {
        transporter.sendMail({
            from: NODE_MAILER.EMAIL,
            to: to, // list of receivers
            subject: subject,
            text: message,
            html: html, // html body
        })
            .then((response) => {
                console.log(`NODE_MAILER  RESPONSE::::${response}`)
                return
            })
            .catch((error) => {
                console.error(`NODE_MAILER ERROR::::${error}`)
            })
    }
}