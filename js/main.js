// ==============================
// Pathway Fleet LLC - Main JS
// ==============================

// Example car rates (update as needed)
const carRates = {
  "Toyota Corolla 2020": 250,
  "Honda Civic 2019": 240
  // Add more cars here
};

// DOM Elements
const bookingForm = document.getElementById("bookingForm");
const carSelect = document.getElementById("carSelect");
const weeksInput = document.getElementById("weeks");
const insuranceCheckbox = document.getElementById("insurance");
const confirmationDiv = document.getElementById("confirmation");

// Function to calculate total cost
function calculateTotal() {
  const car = carSelect.value;
  const weeks = parseInt(weeksInput.value);
  const insurance = insuranceCheckbox.checked ? 50 : 0; // Example insurance $50/week
  const total = carRates[car] * weeks + insurance;
  return total;
}

// Show live total cost
function updateTotalDisplay() {
  const total = calculateTotal();
  let totalDiv = document.getElementById("totalCost");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.id = "totalCost";
    totalDiv.style.marginTop = "10px";
    bookingForm.appendChild(totalDiv);
  }
  totalDiv.textContent = `Total: $${total}`;
}

// Event listeners for live cost
carSelect.addEventListener("change", updateTotalDisplay);
weeksInput.addEventListener("input", updateTotalDisplay);
insuranceCheckbox.addEventListener("change", updateTotalDisplay);

// Initialize total display
updateTotalDisplay();

// ==============================
// Booking Form Submission
// ==============================
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    car: carSelect.value,
    weeks: weeksInput.value,
    insurance: insuranceCheckbox.checked,
    total: calculateTotal()
  };

  try {
    // Send data to Netlify serverless function
    const response = await fetch("/.netlify/functions/booking-form", {
      method: "POST",
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    confirmationDiv.textContent = result.message || "Booking received!";
    confirmationDiv.style.color = "green";

    // Optionally, trigger Stripe checkout here
    // await startStripeCheckout(result); // Uncomment when Stripe function added

  } catch (error) {
    console.error("Error submitting booking:", error);
    confirmationDiv.textContent = "Error submitting booking. Please try again.";
    confirmationDiv.style.color = "red";
  }
});

// ==============================
// Optional: Stripe Payment
// ==============================
// Uncomment and customize if using Stripe
/*
async function startStripeCheckout(data) {
  const stripe = Stripe("YOUR_PUBLISHABLE_KEY");
  const sessionResponse = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    body: JSON.stringify(data)
  });
  const session = await sessionResponse.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
}
*/
