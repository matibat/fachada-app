/**
 * UnBati site configuration.
 * Brand: UnBati — Artist, Tattoo master, Uruguayan heart.
 * Name: Henrys Batista ("Bati")
 * Location: Young, Río Negro → Maldonado Tattoo Studio
 */

import type { SiteConfig } from "@fachada/core/types/profile.types";

export const siteConfig: SiteConfig = {
  name: "UnBati",
  title: "UnBati — Pintura y tatuaje con alma uruguaya",
  description:
    "Artista autodidacta. Pinturas de paisajes uruguayos y tatuajes personalizados. Desde Young hasta Maldonado. Más de 15 años creando.",
  author: "Henrys Batista",
  url: "https://unbati.uy",
  ogImage: "/og-image.png",
  social: {
    instagram: "https://instagram.com/unbati",
    blogger: "https://unbati.blogspot.com",
    whatsapp: "https://wa.me/59892095895",
    whatsappMessage: "Hola UnBati, me contacté desde tu web.",
    email: "hola@unbati.uy",
  },
  location: {
    city: "Maldonado · Montevideo",
    country: "Uruguay",
  },
  roles: [
    {
      id: "pinturas",
      title: "Pintor",
      specialties: [
        "Paisajes uruguayos",
        "Acrílico",
        "Óleo",
        "Aerografía",
        "Escenas rurales",
      ],
      featured: true,
      description:
        "Cuadros que cuentan historias. Desde el interior de Río Negro hasta las costas de Maldonado. Listos para colgar, con barniz protector.",
      about: {
        paragraphs: [
          "Pinto paisajes que me mueven: cielos del campo de Río Negro, costas de Maldonado, faros, vida rural. Cada cuadro es un recorte de Uruguay que podés llevarte a tu casa.",
          "Trabajo en acrílico, óleo y aerografía. Las obras salen barnizadas y listas para colgar. Hago envíos a todo el país y también trabajo por encargo si tenés una escena particular en la cabeza.",
          "Más de 15 años pintando. Autodidacta. Del interior — y eso se nota en el trabajo.",
        ],
      },
      skills: [
        {
          name: "Técnicas",
          skills: ["Acrílico", "Óleo", "Aerografía", "Lápiz", "Bolígrafo"],
        },
        {
          name: "Temáticas",
          skills: [
            "Paisajes",
            "Rural",
            "Costas",
            "Faros",
            "Retratos",
            "Por encargo",
          ],
        },
        {
          name: "Entrega",
          skills: [
            "Barniz protector",
            "Listo para colgar",
            "Envíos a todo Uruguay",
          ],
        },
      ],
    },
    {
      id: "tatuajes",
      title: "Tatuador",
      specialties: [
        "Black & Grey",
        "Retratos",
        "Personalizados",
        "Coberturas",
        "Diseño directo en piel",
      ],
      featured: true,
      description:
        "Tatúo ideas que traés. Diseño directo en piel. Material descartable. Higiene máxima. Tu tatuaje, tu historia.",
      about: {
        paragraphs: [
          "Trabajo en Maldonado. Tatúo de forma 100% personalizada: vos traés la idea, yo la dibujo en tu piel. No uso plantillas genéricas — cada tatuaje es único.",
          "Me especializo en black & grey, retratos y diseños con detalle. También hago coberturas de tatuajes viejos. Si tenés algo en mente pero no sabés bien cómo plasmarlo, charlamos y lo resolvemos juntos.",
          "Todo material descartable. Higiene impecable. Seriedad desde el primer contacto hasta el cuidado post-tatuaje.",
        ],
      },
      skills: [
        {
          name: "Estilos",
          skills: [
            "Black & Grey",
            "Retratos",
            "Delicados",
            "Coberturas",
            "Realismo",
          ],
        },
        {
          name: "Proceso",
          skills: [
            "Diseño personalizado",
            "Dibujo en piel",
            "Sin plantillas genéricas",
          ],
        },
        {
          name: "Higiene",
          skills: [
            "Material descartable",
            "Equipo esterilizado",
            "Protocolo certificado",
          ],
        },
      ],
    },
  ],
  primaryRole: "pinturas",
  analytics: {
    plausibleDomain: "unbati.uy",
  },
};
