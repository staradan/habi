const now = new Date();
    const today = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
    const saved = JSON.parse(localStorage.getItem("ruleOfLife")) || {};

    document.querySelectorAll(".habit").forEach(input => {
      input.checked = saved[input.dataset.habit] || false;
      input.addEventListener("change", () => {
        saved[input.dataset.habit] = input.checked;
        localStorage.setItem("ruleOfLife", JSON.stringify(saved));
      });
    });

    const ruleText = document.getElementById("ruleText");
    ruleText.value = saved.ruleText || "";
    ruleText.addEventListener("input", () => {
      saved.ruleText = ruleText.value;
      localStorage.setItem("ruleOfLife", JSON.stringify(saved));
    });

    document.getElementById("clearButton").addEventListener("click", () => {
  // Clear all checkboxes and textarea
  document.querySelectorAll(".habit").forEach(input => input.checked = false);
  ruleText.value = "";
  document.querySelectorAll("textarea").forEach(textarea => textarea.value = "");

  // Remove from localStorage
  localStorage.removeItem(storageKey);

  // Update saved object to empty
  for (const key in saved) delete saved[key];

  // Show confirmation message
  const status = document.getElementById("saveStatus");
  status.textContent = "🧹 Cleared today's data!";
  setTimeout(() => status.textContent = "", 2500);
});

const jsonOutput = document.getElementById("jsonOutput");
const copyButton = document.getElementById("copyJsonButton");
const copyStatus = document.getElementById("copyStatus");

// Function to update the JSON output textarea
function updateJsonOutput() {
  // Make sure saved object is synced with current form values
  document.querySelectorAll(".habit").forEach(input => {
    saved[input.dataset.habit] = input.checked;
  });
  saved.ruleText = ruleText.value;
  const output = {
    date: today,
    ...saved
  };

  // Set pretty-printed JSON
  jsonOutput.value = JSON.stringify(output, null, 2);
}

// Update JSON on load
updateJsonOutput();

// Update JSON whenever form inputs change
document.querySelectorAll(".habit").forEach(input => {
  input.addEventListener("change", updateJsonOutput);
});
ruleText.addEventListener("input", updateJsonOutput);

// Copy to clipboard on button click
copyButton.addEventListener("click", () => {
  jsonOutput.select();
  jsonOutput.setSelectionRange(0, 99999); // For mobile

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      copyStatus.textContent = "✅ JSON copied to clipboard!";
    } else {
      copyStatus.textContent = "❌ Copy failed. Try manually.";
    }
  } catch (err) {
    copyStatus.textContent = "❌ Copy failed. Try manually.";
  }

  setTimeout(() => {
    copyStatus.textContent = "";
    window.getSelection().removeAllRanges();
  }, 2000);
});

const categorizedReflection = document.getElementById("categorizedReflection");
  const pillButtons = document.querySelectorAll(".pill");

  // Load saved categorized reflection
  categorizedReflection.value = saved.categorizedReflection || "";

  // Save categorized reflection on input
  categorizedReflection.addEventListener("input", () => {
    saved.categorizedReflection = categorizedReflection.value;
    localStorage.setItem("ruleOfLife", JSON.stringify(saved));
    updateJsonOutput(); // Ensure JSON output is updated
  });

  // Handle pill button clicks
  pillButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      categorizedReflection.value += `\n[${category.toUpperCase()}]: `;
      categorizedReflection.focus();
      saved.categorizedReflection = categorizedReflection.value;
      localStorage.setItem("ruleOfLife", JSON.stringify(saved));
      updateJsonOutput();
    });
  });
