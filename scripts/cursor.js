/* Cursor do BRUN — um sistema único, por ordem de prioridade:
     1. contexto da interação  → etiqueta (Ver, ↗, ←, ↓)
     2. área do portfólio      → ○ Design · ▶ Edição · </> Web · cubo 3D
     3. cursor normal          → "<>" vertical, com rasto
   Só existe com rato: em touch e com "reduzir movimento" nada é criado. */
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.documentElement;
  const body = document.body;

  /* ---------- DADOS (edita aqui) ---------- */
  /* formas desenhadas só com linhas (viewBox 40 × 40) */
  const SHAPES = {
    base:   '<path d="M11 17 20 8l9 9M11 23l9 9 9-9"/>',                          /* "<>" na vertical */
    design: '<circle cx="20" cy="20" r="11" stroke-dasharray="64 5"/>',           /* círculo */
    edicao: '<path d="M15 12.5 28 20 15 27.5Z"/>',                                /* play */
    web:    '<path d="M13 14 7 20l6 6M27 14l6 6-6 6M22 11 18 29"/>',              /* </> */
    "3d":   '<path d="M20 8l10 6v12l-10 6-10-6V14zM20 20l-10-6M20 20l10-6M20 20v12"/>' /* cubo */
  };
  const AREA_SHAPE = { design: "design", edicao: "edicao", "desenvolvimento-web": "web", "3d": "3d" };
  const SPIN = { design: .9, "3d": .45 };   /* rotação em graus por px de movimento (parada = sem animação) */
  const LABELS = [                          /* [seletor, etiqueta]; ganha o primeiro que corresponder */
    [".objects-stage", () => (window.i18n ? i18n.t("cursor.drag") : "Arrastar")],
    [".project", () => (window.i18n ? i18n.t("cursor.view") : "Ver")],
    ['a[href*="instagram.com"]', "↗"],
    [".back", "←"],
    ['a[href="#portfolio"]', "↓"],
    [".next", "→"],
    ['a[href^="mailto:"]', "↗"],
    [".button", "↗"]
  ];
  const ECHOES = 8;                         /* elementos do rasto */

  /* ---------- ELEMENTOS ---------- */
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = `<svg class="cursor-svg" viewBox="0 0 40 40">${Object.entries(SHAPES).map(([name, svg]) =>
    `<g class="shape" data-s="${name}"><g class="spin">${svg}</g></g>`).join("")}</svg><span class="cursor-label"></span>`;

  const trail = document.createElement("div");
  trail.setAttribute("aria-hidden", "true");
  trail.innerHTML = `<svg class="echo" viewBox="0 0 40 40">${SHAPES.base}</svg>`.repeat(ECHOES);

  body.append(trail, cursor);
  const shapes = [...cursor.querySelectorAll(".shape")];
  const label = cursor.querySelector(".cursor-label");
  const echoes = [...trail.children];

  /* ---------- ESTADO ---------- */
  let tx = 0, ty = 0;            /* posição do rato (alvo) */
  let x = 0, y = 0;              /* posição do cursor (mola) */
  let vx = 0, vy = 0;            /* velocidade */
  let lastX = 0, lastY = 0;      /* último eco */
  let angle = 0, frame = 0, nextEcho = 0;
  let target = null, shape = null, spin = null, spinFactor = 0;

  /* a forma ativa fica visível; as outras encolhem e rodam (transição suave) */
  function setShape(name) {
    if (name === shape) return;
    shape = name;
    shapes.forEach(g => g.classList.toggle("active", g.dataset.s === name));
    spin = name ? cursor.querySelector(`[data-s="${name}"] .spin`) : null;
    spinFactor = SPIN[name] || 0;
  }

  /* decide o que mostrar para o elemento que está por baixo do rato */
  function resolve(el) {
    const found = LABELS.find(([selector]) => el.closest(selector));
    const row = el.closest(".categories a");
    const slug = row ? row.getAttribute("href").split("/").pop().replace(".html", "") : body.dataset.category;
    const text = found ? (typeof found[1] === "function" ? found[1]() : found[1]) : "";

    cursor.classList.toggle("has-label", !!text);
    cursor.classList.toggle("link", !!text || !!el.closest("a, button"));
    if (text) {
      if (label.textContent !== text) label.textContent = text;
      setShape(null);                            /* 1. a etiqueta substitui a forma */
    } else {
      setShape(AREA_SHAPE[slug] || "base");      /* 2. área  ·  3. normal */
    }
  }

  const show = on => {
    root.classList.toggle("has-cursor", on);
    cursor.classList.toggle("on", on);
  };

  /* rasto: eco do "<>" que desaparece em 0,2–0,5 s; mais rápido = mais longo e mais visível */
  function addEcho(speed) {
    const gap = Math.min(9 + speed * .8, 34);
    if (Math.hypot(x - lastX, y - lastY) < gap) return;
    lastX = x; lastY = y;
    const s = Math.min(speed, 40);
    const el = echoes[nextEcho];
    nextEcho = (nextEcho + 1) % ECHOES;
    el.animate([
      { transform: `translate3d(${x}px, ${y}px, 0) scale(.95)`, opacity: .2 + s / 110 },
      { transform: `translate3d(${x}px, ${y}px, 0) scale(.6)`, opacity: 0 }
    ], { duration: 220 + s * 6.5, easing: "ease-out" });
  }

  /* movimento: mola ligeiramente elástica; o ciclo pára quando o rato pára */
  function tick() {
    vx = (vx + (tx - x) * .28) * .55;
    vy = (vy + (ty - y) * .28) * .55;
    x += vx; y += vy;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    const speed = Math.hypot(vx, vy);
    if (spin) { angle += vx * spinFactor; spin.style.transform = `rotate(${angle}deg)`; }
    if (speed > 1.5 && !cursor.classList.contains("has-label")) addEcho(speed);

    frame = speed + Math.hypot(tx - x, ty - y) > .2 ? requestAnimationFrame(tick) : 0;
  }

  /* ---------- EVENTOS ---------- */
  addEventListener("pointermove", e => {
    if (e.pointerType === "touch" || !e.target.closest) return;
    tx = e.clientX; ty = e.clientY;
    if (!root.classList.contains("has-cursor")) { x = lastX = tx; y = lastY = ty; vx = vy = 0; show(true); }
    if (e.target !== target) { target = e.target; resolve(target); }
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });

  /* com scroll o elemento por baixo muda sem o rato se mexer */
  let checking = false;
  addEventListener("scroll", () => {
    if (checking || !root.classList.contains("has-cursor")) return;
    checking = true;
    requestAnimationFrame(() => {
      checking = false;
      const el = document.elementFromPoint(tx, ty);
      if (el && el !== target) { target = el; resolve(el); }
    });
  }, { passive: true });

  addEventListener("pointerdown", () => cursor.classList.add("down"));
  addEventListener("pointerup", () => cursor.classList.remove("down"));
  document.addEventListener("pointerout", e => { if (!e.relatedTarget) show(false); }); /* rato saiu da janela */

  setShape(AREA_SHAPE[body.dataset.category] || "base"); /* nas páginas de área, começa com a forma da área */
})();
