const mailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAILSENDER,
    pass: process.env.PASSWORD,
  },
});

module.exports = transporter