const body = document.body;
const toggleButton = document.querySelector(".theme-toggle");
const langToggleButton = document.querySelector(".lang-toggle");
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const revealElements = document.querySelectorAll(".reveal");
const scrollProgress = document.querySelector(".scroll-progress");

const themes = {
  light: {
    label: { en: "Light Mode", th: "โหมดสว่าง" },
    next: "dark",
  },
  dark: {
    label: { en: "Dark Mode", th: "โหมดมืด" },
    next: "light",
  },
};

let currentLang = localStorage.getItem("haru-lang") || "en";

function applyLanguage(lang) {
  document.querySelectorAll("[data-th]").forEach(el => {
    if (!el.hasAttribute("data-en")) {
      el.setAttribute("data-en", el.innerHTML);
    }
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
  if (langToggleButton) {
    langToggleButton.textContent = lang === "th" ? "TH" : "EN";
  }
  document.documentElement.lang = lang;
  
  const currentTheme = body.dataset.theme || "light";
  if (toggleButton) {
    toggleButton.textContent = themes[currentTheme].label[lang];
  }
}

applyLanguage(currentLang);

if (langToggleButton) {
  langToggleButton.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "th" : "en";
    localStorage.setItem("haru-lang", currentLang);
    
    document.body.classList.add("lang-transitioning");
    
    setTimeout(() => {
      applyLanguage(currentLang);
      document.body.classList.remove("lang-transitioning");
    }, 250);
  });
}

const savedTheme = localStorage.getItem("haru-theme");
if (savedTheme) {
  body.dataset.theme = savedTheme;
  toggleButton.textContent = themes[savedTheme].label[currentLang];
  toggleButton.setAttribute("aria-pressed", savedTheme === "dark");
} else {
  toggleButton.textContent = themes.light.label[currentLang];
}

toggleButton.addEventListener("click", () => {
  const currentTheme = body.dataset.theme || "light";
  const nextTheme = themes[currentTheme].next;
  body.dataset.theme = nextTheme;
  toggleButton.textContent = themes[nextTheme].label[currentLang];
  toggleButton.setAttribute("aria-pressed", nextTheme === "dark");
  localStorage.setItem("haru-lang", currentLang); // preserve just in case but theme is next... wait I need haru-theme
  localStorage.setItem("haru-theme", nextTheme);
});

let cursorActivated = false;

const activateCursor = () => {
  if (!cursorActivated) {
    body.classList.add("cursor-active");
    cursorActivated = true;
  }
};

const updateCursor = (event) => {
  const { clientX, clientY } = event;
  cursorDot.style.left = `${clientX}px`;
  cursorDot.style.top = `${clientY}px`;
  cursorOutline.style.left = `${clientX}px`;
  cursorOutline.style.top = `${clientY}px`;
  activateCursor();
};

const hoverTargets = document.querySelectorAll("a, button");
hoverTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
  target.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
});

const pointerFine = window.matchMedia("(pointer: fine)").matches;
if (pointerFine) {
  window.addEventListener("mousemove", updateCursor);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const updateScrollProgress = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();
