# Complete Spec — 4 Portfolio SPA Themes

> Each theme is a distinct world. The goal is that switching themes changes everything: how space feels, how text reads, how the page moves, how close or distant the content feels. Not just colors — the entire emotional register.

---

## Shared across all themes

- Light and dark mode, toggled from the navbar. Default follows `prefers-color-scheme`.
- Sticky navigation with smooth scroll between sections.
- Fully responsive (mobile-first).
- Subtle scroll-triggered animations (Intersection Observer) and hover feedback.
- Sections: Hero → About → Skills → Projects → Experience → Contact → Footer

---

---

# Theme 1 — Minimal

## General philosophy

The content is the design. Nothing exists without a reason. If a decorative element can be removed without the visitor losing information, it goes. White space isn't emptiness — it's breathing room. The page should feel like a contemporary art gallery, not a résumé.

But minimalism done purely as style is cold and forgettable. This theme earns its restraint by being _warm_. The paper-toned background, the serif type, the photo that warms to color on hover — these are human touches that tell visitors they're reading about a real person, not scanning a spec sheet.

**Emotional arc:** The visitor lands in silence and clarity → trusts the author's taste → reads carefully, unhurried → reaches the contact section feeling like they already know the person.

**Entry feeling:** quiet confidence. Like opening a well-designed book.

---

## Typography

Typography _is_ the design in this theme. All visual weight falls on it.

| Use                           | Font                                     | Style                                         |
| ----------------------------- | ---------------------------------------- | --------------------------------------------- |
| Primary headings (H1, H2)     | `Playfair Display` or `DM Serif Display` | Regular (400), no artificial bold             |
| Body, labels, nav             | `DM Sans` or `Sora`                      | Light (300) for body, Medium (500) for labels |
| Monospace (tech stack, dates) | `JetBrains Mono`                         | Regular, small size                           |

- **H1 hero:** 72–96px, weight 400, line-height 1.05, tracking -0.02em
- **Body:** 16px, weight 300, line-height 1.8 — generous leading makes prose feel like an invitation to read
- **Labels / overlines:** 11px, uppercase, letter-spacing 0.12em, muted color
- **Hierarchy:** achieved through size and color, never aggressive bold

---

## Color palette

### Light mode

| Token              | Value     | Use                                      |
| ------------------ | --------- | ---------------------------------------- |
| `--bg`             | `#F9F8F5` | Main background (warm white, never pure) |
| `--bg-surface`     | `#FFFFFF` | Cards, navbar                            |
| `--text-primary`   | `#141414` | Headings                                 |
| `--text-secondary` | `#555550` | Body                                     |
| `--text-muted`     | `#999990` | Labels, metadata                         |
| `--border`         | `#E5E4DF` | Dividers                                 |
| `--accent`         | `#141414` | Active links, CTAs (monochromatic)       |

### Dark mode

| Token              | Value     | Use                               |
| ------------------ | --------- | --------------------------------- |
| `--bg`             | `#0E0E0C` | Background (warm black, not pure) |
| `--bg-surface`     | `#161614` | Cards, navbar                     |
| `--text-primary`   | `#F0EFE8` | Headings                          |
| `--text-secondary` | `#A8A89E` | Body                              |
| `--text-muted`     | `#666660` | Labels, metadata                  |
| `--border`         | `#2A2A26` | Dividers                          |
| `--accent`         | `#F0EFE8` | Active links, CTAs                |

> **Principle:** nearly monochromatic. No vivid accent colors. Contrast comes from the warm black/white and the unexpected serif type. The warmth in the tone values (`#F9F8F5`, `#0E0E0C`) is what saves it from feeling sterile.

---

## Layout and spacing

- **Max container:** 720px centered. No more. The narrow width is intentional — it forces vertical reading and feels like a literary publication.
- **Horizontal padding:** 24px on mobile, 0 on desktop (the container already centers).
- **Vertical padding between sections:** 120px. Generous, almost uncomfortable — that pause _is_ the design.
- **Projects grid:** 1 column mobile, 2 columns desktop. No masonry, no asymmetry.
- **Navbar:** name in serif lowercase + links in small uppercase + toggle. No opaque background — transparent with `backdrop-filter: blur(8px)` only on scroll.

---

## Section by section

### Hero — "First impression as an introduction, not a broadcast"

