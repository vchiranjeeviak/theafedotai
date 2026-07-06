const form = document.querySelector("#waitlistForm");
const note = document.querySelector("#formNote");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const submission = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    useCase: formData.get("useCase")?.toString(),
    pain: formData.get("pain")?.toString().trim(),
    createdAt: new Date().toISOString(),
  };

  const previous = JSON.parse(localStorage.getItem("theafeWaitlist") || "[]");
  previous.push(submission);
  localStorage.setItem("theafeWaitlist", JSON.stringify(previous));

  form.reset();
  note.textContent = "You are on the waitlist. Thank you for helping shape theAFE.";
  note.classList.add("success");
});
