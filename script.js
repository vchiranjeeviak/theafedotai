const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');

function setTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  if (themeLabel) themeLabel.textContent = isDark ? "Light" : "Dark";
  if (themeIcon) themeIcon.textContent = isDark ? "☼" : "◐";
  if (themeColor) themeColor.setAttribute("content", isDark ? "#000000" : "#f7f4ee");
  localStorage.setItem("afe-theme", theme);
}

const queryTheme = new URLSearchParams(window.location.search).get("theme");
const savedTheme = queryTheme || localStorage.getItem("afe-theme");
setTheme(savedTheme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const form = document.querySelector("#waitlistForm");
const note = document.querySelector("#formNote");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const submission = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    pain: formData.get("pain")?.toString().trim(),
    createdAt: new Date().toISOString(),
  };
  const previous = JSON.parse(localStorage.getItem("afeWaitlist") || "[]");
  previous.push(submission);
  localStorage.setItem("afeWaitlist", JSON.stringify(previous));
  form.reset();
  if (note) {
    note.textContent = "You are on the early list. Thank you for helping shape Afe.";
    note.classList.add("success");
  }
});