- No background image, no illustrations, no particles.
- Overline: the person's role (e.g. `"Product Engineer"`) in 11px uppercase muted. One line. Sets context fast.
- H1: full name in serif, 80–96px, weight 400, 2–3 lines if needed. The name earns the space.
- Bio: 2 sentences maximum — written in first person, warm and direct. Not "I am a developer." Something like: _"I build interfaces people actually enjoy using. Lately obsessed with performance and the craft of type."_
- CTA: text only with `border-bottom: 1px solid currentColor`. No filled buttons.
- Scroll indicator: a 40px vertical line that fades in and out gently (no arrow).

### About — "The human behind the work"

- Two columns on desktop: photo left (square, no border-radius), text right.
- Photo in grayscale. On hover: color — smooth 0.6s transition. This is the single most memorable interaction on the page. It says: _there's a real person here._
- Text is prose, not bullets. It can include opinions, context, why this work matters. Not a skills list — that's for the Skills section.
- Optional: one short quote that sounds like the person, not a productivity slogan.

### Skills — "Craft, stated plainly"

- A horizontal run of technologies separated by `·`.
- No progress bars, no percentages, no colored badges. Just text.
- Example: `React · TypeScript · Node.js · PostgreSQL · Figma`
- The restraint here is intentional — it communicates confidence without needing to rank oneself.

### Projects — "Show, then tell"

- 2-column grid. Each card: image top + title + 2-line description + tech stack in small mono.
- No shadows, no elevation. Hover: `opacity: 0.85` on the image.
- On card hover: a `→` appears next to the title.
- Description copy matters: each project description should say _what problem it solved_, not just what it is.

### Experience — "A story, not a list"

- Vertical timeline with a 1px `var(--border)` line.
- Each item: date in muted mono + company in medium weight + role + short description.
- The description should be 1–2 sentences that convey _impact_, not just duties. Example: _"Rebuilt the checkout flow — reduced drop-off by 18%."_
- No company logos, no icons.

### Contact — "An invitation"

- Large serif heading: _"Let's work together"_ or a variant that sounds genuine, not corporate.
- Email as a large text link — the link itself is the CTA.
- Optional: 1-line note about what kind of work the person is open to. Makes it easier for the visitor to self-qualify. Example: _"Currently open to senior roles and interesting side projects."_
- No form. Total simplicity.

---

## Animations and micro-interactions

- **Section entry:** fade + translateY(20px) → translateY(0), duration 0.6s, ease-out, stagger between elements.
- **Navigation links:** underline grows from the left (`scaleX` transform).
- **Cursor:** default. No custom cursor.
- **Page transitions:** none. Instant section switch.

---

## Patterns and textures

- None. Zero decoration.
- The only "pattern" allowed is the timeline's vertical line.

---

## What makes it distinctive

1. Serif type in a developer portfolio is unexpected — it signals design literacy.
2. The 720px max-width feels like reading a book, not scanning a webpage.
3. The grayscale → color photo hover is the single "effect" people remember and mention.
4. Plain-text CTAs without button backgrounds project a quiet confidence most portfolios lack.
5. The warmth in the tone values (`#F9F8F5`, not `#FFFFFF`) prevents the cold, clinical feeling that kills otherwise clean designs.

---

---

# Theme 2 — Modern Tech

## General philosophy

This is a declaration of technical ability. The interface itself must prove that the developer commands complex animations, effects, and visual composition. Dark by default because advanced technology lives at night. Every element has energy.

But "tech aesthetic" portfolios often collapse into pure performance: impressive to look at for 10 seconds, forgettable after. This theme avoids that trap by building in _narrative_. The animations aren't decoration — they sequence the story. The typewriter text in the hero isn't a trick — it's an invitation. The visitor should feel like they're being _shown something_ at every scroll position, not just impressed by a demo reel.

**Emotional arc:** Visitor lands in awe at the craft → gets pulled in by the motion → begins to trust the technical depth → by Projects they're reading seriously → Contact feels like an access request granted.

**Entry feeling:** power, velocity, precision. Like watching a live deployment go green.

---

## Typography

