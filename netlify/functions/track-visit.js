// netlify/functions/track-visit.js
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL; // Θα το ρυθμίσουμε στο Netlify

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Ελέγχουμε αν το request είναι από browser και όχι από bot/crawler
    const userAgent = event.headers['user-agent'] || '';
    if (userAgent.match(/bot|crawler|spider|headless/i)) {
        return { statusCode: 200, body: 'Bot detected, skipping tracking.' };
    }

    // Σημαντικό: Ανωνυμοποίηση της IP διεύθυνσης για GDPR
    const ipAddress = event.headers['x-nf-client-connection-ip'] || 'unknown';
    const anonymousIp = ipAddress.split('.').slice(0, 3).join('.') + '.0'; // Αφήνει μόνο τα 3 πρώτα octets

    const page = event.queryStringParameters.page || 'N/A';
    const referrer = event.headers['referer'] || 'N/A';
    const locale = event.headers['accept-language'] ? event.headers['accept-language'].split(',')[0] : 'N/A';

    const dataToLog = {
        timestamp: new Date().toISOString(),
        page: page,
        ip: anonymousIp, // Χρησιμοποιούμε την ανωνυμοποιημένη IP
        userAgent: userAgent,
        referrer: referrer,
        locale: locale
    };

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToLog),
        });

        if (!response.ok) {
            console.error('Error sending data to Google Apps Script:', response.status, await response.text());
            return { statusCode: response.status, body: 'Failed to log data to Google Sheet' };
        }

        const result = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Visit logged successfully", result: result }),
        };
    } catch (error) {
        console.error('Error in Netlify Function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
        };
    }
};
