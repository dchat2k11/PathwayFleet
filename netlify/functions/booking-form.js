const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    const booking = JSON.parse(event.body);

    // Calculate end date
    const startDate = new Date(booking.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (parseInt(booking.weeks) * 7));

    // Authenticate Google Sheets
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Prepare new row
    const newRow = [
      new Date().toISOString(),       // Timestamp
      booking.name,
      booking.email,
      booking.phone,
      booking.vehicleClass,
      booking.startDate,
      endDate.toISOString().split('T')[0],
      booking.insurance ? "Yes" : "No",
      booking.total
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
        booking,
      }),
    };

  } catch (err) {
    console.error("Error saving booking:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving booking", error: err.message }),
    };
  }
};
