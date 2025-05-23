const fetch = require("node-fetch"); // Βεβαιωθείτε ότι αυτό υπάρχει

exports.handler = async function(event, context) {
  try {
    // Διαβάζουμε το Apps Script URL από τις μεταβλητές περιβάλλοντος
    const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    // Ελέγχουμε αν το URL υπάρχει
    if (!googleAppsScriptUrl) {
      throw new Error("GOOGLE_APPS_SCRIPT_URL environment variable is not set.");
    }

    const trackingData = {
      timestamp: new Date().toISOString(),
      page: event.queryStringParameters.page || "unknown",
      ip: event.headers["x-forwarded-for"] || "unknown",
      userAgent: event.headers["user-agent"] || "unknown",
      referrer: event.headers["referer"] || "unknown",
      locale: event.headers["accept-language"] || "unknown"
    };

    const response = await fetch(googleAppsScriptUrl, { // Χρησιμοποιούμε τη μεταβλητή εδώ
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(trackingData)
    });

    const rawResponse = await response.text(); // διαβάζουμε ως text για debugging
    let json;

    try {
      json = JSON.parse(rawResponse);
      // Ελέγχουμε αν το Apps Script απάντησε με status: "error" ή παρόμοιο
      if (json && json.status === "error") {
        console.error("Error from Apps Script:", json.message || rawResponse);
        throw new Error(`Apps Script returned an error: ${json.message || rawResponse}`);
      }
    } catch (parseErr) {
      console.error("Failed to parse response from Apps Script:", rawResponse);
      // Εδώ, αν το rawResponse ξεκινά με <!, είναι HTML σφάλμα.
      if (rawResponse.startsWith("<!DOCTYPE html>")) {
          throw new Error("Google Apps Script returned an HTML error page, not JSON. Check Apps Script deployment settings (Execute as: Me, Who has access: Anyone) and URL.");
      } else {
          throw new Error("Invalid JSON returned from Google Apps Script: " + parseErr.message);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: json })
    };

  } catch (err) {
    console.error("Error in track-visit function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
