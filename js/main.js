document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const carSelect = document.getElementById("carSelect");
  const weeksInput = document.getElementById("weeks");
  const insuranceCheckbox = document.getElementById("insurance");
  const startDateInput = document.getElementById("startDate");
  const totalDiv = document.getElementById("totalCost");
  const confirmationDiv = document.getElementById("confirmation");

  // Car rates
  const carRates = {
    "Toyota Corolla 2020": 250,
    "Honda Civic 2019": 240
  };

  // Calculate total
  function calculateTotal() {
    const car = carSelect.value;
    const weeks = parseInt(weeksInput.value) || 1;
    const insurance = insuranceCheckbox.checked ? 50 * weeks : 0;
    return carRates[car] * weeks + insurance;
  }

  // Update total display
  function updateTotalDisplay() {
    totalDiv.textContent = `Total: $${calculateTotal()}`;
  }

  // Calculate end date
  function calculateEndDate(start, weeks) {
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() + weeks * 7);
    return startDate.toISOString().split("T")[0];
  }

  // Fleet buttons to pre-select car
  document.querySelectorAll(".select-car").forEach(btn => {
    btn.addEventListener("click", () => {
      carSelect.value = btn.dataset.car;
      carSelect.scrollIntoView({ behavior: "smooth" });
      updateTotalDisplay();
    });
  });

  // Event listeners for form inputs
  carSelect.addEventListener("change", updateTotalDisplay);
  weeksInput.addEventListener("input", updateTotalDisplay);
  insuranceCheckbox.addEventListener("change", updateTotalDisplay);
  startDateInput.addEventListener("change", updateTotalDisplay);

  updateTotalDisplay();

  // Submit booking
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const startDate = startDateInput.value;
    if (!startDate) return alert("Please select a start date");

    const weeks = parseInt(weeksInput.value) || 1;

    const bookingData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      car: carSelect.value,
      startDate,
      endDate: calculateEndDate(startDate, weeks),
      weeks,
      insurance: insuranceCheckbox.checked,
      totalPrice: calculateTotal()
    };

    try {
      const response = await fetch("/.netlify/functions/booking-form", {
  method: "POST",
  body: JSON.stringify(formData)
});

      const result = await response.json();
      confirmationDiv.textContent = result.message || "Booking received!";
      confirmationDiv.style.color = "green";

      bookingForm.reset();
      updateTotalDisplay();
    } catch (err) {
      console.error(err);
      confirmationDiv.textContent = "Error submitting booking. Please try again.";
      confirmationDiv.style.color = "red";
    }
    // =========================
// Scroll Animation
// =========================
function scrollAnimate() {
  const elements = document.querySelectorAll('.animate');
  const windowBottom = window.innerHeight + window.scrollY;

  elements.forEach(el => {
    const elementTop = el.offsetTop + el.offsetHeight / 3;
    if (windowBottom >= elementTop) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', scrollAnimate);
window.addEventListener('load', scrollAnimate);

  });
});
