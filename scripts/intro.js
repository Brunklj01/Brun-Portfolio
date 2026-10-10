/* Intro (só quando a pessoa abre o website) e transição simples entre páginas.
   1. Intro, uma vez por sessão: "Olá" em várias línguas → BRUN → o BRUN cresce e passa a ser o BRUN da página.
   2. Navegação: uma cortina preta sobe e cobre a página; na página nova a cortina continua a subir e revela-a.
   O <head> de cada página marca o <html> com .intro-lock (mostra a camada preta) e .arrive (chegada de uma navegação).
   Se a página não tiver um BRUN grande (ex.: páginas de área), o BRUN da intro faz zoom e desaparece. */
(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const text = document.getElementById("intro-text");
  const arriving = root.classList.contains("arrive");
  try { sessionStorage.removeItem("go"); } catch (e) {}
  if (!intro) return;

  const WORDS = ["Olá", "Hello", "Bonjour", "Ciao", "Hallo", "Hola", "Hej", "مرحبا", "こんにちは", "Привет", "안녕하세요", "BRUN"];
  const CURTAIN = { duration: 550, easing: "cubic-bezier(.76, 0, .24, 1)", fill: "forwards" };
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clearAnimations = () => [intro, text].forEach(el => el.getAnimations().forEach(a => a.cancel()));
  let busy = false;

  /* ---------- INTRO (primeira visita) ---------- */
  async function playWords() {
    for (const word of WORDS) {
      text.classList.remove("show");
      await wait(50);
      text.textContent = word;
      text.classList.toggle("brand", word === "BRUN");
      text.classList.add("show");
      await wait(110);
    }
    await wait(500);
  }

  /* o BRUN da camada cresce e move-se até ficar igual ao BRUN da página */
  function grow() {
    const target = document.querySelector(".hero-title, .about-title");
    let move = null;
    if (target) {
      target.style.transition = "none";          /* o BRUN real fica escondido até a animação acabar */
      target.classList.add("visible");
      target.style.visibility = "hidden";
      const range = document.createRange();
      range.selectNodeContents(target); const to = range.getBoundingClientRect();
      range.selectNodeContents(text);   const from = range.getBoundingClientRect();
      if (to.width && from.width && to.bottom > 0 && to.top < innerHeight) {
        move = { x: to.left + to.width / 2 - (from.left + from.width / 2), y: to.top + to.height / 2 - (from.top + from.height / 2), scale: to.width / from.width };
      }
    }
    document.dispatchEvent(new Event("intro-done"));   /* o resto da página começa a aparecer */
    intro.animate([{ backgroundColor: "#000" }, { backgroundColor: "rgba(0, 0, 0, 0)" }], { duration: 700, delay: 250, fill: "forwards" });
    const motion = move
      ? text.animate([{ transform: "none" }, { transform: `translate(${move.x}px, ${move.y}px) scale(${move.scale})` }], { duration: 1000, easing: "cubic-bezier(.76, 0, .24, 1)", fill: "forwards" })
      : text.animate([{ transform: "none", opacity: 1 }, { transform: "scale(2.4)", opacity: 0 }], { duration: 700, easing: "ease-in", fill: "forwards" });

    motion.finished.then(() => {
      root.classList.remove("intro-lock");
      clearAnimations();
      text.classList.remove("show", "brand");
      if (target) { target.style.visibility = ""; target.style.transition = ""; }
    });
  }

  /* ---------- TRANSIÇÃO ENTRE PÁGINAS (cortina) ---------- */
  function leave(href) {                       /* a cortina sobe e cobre a página */
    busy = true;
    try { sessionStorage.setItem("go", "1"); } catch (e) {}
    root.classList.add("intro-lock");
    intro.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0)" }], CURTAIN).finished.then(() => { location.href = href; });
  }

  function lift() {                            /* na página nova, a cortina continua a subir e revela-a */
    document.dispatchEvent(new Event("intro-done"));
    intro.animate([{ clipPath: "inset(0)" }, { clipPath: "inset(0 0 100% 0)" }], CURTAIN).finished.then(() => {
      root.classList.remove("intro-lock", "arrive");
      clearAnimations();
    });
  }

  /* ---------- ARRANQUE ---------- */
  if (arriving) {
    wait(80).then(lift);
  } else if (root.classList.contains("intro-lock")) {
    try { sessionStorage.setItem("intro", "1"); } catch (e) {}
    playWords().then(grow);
  }

  /* ---------- LINKS INTERNOS ---------- */
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const samePage = (a, b) => a.pathname.replace(/index\.html$/, "") === b.pathname.replace(/index\.html$/, "");
  document.addEventListener("click", e => {
    const link = e.target.closest("a[href]");
    if (!link || busy || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.protocol !== location.protocol || url.host !== location.host || samePage(url, location)) return; /* externo, mailto ou só âncora */
    e.preventDefault();
    leave(url.href);
  });
  addEventListener("pageshow", e => {          /* voltar atrás: tira a cortina que ficou na memória */
    if (!e.persisted) return;
    busy = false;
    root.classList.remove("intro-lock", "arrive");
    clearAnimations();
  });
})();
