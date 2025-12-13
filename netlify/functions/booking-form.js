const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    const sheets = google.sheets({ version: "v4", auth });

    if (event.httpMethod === "POST") {
      const booking = JSON.parse(event.body);

      const startDate = new Date(booking.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (parseInt(booking.weeks) * 7));

      const newRow = [
        new Date().toISOString(),  // timestamp
        booking.name,
        booking.email,
        booking.phone,
        booking.vehicleClass,
        booking.startDate,
        endDate.toISOString().split('T')[0],
        booking.insurance ? "Yes" : "No",
        booking.total
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        resource: { values: [newRow] },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Booking saved!", booking }),
      };
    }

    if (event.httpMethod === "GET") {
      // Return all bookings to check for date conflicts
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A2:H",
      });

      const rows = result.data.values || [];
      const bookedDates = {};

      rows.forEach(row => {
        const vehicleClass = row[4];
        const start = row[5];
        const end = row[6];
        if (!bookedDates[vehicleClass]) bookedDates[vehicleClass] = [];
        bookedDates[vehicleClass].push({ start, end });
      });

      return {
        statusCode: 200,
        body: JSON.stringify(bookedDates),
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error", error: err.message }),
    };
  }
};
