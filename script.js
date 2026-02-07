const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  root.dataset.theme = storedTheme;
}

toggle.addEventListener("click", () => {
  const next = root.dataset.theme === "night" ? "" : "night";
  if (next) {
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  } else {
    root.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  }
});

const revealTargets = document.querySelectorAll(
  ".hero-text, .hero-card, .section, .site-footer"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => observer.observe(el));
