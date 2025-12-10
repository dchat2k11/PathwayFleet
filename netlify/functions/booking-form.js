// Pathway Fleet LLC - Booking Form Netlify Function

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    // Parse booking data from request body
    const bookingData = JSON.parse(event.body);

    // Example: Log booking for testing
    console.log("New Booking Received:", bookingData);

    // TODO: Store booking in Google Sheets / Firebase / send email

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Thank you, ${bookingData.name}! Your booking for ${bookingData.car} has been received.`,
        data: bookingData
      }),
    };
  } catch (error) {
    console.error("Error processing booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
