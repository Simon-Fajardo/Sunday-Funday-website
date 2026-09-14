/* =============================================================================
   SUNDAY FUNDAY · datos del negocio
   -----------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA PONER LA WEB EN MARCHA.

   Reemplaza los valores entre corchetes [ASÍ] por los datos reales.
   Al hacerlo, todos los enlaces y textos marcados de index.html y menu.html
   se actualizan solos (teléfono, Instagram, Google Maps, dirección, horarios).

   Lo que no se reemplace se queda visible como [PLACEHOLDER]: es intencional,
   para que nadie publique la web con datos inventados.
   ========================================================================== */
(function () {
  "use strict";

  window.__BRAND__ = {
    nombre: "Sunday Funday",
    desde: 2021,

    contacto: {
      /* Solo dígitos, con indicativo de país. Ej: "573001234567" */
      whatsapp: "[WHATSAPP]",
      /* Usuario sin la arroba. Ej: "sundayfunday" */
      instagram: "[INSTAGRAM]",
      /* Enlace corto del perfil de Google Maps del negocio */
      mapsUrl: "[GOOGLE_MAPS_URL]",
      /* Enlace de "Cómo llegar" (Google Maps → Indicaciones → Compartir) */
      mapsDirecciones: "[GOOGLE_MAPS_URL]",
      /* Solo la URL que aparece dentro de src="..." al copiar el código de
         Google Maps → Compartir → Insertar un mapa */
      mapaEmbedUrl: "[GOOGLE_MAPS_EMBED_URL]",
      telefono: "[TELÉFONO]",
      email: "[EMAIL]"
    },

    local: {
      nombreEnMaps: "Sunday Funday Cra. 7 Nariño Sur",
      direccion: "[DIRECCIÓN COMPLETA]",
      barrio: "Nariño Sur",
      ciudad: "Bogotá",
      region: "Bogotá D.C.",
      pais: "CO",
      horario: "[HORARIO]"
    },

    /* Mensaje con el que se abre WhatsApp al tocar el botón. */
    whatsappMensaje: "¡Hola Sunday Funday! Quisiera preguntar por ",

    /* La carta también vive en el HTML (para que funcione sin JavaScript).
       Esta copia sirve de referencia rápida y para futuros usos. */
    carta: [
      { id: "helados", nombre: "Helados", productos: ["Cono de helado suave"] },
      { id: "funday", nombre: "Funday & Sundaes", productos: ["Funday con 2 toppings", "Sundae", "Parfait"] },
      { id: "frutas", nombre: "Frutas", productos: ["Ensalada de frutas"] },
      { id: "cafe", nombre: "Café", productos: ["Cappuccino", "Mocaccino", "Americano", "Café Bombón", "Café Vienés", "Cappuccino con Baileys", "Té", "Té chai", "Aromática de frutas"] },
      { id: "postres", nombre: "Postres", productos: ["Brownie con helado", "Fresas con chocolate", "Affogato", "Oblea", "Torta de almojábana"] },
      { id: "frias", nombre: "Bebidas frías", productos: ["Frappé de café", "Malteada de frutos rojos", "Sodas saborizadas"] },
      { id: "especiales", nombre: "Especiales", productos: ["Aventura Azul"] }
    ]
  };
})();
