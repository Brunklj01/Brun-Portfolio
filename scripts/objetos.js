/* Objeto 3D do início — ao lado do BRUN (Three.js; só carrega na página inicial).
     · arrastar: roda à volta do objeto (OrbitControls); sem zoom nem deslocamento, para não atrapalhar o scroll
     · passar o rato: o objeto cresce um pouco e pára de rodar sozinho
     · clicar: se houver mais de um modelo em OBJETOS (scripts/dados.js), passa para o seguinte
   Os modelos GLB vêm de "ficheiro"; sem ficheiro aparece uma forma de exemplo.
   Precisa de internet (Three.js vem de um CDN) e de abrir o site através de um servidor — ver LEIA-ME.txt. */
(async () => {
const box = document.querySelector(".hero-objects");
const stage = document.getElementById("objects-stage");
const hint = box && box.querySelector(".objects-hint");
if (!box || !stage || typeof OBJETOS === "undefined" || !OBJETOS.length) return;

/* mostra um aviso na própria página em vez de falhar em silêncio */
function fail(reason, error) {
  console.error("[objeto 3D]", reason, error || "");
  box.hidden = false;
  stage.className = "objects-stage is-error";
  stage.dataset.i18n = "objects.error";
  stage.innerHTML = window.i18n ? i18n.t("objects.error") : "O objeto 3D não carregou.";
  if (hint) hint.hidden = true;
}

/* um módulo e o ficheiro GLB não carregam quando o site é aberto com duplo clique (file://) */
if (location.protocol === "file:") return fail("o site foi aberto como ficheiro (file://); usa um servidor local");

let THREE, GLTFLoader, DRACOLoader, MeshoptDecoder, OrbitControls, RoomEnvironment;
try {
  const [three, gltf, draco, meshopt, orbit, room] = await Promise.all([
    import("three"),
    import("three/addons/loaders/GLTFLoader.js"),
    import("three/addons/loaders/DRACOLoader.js"),
    import("three/addons/libs/meshopt_decoder.module.js"),
    import("three/addons/controls/OrbitControls.js"),
    import("three/addons/environments/RoomEnvironment.js")
  ]);
  ({ GLTFLoader } = gltf); ({ DRACOLoader } = draco); ({ MeshoptDecoder } = meshopt); ({ OrbitControls } = orbit); ({ RoomEnvironment } = room);
  THREE = three;
} catch (error) { return fail("não foi possível carregar o Three.js (sem internet ou bloqueado)", error); }

start();

function start() {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  /* ---------- CENA ---------- */
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
  catch (error) { return; }                                   /* sem WebGL: fica só o BRUN */
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  stage.append(renderer.domElement);
  box.hidden = false;

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture; /* luz neutra */
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(2, 3, 4);
  const rim = new THREE.DirectionalLight(0xffffff, .9);       /* luz por trás: desenha o contorno das partes escuras */
  rim.position.set(-3, 2, -3);
  scene.add(light, rim);

  const camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);  /* 1 unidade = 1 px no plano z = 0 */
  camera.position.set(0, .25, 1);                              /* só a direção; a distância é ajustada em layout() */

  /* ---------- ORBIT CONTROLS ---------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;                               /* o movimento abranda suavemente */
  controls.dampingFactor = .08;
  controls.enableZoom = false;                                 /* a roda do rato continua a fazer scroll da página */
  controls.enablePan = false;
  controls.autoRotate = !reduceMotion;                         /* rotação lenta quando ninguém lhe toca */
  controls.autoRotateSpeed = 1.5;
  renderer.domElement.style.touchAction = "pan-y";             /* no telemóvel, deslizar na vertical faz scroll */

  /* ---------- MODELOS ---------- */
  const loader = new GLTFLoader();
  loader.setDRACOLoader(new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/"));
  loader.setMeshoptDecoder(MeshoptDecoder);

  const sample = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: .35, metalness: .15 });
  const SHAPES = [
    () => new THREE.TorusKnotGeometry(.55, .2, 120, 16),
    () => new THREE.IcosahedronGeometry(.8, 0),
    () => new THREE.BoxGeometry(1, 1, 1),
    () => new THREE.TorusGeometry(.6, .22, 24, 64)
  ];

  /* partes pretas e metálicas ficam invisíveis sobre o fundo preto: tornam-se não metálicas, para refletirem luz */
  const AJUSTAR_PRETOS = true;
  function showBlacks(root) {
    if (!AJUSTAR_PRETOS) return;
    root.traverse(item => {
      if (!item.isMesh) return;
      [].concat(item.material).forEach(m => {
        if (m.color && m.color.r + m.color.g + m.color.b < .03 && m.metalness > .2) { m.metalness = 0; m.roughness = Math.min(m.roughness, .4); m.needsUpdate = true; }
      });
    });
  }

  /* centra o objeto e ajusta-o a um raio de 1 */
  function normalize(object) {
    const sphere = new THREE.Box3().setFromObject(object).getBoundingSphere(new THREE.Sphere());
    object.position.sub(sphere.center);
    const pivot = new THREE.Group();
    pivot.add(object);
    pivot.scale.setScalar(1 / sphere.radius);
    return pivot;
  }
  const placeholder = i => normalize(new THREE.Mesh(SHAPES[i % SHAPES.length](), sample));

  const cache = new Map();                                    /* cada GLB é carregado uma só vez */
  function getModel(i) {
    if (!cache.has(i)) {
      const file = OBJETOS[i].ficheiro;
      cache.set(i, file
        ? loader.loadAsync(file).then(gltf => { showBlacks(gltf.scene); return normalize(gltf.scene); }).catch(error => { fail("não foi possível carregar " + file, error); throw error; })
        : Promise.resolve(placeholder(i)));
    }
    return cache.get(i).then(template => template.clone(true));
  }

  /* ---------- O OBJETO ---------- */
  const holder = new THREE.Group();                           /* a escala em px e a animação de entrada ficam aqui */
  scene.add(holder);
  let model = null, index = 0, token = 0;
  let radius = 1, scale = 0, target = 1, pointerOver = false;

  /* troca de modelo: o antigo encolhe, o novo cresce */
  function setModel(next, delay = 200) {
    const mine = ++token;
    index = next;
    target = 0;
    Promise.all([getModel(next), wait(reduceMotion ? 0 : delay)]).then(([loaded]) => {
      if (mine !== token) return;
      if (model) holder.remove(model);
      model = loaded;
      holder.add(model);
      target = 1;
      wake();
    }).catch(() => {});                                       /* o aviso já foi mostrado por fail() */
  }

  function layout() {
    const width = stage.clientWidth, height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.setLength(height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.updateProjectionMatrix();
    controls.update();
    radius = Math.min(width, height) * .42;
    wake();
  }

  /* ---------- RATO E TOQUE ---------- */
  let press = null;
  stage.addEventListener("pointerdown", e => { press = { x: e.clientX, y: e.clientY, time: performance.now() }; });
  stage.addEventListener("pointercancel", () => { press = null; });
  stage.addEventListener("pointerup", e => {                  /* um clique rápido (sem arrastar) troca de modelo */
    if (!press) return;
    const quick = Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6 && performance.now() - press.time < 500;
    press = null;
    if (!quick || OBJETOS.length < 2) return;
    const rect = stage.getBoundingClientRect();
    const distance = Math.hypot(e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - rect.height / 2);
    if (distance < radius * 1.1) setModel((index + 1) % OBJETOS.length);
  });
  stage.addEventListener("pointerenter", () => { pointerOver = true; controls.autoRotate = false; wake(); });
  stage.addEventListener("pointerleave", () => { pointerOver = false; controls.autoRotate = !reduceMotion; wake(); });

  /* ---------- ANIMAÇÃO (só corre quando é preciso e a página está visível) ---------- */
  let running = false, visible = true, last = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    const k = 1 - Math.pow(.001, dt);                         /* suavização independente dos fps */
    const goal = target * (pointerOver ? 1.05 : 1);
    scale = reduceMotion ? goal : scale + (goal - scale) * k;
    holder.scale.setScalar(Math.max(radius * scale, .001));

    const moved = controls.update(dt);
    renderer.render(scene, camera);

    running = (controls.autoRotate || moved || Math.abs(goal - scale) > .002) && visible && !document.hidden;
    if (running) requestAnimationFrame(frame);
  }

  function wake() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  controls.addEventListener("start", wake);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; wake(); }).observe(box);
  new ResizeObserver(layout).observe(stage);
  document.addEventListener("visibilitychange", wake);

  /* ---------- ARRANQUE ---------- */
  const hint = box.querySelector(".objects-hint");
  if (hint && OBJETOS.length === 1 && window.i18n) {            /* com um só modelo, não há nada para trocar */
    hint.dataset.i18n = "objects.hint.drag";
    hint.innerHTML = i18n.t("objects.hint.drag");
  }
  layout();
  setModel(0, 0);
}
})();
