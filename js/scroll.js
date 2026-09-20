(() => {
  const progress = document.querySelector(".progress");
  const nav = document.querySelector(".nav");
  const orbs = [...document.querySelectorAll(".orb")];
  const phone = document.querySelector(".phone-stack");
  const reveals = [...document.querySelectorAll(".reveal")];
  const steps = [...document.querySelectorAll(".step")];
  const visuals = [...document.querySelectorAll(".step-visual")];
  const demoImg = document.getElementById("live-render");

  // Cache-bust live render
  if (demoImg) {
    demoImg.src = `assets/latest.svg?v=${Date.now()}`;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => io.observe(el));

  function setActiveStep(index) {
    steps.forEach((s, i) => s.classList.toggle("active", i === index));
    visuals.forEach((v, i) => v.classList.toggle("active", i === index));
  }

  // Sticky story: which step is closest to viewport center
  function updateStory() {
    if (!steps.length) return;
    const mid = window.innerHeight * 0.42;
    let best = 0;
    let bestDist = Infinity;
    steps.forEach((step, i) => {
      const r = step.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActiveStep(best);
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.width = `${p * 100}%`;
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);

    // Parallax orbs + hero phone
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = i === 0 ? 0.18 : -0.12;
      orb.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    if (phone) {
      const hero = document.querySelector(".hero");
      const hr = hero ? hero.getBoundingClientRect() : null;
      if (hr) {
        const local = Math.min(1, Math.max(0, -hr.top / (hr.height * 0.7)));
        const rotX = 12 - local * 18;
        const rotY = -8 + local * 10;
        const ty = local * 40;
        const scale = 1 - local * 0.08;
        phone.style.transform = `translate3d(0, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
        phone.style.opacity = String(1 - local * 0.35);
      }
    }
    updateStory();
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();
  setActiveStep(0);
})();
