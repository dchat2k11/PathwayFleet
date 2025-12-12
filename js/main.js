// ==============================
// Pathway Fleet LLC - JS
// ==============================

// Example rates per class
const classRates = {
  "Economy": 300,
  "Standard": 350
};

// DOM Elements
const bookingForm = document.getElementById("bookingForm");
const vehicleClass = document.getElementById("vehicleClass");
const weeksInput = document.getElementById("weeks");
const insuranceCheckbox = document.getElementById("insurance");
const totalCostDiv = document.getElementById("totalCost");
const confirmationDiv = document.getElementById("confirmation");
const startDateInput = document.getElementById("startDate");

// Fleet buttons preselect
document.querySelectorAll(".book-class").forEach(btn => {
  btn.addEventListener("click", () => {
    const selectedClass = btn.closest(".fleet-card").dataset.class;
    vehicleClass.value = selectedClass;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    updateTotal();
  });
});

// Calculate total cost
function updateTotal() {
  const selectedClass = vehicleClass.value;
  const weeks = parseInt(weeksInput.value) || 1;
  const insurance = insuranceCheckbox.checked ? 50 : 0;
  const total = classRates[selectedClass] * weeks + insurance;
  totalCostDiv.textContent = `Total: $${total}`;
}

// Update total on input changes
vehicleClass.addEventListener("change", updateTotal);
weeksInput.addEventListener("input", updateTotal);
insuranceCheckbox.addEventListener("change", updateTotal);

// Initial total display
updateTotal();

// ==============================
// Booking Form Submission
// ==============================
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    vehicleClass: vehicleClass.value,
    startDate: startDateInput.value,
    weeks: weeksInput.value,
    insurance: insuranceCheckbox.checked,
    total: classRates[vehicleClass.value] * parseInt(weeksInput.value) + (insuranceCheckbox.checked ? 50 : 0)
  };

  try {
    const response = await fetch("/.netlify/functions/booking-form", {
      method: "POST",
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      confirmationDiv.textContent = "Booking received! Check your email for confirmation.";
      confirmationDiv.style.display = "block";
      confirmationDiv.style.background = "#0f0c29";
      confirmationDiv.style.color = "#fff";
      confirmationDiv.style.padding = "15px";
      confirmationDiv.style.borderRadius = "10px";
      bookingForm.reset();
      updateTotal();
    } else {
      confirmationDiv.textContent = result.message || "Error submitting booking.";
      confirmationDiv.style.display = "block";
      confirmationDiv.style.background = "#ff0000";
      confirmationDiv.style.color = "#fff";
    }

  } catch (error) {
    console.error("Booking error:", error);
    confirmationDiv.textContent = "Error submitting booking. Try again.";
    confirmationDiv.style.display = "block";
    confirmationDiv.style.background = "#ff0000";
    confirmationDiv.style.color = "#fff";
  }
});