| Use               | Font                                     | Style                         |
| ----------------- | ---------------------------------------- | ----------------------------- |
| Headings (H1, H2) | `Space Grotesk` or `Bricolage Grotesque` | Bold (700), negative tracking |
| Body              | `Inter` or `IBM Plex Sans`               | Regular (400)                 |
| Code / tech stack | `JetBrains Mono` or `Fira Code`          | With ligatures                |
| Labels / badges   | `Space Mono`                             | Uppercase, small              |

- **H1 hero:** 80–112px, weight 700–800, tracking -0.03em. Occasionally split across two lines with different sizes.
- **Body:** 15px, weight 400, line-height 1.65.
- **Special effect:** 1–2 key words in the H1 can use a neon accent color. Not the whole title — just the word that matters most.

---

## Color palette

### Dark mode (default and dominant)

| Token              | Value       | Use                                          |
| ------------------ | ----------- | -------------------------------------------- |
| `--bg`             | `#080C10`   | Deep background (blue-black, not pure black) |
| `--bg-surface`     | `#0F1620`   | Cards, navbar                                |
| `--bg-elevated`    | `#1A2535`   | Cards on hover, inputs                       |
| `--text-primary`   | `#E8EFF5`   | Headings                                     |
| `--text-secondary` | `#8A9BB0`   | Body                                         |
| `--text-muted`     | `#4A5A70`   | Metadata                                     |
| `--border`         | `#1E2D40`   | Normal borders                               |
| `--border-glow`    | `#00D4FF40` | Glowing borders (cyan with opacity)          |
| `--accent-cyan`    | `#00D4FF`   | Primary accent                               |
| `--accent-violet`  | `#8B5CF6`   | Secondary accent                             |
| `--accent-green`   | `#00FF88`   | Tertiary accent (success, online status)     |

### Light mode

| Token             | Value     | Use                          |
| ----------------- | --------- | ---------------------------- |
| `--bg`            | `#F0F4F8` | Background                   |
| `--bg-surface`    | `#FFFFFF` | Cards                        |
| `--accent-cyan`   | `#0095C8` | Darkened cyan for legibility |
| `--accent-violet` | `#6D3FD9` | Darkened violet              |

---

## Layout and spacing

- **Max container:** 1100px. Breathes more than Minimal.
- **Projects grid:** Bento layout. Some cards 2×1, some 1×1. Controlled asymmetry.
- **Vertical padding between sections:** 80–100px.
- **Navbar:** glassmorphism — `background: rgba(8,12,16,0.7)`, `backdrop-filter: blur(20px)`, `border-bottom: 1px solid var(--border-glow)`.
- **Section separators:** 1px horizontal lines with a gradient that fades at both ends.

---

## Section by section

### Hero — "Boot sequence"

- Background: subtle particle canvas (tsParticles or pure canvas), opacity 0.2. The particles shouldn't dominate — they should feel like a living atmosphere.
- Overline: monospace typewriter effect: `> Initializing portfolio...` — one line, then the name appears. Sequence matters: the visitor reads the setup before the reveal.
- H1: large name, then a rotating line below: _"Frontend Engineer / UI Architect / Creative Coder"_ cycling with a crossfade every 3s.
- Buttons: outlined, `var(--accent-cyan)` border, hover with glow `box-shadow: 0 0 20px var(--accent-cyan)40`.
- Decorational side column: slowly drifting binary numbers or coordinates, very low opacity. Atmosphere, not content.
- The bio is 2–3 lines of actual voice: _"I care about the milliseconds. And about the interfaces people don't notice because they just work."_

### About — "The operator behind the system"

- Photo with `clip-path` hexagonal or an animated border (rotating gradient around the photo).
- 2×2 stats grid: years of experience, shipped projects, etc. Counter animates on scroll. Keep the numbers real — if in doubt, use modest numbers. Inflated counters read as insecure.
- Skills as badges with accent colors — grouped, not strewn randomly.
- 2–3 sentences of personal voice. Not a mission statement. Something that could only be written by this person.

### Skills — "The arsenal"

- Scroll-animated progress bars, but with terminal aesthetics: `████████░░ 80%`.
- Grouped by category: Frontend / Backend / Tools. Each category has its accent color.
- On hover: tooltip with a single line of context — what this person has _done_ with this skill, not a definition.

### Projects — "Proof of work"

