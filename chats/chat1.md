# Startup Website Design

_Started 2026-04-28 15:46 UTC_

---

## User

GitHub connected

## Assistant

Hey! GitHub's connected. Paste a github.com repo URL whenever you're ready — I can browse the structure and pull in specific files (components, themes, assets) to use as reference for design mockups.

## User

Brand book for our startup here: https://github.com/MSizzle/brand-book.git

This website is supposed to be customer-facing and will comprise of 3 GPT wrappers each for different tools that customers can use to use AI to help their business out. Described in pasted text. I imagine what would look good is not actually three circles but three large boxes in a prometheus styled webpage.

Ask me any questions you've got, and let's build this out using my instructiosn and the brand book. Eventually want to ship this out to Claude Code to build.

## Assistant

I'll grab the brand book and then ask some focused questions before we wireframe.

_[tool: github_list_repos]_

_[tool: github_get_tree]_

Let me read the core brand files and explore the structure.

_[tool: github_read_file]_

_[tool: github_read_file]_

_[tool: github_read_file]_

_[tool: github_get_tree]_

_[tool: github_get_tree]_

_[tool: github_get_tree]_

_[tool: github_read_file]_

_[tool: github_read_file]_

I have enough Prometheus brand context. Now let me ask focused questions before sketching wireframes.

_[tool: snip]_

_[tool: questions_v2]_

## User

Questions answered:
- homepage_layout: Three big horizontal cards, full-width, stacked vertically (editorial scroll)
- click_interaction: Explore a few options
- wrapper_ui_style: Classic chatbot — message bubbles, input at bottom
- workflow_naming: Use placeholders
- workflow_1_title: Rank Buddy - Assessing your SEO and AIO
- tone_of_copy: Decide for me
- auth_gate: Open with optional sign-in to save reports
- pdf_handling: Inline preview + download button
- wireframe_fidelity: Enough for Claude Code to cook
- include_workflow_wireframes: Homepage + all three workflow shells (W2/W3 as placeholders)
- branding_presence: Top-left of every page (standard)

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: github_import_files]_

Now let me check the brand.css and grab the deck_stage starter for the multi-page wireframe.

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

The user said "Enough for Claude Code to cook" — meaning these wireframes need to be detailed enough to hand off, but still loose. I'll go with a hybrid: clean grayscale-with-Prometheus-accents fidelity (keeps the brand DNA visible so Claude Code knows the target aesthetic), with annotation notes for engineering hand-off.

Plan:
- A scrollable single-page wireframe doc (not a deck — easier to read/print for handoff) with labeled sections
- Each section is a "frame" showing one screen state
- Annotations call out behavior, copy, components
- Tweaks panel: toggle between sketchy/clean fidelity, cycle through the 3 click→open transition variations, and toggle annotations

Let me build it.

_[tool: write_file]_

Now the main wireframe document. I'll structure it as a long scrollable handoff doc with labeled frames. Given size, I'll split into a few JSX files.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

## Assistant

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: done]_

_[tool: get_webview_logs]_

_[tool: read_file]_

_[tool: grep]_

_[tool: snip]_

`useTweaks` returns an array, not `{tweaks, setTweak}`. Let me fix.

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Wireframes shipped — `Wireframes.html`.

**What's in there**
- **01 Home** — three full-width rows; Rank Buddy gets the flame treatment, Workflows 02/03 are muted "Coming soon."
- **02 Click → open** — three transition options side-by-side (expand / dock / route). Recommended: build C, layer A on top.
- **03 Rank Buddy** — three-column chat shell (history · thread · live PDF preview), with separate message variants for display questions, mono traces, and the structured score card. Plus the optional sign-in nudge.
- **04 W2/W3** — placeholder shells that reuse the same chrome.
- **05 Handoff** — stack assumptions, route map, and the strict-mode rules Claude Code needs to wire up server-side.

**Tweaks panel** flips between on-brand and sketchy fidelity, hides the annotation pins, and lets you preview each homepage card in its "expanded/focused" state.

**Caveats**
- Rank Buddy's strict-mode prompt should live server-side and be versioned — wireframes assume but don't show that.
- Mobile layout isn't drawn; rows stack vertically and the three-column tool shell collapses to single-column. Worth a follow-up pass if you want it explicit before handoff.

## User

Verifier agent check completed

## Assistant

<i>Fixing the canvas overflow by widening the frame canvas (label moves above) and tightening the Rank Buddy grid.</i>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

<i>Now tighten the Rank Buddy grid columns and reposition annotations using percentages so they don't clip.</i>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

<i>Also fix the transition annotations and the other Annot positions, then verify.</i>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

<i>Verifying the fix.</i>

_[tool: snip]_

_[tool: fork_verifier_agent]_

<i>Fixed: frame labels now sit above each canvas (full doc width), Rank Buddy's three-column grid was tightened to fit narrower viewports, and all annotation pins now use percentages so they scale with the canvas.</i>

## User

Verifier agent check completed

## Assistant

<i>Bumping CSS cache and adding a fallback for narrow widths.</i>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

<i>Verifying.</i>

_[tool: snip]_

_[tool: done]_

<i>Cleaning up resolved iterations.</i>

_[tool: snip]_

<i>Yes — ready to ship. Quick pre-handoff checklist for Claude Code:</i>

**You're good to go.** Hand off `Wireframes.html` + the `frames-*.jsx` + `wireframe.css` + `assets/` folder.

**What to tell Claude Code in the prompt:**
1. Build the real app at the routes listed in section 05 (`/`, `/tools/rank-buddy`, `/tools/workflow-two`, `/tools/workflow-three`, `/sign-in`).
2. Use the Prometheus brand-book repo as the source of truth for tokens, fonts, and the conic orb — not the wireframe CSS (that's just scaffolding).
3. Implement transition **C first** (real routes), layer **A** (FLIP expand) on top as enhancement when navigating from `/`. Skip B unless asked.
4. Rank Buddy's strict-mode system prompt lives **server-side, versioned**. Stream the trace + score card via SSE.
5. PDF generation server-side (react-pdf or puppeteer), reading the same data the right rail reads. Inline preview + download button.
6. Auth = magic link, **guest mode is a primary path** — not a hidden link.
7. The three assistant message variants matter visually: display-serif question / mono trace / structured score card. Don't collapse them into generic bubbles.

**Two things worth flagging before you send:**
- Mobile layout isn't drawn. The three-column Rank Buddy shell needs to stack (history → chat → preview) below ~900px. Worth saying explicitly so Claude Code doesn't guess wrong.
- Workflows 02/03 placeholders should keep the same chrome when their real specs land — note that so the eventual swap is mechanical, not a redesign.

Send it. 🔥

## User

can you add a context file in MD that tells claude code the things you think need to be told explicitly

## Assistant

<i>Writing the handoff context file.</i>

_[tool: snip]_

_[tool: write_file]_

## Assistant

<i></i>

_[tool: snip]_

_[tool: write_file]_

<i></i>

_[tool: snip]_

_[tool: show_to_user]_

`CLAUDE_CODE_HANDOFF.md` is up. It covers:

- File map (what to use, what to discard)
- Stack assumptions + routes
- The three things easiest to get wrong (message variants, strict-mode behavior, transition build order)
- Layout details the wireframes don't fully spell out (mobile reflow, sticky input, cream PDF preview)
- Brand-book quick reference inline
- v1 definition of done + explicit out-of-scope list

Ship `Wireframes.html` + `CLAUDE_CODE_HANDOFF.md` + the `assets/` folder and you're set.

