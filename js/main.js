(() => {
  const canvas = document.getElementById("dust");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dots;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      dots = Array.from({ length: Math.min(70, Math.floor((w * h) / 28000)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3, v: Math.random() * 0.25 + 0.05, a: Math.random() * 0.35 + 0.1,
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y -= d.v; if (d.y < 0) d.y = h;
        ctx.beginPath(); ctx.fillStyle = `rgba(0,255,136,${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    resize(); window.addEventListener("resize", resize); tick();
  }
  const pills = [...document.querySelectorAll("[data-pill]")];
  const panel = document.getElementById("pill-copy");
  const copy = { sprint: "1 workflow livré — cadrage, build, tests, handoff.", pack3: "3 workflows figés + doc + session de passation.", retainer: "Monitoring et petites évolutions, 249 € / mois.", demo: "Photo → cartoon → page site mise à jour automatiquement." };
  pills.forEach((p) => p.addEventListener("click", () => { pills.forEach((x) => x.classList.remove("active")); p.classList.add("active"); if (panel) panel.textContent = copy[p.dataset.pill] || ""; }));
  const animateCount = (el) => { const target = Number(el.dataset.count || 0); const suffix = el.dataset.suffix || ""; const prefix = el.dataset.prefix || ""; const duration = 1100; const start = performance.now(); const step = (t) => { const p = Math.min(1, (t - start) / duration); const eased = 1 - Math.pow(1 - p, 3); el.textContent = prefix + Math.round(target * eased) + suffix; if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  const io = new IntersectionObserver((entries) => { entries.forEach((e) => { if (!e.isIntersecting) return; e.target.querySelectorAll(".fill[data-width]").forEach((f) => { f.style.width = f.dataset.width; }); e.target.querySelectorAll("[data-count]").forEach((c) => { if (!c.dataset.done) { c.dataset.done = "1"; animateCount(c); } }); }); }, { threshold: 0.25 });
  document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));
  const tasks = document.getElementById("calc-tasks"); const mins = document.getElementById("calc-mins"); const outH = document.getElementById("calc-hours"); const outLabel = document.getElementById("calc-label"); const tasksVal = document.getElementById("calc-tasks-val"); const minsVal = document.getElementById("calc-mins-val");
  const updateCalc = () => { if (!tasks || !mins || !outH) return; const t = Number(tasks.value); const m = Number(mins.value); if (tasksVal) tasksVal.textContent = String(t); if (minsVal) minsVal.textContent = String(m); const hours = Math.round(((t * m * 20) / 60) * 10) / 10; outH.textContent = String(hours).replace(".", ","); if (outLabel) outLabel.textContent = "heures / mois récupérées (estimation)"; };
  tasks && tasks.addEventListener("input", updateCalc); mins && mins.addEventListener("input", updateCalc); updateCalc();
})();
