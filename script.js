const toggle = document.getElementById("themeToggle");
const root = document.documentElement;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("siteNav");

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  root.dataset.theme = storedTheme;
}

if (toggle) {
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
}

if (menuToggle && nav) {
  const navClose = nav.querySelector(".nav-close");

  const closeNav = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  if (navClose) {
    navClose.addEventListener("click", closeNav);
  }

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("open")) closeNav();
    });
  });

  nav.addEventListener("click", (event) => {
    if (event.target === nav && nav.classList.contains("open")) {
      closeNav();
    }
  });
}

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

const mediumContainers = document.querySelectorAll("[data-medium-list]");

const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.textContent || div.innerText || "";
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const createMediumCard = (item) => {
  const article = document.createElement("article");
  article.className = "card";

  const wrapper = document.createElement("div");

  const meta = document.createElement("p");
  meta.className = "medium-meta";
  meta.textContent = `Medium • ${formatDate(item.pubDate)}`;

  const title = document.createElement("h3");
  title.textContent = item.title || "Untitled";

  const excerpt = document.createElement("p");
  const text = stripHtml(item.description || item.content || "");
  excerpt.textContent = text.slice(0, 170).trim() + (text.length > 170 ? "..." : "");

  wrapper.appendChild(meta);
  wrapper.appendChild(title);
  wrapper.appendChild(excerpt);

  const link = document.createElement("a");
  link.className = "tag";
  link.href = item.link || "https://medium.com/@rathourarvi";
  link.target = "_blank";
  link.rel = "noreferrer noopener";
  link.textContent = "Read";

  article.appendChild(wrapper);
  article.appendChild(link);
  return article;
};

const renderMediumFallback = (container) => {
  container.innerHTML = "";
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div>
      <h3>Medium previews unavailable</h3>
      <p>Open the profile directly to read all posts.</p>
    </div>
    <a class="tag" href="https://medium.com/@rathourarvi" target="_blank" rel="noreferrer noopener">Open</a>
  `;
  container.appendChild(card);
};

const loadMediumPosts = async () => {
  if (!mediumContainers.length) return;

  const feedUrl = "https://medium.com/feed/@rathourarvi";
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

  try {
    const response = await fetch(apiUrl, { cache: "no-store" });
    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (!items.length) {
      mediumContainers.forEach(renderMediumFallback);
      return;
    }

    mediumContainers.forEach((container) => {
      const limit = Number(container.getAttribute("data-limit")) || 3;
      const selected = items.slice(0, limit);
      container.innerHTML = "";
      selected.forEach((item) => container.appendChild(createMediumCard(item)));
    });
  } catch (error) {
    mediumContainers.forEach(renderMediumFallback);
  }
};

loadMediumPosts();
