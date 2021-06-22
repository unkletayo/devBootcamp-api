const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: '../config/config.env' });

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {


  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    ignoreTLS: true,
    auth: { 
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
    
  });

  // const transporter = nodemailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "bedd9c04830bcb",
  //     pass: "1e994acf507e84"
  //   }
  // });
  

  // send mail with defined transport object
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

 const info = await transporter.sendMail(message)

 console.log('Message sent %s', info.messageId);

}


module.exports = sendEmail;