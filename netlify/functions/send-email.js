const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { name, email, message } = JSON.parse(event.body);

  // Δημιουργία μεταφορέα
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER, // akronservices@mail.com
      pass: process.env.MAIL_PASS, // Κωδικός
    },
  });

  // Ρύθμιση email
  const mailOptions = {
    from: `"Επικοινωνία Ιστοσελίδας" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER, // Στέλνει στον εαυτό σου
    subject: "Νέο μήνυμα από τη φόρμα",
    html: `
      <p><strong>Όνομα:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Μήνυμα:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};


