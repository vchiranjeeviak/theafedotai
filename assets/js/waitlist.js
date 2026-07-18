const form = document.querySelector("#waitlistForm");
const note = document.querySelector("#formNote");
const submitButton = form?.querySelector('button[type="submit"]');
const buttonLabel = submitButton?.querySelector(".button-label");
const widgetSlot = document.querySelector("#turnstileWidget");
const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const endpointMeta = document.querySelector('meta[name="afe-intake-endpoint"]');
const siteKeyMeta = document.querySelector('meta[name="afe-turnstile-site-key"]');
const endpoint = endpointMeta?.content.trim()
  || (isLocal ? "http://127.0.0.1:8000/v1/public/early-access" : "");
const siteKey = siteKeyMeta?.content.trim()
  || (isLocal ? "1x00000000000000000000AA" : "");

let botToken = "";
let widgetId;
let submissionResultVisible = false;

function setStatus(message, state = "idle") {
  if (!note) return;
  note.textContent = message;
  note.classList.toggle("success", state === "success");
  note.classList.toggle("error", state === "error");
}

function setSubmitting(isSubmitting) {
  form?.setAttribute("aria-busy", String(isSubmitting));
  if (submitButton) submitButton.disabled = isSubmitting;
  if (buttonLabel) buttonLabel.textContent = isSubmitting ? "Joining…" : "Join the early list";
}

function loadTurnstile() {
  if (!siteKey || !widgetSlot) return;
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  script.async = true;
  script.defer = true;
  script.addEventListener("load", () => {
    widgetId = window.turnstile.render(widgetSlot, {
      sitekey: siteKey,
      action: "early_access",
      theme: "auto",
      callback: (token) => {
        botToken = token;
        if (!submissionResultVisible) {
          setStatus("Verification complete. Your details are used only for Afe early-access contact.");
        }
      },
      "expired-callback": () => {
        botToken = "";
        setStatus("Verification expired. Please try again.", "error");
      },
      "error-callback": () => {
        botToken = "";
        setStatus("Verification could not load. Please refresh and try again.", "error");
      },
    });
  });
  script.addEventListener("error", () => {
    setStatus("Verification could not load. Please refresh and try again.", "error");
  });
  document.head.append(script);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!endpoint) {
    setStatus("Early access is temporarily unavailable. Please email hello@theafe.ai.", "error");
    return;
  }
  if (!botToken) {
    setStatus("Please complete the verification before joining.", "error");
    return;
  }

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    problem: formData.get("problem")?.toString().trim(),
    consent: formData.get("consent") === "on",
    source: "theafe.ai",
    company: formData.get("company")?.toString(),
    bot_token: botToken,
  };

  submissionResultVisible = false;
  setSubmitting(true);
  setStatus("Securely joining the early list…");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("submission rejected");
    form.reset();
    botToken = "";
    submissionResultVisible = true;
    if (window.turnstile && widgetId !== undefined) window.turnstile.reset(widgetId);
    setStatus("You are on the early list. Thank you for helping shape Afe.", "success");
  } catch {
    botToken = "";
    submissionResultVisible = true;
    if (window.turnstile && widgetId !== undefined) window.turnstile.reset(widgetId);
    setStatus("We could not save your request. Please try again or email hello@theafe.ai.", "error");
  } finally {
    setSubmitting(false);
  }
});

form?.addEventListener("input", () => {
  if (!submissionResultVisible) return;
  submissionResultVisible = false;
  setStatus("Your details are used only for Afe early-access contact.");
});

loadTurnstile();
