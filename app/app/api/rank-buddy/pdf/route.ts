import { NextRequest } from "next/server";

interface ScoreCategory {
  name: string;
  score: number;
  max: number;
  doing_well?: string[];
  needs_work?: string[];
}

interface PrioritizedFix {
  priority?: number;
  action: string;
  why?: string;
  impact?: string;
}

interface ScoreInput {
  scoreType: "SEO" | "AIO";
  score: number;
  headline?: string;
  categories?: ScoreCategory[];
  top_fixes?: PrioritizedFix[];
  evidence?: string[];
  seo_aio_gap?: string;
  blunt_insight?: string;

  /* legacy */
  doing_well?: string[];
  needs_work?: string[];
  visible_to_ai?: string[];
  invisible_to_ai?: string[];
  top_actions?: string[];
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pct(score: number, max: number): number {
  return Math.max(0, Math.min(100, Math.round((score / max) * 100)));
}

function renderCategory(cat: ScoreCategory): string {
  const fillPct = pct(cat.score, cat.max);
  const doingWell = (cat.doing_well ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const needsWork = (cat.needs_work ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <div class="category">
      <div class="category-head">
        <span class="category-name">${escapeHtml(cat.name)}</span>
        <span class="category-score">${cat.score}<span class="dim">/${cat.max}</span></span>
      </div>
      <div class="bar"><span class="bar-fill" style="width:${fillPct}%"></span></div>
      ${doingWell || needsWork ? `
        <div class="findings">
          ${doingWell ? `<div class="findings-col"><div class="findings-label good">Doing well</div><ul>${doingWell}</ul></div>` : ""}
          ${needsWork ? `<div class="findings-col"><div class="findings-label bad">Needs work</div><ul>${needsWork}</ul></div>` : ""}
        </div>
      ` : ""}
    </div>
  `;
}

function renderFix(fix: PrioritizedFix, i: number): string {
  const dotCount = fix.impact === "high" ? 3 : fix.impact === "medium" ? 2 : 1;
  const dots = Array.from({ length: dotCount })
    .map(() => `<span class="dot"></span>`)
    .join("");
  return `
    <li class="fix">
      <span class="fix-num">${fix.priority ?? i + 1}</span>
      <div class="fix-body">
        <div class="fix-action">${escapeHtml(fix.action)}</div>
        ${fix.why ? `<div class="fix-why">${escapeHtml(fix.why)}</div>` : ""}
      </div>
      ${fix.impact ? `<div class="fix-impact">${dots}<span class="impact-label">${escapeHtml(fix.impact)}</span></div>` : ""}
    </li>
  `;
}

function legacyToCategories(s: ScoreInput): ScoreCategory[] {
  const dw = s.doing_well ?? s.visible_to_ai ?? [];
  const nw = s.needs_work ?? s.invisible_to_ai ?? [];
  if (dw.length === 0 && nw.length === 0) return [];
  return [{
    name: s.scoreType === "SEO" ? "Findings" : "AI Visibility",
    score: s.score,
    max: 100,
    doing_well: dw,
    needs_work: nw,
  }];
}

function legacyToFixes(s: ScoreInput): PrioritizedFix[] {
  const list = s.top_fixes ?? [];
  if (list.length > 0 && typeof list[0] === "object" && "action" in (list[0] as object)) {
    return list;
  }
  const legacy = (s.top_fixes as unknown as string[]) ?? s.top_actions ?? [];
  return legacy.map((action, i) => ({ priority: i + 1, action }));
}

function renderScoreSection(s: ScoreInput): string {
  const categories = s.categories ?? legacyToCategories(s);
  const fixes = legacyToFixes(s);

  return `
    <section class="score-section">
      <header class="score-header">
        <div class="score-block">
          <div class="score-label">${s.scoreType} Score</div>
          <div class="score-num">${s.score}<span class="denom">/100</span></div>
        </div>
        ${s.headline ? `<p class="score-headline">${escapeHtml(s.headline)}</p>` : ""}
      </header>
      ${categories.length > 0 ? `<div class="categories">${categories.map(renderCategory).join("")}</div>` : ""}
      ${fixes.length > 0 ? `
        <div class="fixes">
          <div class="fixes-label">Top fixes, ranked</div>
          <ol class="fixes-list">${fixes.map((f, i) => renderFix(f, i)).join("")}</ol>
        </div>
      ` : ""}
      ${s.blunt_insight ? `<blockquote class="insight">&ldquo;${escapeHtml(s.blunt_insight)}&rdquo;</blockquote>` : ""}
      ${s.seo_aio_gap ? `<div class="gap"><div class="gap-label">SEO ↔ AIO gap</div><div class="gap-text">${escapeHtml(s.seo_aio_gap)}</div></div>` : ""}
    </section>
  `;
}

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #EFEBE8;
    color: #1C1C1C;
    padding: 56px 48px 64px;
    max-width: 820px;
    margin: 0 auto;
    line-height: 1.55;
  }
  .eyebrow {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #FF5B23;
    font-weight: 600;
  }
  h1 {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 2.2rem;
    font-weight: 400;
    margin: 12px 0 6px;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .meta {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.62rem;
    color: #525252;
    letter-spacing: 0.05em;
    margin-bottom: 28px;
  }
  .divider { height: 1px; background: #DCD8D4; margin: 24px 0; }
  .preamble {
    color: #525252;
    font-size: 0.9rem;
    line-height: 1.65;
    margin-bottom: 36px;
    max-width: 60ch;
  }
  .score-section { margin-bottom: 44px; page-break-inside: avoid; }
  .score-header {
    display: flex;
    align-items: center;
    gap: 28px;
    padding-bottom: 18px;
    border-bottom: 1px solid #DCD8D4;
    margin-bottom: 22px;
  }
  .score-block { display: flex; flex-direction: column; gap: 4px; min-width: 110px; }
  .score-label {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #FF5B23;
    font-weight: 600;
  }
  .score-num {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 3.4rem;
    color: #FF5B23;
    line-height: 1;
  }
  .denom { font-size: 1.2rem; color: #525252; margin-left: 2px; }
  .score-headline {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic;
    font-size: 1.2rem;
    color: #1C1C1C;
    line-height: 1.3;
    max-width: 38ch;
  }
  .categories { display: flex; flex-direction: column; gap: 18px; margin-bottom: 28px; }
  .category { display: flex; flex-direction: column; gap: 8px; }
  .category-head { display: flex; justify-content: space-between; align-items: baseline; }
  .category-name { font-weight: 600; font-size: 0.92rem; }
  .category-score {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
  }
  .dim { color: #525252; }
  .bar { position: relative; height: 3px; background: #DCD8D4; overflow: hidden; }
  .bar-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: linear-gradient(135deg, #FE8131 0%, #FF5B23 50%, #C72B1E 100%);
  }
  .findings { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 4px; }
  .findings-col { display: flex; flex-direction: column; gap: 4px; }
  .findings-label {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .findings-label.good { color: #FF5B23; }
  .findings-label.bad { color: #525252; }
  .findings-col ul { list-style: none; }
  .findings-col li {
    position: relative;
    padding-left: 12px;
    font-size: 0.85rem;
    color: #525252;
    line-height: 1.5;
    margin-bottom: 3px;
  }
  .findings-col li::before { content: "·"; position: absolute; left: 0; color: #A8A29E; }
  .fixes {
    margin-top: 22px;
    padding-top: 22px;
    border-top: 1px solid #DCD8D4;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .fixes-label {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #FF5B23;
    font-weight: 600;
  }
  .fixes-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .fix {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 14px;
    align-items: start;
    padding: 12px 14px;
    background: #F5F2EE;
    border-left: 2px solid #FF5B23;
  }
  .fix-num {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic;
    font-size: 1.4rem;
    color: #FF5B23;
    line-height: 1;
    min-width: 16px;
  }
  .fix-body { display: flex; flex-direction: column; gap: 3px; }
  .fix-action { font-size: 0.92rem; font-weight: 500; color: #1C1C1C; line-height: 1.4; }
  .fix-why { font-size: 0.8rem; color: #525252; line-height: 1.5; }
  .fix-impact { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; padding-top: 4px; }
  .dot { display: inline-block; width: 5px; height: 5px; border-radius: 999px; background: #FF5B23; margin-left: 2px; }
  .impact-label {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.55rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #525252;
  }
  .insight {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic;
    font-size: 1rem;
    color: #1C1C1C;
    border-left: 2px solid #FF5B23;
    padding-left: 14px;
    margin-top: 18px;
    line-height: 1.4;
  }
  .gap {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #DCD8D4;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .gap-label {
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #FF5B23;
    font-weight: 600;
  }
  .gap-text { font-size: 0.88rem; color: #525252; line-height: 1.5; }
  .empty {
    background: #F5F2EE;
    padding: 18px;
    color: #525252;
    font-size: 0.88rem;
    font-style: italic;
  }
  .footer {
    margin-top: 56px;
    padding-top: 18px;
    border-top: 1px solid #DCD8D4;
    font-family: "JetBrains Mono", Menlo, monospace;
    font-size: 0.6rem;
    color: #A8A29E;
    letter-spacing: 0.08em;
    display: flex;
    justify-content: space-between;
  }
  .print-hint {
    background: #1C1C1C;
    color: #F0EAE0;
    padding: 14px 18px;
    margin-bottom: 28px;
    font-size: 0.78rem;
    line-height: 1.5;
    border-left: 2px solid #FF5B23;
  }
  .print-hint b { color: #FF5B23; }
  @media print {
    body { padding: 24px; }
    .print-hint { display: none; }
  }
`;

export async function POST(req: NextRequest) {
  let payload: { url?: string; scores?: ScoreInput[] } = {};
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const url = payload.url;
  const scores = payload.scores ?? [];

  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    // use as-is
  }

  const seo = scores.find((s) => s.scoreType === "SEO");
  const aio = scores.find((s) => s.scoreType === "AIO");
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const evidenceLine = (seo?.evidence ?? aio?.evidence ?? []).join(" · ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(hostname)} — Rank Buddy Audit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>${STYLES}</style>
</head>
<body>
  <div class="print-hint">
    <b>Save as PDF →</b> Use your browser's Print menu (⌘P / Ctrl+P) and choose &ldquo;Save as PDF&rdquo;. This page is print-styled.
  </div>
  <div class="eyebrow">Rank Buddy · Prometheus Tools</div>
  <h1>${escapeHtml(hostname)} — SEO${aio ? " &amp; AIO" : ""} Audit</h1>
  <div class="meta">Generated ${date} · rank-buddy.v1${evidenceLine ? ` · ${escapeHtml(evidenceLine)}` : ""}</div>
  <div class="divider"></div>
  <p class="preamble">
    Evidence-only audit. Only verifiable content from the pages reviewed was used. No assumptions about traffic, backlinks, or rankings. Each category is scored out of 20 with specific findings.
  </p>
  ${seo ? renderScoreSection(seo) : `<section class="score-section"><div class="empty">SEO audit not run.</div></section>`}
  ${aio ? renderScoreSection(aio) : `<section class="score-section"><h2 style="font-family:'Instrument Serif',serif;font-weight:400;font-size:1.3rem;margin-bottom:8px;">AIO Analysis</h2><div class="empty">Run the AIO analysis after your SEO audit to populate this section.</div></section>`}
  <div class="footer">
    <span>prometheus.today/tools/rank-buddy</span>
    <span>Rank Buddy v1</span>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="rank-buddy-${hostname}.html"`,
    },
  });
}