- Bento grid: 3 columns, varying card sizes.
- Each card: dark background + image with gradient overlay + floating tags + large title.
- Hover: `transform: translateY(-6px)`, glow shadow from that project's accent color.
- Status badge: `// live` in green or `// in progress` in amber.
- Filter tabs by category (text tabs, no aggressive styling).
- **Project descriptions are the most human part of this section.** Each should open with the problem: _"A client's booking system was losing 30% of users on mobile."_ One sentence on what was built. One sentence on the result.

### Experience — "The mission log"

- Horizontal timeline desktop (visual line), vertical on mobile.
- Timeline nodes: circles with neon border.
- Click or hover to expand: smooth animation.
- Each expanded entry has a "what changed because of this work" sentence — not just job duties. That's what separates senior from junior reading.

### Contact — "Access terminal"

- Simulated terminal: an input that looks like a console.
- On send: animated response _"Message received. Processing..."_ with code-style feedback.
- Alternative: glassmorphism-style form inputs.
- Below the terminal: plain-text links — email (primary), GitHub, LinkedIn. Some people won't want to use the fancy input.

---

## Animations and micro-interactions

- **Section entry:** fade + slight `blur(4px)` → `blur(0)`, duration 0.5s.
- **Card hover:** elevation + border glow.
- **Custom cursor:** small dot + trailing ring with delay (CSS or JS). Desktop only.
- **Scroll progress bar:** 2px line at the top of the viewport advancing with scroll, in cyan.
- **Navbar links:** on hover, neon underline + small flash.

---

## Patterns and textures

- **Subtle grid in hero:** CSS `background-image: linear-gradient(var(--border) 1px, transparent 1px)` — barely visible grid.
- **Radial gradient in hero:** center-out, accent color to transparent, very diffuse.
- **Noise texture:** `opacity: 0.025` over cards to remove the flat "plastic" feeling.

---

## What makes it distinctive

1. The Bento project layout demonstrates design judgment — not just engineering.
2. The glassmorphic navbar in dark mode reads as premium with minimal effort.
3. The custom cursor is the detail people mention when they share the portfolio.
4. The typewriter effect is expected — what's different is the _rotating role line_ under the name.
5. The narrative project descriptions turn a visual demo into a case study.

---

---

# Theme 3 — Professional

## General philosophy

This is a portfolio for someone aiming at serious roles, communicating seniority, or reaching corporate clients. The interface says: _"I know what I'm doing, I've done it well, and I can do it again."_ No visual tricks, no experimental effects. Structure is the message. It should look like a well-considered software product.

But "professional" can easily become "lifeless." Most portfolios in this category look like LinkedIn printed to HTML — technically correct, humanly inert. This theme avoids that by treating every section as a _decision made by a person with taste_, not a template filled in. The typography is tight and purposeful. The layout is confident. And beneath the structure, there's a clear voice: a senior engineer who knows their worth and communicates it plainly.

**Emotional arc:** Visitor arrives with a question (_"Is this person legit?"_) → Hero answers with evidence, not hype → About and Skills build context → Projects prove the claims → Experience closes the case → Contact is a natural next step, not a leap of faith.

**Entry feeling:** structure, trust, executive clarity. Like reading a pitch deck that you actually want to finish.

---

## Typography

| Use                | Font                                                     | Style          |
| ------------------ | -------------------------------------------------------- | -------------- |
| Headings (H1, H2)  | `Plus Jakarta Sans` or `Neue Haas Grotesk`               | SemiBold (600) |
| Body               | `Plus Jakarta Sans` (same family, lighter weight)        | Regular (400)  |
| Data, dates, stats | Tabular numbers via `font-variant-numeric: tabular-nums` | Medium (500)   |

- Using a single font family across all weights is a mark of design maturity. No "body font" vs "heading font" split.
- **H1 hero:** 56–72px, weight 600, tracking -0.01em. More composed than Minimal.
- **Body:** 15px, weight 400, line-height 1.65.
- **Label hierarchy:** 12px, weight 500, uppercase, letter-spacing 0.08em.

---

## Color palette

### Light mode

