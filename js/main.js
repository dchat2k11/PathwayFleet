// ======================================
// Pathway Fleet LLC
// main.js – Sheet-Aligned UX Logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[name='driver-application']");
  if (!form) return;

  let submitted = false;

  form.addEventListener("submit", () => {
    if (submitted) {
      // Prevent double submission
      event.preventDefault();
      return;
    }

    submitted = true;

    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.disabled = true;
      button.textContent = "Submitting...";
    }
  });
});
