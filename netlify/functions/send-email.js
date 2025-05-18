const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  try {
    const data = JSON.parse(event.body);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AKRON Web" <${process.env.MAIL_USER}>`,
      to: "ar.akron.services@gmail.com",
      subject: `Μήνυμα από: ${data.name}`,
      text: data.message,
      html: `<p><strong>Όνομα:</strong> ${data.name}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Μήνυμα:</strong><br>${data.message}</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