| Token              | Value     | Use                                                         |
| ------------------ | --------- | ----------------------------------------------------------- |
| `--bg`             | `#FFFFFF` | Background                                                  |
| `--bg-surface`     | `#F7F7F8` | Alternating sections, cards                                 |
| `--bg-dark`        | `#0F1929` | Hero section (dark-on-light creates section-level contrast) |
| `--text-primary`   | `#0D1117` | Headings                                                    |
| `--text-secondary` | `#4A5568` | Body                                                        |
| `--text-muted`     | `#A0AEC0` | Metadata                                                    |
| `--border`         | `#E2E8F0` | Borders                                                     |
| `--accent`         | `#2563EB` | Professional blue                                           |
| `--accent-light`   | `#EFF6FF` | Badge backgrounds, highlights                               |

### Dark mode

| Token              | Value     | Use                           |
| ------------------ | --------- | ----------------------------- |
| `--bg`             | `#0D1117` | Background (GitHub dark feel) |
| `--bg-surface`     | `#161B22` | Cards, surfaces               |
| `--bg-elevated`    | `#21262D` | Elevated cards                |
| `--text-primary`   | `#F0F6FC` | Headings                      |
| `--text-secondary` | `#8B949E` | Body                          |
| `--border`         | `#30363D` | Borders                       |
| `--accent`         | `#58A6FF` | Blue in dark mode             |

---

## Layout and spacing

- **Desktop sidebar structure:** fixed 240px left sidebar + main content. Mobile: normal top navbar.
- **Max container:** 960px (sidebar + content).
- **Projects grid:** 2–3 uniform-column grid. No asymmetry.
- **Vertical padding between sections:** 80px.
- **Alternating sections:** one section on `--bg`, the next on `--bg-surface`. Creates rhythm without relying on color.

---

## Section by section

### Hero — "First impression as a brief"

- **Always dark**, regardless of color mode. The hero has its own `--bg-dark` background. The darkness makes the name land hard — a section break disguised as design.
- Professional circular photo with a subtle gradient ring. Real, current, good lighting.
- Name + current role + status line: _"Open to senior roles"_ or _"Currently at [Company]"_ — one fact, stated simply.
- 3–4 stat chips in a horizontal row: `5 yrs exp` / `23 shipped products` / `8 clients` / `Available ●` (pulsing green dot for availability). Keep numbers honest — conservative metrics read as senior; inflated numbers read as junior.
- Buttons: "View projects" (filled, blue) + "Download CV" (outlined).
- The hero should answer: _who are you, what do you do, are you available?_ — in under 5 seconds.

### About — "Context and credibility"

- Two columns: prose left, data cards right.
- Data cards: large number + label. E.g.: `5+` / `years of experience`, `23` / `products shipped`. Let the numbers do work, not the superlatives.
- Prose: 3–4 paragraphs in active voice. Not a list of adjectives. Write _about the work_ — what kinds of problems this person solves, what they care about, where they want to go. One short sentence in each paragraph should be unexpectedly direct.

### Skills — "Capability, organized"

- Tabbed view: `Frontend` / `Backend` / `DevOps` / `Soft Skills`.
- Each skill: icon + name + text level (`Senior`, `Intermediate`). No numeric progress bars.
- 3–4 column grid per tab.
- No skill should appear more than once (no "JavaScript" and "ES6" as separate entries).

### Projects — "The case studies"

- Filter tabs: `All` / `Frontend` / `Full-stack` / `Open Source`.
- Each card: image + category badge + title + short description + links (GitHub, Live).
- Card hover: subtle elevation (`box-shadow`), no glow.
- **Description structure:** 1 line on the problem, 1 line on the approach, 1 line on the outcome. Repeat across every project — consistency reads as discipline.
- Even for side projects: _why_ does it exist? One sentence.

### Experience — "The evidence"

- **Double column timeline:** Experience left, Education right. Side by side on desktop.
- Each item: company logo if available + role + company + dates + 2–3 bullets.
- Bullets use `—`, not emojis or complex icons. Bullet copy = outcome-first: _"Reduced API response time by 40% through query optimization and caching."_ Never _"Responsible for API optimization."_
- Gap awareness: if there's a gap in the timeline, it can be visible and that's fine. Real people have gaps.

### Contact — "The next step"

- Complete form: name + email + subject + message.
- Labels above each field (not placeholder-only — placeholders disappear when typing and confuse users).
- Submit button with loading state.
- Contact sidebar: email + LinkedIn + GitHub as links with icons — for people who prefer direct outreach.
- Optional: a one-liner above the form saying what kind of inquiries are welcome. Sets expectations and reduces noise.

