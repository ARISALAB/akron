const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Επιτρέπει CORS αιτήματα από οποιαδήποτε προέλευση (μπορείς να το περιορίσεις αργότερα)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Χειρισμός CORS OPTIONS request (απαραίτητο για ορισμένους browsers/περιβάλλοντα)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers: headers,
      body: ''
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Βασικός έλεγχος για πεδία
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ success: false, error: "Missing fields" }),
      };
    }

    // Δημιουργία μεταφορέα με Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Χρησιμοποίησε μεταβλητή περιβάλλοντος για το email
        pass: process.env.GMAIL_APP_PASSWORD // App Password από Google (ως μεταβλητή περιβάλλοντος)
      },
    });

    // 1. Mail options για το email που στέλνεται ΣΕ ΕΣΕΝΑ
    const mailOptionsToOwner = {
      from: `"Επικοινωνία Ιστότοπου" <${process.env.GMAIL_USER}>`, // το Gmail σου ως αποστολέας
      to: process.env.OWNER_EMAIL || process.env.GMAIL_USER, // Δέκτης (εσύ), μπορείς να χρησιμοποιήσεις άλλο email αν θες
      subject: `Νέο μήνυμα από ${data.name}`,
      html: `
        <h3>Όνομα:</h3><p>${data.name}</p>
        <h3>Email:</h3><p>${data.email}</p>
        <h3>Μήνυμα:</h3><p>${data.message}</p>
      `,
    };

    // Αποστολή του email ΣΕ ΕΣΕΝΑ
    await transporter.sendMail(mailOptionsToOwner);
    console.log("✅ Email sent to owner successfully.");

const autoReplyMailOptions = {
  from: `"AR Akron Services" <${process.env.GMAIL_USER}>`,
  to: data.email,
  subject: "Επιβεβαίωση λήψης μηνύματος από AR Akron Services",
  html: `
    <p>Αγαπητέ/ή ${data.name},</p>
    <p>Σε ευχαριστούμε θερμά για το μήνυμά σου στην AR Akron Services. Λάβαμε την επικοινωνία σου και θα την εξετάσουμε το συντομότερο δυνατό.</p>
    <p>Θα επικοινωνήσουμε μαζί σου άμεσα.</p>
    <p>Με εκτίμηση,</p>
    <p>Η ομάδα της AR Akron Services</p>
    <br>
    <hr>
    <div style="text-align: center; padding-bottom: 20px;">
      <img src="https://i.ibb.co/fVQTHcqh/10.jpg" alt="AR Akron Services Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
    </div>
    <p><small>Αυτό είναι ένα αυτοματοποιημένο μήνυμα, παρακαλούμε μην απαντήσετε σε αυτό το email.</small></p>
  `,
};

      // Εναλλακτικά, σώμα email σε απλό κείμενο (αντί του html)
      /*
      text: `
        Αγαπητέ/ή ${data.name},

        Σε ευχαριστούμε θερμά για το μήνυμά σου στην AR Akron Services. Λάβαμε την επικοινωνία σου και θα την εξετάσουμε το συντομότερο δυνατό.

        Θα επικοινωνήσουμε μαζί σου άμεσα.

        Με εκτίμηση,
        Η ομάδα της AR Akron Services

        ---
        Αυτό είναι ένα αυτοματοποιημένο μήνυμα, παρακαλούμε μην απαντήσετε σε αυτό το email.
      `,
      */
    };

    // Αποστολή της αυτόματης απάντησης
    try {
        await transporter.sendMail(autoReplyMailOptions);
        console.log("✅ Auto-reply sent successfully to:", data.email);
    } catch (autoReplyError) {
        console.error("❌ Error sending auto-reply:", autoReplyError);
        // Συνέχισε, μην σταματήσεις την εκτέλεση της function
    }

    // Επιστροφή επιτυχίας στον χρήστη (αφού το email προς εσένα στάλθηκε)
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error("❌ Error processing request or sending main email:", error);
    return {
      statusCode: error.statusCode || 500, // Διατήρηση status code αν υπάρχει (π.χ. 400)
      headers: headers,
      body: JSON.stringify({ success: false, error: error.message || "Server error" }),
    };
  }
};
