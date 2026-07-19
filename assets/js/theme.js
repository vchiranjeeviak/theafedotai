const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');
const queryParameters = new URLSearchParams(window.location.search);

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

const queryTheme = queryParameters.get("theme");
const savedTheme = queryTheme || localStorage.getItem("afe-theme");
setTheme(savedTheme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
