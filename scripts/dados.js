/* ============================================================
   DADOS — edita aqui a foto do Brun, as categorias e os projetos.
   img: URL ou caminho de imagem real (opcional). Caminhos relativos
   escrevem-se a partir do HTML onde aparecem
   (ex.: "../imagens/atlas.jpg" nas páginas dentro de paginas/).
   Sem img, usa-se uma composição abstrata a preto e branco.
   ============================================================ */
const BRUN_PHOTO = ""; /* ex.: "../imagens/brun.jpg" */

const CATEGORIAS = [
  { slug: "design", nome: "Design" },
  { slug: "edicao", nome: "Edição" },
  { slug: "desenvolvimento-web", nome: "Desenvolvimento Web" },
  { slug: "3d", nome: "3D" }
];

/* 6 projetos por categoria */
const PROJETOS = {
  "design": [
    { nome: "Atlas",      tipo: "Identidade visual", ano: 2026, img: "" },
    { nome: "Casa Norte", tipo: "Direção de arte",   ano: 2025, img: "" },
    { nome: "Sílaba",     tipo: "Tipografia",        ano: 2023, img: "" },
    { nome: "Fio",        tipo: "Identidade visual", ano: 2025, img: "" },
    { nome: "Cartaz 07",  tipo: "Cartaz",            ano: 2024, img: "" },
    { nome: "Marca",      tipo: "Embalagem",         ano: 2023, img: "" }
  ],
  "edicao": [
    { nome: "Meridiano", tipo: "Design editorial", ano: 2025, img: "" },
    { nome: "Pausa",     tipo: "Fotografia",       ano: 2024, img: "" },
    { nome: "Ritmo",     tipo: "Vídeo",            ano: 2024, img: "" },
    { nome: "Revista 03",tipo: "Design editorial", ano: 2026, img: "" },
    { nome: "Luz Baixa", tipo: "Fotografia",       ano: 2025, img: "" },
    { nome: "Corte",     tipo: "Vídeo",            ano: 2023, img: "" }
  ],
  "desenvolvimento-web": [
    { nome: "Vazio",  tipo: "Website",           ano: 2024, img: "" },
    { nome: "Grelha", tipo: "Sistema de design", ano: 2025, img: "" },
    { nome: "Eixo",   tipo: "Aplicação web",     ano: 2026, img: "" },
    { nome: "Arquivo",tipo: "Website",           ano: 2025, img: "" },
    { nome: "Pulso",  tipo: "Aplicação web",     ano: 2024, img: "" },
    { nome: "Loja Q", tipo: "E-commerce",        ano: 2023, img: "" }
  ],
  "3d": [
    { nome: "Volume", tipo: "Modelação", ano: 2026, img: "" },
    { nome: "Cinza",  tipo: "Render",    ano: 2025, img: "" },
    { nome: "Bloco",  tipo: "Animação",  ano: 2024, img: "" },
    { nome: "Órbita", tipo: "Animação",  ano: 2026, img: "" },
    { nome: "Pedra",  tipo: "Modelação", ano: 2025, img: "" },
    { nome: "Sala 9", tipo: "Render",    ano: 2024, img: "" }
  ]
};

/* Objeto 3D (GLB) ao lado do BRUN, na página inicial: mostra um de cada vez.
   ficheiro: caminho do .glb dentro da pasta modelos/ (vazio = forma de exemplo).
   Com mais de um modelo na lista, clicar no objeto passa para o seguinte. */
const OBJETOS = [
  { nome: "3D Design", ficheiro: "modelos/3ddesign_wyb.glb" }
];

/* Placeholders abstratos a preto e branco (data URI, sem pedidos de rede) */
const FORMAS = [
  '<circle cx="50" cy="52" r="30" fill="#fff"/>',
  '<rect width="45" height="100" fill="#fff"/><circle cx="62" cy="60" r="18" fill="#fff"/>',
  '<path d="M0 100 L60 0 L100 100Z" fill="#fff"/>',
  '<g stroke="#fff" stroke-width="2.5">' + Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 8 + 6}" x2="100" y2="${i * 8 + 6}"/>`).join("") + "</g>",
  '<circle cx="50" cy="50" r="36" fill="none" stroke="#fff" stroke-width="3"/><circle cx="50" cy="50" r="18" fill="#fff"/>',
  '<rect x="14" y="14" width="72" height="72" fill="#fff"/><rect x="30" y="30" width="40" height="40" fill="#000"/>',
  '<path d="M50 12 87 32 87 70 50 90 13 70 13 32Z" fill="#fff"/><path d="M50 12 50 52 13 32M50 52 87 32" stroke="#000" stroke-width="3" fill="none"/>'
];
const imagemAbstrata = i => "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#000"/>${FORMAS[i % FORMAS.length]}</svg>`);
