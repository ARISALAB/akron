const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // Βασικός έλεγχος για πεδία
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing fields" }),
      };
    }

    // Δημιουργία μεταφορέα με Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ar.akron.services@gmail.com", // το Gmail σου
        pass: process.env.GMAIL_APP_PASSWORD // App Password από Google
      },
    });

    const mailOptions = {
      from: `"Επικοινωνία Ιστότοπου" <ar.akron.services@gmail.com>`,
      to: "ar.akron.services@gmail.com", // δέκτης (εσύ)
      subject: `Νέο μήνυμα από ${data.name}`,
      html: `
        <h3>Όνομα:</h3><p>${data.name}</p>
        <h3>Email:</h3><p>${data.email}</p>
        <h3>Μήνυμα:</h3><p>${data.message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error" }),
    };
  }
};
