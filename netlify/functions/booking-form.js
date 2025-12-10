const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    // Parse booking data
    const booking = JSON.parse(event.body);

    // Authenticate Google Sheets API
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Prepare row data
    const newRow = [
      new Date().toISOString(), // Timestamp
      booking.name,
      booking.email,
      booking.phone,
      booking.car,
      booking.startDate,
      booking.endDate,
      booking.weeks,
      booking.insurance ? "Yes" : "No",
      booking.totalPrice
    ];

    // Append row to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Booking saved successfully!",
        booking: booking,
      }),
    };
  } catch (error) {
    console.error("Error saving booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving booking", error: error.message }),
    };
  }
};
