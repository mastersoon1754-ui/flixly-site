(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("dust");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let dots = [];
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const n = Math.min(90, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 22000));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 1.3 + 0.25,
        v: Math.random() * 0.18 + 0.04,
        a: Math.random() * 0.45 + 0.08,
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const d of dots) {
        d.y -= d.v;
        if (d.y < 0) d.y = canvas.offsetHeight;
        ctx.beginPath();
        ctx.fillStyle = `rgba(210,220,215,${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener("resize", resize);
    tick();
  }

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".menu").forEach((m) => {
      if (!m.contains(e.target)) m.removeAttribute("open");
    });
  });

  const cta = {
    sprint: {
      href: "mailto:hello@flixly.me?subject=Flixly%20—%20Sprint",
      label: "Cadrer un Sprint",
    },
    pack3: {
      href: "mailto:hello@flixly.me?subject=Flixly%20—%20Pack%203",
      label: "Cadrer un Pack 3",
    },
    retainer: {
      href: "mailto:hello@flixly.me?subject=Flixly%20—%20Retainer",
      label: "Parler retainer",
    },
    demo: { href: "#demo", label: "Voir la démo" },
    plus: { href: "#faq", label: "Lire la FAQ" },
  };
  const heroCta = document.getElementById("hero-cta");
  const plusPop = document.getElementById("plus-pop");
  const tabs = [...document.querySelectorAll(".tab[data-tab]")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.toggle("is-on", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      const key = tab.dataset.tab;
      if (plusPop) plusPop.hidden = key !== "plus";
      const next = cta[key];
      if (heroCta && next) {
        heroCta.href = next.href;
        const svg = heroCta.querySelector("svg");
        heroCta.textContent = next.label + " ";
        if (svg) heroCta.appendChild(svg);
      }
    });
  });

  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    if (reduce) {
      el.textContent = String(target);
      return;
    }
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / 1100);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll(".bar[data-width]").forEach((b) => {
          b.style.width = b.dataset.width;
        });
        e.target.querySelectorAll(".fill[data-width]").forEach((f) => {
          f.style.width = f.dataset.width;
        });
        e.target.querySelectorAll("[data-count]").forEach((c) => {
          if (!c.dataset.done) {
            c.dataset.done = "1";
            animateCount(c);
          }
        });
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll("[data-animate], .join").forEach((el) => io.observe(el));

  const hoursData = {
    sprint: {
      lead: "<strong>1 workflow prioritaire.</strong> Cadrage, build, tests, handoff. Les totaux illustrent le temps encore perdu aujourd’hui — pas une promesse contractuelle.",
      items: [
        { n: 8, name: "Relances devis", w: 100 },
        { n: 6, name: "Photo → cartoon → site", w: 75 },
        { n: 5, name: "Leads → CRM", w: 62 },
        { n: 4, name: "Form → PDF", w: 50 },
        { n: 3, name: "Relance J+3", w: 38 },
        { n: 2, name: "Reporting hebdo", w: 25 },
      ],
    },
    pack3: {
      lead: "<strong>3 workflows figés au cadrage.</strong> Doc + session de passation. Les barres montrent le volume combiné typique — toujours illustratif.",
      items: [
        { n: 12, name: "Relances + J+3", w: 100 },
        { n: 8, name: "Leads → CRM", w: 67 },
        { n: 6, name: "Photo → site", w: 50 },
        { n: 5, name: "Form → PDF", w: 42 },
        { n: 4, name: "Factures / relance paiement", w: 33 },
        { n: 3, name: "Reporting", w: 25 },
      ],
    },
  };
  const hoursList = document.getElementById("hours-list");
  const hoursLead = document.getElementById("hours-lead");
  const renderHours = (key) => {
    const pack = hoursData[key];
    if (!pack || !hoursList) return;
    if (hoursLead) hoursLead.innerHTML = pack.lead;
    hoursList.innerHTML = pack.items
      .map(
        (it) => `<li>
          <div class="hours-meta">
            <span class="hours-n">${it.n}</span>
            <span class="hours-u">h / mois</span>
            <span class="hours-name">${it.name}</span>
          </div>
          <div class="track" aria-hidden="true"><div class="fill" data-width="${it.w}%"></div></div>
        </li>`
      )
      .join("");
    if (hoursList.classList.contains("in")) {
      requestAnimationFrame(() => {
        hoursList.querySelectorAll(".fill[data-width]").forEach((f) => {
          f.style.width = f.dataset.width;
        });
      });
    }
  };
  renderHours("sprint");
  document.querySelectorAll("[data-hours]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-hours]").forEach((b) => {
        b.classList.toggle("is-on", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      renderHours(btn.dataset.hours);
    });
  });

  const tasks = [
    { id: "relances", name: "Relances devis", hours: 8, on: true },
    { id: "crm", name: "Saisie CRM", hours: 6, on: true },
    { id: "site", name: "MAJ site", hours: 5, on: true },
    { id: "j3", name: "Relance J+3", hours: 4, on: true },
    { id: "excel", name: "Exports Excel", hours: 4, on: false },
    { id: "inbox", name: "Tri inbox", hours: 5, on: false },
    { id: "pdf", name: "Form → PDF", hours: 3, on: false },
    { id: "rdv", name: "Prise de RDV", hours: 3, on: false },
    { id: "factures", name: "Relance factures", hours: 4, on: false },
    { id: "report", name: "Reporting", hours: 3, on: false },
  ];
  const RATE = 40;
  const pillsEl = document.getElementById("save-pills");
  const seats = document.getElementById("seats");
  const seatsLabel = document.getElementById("seats-label");
  const sumEuro = document.getElementById("sum-euro");
  const sumHours = document.getElementById("sum-hours");

  const fmt = (n) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const paint = () => {
    const team = Number(seats?.value || 1);
    if (seatsLabel) seatsLabel.textContent = team === 1 ? "1 pers." : `${team} pers.`;
    const hours = tasks.filter((t) => t.on).reduce((s, t) => s + t.hours, 0) * team;
    const euro = hours * RATE;
    if (sumEuro) sumEuro.textContent = fmt(euro);
    if (sumHours) sumHours.textContent = `${hours} h × ${RATE} € × ${team} pers.`;
  };

  if (pillsEl) {
    pillsEl.innerHTML = tasks
      .map(
        (t) => `<button type="button" class="pill${t.on ? " is-on" : ""}" data-id="${t.id}" aria-pressed="${t.on}">
          <span class="mark" aria-hidden="true"></span>
          <span>${t.name}</span>
          <span class="amt">${t.hours} h</span>
        </button>`
      )
      .join("");
    pillsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-id]");
      if (!btn) return;
      const item = tasks.find((t) => t.id === btn.dataset.id);
      if (!item) return;
      item.on = !item.on;
      btn.classList.toggle("is-on", item.on);
      btn.setAttribute("aria-pressed", String(item.on));
      paint();
    });
  }
  seats?.addEventListener("input", paint);
  paint();
})();
