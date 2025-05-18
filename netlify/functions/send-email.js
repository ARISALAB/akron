const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.handler = async function (event, context) {
  try {
    const { name, email, message } = JSON.parse(event.body);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `Νέο μήνυμα από ${name}`,
      text: `Από: ${name}\nEmail: ${email}\nΜήνυμα:\n${message}`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error("❌ Error sending email:", error); // 🧨 πολύ σημαντικό για να δούμε τι φταίει

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
