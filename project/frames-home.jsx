/* Frame components for the wireframe doc.
   Each Frame renders a labeled wireframe canvas. Sub-components mock
   specific screens. All sizes are illustrative — Claude Code can take
   the structure & spacing as guidance, not gospel.
*/

const { useState } = React;

/* ----------------- Generic primitives ----------------- */

function Frame({ tag, title, notes, children, theme = "dark", height = 720 }) {
  return (
    <div className="frame">
      <div className="frame-label">
        {tag && <span className="tag">{tag}</span>}
        <h4>{title}</h4>
        {notes && notes.map((n, i) => <p key={i}>{n}</p>)}
      </div>
      <div className="frame-canvas" data-theme={theme} style={{ minHeight: height }}>
        <div className="browser">
          <div className="browser-bar">
            <div className="browser-dots"><span /><span /><span /></div>
            <div className="browser-url">prometheus.today/tools</div>
          </div>
          <div style={{ position: "relative" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function Annot({ n, x, y, children, w = 180 }) {
  return (
    <div className="annot" style={{ left: x, top: y, maxWidth: w }}>
      <span className="pin">{n}</span>
      <span className="flag">{children}</span>
    </div>
  );
}

function TopNav({ theme = "dark", current = "Home" }) {
  return (
    <div className="topnav">
      <div className="lockup">
        <span className="orb" /> Prometheus
      </div>
      <div className="nav-right">
        <span>Tools</span>
        <span style={{ opacity: 0.5 }}>About</span>
        <span style={{ opacity: 0.5 }}>Contact</span>
        <span className="signin">Sign in</span>
      </div>
    </div>
  );
}

/* ----------------- Homepage hero + 3-card stack ----------------- */

function WorkflowCard({ num, title, blurb, status = "live", flame = false, big = false }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "100px 1fr auto",
      gap: 28,
      alignItems: "center",
      padding: big ? "44px 36px" : "30px 36px",
      border: "1px solid var(--prom-border-dark)",
      borderColor: flame ? "rgba(255,91,35,0.45)" : "var(--prom-border-dark)",
      background: flame ? "linear-gradient(90deg, rgba(255,91,35,0.08), rgba(255,91,35,0.01))" : "rgba(31,31,31,0.35)",
      cursor: "pointer",
      position: "relative"
    }}>
      <div style={{
        fontFamily: "var(--prom-font-display)",
        fontSize: big ? "5rem" : "3.4rem",
        color: flame ? "var(--prom-flame-primary)" : "rgba(240,234,224,0.5)",
        fontStyle: "italic",
        lineHeight: 0.9
      }}>
        {num}
      </div>
      <div>
        <div className="eye" style={{ marginBottom: 8 }}>
          {status === "live" ? "Available" : "Coming soon"}
        </div>
        <div style={{
          fontFamily: "var(--prom-font-display)",
          fontSize: big ? "2.6rem" : "2rem",
          fontWeight: 400,
          lineHeight: 1.05,
          marginBottom: 8
        }}>
          {title}
        </div>
        <div style={{
          fontSize: "0.92rem",
          color: "rgba(240,234,224,0.7)",
          maxWidth: "60ch",
          lineHeight: 1.55
        }}>
          {blurb}
        </div>
      </div>
      <div style={{
        fontFamily: "var(--prom-font-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: flame ? "var(--prom-flame-primary)" : "var(--prom-text-muted)",
        whiteSpace: "nowrap"
      }}>
        Open →
      </div>
    </div>
  );
}

function HomepageScreen({ annotations = true, expandedIdx = null }) {
  const cards = [
    {
      num: "01",
      title: <>Rank Buddy <em style={{ color: "var(--prom-flame-primary)" }}>—</em> Assessing your SEO and AIO</>,
      blurb: "Paste a URL. Rank Buddy audits how search engines and AI assistants see your site, then ships a strict, evidence-only report.",
      status: "live",
      flame: true,
    },
    {
      num: "02",
      title: "Workflow Two",
      blurb: "Coming soon. Placeholder for the second tool — the second AI workflow your customers will use.",
      status: "soon",
    },
    {
      num: "03",
      title: "Workflow Three",
      blurb: "Coming soon. Placeholder for the third tool — the third AI workflow your customers will use.",
      status: "soon",
    },
  ];

  return (
    <div style={{ background: "var(--prom-gradient-glow)", minHeight: 720 }}>
      <TopNav />
      <div style={{ padding: "72px 60px 48px", maxWidth: 1180, margin: "0 auto" }}>
        <div className="eye" style={{ marginBottom: 18 }}>Prometheus · Tools</div>
        <h1 style={{
          fontFamily: "var(--prom-font-display)",
          fontWeight: 400,
          fontSize: "clamp(3.2rem, 6vw, 5.4rem)",
          margin: 0,
          lineHeight: 0.98,
          maxWidth: "16ch"
        }}>
          AI workflows that actually <em style={{ color: "var(--prom-flame-primary)", fontStyle: "italic" }}>do the work.</em>
        </h1>
        <p style={{
          marginTop: 22,
          maxWidth: "60ch",
          color: "rgba(240,234,224,0.75)",
          fontSize: "1.1rem",
          lineHeight: 1.55
        }}>
          Three small tools. Each one wraps a model, gives it a job, and stops. Pick one to begin.
        </p>
      </div>

      <div style={{
        padding: "0 60px 80px",
        maxWidth: 1180,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative"
      }}>
        {cards.map((c, i) => (
          <WorkflowCard key={i} {...c} big={expandedIdx === i} />
        ))}
      </div>

      {annotations && (
        <>
          <Annot n="1" x="4%" y={40} w={170}>Sticky top nav, wordmark + orb top-left, sign-in CTA right.</Annot>
          <Annot n="2" x="38%" y={150} w={200}>Hero headline, Instrument Serif italic on flame for the verb.</Annot>
          <Annot n="3" x="65%" y={360} w={180}>Card 1 = "live" treatment. Flame border, faint gradient wash, large numeric.</Annot>
          <Annot n="4" x="65%" y={490} w={180}>Cards 2 & 3 muted: greyed numerals, "Coming soon" eyebrow.</Annot>
          <Annot n="5" x="4%" y={620} w={170}>Click anywhere on row → triggers open transition (next section).</Annot>
        </>
      )}
    </div>
  );
}

window.Frame = Frame;
window.Annot = Annot;
window.TopNav = TopNav;
window.WorkflowCard = WorkflowCard;
window.HomepageScreen = HomepageScreen;