---

## Animations and micro-interactions

- **Section entry:** simple fade, duration 0.4s. Nothing dramatic.
- **Card hover:** `translateY(-3px)` + more pronounced shadow.
- **Active state in sidebar:** current section link gets `border-left: 3px solid var(--accent)` + `--accent-light` background.
- **Available dot:** slow `@keyframes pulse`, like a traffic light.
- **No custom cursor, no particles, no text effects.**

---

## Patterns and textures

- No visible textures.
- The pattern is structural: the sidebar/content division _is_ the pattern.
- Separators: `border-top: 1px solid var(--border)` only.

---

## What makes it distinctive

1. The side navbar on desktop is rare in portfolios — it signals "product thinking," not "template filling."
2. The hero always dark regardless of mode creates a strong first impression and a memorable section transition.
3. The double-column timeline (experience + education) side by side is more informative and visually more mature than a simple list.
4. The "available" green dot is the only vivid color element — and it carries concrete meaning, not decoration.
5. Outcome-first bullet copy in Experience is the single change that most separates this from generic portfolios.

---

---

# Theme 4 — Vaporwave

## General philosophy

This portfolio is an interactive artwork. It doesn't follow corporate design rules — because those rules were written before the internet, before monitors, before digital dreams. Each section is a _scene_: the visitor travels through distinct environments while scrolling. It's irresistible, memorable, and entirely authentic.

But aesthetic-first portfolios often fail as portfolios — all vibe, no substance. The trap is putting so much energy into the atmosphere that the actual work gets buried. This theme earns its extravagance by making the content _the star_ of each scene. The skills section looks like a game inventory because that framing is more memorable — but every skill is real. The project cards look like VHS cassettes because it's surprising — but every description still answers: _what was the problem, what did I build, what changed?_ Personality is a competitive advantage. But only when the work can back it up.

**Emotional arc:** Visitor is stopped in their tracks by the hero → curious, they scroll expecting style with no substance → project section surprises them with actual depth → experience ties the aesthetic to real credentials → contact is the "this is too good not to reach out" moment.

**Entry feeling:** nostalgia for a future that never existed. Wonder. _"Who made this?"_

---

## Typography

Typography mixes eras deliberately — 80s display serif + modern sans + retro display, in deliberate contrast.

| Use                     | Font                               | Style                       |
| ----------------------- | ---------------------------------- | --------------------------- |
| H1 hero / main headings | `Bebas Neue` or `Anton`            | Regular, all-caps, enormous |
| H2 section headings     | `Viga` or `Righteous`              | Regular, retro character    |
| Body                    | `Space Grotesk`                    | Regular 400                 |
| Labels, metadata        | `Space Mono`                       | Terminal character          |
| Accent / quotes         | `Dancing Script` or italic cursive | Unexpected contrast         |

- **H1 hero:** 100–140px, all-caps, tracking 0. Scale is the statement.
- **Body:** 15px, weight 400, line-height 1.7.
- **Technique:** some H1 words can use `color: transparent; -webkit-text-stroke: 2px var(--accent)` — outlined text, retro-poster style.

---

## Color palette

### Dark mode (default and dominant)

| Token               | Value                                   | Use                   |
| ------------------- | --------------------------------------- | --------------------- |
| `--bg`              | `#1A0533`                               | Deep purple           |
| `--bg-surface`      | `#2D0D5C`                               | Surfaces, cards       |
| `--text-primary`    | `#F5E6FF`                               | Text on dark          |
| `--text-secondary`  | `#C4A0E8`                               | Secondary text        |
| `--pink`            | `#FF2DAF`                               | Primary neon pink     |
| `--cyan`            | `#00FFFF`                               | Bright cyan           |
| `--yellow`          | `#FFE600`                               | Neon yellow           |
| `--lavender`        | `#C77DFF`                               | Lavender              |
| `--gradient-sunset` | `#FF6B6B → #FF2DAF → #C77DFF → #4EA8DE` | Hero section gradient |
| `--grid-color`      | `rgba(0, 255, 255, 0.15)`               | Retro grid line color |

### Light mode

