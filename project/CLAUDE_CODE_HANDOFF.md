# Prometheus Tools Site — Handoff to Claude Code

You are building a customer-facing website that hosts three AI tool "wrappers." The wireframes are in `Wireframes.html`. This file is the part of the brief that lives outside the wireframes — read it first.

---

## What you're building

A small site with one home page and three tool pages. Home is an editorial scroll with three large clickable rows. Each row opens its own tool, which is a chat-style UI around a constrained AI workflow.

- **Tool 01 — Rank Buddy.** Live. SEO + AIO auditor with strict no-hallucination rules.
- **Tool 02 — Workflow Two.** Placeholder. Same shell as Rank Buddy when content arrives.
- **Tool 03 — Workflow Three.** Placeholder. Same as 02.

The aesthetic is the existing **Prometheus** brand (separate repo: `MSizzle/brand-book`). Pull tokens, fonts, and the conic-gradient orb from there. Do not invent new colors or type.

---

## Files in this handoff

| File | What it is | What to do with it |
|---|---|---|
| `Wireframes.html` | The wireframe doc. Open it in a browser to see screen states + annotations. | Reference. Don't ship its CSS. |
| `wireframe.css` | Wireframe scaffolding only (dashed borders, frame chrome). | **Discard.** Production styles come from the brand book. |
| `frames-home.jsx`, `frames-tools.jsx` | React components used by the wireframe doc. | **Reference for layout / copy / structure**, not production code. They use inline styles and rough numbers. Rebuild cleanly. |
| `fonts.css` | Local @font-face declarations for Instrument Serif / DM Sans / JetBrains Mono. | Use as a starting point or load the same files from the brand book. |
| `assets/color/brand.css` | Canonical Prometheus tokens. | **Use directly.** This is the source of truth for color and gradients. |
| `assets/type/` | TTF font files (Instrument Serif, DM Sans, JetBrains Mono). | **Use directly.** |
| `tweaks-panel.jsx`, `deck-stage.js` | Tooling for the wireframe doc. | Discard. |

---

## Stack assumptions (override only with reason)

