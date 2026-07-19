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