| Token            | Value     | Use                          |
| ---------------- | --------- | ---------------------------- |
| `--bg`           | `#FDF0FF` | Very pale lavender           |
| `--bg-surface`   | `#FFFFFF` | Cards                        |
| `--text-primary` | `#2D0D5C` | Dark text                    |
| `--pink`         | `#D1007A` | Darkened pink for legibility |
| `--cyan`         | `#0096A0` | Darkened cyan                |

---

## Layout and spacing

- **No fixed container:** each section uses its own layout — full-width or restricted, depending on the scene.
- **Sections as scenes:** each has its own background, decoration, and composition.
- **Projects grid:** VHS cassette or game cartridge cards.
- **Vertical padding:** variable — some sections deliberately close to create tension, others open for air.
- **Layout-breaking elements:** images or text that overflow the container, elements that overlap between sections. These are intentional — they make the page feel alive.

---

## Section by section

### Hero — "The opening scene"

- **Background:** perspective grid animation (retrowave floor) via CSS — converging lines that slowly move toward the viewer, looping infinitely.
- **Sky:** sunset gradient bottom-to-top: `#0A0015 → #4A0080 → #FF2DAF → #FF8C42`.
- **Retro sun:** semicircle with horizontal stripes overlay (the vaporwave icon), yellow/orange.
- **H1:** name in Bebas Neue, enormous, with neon shadow: `text-shadow: 0 0 30px var(--pink)`. The name _glows_.
- **Subtitle:** Space Mono, small, blinking cursor effect. One line: role or short tagline. Actually _written_ — not placeholder text.
- **Decorative SVG:** palm tree or Greek statue silhouette.
- **CTA:** button with an animated rainbow border gradient. Hover: the rainbow spins faster.

### About — "The operator's desk"

- **Background:** very subtle checker pattern in purple tones (`repeating-conic-gradient`).
- Photo with glitch effect on hover — image duplication with color channel offset (CSS `filter: hue-rotate` + position shift). 0.3s, then snaps back. Feels like a video signal quirk.
- Text sits on a card styled as a Windows 95 window — decorative title bar with minimize/close buttons. The person's name is the window title. Content inside is real prose: a short paragraph in first person that sounds like talking, not writing-about-yourself.
- Personal quote in large italic below — one sentence that captures the person's actual voice.

### Skills — "The inventory"

- Presented as game achievement unlocks: each skill has a pixel-art icon (devicons work fine) + name + XP bar styled for RPG.
- XP bar: neon colors, fills on scroll with spring animation.
- Layout: game inventory grid of square icon cells with tooltips on hover.
- Tooltip content: _what_ this person has done with this skill, in plain language. Not a definition. Example: _"Built a real-time collaborative editor used by 8,000 daily active users."_

### Projects — "The VHS shelf"

Cards styled as VHS cassettes:

- Card background: dark texture with subtle CSS scanlines (`repeating-linear-gradient`).
- Cassette "label" with the project name in a cursive font (handwritten look).
- Rounded corners, plastic aesthetic.
- Hover: "track" effect — brief image glitch that settles, like inserting the cassette.
- Badge: `▶ PLAY` in green for live link, `</>` for GitHub.
- Section background: soft neon gradient.
- **Each cassette description:** one sentence on the problem, one on the tech, one on the moment it shipped and why it mattered. The tone should match the aesthetic — brief, direct, personal.

### Experience — "The geocities era chronicle"

- Timeline styled as an old internet timeline — forum-era or GeoCities aesthetic.
- Each job in a "postcard" with a pixel border (`border-image` with pixel SVG pattern).
- Dates large, in Space Mono.
- Separators: CSS `animation`-based blinking star or `-·-·-` divider — decorative, not content.
- Each postcard has a "postmark" stamp: the company name or city + year. Purely decorative but deeply nostalgic.
- Copy inside each postcard follows the same discipline as other themes: outcome-first bullets.

### Contact — "The chatroom"

