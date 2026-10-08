const nodemailer = require("nodemailer");

// Αποστολή από info@arakronservices.gr μέσω Brevo SMTP.
// Αν δεν έχουν οριστεί ακόμα οι μεταβλητές SMTP_*, συνεχίζει να στέλνει από Gmail (όπως πριν).
function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

// Προστασία: τα στοιχεία της φόρμας μπαίνουν στο email ως κείμενο, όχι ως HTML
const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
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

    const transporter = createTransport();
    const fromAddress = process.env.MAIL_FROM || process.env.GMAIL_USER;   // π.χ. info@arakronservices.gr
    const ownerAddress = process.env.OWNER_EMAIL || fromAddress;
    const name = esc(data.name);
    const email = esc(data.email);
    const message = esc(data.message).replace(/\n/g, "<br>");

    // 1) Σε εσένα — το «Απάντηση» πάει κατευθείαν στον πελάτη
    await transporter.sendMail({
      from: `"Akron Webuilder · Φόρμα" <${fromAddress}>`,
      to: ownerAddress,
      replyTo: data.email,
      subject: `Νέο μήνυμα από ${data.name}`,
      html: `
        <h3>Όνομα:</h3><p>${name}</p>
        <h3>Email:</h3><p>${email}</p>
        <h3>Μήνυμα:</h3><p>${message}</p>
      `,
    });
    console.log("✅ Email sent to owner successfully.");

    // 2) Επιβεβαίωση στον πελάτη — από info@, και μπορεί να απαντήσει
    try {
      await transporter.sendMail({
        from: `"AR Akron Services" <${fromAddress}>`,
        to: data.email,
        replyTo: fromAddress,
        subject: "Λάβαμε το μήνυμά σας — AR Akron Services",
        html: `
          <p>Αγαπητέ/ή <strong>${name}</strong>,</p>
          <p>Σας ευχαριστούμε για το μήνυμά σας στην <strong>AR Akron Services</strong>.</p>
          <p>Το λάβαμε και θα επικοινωνήσουμε μαζί σας το συντομότερο.</p>
          <p>Αν θέλετε να προσθέσετε κάτι, απαντήστε απλώς σε αυτό το email.</p>
          <p>Με εκτίμηση,<br>Η ομάδα της AR Akron Services</p>
          <br>
          <hr>
          <div style="text-align: left; padding: 10px 0;">
            <img src="https://i.ibb.co/fVQTHcqh/10.jpg" alt="AR Akron Services Logo" style="width: 80px; height: auto;">
          </div>
          <p><small>AR Akron Services · info@arakronservices.gr · +30 698 366 1460</small></p>
        `
      });
      console.log("✅ Auto-reply sent successfully to:", data.email);
    } catch (autoReplyError) {
      console.error("❌ Error sending auto-reply:", autoReplyError);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error("❌ Error processing request or sending email:", error);
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || "Server error" }),
    };
  }
};
