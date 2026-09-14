(function () {
  "use strict";

/* =============================================================================
   SUNDAY FUNDAY · main.js
   Cuatro sistemas de interacción y nada más:
     1. Navegación (cabecera fija + panel móvil)
     2. Reveal al hacer scroll
     3. Barra flotante "Cómo llegar" en móvil
     4. Parallax muy suave (solo si GSAP cargó)
   Todo el contenido vive en el HTML. Este archivo solo lo enriquece.
   ========================================================================== */

  var datos = window.__BRAND__ || {};
  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  /* Un valor tipo "[WHATSAPP]" todavía no ha sido reemplazado por el negocio. */
  function pendiente(valor) {
    return !valor || /^\s*\[.*\]\s*$/.test(String(valor));
  }

  function safe(fn, nombre) {
    try { fn(); } catch (e) { console.warn("[" + nombre + "]", e); }
  }

  /* ---------------------------------------------------------------------------
     1. Navegación
     ------------------------------------------------------------------------ */
  function initNav() {
    var cabecera = $("[data-cabecera]");
    var boton = $("[data-boton-menu]");
    var panel = $("[data-panel-menu]");

    if (cabecera) {
      var alFijar = function () {
        cabecera.classList.toggle("is-fija", window.scrollY > 24);
      };
      alFijar();
      window.addEventListener("scroll", alFijar, { passive: true });
    }

    if (!boton || !panel) return;

    var abierto = false;

    function enfocables() {
      return $$("a[href], button:not([disabled])", panel).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function abrir() {
      abierto = true;
      panel.classList.add("is-abierto");
      panel.removeAttribute("inert");
      boton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var primero = enfocables()[0];
      if (primero) primero.focus();
    }

    function cerrar(devolverFoco) {
      abierto = false;
      panel.classList.remove("is-abierto");
      boton.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (devolverFoco) boton.focus();
      // Se marca inert cuando termina la transición, para no robar el foco antes.
      window.setTimeout(function () {
        if (!abierto) panel.setAttribute("inert", "");
      }, 360);
    }

    panel.setAttribute("inert", "");
    boton.addEventListener("click", function () { abierto ? cerrar(true) : abrir(); });

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a[href]")) cerrar(false);
    });

    document.addEventListener("keydown", function (e) {
      if (!abierto) return;
      if (e.key === "Escape") { cerrar(true); return; }
      if (e.key !== "Tab") return;
      var lista = enfocables();
      if (!lista.length) return;
      var primero = lista[0];
      var ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });

    window.addEventListener("resize", function () {
      if (abierto && window.innerWidth >= 960) cerrar(false);
    });
  }

  /* ---------------------------------------------------------------------------
     2. Reveal al hacer scroll
     ------------------------------------------------------------------------ */
  function initReveals() {
    var objetivos = $$("[data-reveal]");
    if (!objetivos.length) return;

    function mostrarTodo() {
      objetivos.forEach(function (el) { el.classList.add("is-visible"); });
    }

    if (!("IntersectionObserver" in window)) { mostrarTodo(); return; }

    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visible");
        io.unobserve(entrada.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });

    objetivos.forEach(function (el) { io.observe(el); });

    // Red de seguridad: a los 6 s nada puede seguir invisible dentro de pantalla.
    window.setTimeout(function () {
      $$("[data-reveal]:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.2) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------------------
     3. Barra flotante en móvil
     ------------------------------------------------------------------------ */
  function initBarraMovil() {
    var barra = $("[data-barra-movil]");
    if (!barra) return;
    var disparador = $("[data-fin-hero]") || $(".hero");
    var limite = function () {
      return disparador ? disparador.offsetTop + disparador.offsetHeight * 0.7 : 500;
    };
    var actualizar = function () {
      barra.classList.toggle("is-visible", window.scrollY > limite());
    };
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
  }

  /* ---------------------------------------------------------------------------
     4. Datos del negocio (lib/manifest.js) → enlaces y textos del HTML
     ------------------------------------------------------------------------ */
  function initDatosNegocio() {
    var contacto = datos.contacto || {};
    var local = datos.local || {};

    var enlaces = {
      whatsapp: pendiente(contacto.whatsapp) ? null :
        "https://wa.me/" + String(contacto.whatsapp).replace(/\D/g, "") +
        "?text=" + encodeURIComponent(datos.whatsappMensaje || "Hola Sunday Funday"),
      instagram: pendiente(contacto.instagram) ? null :
        "https://instagram.com/" + String(contacto.instagram).replace(/^@/, ""),
      maps: pendiente(contacto.mapsUrl) ? null : contacto.mapsUrl,
      "maps-direcciones": pendiente(contacto.mapsDirecciones) ? null : contacto.mapsDirecciones,
      telefono: pendiente(contacto.telefono) ? null : "tel:" + String(contacto.telefono).replace(/[^\d+]/g, ""),
      email: pendiente(contacto.email) ? null : "mailto:" + contacto.email
    };

    $$("[data-enlace]").forEach(function (el) {
      var destino = enlaces[el.getAttribute("data-enlace")];
      if (!destino) return;
      el.setAttribute("href", destino);
      el.removeAttribute("aria-describedby");
    });

    var textos = {
      direccion: local.direccion,
      horario: local.horario,
      telefono: contacto.telefono,
      email: contacto.email,
      instagram: pendiente(contacto.instagram) ? null : "@" + String(contacto.instagram).replace(/^@/, ""),
      whatsapp: contacto.whatsapp
    };

    $$("[data-dato]").forEach(function (el) {
      var valor = textos[el.getAttribute("data-dato")];
      if (pendiente(valor)) return;
      el.textContent = valor;
      el.removeAttribute("data-pendiente");
    });

    // Mapa incrustado: solo si el negocio ya pegó la URL del embed.
    var marco = $("[data-mapa]");
    if (marco && !pendiente(contacto.mapaEmbedUrl)) {
      var iframe = document.createElement("iframe");
      iframe.src = contacto.mapaEmbedUrl;
      iframe.title = "Mapa de " + (local.nombreEnMaps || "Sunday Funday");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.setAttribute("allowfullscreen", "");
      marco.innerHTML = "";
      marco.appendChild(iframe);
    }

    var anio = $("[data-anio]");
    if (anio) anio.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------------
     5. Parallax muy suave (requiere GSAP; ±28 px como máximo)
     ------------------------------------------------------------------------ */
  function initParallax() {
    if (reducido) return;
    if (window.matchMedia("(max-width: 719px)").matches) return;

    $$("[data-parallax]").forEach(function (el) {
      var recorrido = parseFloat(el.getAttribute("data-parallax")) || 18;
      recorrido = Math.min(Math.abs(recorrido), 28) * (recorrido < 0 ? -1 : 1);
      window.gsap.fromTo(el,
        { y: recorrido },
        {
          y: -recorrido,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6
          }
        }
      );
    });
  }

  /* ---------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  function boot() {
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initBarraMovil, "initBarraMovil");
    safe(initDatosNegocio, "initDatosNegocio");

    if (window.gsap && window.ScrollTrigger) {
      try { window.gsap.registerPlugin(window.ScrollTrigger); } catch (e) { /* sin plugin */ }
      safe(initParallax, "initParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
