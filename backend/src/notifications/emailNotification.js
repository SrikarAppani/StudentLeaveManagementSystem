const transporter = require("./transporter.js");
const dotenv = require("dotenv");

dotenv.config();

async function sendEmailNotification(toEmail, subject, htmlContent) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject,
      html: htmlContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to', toEmail);
    } catch (err) {
      console.error('Email sending failed:', err);
    }
};

module.exports = sendEmailNotification;