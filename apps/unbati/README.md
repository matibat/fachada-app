# UnBati — Pintura y Tatuaje

A portfolio for **Henrys Batista** ("UnBati"), artist and tattoo master from Uruguay.

## App Structure

```
unbati/
├── app.config.ts         # Main config aggregate
├── site.config.ts        # SEO, metadata, roles, social links
├── profile.config.ts     # Theme, about, skills configuration
├── pages/                # (To be filled with content pages)
└── blog/                 # (To be filled with blog posts)
```

## Configuration Overview

### Site Config (`site.config.ts`)

- **Brand**: UnBati (legal name: Henrys Batista)
- **URL**: unbati.uy
- **Location**: Maldonado, Uruguay (primary); Young, Río Negro (origin)
- **Roles**:
  - Pintor (Painter) — Landscape paintings, rural scenes, Uruguayan heritage
  - Tatuador (Tattoo Artist) — Black & grey, portraits, personalized designs
- **Contact**: WhatsApp (+598 92 095 895), Instagram

### Profile Config (`profile.config.ts`)

- **Theme**: Minimalist
- **Mode**: Dark (fixed, no toggle)
- **About**: 3 paragraphs of personal bio and philosophy
- **Skills**: Organized by Pintura, Tatuaje, Filosofía

### App Config (`app.config.ts`)

- Aggregates site + profile configs
- Sets theme layouts (centered hero, 3-column skills, card about section)
- Configures SEO metadata and OG image

## Next Steps

1. **Add theme colors** to the theme system for UnBati's dark palette:
   - Primary: #0F172A, Accent: #E2B38D, Secondary: #A3BFFA
   - Typography: Playfair Display (headings), Inter (body)

2. **Create page structure** (`pages/`) when ready to add:
   - Hero / Home
   - About (Quién soy)
   - Pinturas (gallery)
   - Tatuajes (gallery + process)
   - Blog / Historias
   - Contacto

3. **Add blog posts** (`blog/`) for SEO and storytelling.

4. **Upload assets**: Hero image, portfolio photos, OG image.

---

**Created**: Configuration only. Ready for content development.
