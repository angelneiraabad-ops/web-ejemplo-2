/* =================================================================
   RAÍCES NATURALES · main.js
   Interacciones ligeras, sin dependencias externas.
   ================================================================= */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const hero = document.querySelector(".hero");
  const heroMedia = document.getElementById("heroMedia");
  const navToggle = document.getElementById("navToggle");
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     1. HEADER: cambia de estilo al salir del hero
     Si no hay hero en la página, el header arranca en modo sólido.
     --------------------------------------------------------------- */
  function setHeaderState() {
    if (!header) return;
    // Páginas sin hero: header siempre sólido
    if (!hero) {
      header.classList.add("is-scrolled");
      header.classList.remove("header--sobre-hero");
      return;
    }
    const umbral = window.innerHeight * 0.75;
    if (window.scrollY > umbral) {
      header.classList.add("is-scrolled");
      header.classList.remove("header--sobre-hero");
    } else {
      header.classList.remove("is-scrolled");
      header.classList.add("header--sobre-hero");
    }
  }

  /* ---------------------------------------------------------------
     2. HERO: parallax sutil de la imagen al hacer scroll
     --------------------------------------------------------------- */
  function parallaxHero() {
    if (!heroMedia || reduceMotion) return;
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroMedia.style.transform = "translateY(" + y * 0.18 + "px)";
    }
  }

  /* ---------------------------------------------------------------
     3. Scroll optimizado con requestAnimationFrame
     --------------------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        setHeaderState();
        parallaxHero();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", setHeaderState);
  setHeaderState();

  /* ---------------------------------------------------------------
     4. MENÚ MÓVIL
     --------------------------------------------------------------- */
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const abierto = body.classList.toggle("nav-abierto");
      navToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
      navToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    // Cerrar el menú al pulsar un enlace
    document.querySelectorAll("#nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("nav-abierto");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------
     5. REVEAL: aparición de elementos al entrar en pantalla
     --------------------------------------------------------------- */
  const revelables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revelables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const io = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            io.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revelables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------
     6. Año dinámico en el footer
     --------------------------------------------------------------- */
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     7. FILTROS DE COLECCIÓN (formulas.html)
     --------------------------------------------------------------- */
  const filtros = document.querySelectorAll(".filtro");
  const tarjetasCol = document.querySelectorAll("[data-cats]");
  if (filtros.length && tarjetasCol.length) {
    filtros.forEach(function (chip) {
      chip.addEventListener("click", function () {
        filtros.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        const f = chip.getAttribute("data-filter");
        tarjetasCol.forEach(function (card) {
          const cats = card.getAttribute("data-cats") || "";
          const mostrar = f === "todos" || cats.split(" ").indexOf(f) !== -1;
          card.classList.toggle("is-oculto", !mostrar);
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     8. DETALLE DE FÓRMULA (formula.html?f=...)
     --------------------------------------------------------------- */
  const FORMULAS = {
    alpha: {
      nombre: "Alpha: Angus & Kale",
      meta: "Alta Proteína · EU",
      img: "assets/img/cuenco-servido.jpg",
      location: "Producción Local Certificada, EU",
      year: "2026",
      type: "Dieta de Mantenimiento / Alta Proteína",
      batch: "Lote 04-A / Raciones de 500 g",
      status: "Disponible para suscripción activa",
      collaboration: "Comité de Nutrición Veterinaria Independiente",
      description: "Una formulación densa en nutrientes diseñada para perros adultos con requerimientos energéticos elevados. Utiliza cortes limpios de ganado alimentado exclusivamente con pasto, complementados con antioxidantes naturales y micronutrientes esenciales.",
      approach: "Nuestro enfoque rechaza los procesos de extrusión a alta temperatura. Cada ingrediente es cocido suavemente al vapor para preservar la integridad enzimática, garantizando una palatabilidad excepcional y una digestibilidad superior al 95 %.",
      credits: "Dirección Científica: Dr. M. Aris · Selección de Materia Prima: Equipo Agrícola Asociado.",
      prev: "veta", next: "kura"
    },
    kura: {
      nombre: "Kura: Cordero Silvestre",
      meta: "Sensibilidad Digestiva · Oceanía",
      img: "assets/img/cuenco-azul.jpg",
      location: "Pastos de Altura, Oceanía",
      year: "2026",
      type: "Dieta Hipoalergénica / Sensibilidad Digestiva",
      batch: "Lote 02-K / Raciones de 500 g",
      status: "Disponible para suscripción activa",
      collaboration: "Comité de Nutrición Veterinaria Independiente",
      description: "Proteína novel de cordero de libre pastoreo con infusión de calabaza orgánica, formulada para sistemas digestivos altamente sensibles.",
      approach: "Una dieta de eliminación construida sobre una única fuente proteica novel. La calabaza orgánica aporta fibra soluble que estabiliza el tránsito digestivo sin recurrir a aditivos ni desnaturalizar la materia.",
      credits: "Dirección Científica: Dr. M. Aris · Selección de Materia Prima: Equipo Agrícola Asociado.",
      prev: "alpha", next: "veta"
    },
    veta: {
      nombre: "Veta: Pescado Blanco & Algas",
      meta: "Soporte Dérmico y Cognitivo · UK",
      img: "assets/img/cuenco-color.jpg",
      location: "Costa Atlántica, UK",
      year: "2026",
      type: "Soporte Dérmico y Cognitivo",
      batch: "Lote 03-V / Raciones de 500 g",
      status: "Disponible para suscripción activa",
      collaboration: "Comité de Nutrición Veterinaria Independiente",
      description: "Captura salvaje de pescado blanco combinada con microalgas marinas, rica en ácidos grasos esenciales para la salud neurológica y cutánea.",
      approach: "Perfil lipídico diseñado para la función cognitiva y la barrera dérmica. Los ácidos grasos Omega se preservan mediante cocción a baja temperatura, evitando su oxidación.",
      credits: "Dirección Científica: Dr. M. Aris · Selección de Materia Prima: Equipo Agrícola Asociado.",
      prev: "kura", next: "alpha"
    }
  };

  const detalle = document.getElementById("detalle");
  if (detalle) {
    const params = new URLSearchParams(window.location.search);
    const clave = (params.get("f") || "alpha").toLowerCase();
    const d = FORMULAS[clave] || FORMULAS.alpha;

    function set(id, valor) {
      const el = document.getElementById(id);
      if (el) el.textContent = valor;
    }
    document.title = d.nombre + " · Raíces Naturales";
    const img = document.getElementById("detImg");
    if (img) { img.src = d.img; img.alt = d.nombre; }
    set("detNombre", d.nombre);
    set("detMeta", d.meta);
    set("detLocation", d.location);
    set("detYear", d.year);
    set("detType", d.type);
    set("detBatch", d.batch);
    set("detStatus", d.status);
    set("detCollab", d.collaboration);
    set("detDesc", d.description);
    set("detApproach", d.approach);
    set("detCredits", d.credits);

    const prev = document.getElementById("detPrev");
    const next = document.getElementById("detNext");
    if (prev) {
      prev.href = "formula.html?f=" + d.prev;
      const pv = prev.querySelector(".v");
      if (pv) pv.textContent = FORMULAS[d.prev].nombre;
    }
    if (next) {
      next.href = "formula.html?f=" + d.next;
      const nv = next.querySelector(".v");
      if (nv) nv.textContent = FORMULAS[d.next].nombre;
    }
  }

  /* ---------------------------------------------------------------
     9. FORMULARIO DE CONTACTO (contacto.html)
     Validación + estado de éxito (sin backend).
     --------------------------------------------------------------- */
  const form = document.getElementById("formContacto");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const exito = document.getElementById("formExito");
      form.hidden = true;
      if (exito) {
        exito.hidden = false;
        exito.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });
  }
})();
