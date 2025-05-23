const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const trackingData = {
      timestamp: new Date().toISOString(),
      page: event.queryStringParameters.page || "unknown",
      ip: event.headers["x-forwarded-for"] || "unknown",
      userAgent: event.headers["user-agent"] || "unknown",
      referrer: event.headers["referer"] || "unknown",
      locale: event.headers["accept-language"] || "unknown"
    };

    const response = await fetch("https://script.google.com/macros/s/AKfycbwOR1_p-7eoA5GE4E2qb9S-iQpqQn2gE86qCfF0imVOTLAYCgtBMfQ6woLfPIYoTUdBKQ/exec", {
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
    } catch (parseErr) {
      console.error("Failed to parse response from Apps Script:", rawResponse);
      throw new Error("Invalid JSON returned from Google Apps Script");
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
