/**
 * UnBati profile configuration.
 * Theme: Dark, artistic, like a studio at sunset.
 * Mood: Intimate, professional, no distractions.
 */

import type { ProfileConfig } from "@fachada/core/types/profile.types";

export const profileConfig: ProfileConfig = {
  theme: {
    style: "unbati",
    defaultMode: "light",
    enableStyleSwitcher: false,
    enableModeToggle: false,
  },
  about: {
    paragraphs: [
      "Soy Henrys Batista, conocido como UnBati. Artista autodidacta nacido en Young, Río Negro. Pinto paisajes uruguayos, homenajes al campo y escenas que me mueven.",
      "En Maldonado tatúo de forma personalizada, dibujando directo en la piel. Cada tatuaje es una colaboración: vos traés la idea, yo la hago realidad con precisión, higiene máxima y respeto.",
      "Más de 15 años creando. Material descartable. Del interior al mar — esto es Uruguay, esto es mi trabajo.",
    ],
  },
  skills: [
    {
      name: "Pintura",
      skills: [
        "Acrílico",
        "Óleo",
        "Aerografía",
        "Paisajes",
        "Retratos",
        "Composición",
      ],
    },
    {
      name: "Tatuaje",
      skills: [
        "Black & Grey",
        "Retratos",
        "Delicados",
        "Coberturas",
        "Diseño personalizado",
        "Higiene certificada",
      ],
    },
    {
      name: "Filosofía",
      skills: ["Seriedad", "Autenticidad", "Del interior", "Hecho a mano"],
    },
  ],
  sections: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    { id: "contact", enabled: true, order: 4 },
  ],
  contactMessage: "Escribime por WhatsApp o mandá un mail. Respondo rápido.",
};
