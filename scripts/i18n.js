/* Tradução do site: PT · EN · ES · FR · DE · IT.
   Como funciona: os textos do HTML levam data-i18n="chave" e esta tabela tem a tradução de cada chave.
   Ao escolher um idioma (botões no menu) o site troca todos os textos; a escolha fica guardada.
   Na primeira visita usa o idioma do browser (se não for suportado, inglês).
   Cada linha da tabela: chave: [pt, en, es, fr, de, it]. Para um novo idioma, acrescenta o código a LANGS
   e uma tradução no fim de cada linha (o que faltar aparece em português). */
(() => {
  const LANGS = ["pt", "en", "es", "fr", "de", "it"];
  const TAGS = { pt: "pt-PT", en: "en", es: "es", fr: "fr", de: "de", it: "it" };

  const T = {
    /* menu */
    "nav.home":  ["Início", "Home", "Inicio", "Accueil", "Start", "Home"],
    "nav.lang":  ["Idioma", "Language", "Idioma", "Langue", "Sprache", "Lingua"],
    "translator.label": ["Translator", "Translator", "Traductor", "Traducteur", "Übersetzer", "Traduttore"],
    /* início: hero */
    "hero.label":  ["Digital creative", "Digital creative", "Creativo digital", "Créatif digital", "Digitaler Kreativer", "Creativo digitale"],
    "hero.areas":  ["Design / Web / 3D / Edição", "Design / Web / 3D / Editing", "Diseño / Web / 3D / Edición", "Design / Web / 3D / Édition", "Design / Web / 3D / Bearbeitung", "Design / Web / 3D / Editing"],
    "hero.status": ["Disponível para<br>projetos selecionados<br>2026", "Available for<br>selected projects<br>2026", "Disponible para<br>proyectos seleccionados<br>2026", "Disponible pour<br>des projets sélectionnés<br>2026", "Verfügbar für<br>ausgewählte Projekte<br>2026", "Disponibile per<br>progetti selezionati<br>2026"],
    "hero.cta":    ["Ver trabalho ↓", "See work ↓", "Ver trabajo ↓", "Voir le travail ↓", "Arbeiten ansehen ↓", "Vedi i lavori ↓"],
    "objects.hint":  ["Arrasta para rodar · clica para trocar", "Drag to rotate · click to swap", "Arrastra para girar · haz clic para cambiar", "Faites glisser pour tourner · cliquez pour changer", "Ziehen zum Drehen · Klicken zum Wechseln", "Trascina per ruotare · clicca per cambiare"],
    "objects.hint.drag": ["Arrasta para rodar", "Drag to rotate", "Arrastra para girar", "Faites glisser pour tourner", "Ziehen zum Drehen", "Trascina per ruotare"],
    "objects.error": ["O objeto 3D não carregou. Abre o site através de um servidor (ver LEIA-ME.txt) e confirma a ligação à internet.", "The 3D object didn't load. Open the site through a server (see LEIA-ME.txt) and check your internet connection.", "El objeto 3D no se cargó. Abre el sitio a través de un servidor (ver LEIA-ME.txt) y comprueba tu conexión a internet.", "L'objet 3D ne s'est pas chargé. Ouvrez le site via un serveur (voir LEIA-ME.txt) et vérifiez votre connexion internet.", "Das 3D-Objekt wurde nicht geladen. Öffne die Seite über einen Server (siehe LEIA-ME.txt) und prüfe deine Internetverbindung.", "L'oggetto 3D non si è caricato. Apri il sito tramite un server (vedi LEIA-ME.txt) e controlla la connessione a internet."],
    "objects.label": ["Objetos 3D interativos", "Interactive 3D objects", "Objetos 3D interactivos", "Objets 3D interactifs", "Interaktive 3D-Objekte", "Oggetti 3D interattivi"],
    /* início: portfolio */
    "portfolio.title": ["Portfolio", "Portfolio", "Portfolio", "Portfolio", "Portfolio", "Portfolio"],
    "portfolio.areas": ["04 áreas", "04 areas", "04 áreas", "04 domaines", "04 Bereiche", "04 aree"],
    "count":           ["{n} projetos ↗", "{n} projects ↗", "{n} proyectos ↗", "{n} projets ↗", "{n} Projekte ↗", "{n} progetti ↗"],
    "next":            ["Próxima área", "Next area", "Siguiente área", "Domaine suivant", "Nächster Bereich", "Prossima area"],
    /* início: about e contacto */
    "about.label": ["About", "About", "Sobre mí", "À propos", "Über mich", "Chi sono"],
    "about.title": ["Brun is a digital creative focused on design, web, editing and 3D.",
                    "Brun is a digital creative focused on design, web, editing and 3D.",
                    "Brun es un creativo digital centrado en diseño, web, edición y 3D.",
                    "Brun est un créatif digital spécialisé dans le design, le web, l'édition et la 3D.",
                    "Brun ist ein digitaler Kreativer mit Fokus auf Design, Web, Bearbeitung und 3D.",
                    "Brun è un creativo digitale specializzato in design, web, editing e 3D."],
    "about.text":  ["Trabalho na interseção entre design e tecnologia: identidade, edição, sites e imagem 3D, sempre com poucas peças e muita intenção.",
                    "I work at the intersection of design and technology: identity, editing, websites and 3D imagery, always with few pieces and a lot of intent.",
                    "Trabajo en la intersección entre diseño y tecnología: identidad, edición, sitios web e imagen 3D, siempre con pocas piezas y mucha intención.",
                    "Je travaille à l'intersection du design et de la technologie : identité, édition, sites web et images 3D, toujours avec peu de pièces et beaucoup d'intention.",
                    "Ich arbeite an der Schnittstelle von Design und Technologie: Identität, Bearbeitung, Websites und 3D-Bilder, immer mit wenigen Elementen und viel Absicht.",
                    "Lavoro all'intersezione tra design e tecnologia: identità, editing, siti web e immagini 3D, sempre con pochi elementi e molta intenzione."],
    "about.more":  ["Mais sobre Brun ↗", "More about Brun ↗", "Más sobre Brun ↗", "En savoir plus sur Brun ↗", "Mehr über Brun ↗", "Scopri di più su Brun ↗"],
    "cta.title":   ["Let's<br>create<br>something<span class=\"red\">.</span>", "Let's<br>create<br>something<span class=\"red\">.</span>",
                    "Vamos<br>a crear<br>algo<span class=\"red\">.</span>", "Créons<br>quelque<br>chose<span class=\"red\">.</span>",
                    "Lass uns<br>etwas<br>erschaffen<span class=\"red\">.</span>", "Creiamo<br>qualcosa<br>insieme<span class=\"red\">.</span>"],
    /* página Brun */
    "brun.photo":      ["Foto", "Photo", "Foto", "Photo", "Foto", "Foto"],
    "brun.photoLabel": ["Fotografia de Brun", "Photograph of Brun", "Fotografía de Brun", "Photographie de Brun", "Foto von Brun", "Fotografia di Brun"],
    "brun.interests":  ["Interesses<br><span class=\"muted\">Tipografia, fotografia analógica, arquitetura, edição independente.</span>",
                        "Interests<br><span class=\"muted\">Typography, analogue photography, architecture, independent publishing.</span>",
                        "Intereses<br><span class=\"muted\">Tipografía, fotografía analógica, arquitectura, edición independiente.</span>",
                        "Centres d'intérêt<br><span class=\"muted\">Typographie, photographie argentique, architecture, édition indépendante.</span>",
                        "Interessen<br><span class=\"muted\">Typografie, analoge Fotografie, Architektur, unabhängiges Verlagswesen.</span>",
                        "Interessi<br><span class=\"muted\">Tipografia, fotografia analogica, architettura, editoria indipendente.</span>"],
    "brun.area":       ["Área<br><span class=\"muted\">Design, edição, desenvolvimento web e 3D.</span>",
                        "Areas<br><span class=\"muted\">Design, editing, web development and 3D.</span>",
                        "Áreas<br><span class=\"muted\">Diseño, edición, desarrollo web y 3D.</span>",
                        "Domaines<br><span class=\"muted\">Design, édition, développement web et 3D.</span>",
                        "Bereiche<br><span class=\"muted\">Design, Bearbeitung, Webentwicklung und 3D.</span>",
                        "Aree<br><span class=\"muted\">Design, editing, sviluppo web e 3D.</span>"],
    /* áreas */
    "cat.design":              ["Design", "Design", "Diseño", "Design", "Design", "Design"],
    "cat.edicao":              ["Edição", "Editing", "Edición", "Édition", "Bearbeitung", "Editing"],
    "cat.desenvolvimento-web": ["Desenvolvimento Web", "Web Development", "Desarrollo Web", "Développement Web", "Webentwicklung", "Sviluppo Web"],
    "cat.3d":                  ["3D", "3D", "3D", "3D", "3D", "3D"],
    "desc.design":              ["Identidade visual, direção de arte e sistemas gráficos.", "Visual identity, art direction and graphic systems.", "Identidad visual, dirección de arte y sistemas gráficos.", "Identité visuelle, direction artistique et systèmes graphiques.", "Visuelle Identität, Art Direction und grafische Systeme.", "Identità visiva, direzione artistica e sistemi grafici."],
    "desc.edicao":              ["Design editorial, fotografia e edição de vídeo.", "Editorial design, photography and video editing.", "Diseño editorial, fotografía y edición de vídeo.", "Design éditorial, photographie et montage vidéo.", "Editorial Design, Fotografie und Videoschnitt.", "Design editoriale, fotografia e montaggio video."],
    "desc.desenvolvimento-web": ["Sites rápidos, acessíveis e com identidade própria.", "Fast, accessible websites with their own identity.", "Sitios web rápidos, accesibles y con identidad propia.", "Sites rapides, accessibles et avec une identité propre.", "Schnelle, barrierefreie Websites mit eigener Identität.", "Siti veloci, accessibili e con un'identità propria."],
    "desc.3d":                  ["Modelação, volume e composição tridimensional.", "Modelling, volume and three-dimensional composition.", "Modelado, volumen y composición tridimensional.", "Modélisation, volume et composition tridimensionnelle.", "Modellierung, Volumen und dreidimensionale Komposition.", "Modellazione, volume e composizione tridimensionale."],
    /* cabeçalho da página e cursor */
    "title.inicio":     ["Brun — Portfolio", "Brun — Portfolio", "Brun — Portfolio", "Brun — Portfolio", "Brun — Portfolio", "Brun — Portfolio"],
    "title.brun":       ["Brun — Sobre", "Brun — About", "Brun — Sobre mí", "Brun — À propos", "Brun — Über mich", "Brun — Chi sono"],
    "meta.description": ["Portfolio de Brun, designer e diretor criativo.", "Portfolio of Brun, digital creative and creative director.", "Portfolio de Brun, creativo digital y director creativo.", "Portfolio de Brun, créatif digital et directeur créatif.", "Portfolio von Brun, digitaler Kreativer und Creative Director.", "Portfolio di Brun, creativo digitale e direttore creativo."],
    "cursor.view":      ["Ver", "View", "Ver", "Voir", "Ansehen", "Vedi"],
    "cursor.drag":      ["Arrastar", "Drag", "Arrastrar", "Glisser", "Ziehen", "Trascina"]
  };

  /* tipos de projeto (a chave é o texto em português usado em dados.js) */
  [
    ["Identidade visual", "Visual identity", "Identidad visual", "Identité visuelle", "Visuelle Identität", "Identità visiva"],
    ["Direção de arte", "Art direction", "Dirección de arte", "Direction artistique", "Art Direction", "Direzione artistica"],
    ["Tipografia", "Typography", "Tipografía", "Typographie", "Typografie", "Tipografia"],
    ["Cartaz", "Poster", "Cartel", "Affiche", "Plakat", "Poster"],
    ["Embalagem", "Packaging", "Packaging", "Packaging", "Verpackung", "Packaging"],
    ["Design editorial", "Editorial design", "Diseño editorial", "Design éditorial", "Editorial Design", "Design editoriale"],
    ["Fotografia", "Photography", "Fotografía", "Photographie", "Fotografie", "Fotografia"],
    ["Vídeo", "Video", "Vídeo", "Vidéo", "Video", "Video"],
    ["Website", "Website", "Sitio web", "Site web", "Website", "Sito web"],
    ["Sistema de design", "Design system", "Sistema de diseño", "Système de design", "Designsystem", "Design system"],
    ["Aplicação web", "Web app", "Aplicación web", "Application web", "Web-App", "App web"],
    ["E-commerce", "E-commerce", "E-commerce", "E-commerce", "E-Commerce", "E-commerce"],
    ["Modelação", "Modelling", "Modelado", "Modélisation", "Modellierung", "Modellazione"],
    ["Render", "Render", "Render", "Rendu", "Rendering", "Render"],
    ["Animação", "Animation", "Animación", "Animation", "Animation", "Animazione"]
  ].forEach(row => { T["type." + row[0]] = row; });

  let current = "pt";

  const pick = key => { const row = T[key]; return row ? (row[LANGS.indexOf(current)] ?? row[0]) : undefined; };

  function detect() {
    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    if (LANGS.includes(saved)) return saved;
    for (const preferred of navigator.languages || [navigator.language || "pt"]) {
      const code = preferred.slice(0, 2).toLowerCase();
      if (LANGS.includes(code)) return code;
    }
    return "en";
  }

  function apply() {
    document.documentElement.lang = TAGS[current];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const text = pick(el.dataset.i18n);
      if (text !== undefined) el.innerHTML = text.replace("{n}", el.dataset.n ?? "");
    });
    document.querySelectorAll("[data-i18n-label]").forEach(el => {
      const text = pick(el.dataset.i18nLabel);
      if (text !== undefined) el.setAttribute("aria-label", text);
    });
    document.querySelectorAll("[data-lang]").forEach(el => el.setAttribute("aria-pressed", String(el.dataset.lang === current)));
    document.querySelectorAll("[data-lang-code]").forEach(el => { el.textContent = current.toUpperCase(); });

    const slug = document.body.dataset.category;
    document.title = slug ? `${pick("cat." + slug)} — Brun` : pick("title." + (document.body.dataset.page || "inicio")) || document.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = pick("meta.description");
  }

  function setLanguage(lang) {
    if (!LANGS.includes(lang) || lang === current) return;
    current = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    apply();
  }

  document.addEventListener("click", e => {
    const button = e.target.closest("[data-lang]");
    if (button) setLanguage(button.dataset.lang);
  });

  window.i18n = { languages: LANGS, names: { pt: "Português", en: "English", es: "Español", fr: "Français", de: "Deutsch", it: "Italiano" }, table: T, t: pick, set: setLanguage, init() { current = detect(); apply(); } };
})();