- **IRC / AOL Instant Messenger aesthetic.** Window with title bar: _"new message from: [name]"_ or _"you've got mail."_
- Input styled as a retro chat field. Border glow in pink or cyan.
- On send: animated bot response — a few lines of pre-written reply that's warm and funny, not robotic. Example: _"Message received. I'll be in touch. (Please don't go anywhere, this is very exciting.)"_
- Easter egg: specific phrases trigger special responses. Small delight for curious visitors.
- Always include a plain-text escape hatch: _"Prefer email? [email]"_ below the chat window.

---

## Animations and micro-interactions

- **Hero grid:** moves toward the viewer in an infinite loop (`perspective` + `translateZ` in keyframes).
- **Section entry for project cards:** drops in from above with bounce (`cubic-bezier` with overshoot). Feels like the cassette being placed on the shelf.
- **Glitch on section headings:** hover triggers a 0.3s chromatic aberration — text shifts red + cyan. Not on idle — only on hover, so it stays surprising.
- **Custom cursor:** retro crosshair or 16×16 pixel cursor.
- **Parallax:** the hero sun moves at a different scroll speed than the grid.
- **Footer stars:** small static particles that blink slowly.

---

## Patterns and textures

Used in specific sections, never all at once — layering everything creates noise, not richness:

| Pattern          | CSS / Technique                                                                                     | Section           |
| ---------------- | --------------------------------------------------------------------------------------------------- | ----------------- |
| Perspective grid | `perspective` + animated CSS lines                                                                  | Hero              |
| Checker pattern  | `repeating-conic-gradient`                                                                          | About             |
| Scanlines        | `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)` | Project cards     |
| Starfield        | `box-shadow` with many points (CSS trick) or canvas                                                 | Footer / Contact  |
| Noise grain      | Pseudo-element at `opacity: 0.04`, SVG pattern                                                      | About, Experience |
| Pixel border     | `border-image` with 3×3 pixel SVG                                                                   | Experience cards  |

---

## What makes it distinctive

1. The perspective grid animation in the hero is the most recognizable image of the theme — nobody forgets it.
2. VHS cassette project cards are unique in the dev portfolio space — and the descriptions inside are still substantive.
3. The contrast between 140px type and 11px Space Mono metadata creates perfect visual tension.
4. The AIM/IRC contact section is the _moment_ that makes people share the portfolio.
5. The glitch effect only on hover is enough — not ambient, never noise. That restraint is what makes it land.
6. The About "Windows 95 window" grounds the nostalgia in something personal rather than just decorative.

---

---

# Summary — Real Differences Between Themes

|                         | Minimal                       | Modern Tech                        | Professional                        | Vaporwave                           |
| ----------------------- | ----------------------------- | ---------------------------------- | ----------------------------------- | ----------------------------------- |
| **Emotional target**    | Trust through restraint       | Awe, then depth                    | Confidence, then credibility        | Wonder, then substance              |
| **Container width**     | 720px                         | 1100px                             | 960px + sidebar                     | Full-width per scene                |
| **Heading font**        | Serif (Playfair)              | Bold grotesque (Space Grotesk)     | Modern sans (Plus Jakarta)          | Retro display (Bebas Neue)          |
| **Hero background**     | Empty warm white              | Particles + dark grid              | Always-dark solid                   | Animated perspective grid           |
| **Projects grid**       | 2 clean columns               | Asymmetric Bento                   | Uniform grid with filters           | VHS cassette cards                  |
| **Skills**              | Plain text list               | Terminal-style progress bars       | Tabs + icons + text levels          | RPG inventory + XP bars             |
| **Timeline**            | Thin vertical line            | Horizontal, neon nodes             | Double-column (exp + edu)           | GeoCities-era postcards             |
| **Contact**             | Large email link              | Simulated terminal                 | Full form + direct contacts sidebar | Retro AIM/IRC chat window           |
| **Cursor**              | Default                       | Custom (dot + trailing ring)       | Default                             | Retro pixel cursor                  |
| **Animations**          | Fade + gentle translateY      | Glow, blur, typewriter             | Minimal fade                        | Glitch, bounce drop, parallax       |
| **Decoration**          | None                          | Grid pattern + noise               | None                                | Checkers, scanlines, starfield, sun |
| **Human signal**        | Grayscale → color photo hover | Real narrative in project captions | Outcome-first bullet copy           | Real voice in Windows 95 About card |
| **Cantidad de colores** | 1 (monocromático)             | 3 acentos neón                     | 1 acento (azul)                     | 4–5 neones                          |
| **Modo predominante**   | Claro                         | Oscuro                             | Claro (hero oscuro)                 | Oscuro                              |
| **Vibe**                | Galería de arte contemporáneo | Dashboard de misión crítica        | Producto de software maduro         | Instalación artística interactiva   |
