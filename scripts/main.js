/* Script comum a todas as páginas.
   O <body> indica: data-base ("" na raiz, "../" em paginas/),
   data-page (página atual) e data-category (só nas páginas de categoria). */
(() => {
  const body = document.body;
  const base = body.dataset.base || "";
  const page = body.dataset.page || "";

  /* Menu e footer (iguais em todas as páginas) */
  function addNavAndFooter() {
    const current = name => (page === name ? ' aria-current="page"' : "");
    body.insertAdjacentHTML("afterbegin", `
      <header class="nav">
        <nav aria-label="Principal" style="display:contents">
          <a href="${base}index.html"${current("inicio")} data-i18n="nav.home">Início</a>
          <a href="${base}paginas/brun.html"${current("brun")}>Brun</a>
          <button class="translator-toggle" type="button" aria-expanded="false" aria-controls="lang-panel">
            <span data-i18n="translator.label">Translator</span><span class="translator-code" data-lang-code>PT</span>
          </button>
        </nav>
      </header>
      ${window.i18n ? `<div class="lang-panel" id="lang-panel" role="group" aria-labelledby="lang-title">
        <p class="lang-title" id="lang-title" data-i18n="nav.lang">Idioma</p>
        ${i18n.languages.map(code => `<button class="lang-option" type="button" data-lang="${code}" lang="${code}"><span>${i18n.names[code]}</span><span class="lang-code">${code.toUpperCase()}</span></button>`).join("")}
      </div>` : ""}`);
    body.insertAdjacentHTML("beforeend", `
      <footer class="footer">
        <span>Brun</span>
        <ul>
          <li><a href="https://www.instagram.com/webrun_d.s/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
      </footer>`);
  }

  /* Mini menu do tradutor: abre/fecha o painel de idiomas (a troca em si está em i18n.js) */
  function setupTranslatorMenu() {
    const toggle = document.querySelector(".translator-toggle");
    const panel = document.getElementById("lang-panel");
    if (!toggle || !panel) return;
    const setOpen = open => {
      panel.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) (panel.querySelector('[aria-pressed="true"]') || panel.querySelector("button")).focus();
    };
    toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
    panel.addEventListener("click", e => { if (e.target.closest("[data-lang]")) setTimeout(() => setOpen(false), 220); });
    document.addEventListener("click", e => { if (!e.target.closest(".lang-panel, .translator-toggle")) setOpen(false); });
    addEventListener("keydown", e => {
      if (e.key === "Escape" && panel.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
  }

  /* Início: lista das 4 categorias (número, nome e nº de projetos) */
  function addCategories() {
    const list = document.getElementById("categories");
    if (!list) return;
    CATEGORIAS.forEach((c, i) => list.insertAdjacentHTML("beforeend", `
      <li><a href="${base}paginas/${c.slug}.html">
        <span class="category-number">${String(i + 1).padStart(2, "0")}</span>
        <span class="category-name" data-i18n="cat.${c.slug}">${c.nome}</span>
        <span class="category-count" data-i18n="count" data-n="${String(PROJETOS[c.slug].length).padStart(2, "0")}">${String(PROJETOS[c.slug].length).padStart(2, "0")} projetos ↗</span>
      </a></li>`));
  }

  /* Página de categoria: grelha com os 6 projetos + link para a categoria seguinte */
  function addProjects() {
    const list = document.getElementById("projects");
    const category = body.dataset.category;
    if (!list || !category) return;
    const position = CATEGORIAS.findIndex(c => c.slug === category);
    PROJETOS[category].forEach((p, i) => list.insertAdjacentHTML("beforeend", `
      <article class="project reveal">
        <div class="project-image"><img alt="" loading="lazy" src="${p.img || imagemAbstrata(position * 6 + i)}"></div>
        <div class="project-info">
          <h3 class="project-title">${p.nome}</h3>
          <span class="muted"><span data-i18n="type.${p.tipo}">${p.tipo}</span> — ${p.ano}</span>
        </div>
      </article>`));
    const next = CATEGORIAS[(position + 1) % CATEGORIAS.length];
    list.insertAdjacentHTML("afterend", `
      <a class="next reveal" href="${base}paginas/${next.slug}.html">
        <span class="small muted" data-i18n="next">Próxima área</span>
        <span class="next-name"><span data-i18n="cat.${next.slug}">${next.nome}</span> →</span>
      </a>`);
  }

  /* Brun: foto */
  function addPhoto() {
    const photo = document.getElementById("photo");
    if (photo && BRUN_PHOTO) photo.innerHTML = `<img alt="" src="${BRUN_PHOTO}">`;
  }

  /* Animação de entrada ao fazer scroll (espera pelo fim da intro, se houver) */
  function animateOnScroll() {
    const items = document.querySelectorAll(".reveal");
    const start = () => {
      if (!("IntersectionObserver" in window)) return items.forEach(el => el.classList.add("visible"));
      const observer = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }), { threshold: .12 });
      items.forEach(el => observer.observe(el));
    };
    if (document.documentElement.classList.contains("intro-lock")) document.addEventListener("intro-done", start, { once: true });
    else start();
  }

  addNavAndFooter();
  setupTranslatorMenu();
  addCategories();
  addProjects();
  addPhoto();
  if (window.i18n) i18n.init(); /* aplica o idioma guardado ou o do browser */
  animateOnScroll();
})();
