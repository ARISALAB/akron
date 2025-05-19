const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Missing fields" }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      },
    });

    const mailOptionsToOwner = {
      from: `"Επικοινωνία Ιστότοπου" <${process.env.GMAIL_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.GMAIL_USER,
      subject: `Νέο μήνυμα από ${data.name}`,
      html: `
        <h3>Όνομα:</h3><p>${data.name}</p>
        <h3>Email:</h3><p>${data.email}</p>
        <h3>Μήνυμα:</h3><p>${data.message}</p>
      `,
    };

    await transporter.sendMail(mailOptionsToOwner);
    console.log("✅ Email sent to owner successfully.");

    const autoReplyMailOptions = {
      from: `"AR Akron Services" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "Επιβεβαίωση λήψης μηνύματος από AR Akron Services",
      html: `
        <p>Αγαπητέ/ή ${data.name},</p>
        <p>Σε ευχαριστούμε θερμά για το μήνυμά σου στην <strong>AR Akron Services</strong>. Λάβαμε την επικοινωνία σου και θα την εξετάσουμε το συντομότερο δυνατό.</p>
        <p>Θα επικοινωνήσουμε μαζί σου άμεσα.</p>
        <p>Με εκτίμηση,</p>
        <p>Η ομάδα της AR Akron Services</p>
        <br>
        <hr>
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://i.ibb.co/fVQTHcqh/10.jpg" alt="AR Akron Services Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
        </div>
        <p><small>Αυτό είναι ένα αυτοματοποιημένο μήνυμα, παρακαλούμε μην απαντήσετε σε αυτό το email.</small></p>
      `
    };

    try {
      await transporter.sendMail(autoReplyMailOptions);
      console.log("✅ Auto-reply sent successfully to:", data.email);
    } catch (autoReplyError) {
      console.error("❌ Error sending auto-reply:", autoReplyError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error("❌ Error processing request or sending email:", error);
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || "Server error" }),
    };
  }
};
