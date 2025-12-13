// ==============================
// Pathway Fleet LLC - Fleet & Booking JS (FIXED)
// ==============================

// Vehicle weekly rates
const classRates = {
  Economy: 300,
  Standard: 350
};

// DOM Elements
const bookingForm = document.getElementById("bookingForm");
const carSelect = document.getElementById("carSelect");
const weeksInput = document.getElementById("weeks");
const insuranceCheckbox = document.getElementById("insurance");
const totalCostDiv = document.getElementById("totalCost");
const confirmationDiv = document.getElementById("confirmation");
const startDateInput = document.getElementById("startDate");
const fleetButtons = document.querySelectorAll(".select-car");

// ==============================
// Fleet → Booking auto-fill
// ==============================
fleetButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const vehicleClass = e.target.closest(".fleet-card").dataset.class;
    carSelect.value = vehicleClass;
    updateTotal();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });
});

// ==============================
// Calculate Total (FIXED)
// ==============================
function calculateTotal() {
  const selectedClass = carSelect.value;
  const weeks = Number(weeksInput.value) || 1;
  const insuranceCost = insuranceCheckbox.checked ? 50 * weeks : 0;

  return (classRates[selectedClass] * weeks) + insuranceCost;
}

// Update Total Display
function updateTotal() {
  const total = calculateTotal();
  totalCostDiv.textContent = `Total: $${total}`;
}

// Event listeners
carSelect.addEventListener("change", updateTotal);
weeksInput.addEventListener("input", updateTotal);
insuranceCheckbox.addEventListener("change", updateTotal);

// Initial display
updateTotal();

// ==============================
// Booking Form Submission (FIXED)
// ==============================
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Basic validation
  if (!startDateInput.value) {
    confirmationDiv.textContent = "Please select a start date.";
    confirmationDiv.style.color = "red";
    return;
  }

  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    vehicleClass: carSelect.value,
    startDate: startDateInput.value,
    weeks: Number(weeksInput.value),
    insurance: insuranceCheckbox.checked,
    total: calculateTotal()
  };

  confirmationDiv.textContent = "Submitting booking...";
  confirmationDiv.style.color = "#0ff";

  try {
    const response = await fetch("/.netlify/functions/booking-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Booking failed");
    }

    confirmationDiv.textContent = "✅ Booking submitted successfully!";
    confirmationDiv.style.color = "lime";

    bookingForm.reset();
    weeksInput.value = 1;
    updateTotal();

  } catch (error) {
    console.error("Booking error:", error);
    confirmationDiv.textContent = "❌ Error submitting booking. Please try again.";
    confirmationDiv.style.color = "red";
  }
});