- **Framework:** Next.js (app router). Server components for marketing pages, client components inside the chat shell.
- **Styling:** plain CSS or Tailwind — your call. Either way, consume the brand-book tokens via `assets/color/brand.css` (CSS custom properties) so they stay portable.
- **AI:** server-side. Strict-mode system prompts live in versioned files in the repo (`prompts/rank-buddy.v1.txt` etc.), never in client code.
- **Streaming:** SSE or fetch streams from a route handler (e.g. `/api/rank-buddy/stream`). The chat client reads chunks and renders message variants as they arrive.
- **PDF:** server-side render with `react-pdf` or `puppeteer`. Same data source as the right-rail preview, so the preview and the downloaded file never diverge.
- **Auth:** magic-link only (Auth.js + Resend, or Clerk's email-link flow). **Guest mode must work end-to-end without sign-in.** Sign-in only saves reports.
- **Storage:** Postgres or SQLite for users + saved reports. Guest reports get a temporary id and expire after N days.

---

## Routes

```
/                          home — three rows
/tools/rank-buddy          Rank Buddy chat shell
/tools/rank-buddy/r/[id]   saved/shared report (works for guest temp ids too)
/tools/workflow-two        placeholder shell
/tools/workflow-three      placeholder shell
/sign-in                   magic-link page (modal is just a wrapper)
/api/rank-buddy/stream     POST { url } → SSE stream of trace + score
/api/rank-buddy/pdf        GET ?id=... → PDF
```

---

## The three things easy to get wrong

### 1. Three distinct assistant message variants

The chat thread is **not** a stream of identical bubbles. Implement three renderers and dispatch on a `kind` field in the streamed message:

- `kind: "question"` — Display question. Instrument Serif italic, large (~1.6rem), no bubble background. Used for "Paste your website URL." Feels editorial, not chatty.
- `kind: "trace"` — System trace. JetBrains Mono, small (~0.78rem), muted color, line-by-line. Used for `browsing /home`, `opening /about · OK`, etc.
- `kind: "score"` — Structured output card. Boxed, has the 0–100 numeral large in flame, plus "Doing well" / "Needs work" / "Top 3 fixes" sections. Not free text.

If you collapse these into generic bubbles you've lost the design.

### 2. Strict-mode behavior is not optional

Rank Buddy's system prompt (the one the user provided in the original brief) has hard rules. They are product, not flavor:

- Only score what's verifiable. Use "Not detected on reviewed pages" otherwise.
- Never assume traffic, backlinks, rankings, or invent tools/metrics.
- SEO scoring runs first. AIO is a second optional pass, **gated on user "yes."**
- PDF generation only after both stages, or after explicit user request.

Store the prompt in `prompts/rank-buddy.v1.txt` and version it. Bumping the prompt = new file, not in-place edit. Log which version produced each saved report.

### 3. Three transition options, build C first

Section 02 of the wireframes shows three click→open behaviors. Ship in this order:

1. **Build C first** — real routes per tool. Hard navigation. This is required anyway for direct linking, sign-in redirects, SEO, and refresh resilience.
2. **Add A as a progressive enhancement** — when the user clicks from `/`, animate a FLIP-style expand from the row position before route-completion. Use the View Transitions API where available, fall back to no-anim.
3. **Skip B (the docked sidebar) for v1.** Only build it if usage data shows people hopping between tools mid-session.

Do not start with A. The animation makes refreshes and deep links awkward if the route isn't there underneath.

---

## Layout details the wireframes don't fully spell out

### Home page

- Max content width 1180px.
- Three rows stack vertically at every viewport. Don't try to make them columns on wide screens.
- Whole row = single `<a>`. No nested interactives. Hover state: border brightens to `--prom-flame-primary`, "Open →" tag translates ~4px.
- "Coming soon" rows are not disabled. They route to the placeholder shell.

### Rank Buddy

- Three columns desktop: history rail (~220px) / chat thread (1fr) / PDF preview (~260px).
- **Below ~900px viewport:** stack vertically. Order: chat thread → PDF preview (collapsible) → history rail (drawer behind a button). The right rail must never clip horizontally.
- History rail "+ New audit" button is flame primary. List items use a 2px left border in flame for the active item.
- Input bar is sticky to the bottom of the chat column, not the viewport.
- The PDF preview uses **cream theme** (`--prom-bg-cream`, `--prom-text-ink`) — it's a window into a print artifact, so it stays light even when the rest of the app is dark.

### Sign-in nudge

- Triggered after the **first** completed audit, not before.
- "Skip — keep using as guest" is equally weighted with "Send magic link" — it's a real choice, not a fine-print escape hatch.
- After the user signs in, retroactively attach any in-progress guest report to their account.

---

## Copy & tone

- Eyebrow text: JetBrains Mono, uppercase, ~0.15em letter spacing, flame color. Always short.
- Headlines: Instrument Serif, weight 400. Italics are deliberate — only on emphasis words ("do the work", "exhale", etc.). Don't decorate.
- Body: DM Sans, 400/500. Plainspoken. No marketing fluff.
- Empty states for placeholder tools say what's coming, not "this page intentionally left blank."

---

## Brand book quick reference

```css
/* Colors */
--prom-bg-primary:   #151515;  /* default canvas */
--prom-bg-deep:      #0E0E0E;  /* contrast sections */
--prom-bg-glow:      #2E1D17;  /* radial glow stop behind hero */
--prom-bg-cream:     #EFEBE8;  /* light surfaces, PDF preview */
--prom-text-cream:   #F0EAE0;  /* body on dark */
--prom-text-ink:     #1C1C1C;  /* body on cream */
--prom-flame-primary:#FF5B23;  /* CTA, accents, eyebrows */

/* Type */
--prom-font-display: "Instrument Serif", Georgia, serif;
--prom-font-body:    "DM Sans", system-ui, sans-serif;
--prom-font-mono:    "JetBrains Mono", Menlo, monospace;

/* Logo orb */
background: conic-gradient(
  from 0deg at 50% 50%,
  #FF5B23 0deg, #C72B1E 90deg, #D94217 180deg,
  #FE8131 270deg, #FF5B23 360deg
);
```

Dark is default. Cream is the exhale. Don't flip that ratio without a reason.

---

## Definition of done for v1

- [ ] `/` renders the three rows. Live row visually differentiated. Click navigates to `/tools/...`.
- [ ] `/tools/rank-buddy` accepts a URL, streams the trace, renders the score card, generates a PDF, and offers inline preview + download.
- [ ] AIO is gated on a user "yes" and only after SEO completes.
- [ ] Strict-mode rules are enforced in the system prompt and the prompt is versioned in-repo.
- [ ] Guest flow works end-to-end without auth. Sign-in is offered post-first-audit, never required.
- [ ] Placeholder shells exist at `/tools/workflow-two` and `/tools/workflow-three` with "Notify me" CTA.
- [ ] Mobile: home rows stack, Rank Buddy reflows to single-column with PDF preview collapsible.
- [ ] Lighthouse: a11y ≥95, no horizontal scroll at any width.

---

## Out of scope for v1

- Workflow Two and Workflow Three's actual functionality (placeholders only).
- Account dashboard. Saved reports are accessed by direct URL until v2.
- Team / billing / sharing UI.
- Custom domains / white-label.

If a request feels like scope creep against this list, surface it instead of building it.
