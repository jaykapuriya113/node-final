const nodemailer = require('nodemailer');

const sendEmail =async options => {

 const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }

 });

 const mailOption={
        from:process.env.EMAIL_USERNAME,
        to:options.email,
        subject:options.subject,
        text:options.message,
    
    };

await transporter.sendMail(mailOption);
};

module.exports = sendEmail;