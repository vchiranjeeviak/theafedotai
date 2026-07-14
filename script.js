const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');
const queryParameters = new URLSearchParams(window.location.search);

const comparisonFonts = new Set(["geist", "instrument", "manrope"]);
const queryFont = queryParameters.get("font")?.toLowerCase();
if (comparisonFonts.has(queryFont)) root.dataset.font = queryFont;

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

const pointerTiltItems = document.querySelectorAll("[data-tilt]");
const supportsPointerTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsPointerTilt) {
  pointerTiltItems.forEach((item) => {
    const strength = Number(item.dataset.tiltStrength || 2);

    const resetTilt = () => {
      item.classList.remove("is-pointer-active");
      item.style.setProperty("--pointer-x", "50%");
      item.style.setProperty("--pointer-y", "50%");
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
      item.style.setProperty("--shift-x", "0px");
      item.style.setProperty("--shift-y", "0px");
      item.style.setProperty("--ring-x", "0px");
      item.style.setProperty("--ring-y", "0px");
      item.style.setProperty("--ring-rotate", "0deg");
    };

    item.addEventListener("pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const bounds = item.getBoundingClientRect();
      const normalizedX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const normalizedY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      const percentX = ((normalizedX + 1) / 2) * 100;
      const percentY = ((normalizedY + 1) / 2) * 100;
      item.classList.add("is-pointer-active");
      item.style.setProperty("--pointer-x", `${percentX}%`);
      item.style.setProperty("--pointer-y", `${percentY}%`);
      item.style.setProperty("--tilt-x", `${normalizedX * strength}deg`);
      item.style.setProperty("--tilt-y", `${normalizedY * -strength}deg`);
      item.style.setProperty("--shift-x", `${normalizedX * 6}px`);
      item.style.setProperty("--shift-y", `${normalizedY * 6}px`);
      item.style.setProperty("--ring-x", `${normalizedX * 7}px`);
      item.style.setProperty("--ring-y", `${normalizedY * 5}px`);
      item.style.setProperty("--ring-rotate", `${normalizedX * 3}deg`);
    });

    item.addEventListener("pointerleave", resetTilt);
    item.addEventListener("blur", resetTilt, true);
  });
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
