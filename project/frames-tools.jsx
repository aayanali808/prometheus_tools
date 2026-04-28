/* Click-to-open transition variations and the inside-of-workflow shells. */

const { useState: useStateT } = React;

/* -------- Transition variation A: card expands to fullscreen -------- */

function TransitionA() {
  return (
    <div style={{ background: "var(--prom-gradient-glow)", minHeight: 540, position: "relative" }}>
      <TopNav />
      <div style={{ padding: "40px 60px", maxWidth: 1180, margin: "0 auto", opacity: 0.25 }}>
        <h1 style={{ fontFamily: "var(--prom-font-display)", fontSize: "3.2rem", margin: 0, fontWeight: 400 }}>
          AI workflows that actually <em style={{ color: "var(--prom-flame-primary)" }}>do the work.</em>
        </h1>
      </div>
      {/* expanding card overlay */}
      <div style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        top: 220,
        bottom: 30,
        border: "1px solid rgba(255,91,35,0.6)",
        background: "var(--prom-bg-deep)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,91,35,0.15)",
        padding: "30px 40px",
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 28,
        alignItems: "start"
      }}>
        <div style={{
          fontFamily: "var(--prom-font-display)",
          fontSize: "5.4rem",
          color: "var(--prom-flame-primary)",
          fontStyle: "italic",
          lineHeight: 0.9
        }}>01</div>
        <div>
          <div className="eye" style={{ marginBottom: 8 }}>Loading Rank Buddy…</div>
          <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "2.4rem", fontWeight: 400, lineHeight: 1.05 }}>
            Rank Buddy <em style={{ color: "var(--prom-flame-primary)" }}>—</em> Assessing your SEO and AIO
          </div>
          <div style={{ marginTop: 24, height: 3, background: "rgba(255,91,35,0.2)", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: "62%", background: "var(--prom-flame-primary)" }} />
          </div>
          <div style={{ marginTop: 14, fontFamily: "var(--prom-font-mono)", fontSize: "0.7rem", color: "var(--prom-text-muted)", letterSpacing: "0.1em" }}>
            INITIALIZING_AGENT · CONTEXT_LOADED · READY_FOR_INPUT
          </div>
        </div>
      </div>
      <Annot n="A" x="2%" y={250} w={170}>Card grows from its row position (FLIP-style transform). Other cards fade. Page bg unchanged.</Annot>
    </div>
  );
}

/* -------- Transition variation B: shared element / split-screen panel -------- */

function TransitionB() {
  return (
    <div style={{ background: "var(--prom-bg-primary)", minHeight: 540, position: "relative" }}>
      <TopNav />
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: 460 }}>
        <div style={{ borderRight: "1px solid var(--prom-border-dark)", padding: "30px 24px", background: "var(--prom-bg-deep)" }}>
          <div className="eye">Tools</div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: "12px 14px", background: "rgba(255,91,35,0.08)", borderLeft: "2px solid var(--prom-flame-primary)" }}>
              <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "1.2rem" }}>01 Rank Buddy</div>
              <div style={{ fontSize: "0.78rem", color: "var(--prom-text-muted)", marginTop: 2 }}>SEO & AIO audit</div>
            </div>
            <div style={{ padding: "12px 14px", opacity: 0.55 }}>
              <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "1.2rem" }}>02 Workflow Two</div>
              <div style={{ fontSize: "0.78rem", color: "var(--prom-text-muted)", marginTop: 2 }}>Coming soon</div>
            </div>
            <div style={{ padding: "12px 14px", opacity: 0.55 }}>
              <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "1.2rem" }}>03 Workflow Three</div>
              <div style={{ fontSize: "0.78rem", color: "var(--prom-text-muted)", marginTop: 2 }}>Coming soon</div>
            </div>
          </div>
        </div>
        <div style={{ padding: 36 }}>
          <div className="eye">Now open</div>
          <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "2.4rem", fontWeight: 400, marginTop: 8 }}>
            Rank Buddy
          </div>
          <div style={{ marginTop: 18, color: "rgba(240,234,224,0.7)", maxWidth: "60ch", fontSize: "0.95rem" }}>
            Chat shell loads to the right. Sidebar persists so users can switch tools without going back home.
          </div>
        </div>
      </div>
      <Annot n="B" x="2%" y={140} w={180}>Card "docks" into a left rail. Other workflows compress into nav items. Wrapper UI fills right pane.</Annot>
    </div>
  );
}

/* -------- Transition variation C: dedicated page route, no animation -------- */

function TransitionC() {
  return (
    <div style={{ background: "var(--prom-bg-primary)", minHeight: 540, position: "relative" }}>
      <TopNav />
      <div style={{ padding: "20px 60px 0", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--prom-font-mono)", fontSize: "0.7rem", color: "var(--prom-text-muted)", letterSpacing: "0.1em" }}>
          ← TOOLS / RANK BUDDY
        </div>
      </div>
      <div style={{ padding: "30px 60px", maxWidth: 1180, margin: "0 auto" }}>
        <div className="eye" style={{ marginBottom: 12 }}>Tool 01</div>
        <h2 style={{ fontFamily: "var(--prom-font-display)", fontSize: "3rem", fontWeight: 400, margin: 0 }}>
          Rank Buddy
        </h2>
        <p style={{ color: "rgba(240,234,224,0.7)", maxWidth: "55ch", fontSize: "1rem", marginTop: 8 }}>
          Honest, evidence-only audits. Paste a URL to begin.
        </p>
        <div style={{
          marginTop: 30,
          border: "1px dashed var(--prom-border-dark)",
          height: 240,
          display: "grid",
          placeItems: "center",
          color: "var(--prom-text-muted)",
          fontFamily: "var(--prom-font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em"
        }}>
          [ CHAT INTERFACE LOADS HERE ]
        </div>
      </div>
      <Annot n="C" x="2%" y={140} w={180}>Hard navigation. /tools/rank-buddy. Simplest, most accessible. Breadcrumb up top.</Annot>
    </div>
  );
}

/* -------- Rank Buddy chat shell -------- */

function RankBuddyChat() {
  return (
    <div style={{ background: "var(--prom-bg-primary)", minHeight: 720, display: "grid", gridTemplateRows: "auto 1fr" }}>
      <TopNav />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 220px) 1fr minmax(220px, 260px)", minHeight: 660 }}>
        {/* Left: sessions/history */}
        <aside style={{ borderRight: "1px solid var(--prom-border-dark)", padding: "22px 18px", background: "var(--prom-bg-deep)" }}>
          <div className="eye" style={{ marginBottom: 14 }}>Rank Buddy</div>
          <button style={{
            width: "100%", padding: "10px 12px", marginBottom: 18,
            background: "var(--prom-flame-primary)", color: "var(--prom-bg-primary)",
            border: "none", fontFamily: "var(--prom-font-mono)",
            fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
            fontWeight: 600, cursor: "pointer"
          }}>+ New audit</button>
          <div style={{ fontFamily: "var(--prom-font-mono)", fontSize: "0.62rem", letterSpacing: "0.15em", color: "var(--prom-text-muted)", marginBottom: 10 }}>
            RECENT
          </div>
          {["acme.com — 2d ago", "stripe.com — 5d ago", "your-site.com — draft"].map((s, i) => (
            <div key={i} style={{
              padding: "10px 12px",
              fontSize: "0.82rem",
              borderLeft: i === 2 ? "2px solid var(--prom-flame-primary)" : "2px solid transparent",
              background: i === 2 ? "rgba(255,91,35,0.05)" : "transparent",
              color: i === 2 ? "var(--prom-text-cream)" : "var(--prom-text-muted)",
              marginBottom: 2
            }}>{s}</div>
          ))}
        </aside>

        {/* Center: chat thread */}
        <main style={{ display: "grid", gridTemplateRows: "1fr auto", minHeight: 660 }}>
          <div style={{ padding: "30px 36px", overflow: "hidden" }}>
            {/* assistant msg */}
            <div style={{ marginBottom: 22 }}>
              <div className="eye" style={{ marginBottom: 6 }}>Rank Buddy</div>
              <div style={{
                fontFamily: "var(--prom-font-display)",
                fontSize: "1.6rem",
                fontWeight: 400,
                lineHeight: 1.2,
                maxWidth: "32ch"
              }}>
                Paste your website URL <em style={{ color: "var(--prom-flame-primary)" }}>(homepage preferred).</em>
              </div>
            </div>
            {/* user msg */}
            <div style={{ marginBottom: 22, display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                maxWidth: "60%",
                padding: "12px 16px",
                background: "rgba(255,91,35,0.1)",
                border: "1px solid rgba(255,91,35,0.3)",
                color: "var(--prom-text-cream)",
                fontSize: "0.95rem"
              }}>
                https://acme.com
              </div>
            </div>
            {/* assistant working */}
            <div style={{ marginBottom: 22 }}>
              <div className="eye" style={{ marginBottom: 6 }}>Rank Buddy</div>
              <div style={{ fontFamily: "var(--prom-font-mono)", fontSize: "0.78rem", color: "var(--prom-text-muted)", lineHeight: 1.7 }}>
                browsing /home<br />
                opening /about · OK<br />
                opening /services · OK<br />
                opening /blog · 404, skipping<br />
                <span style={{ color: "var(--prom-flame-primary)" }}>scoring 5 categories…</span>
              </div>
            </div>
            {/* score card output */}
            <div style={{
              border: "1px solid var(--prom-border-dark)",
              background: "rgba(31,31,31,0.5)",
              padding: 24,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 28,
              alignItems: "center"
            }}>
              <div>
                <div className="eye">SEO Score</div>
                <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "4rem", color: "var(--prom-flame-primary)", lineHeight: 1, marginTop: 4 }}>
                  72<span style={{ fontSize: "1.4rem", color: "var(--prom-text-muted)" }}>/100</span>
                </div>
              </div>
              <div style={{ fontSize: "0.9rem", color: "rgba(240,234,224,0.75)", lineHeight: 1.5 }}>
                <b style={{ color: "var(--prom-text-cream)" }}>Doing well:</b> HTTPS · clear H1 · readable services page<br />
                <b style={{ color: "var(--prom-text-cream)", marginTop: 6, display: "inline-block" }}>Needs work:</b> missing meta descriptions · no testimonials visible · weak CTA on home
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button style={{
                padding: "10px 16px", background: "var(--prom-flame-primary)", color: "var(--prom-bg-primary)",
                border: "none", fontFamily: "var(--prom-font-mono)", fontSize: "0.7rem",
                letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600
              }}>Run AIO analysis →</button>
              <button style={{
                padding: "10px 16px", background: "transparent", color: "var(--prom-text-cream)",
                border: "1px solid var(--prom-border-dark)", fontFamily: "var(--prom-font-mono)",
                fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase"
              }}>Generate PDF</button>
            </div>
          </div>
          {/* input bar */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--prom-border-dark)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              border: "1px solid var(--prom-border-dark)",
              padding: "10px 14px",
              background: "rgba(31,31,31,0.4)"
            }}>
              <span style={{ color: "var(--prom-flame-primary)", fontFamily: "var(--prom-font-mono)" }}>›</span>
              <span style={{ flex: 1, color: "var(--prom-text-muted)", fontSize: "0.9rem" }}>
                Type a URL or follow-up…
              </span>
              <span style={{
                fontFamily: "var(--prom-font-mono)", fontSize: "0.65rem",
                letterSpacing: "0.15em", color: "var(--prom-text-muted)"
              }}>↵ SEND</span>
            </div>
          </div>
        </main>

        {/* Right: live PDF preview pane */}
        <aside style={{ borderLeft: "1px solid var(--prom-border-dark)", padding: "22px 18px", background: "var(--prom-bg-deep)" }}>
          <div className="eye" style={{ marginBottom: 12 }}>Report preview</div>
          <div style={{
            background: "var(--prom-bg-cream)",
            color: "var(--prom-text-ink)",
            padding: "20px 16px",
            fontFamily: "var(--prom-font-body)",
            fontSize: "0.7rem",
            lineHeight: 1.5,
            minHeight: 360
          }}>
            <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "1rem", marginBottom: 6 }}>
              Acme Co. — SEO & AIO Audit
            </div>
            <div style={{ height: 1, background: "var(--prom-border-light)", margin: "8px 0" }} />
            <div className="placeholder-bar" style={{ marginBottom: 6 }} />
            <div className="placeholder-bar" style={{ marginBottom: 6, width: "80%" }} />
            <div className="placeholder-bar" style={{ marginBottom: 14, width: "60%" }} />
            <div style={{ fontWeight: 600, fontSize: "0.7rem", color: "var(--prom-flame-primary)", marginBottom: 4 }}>SEO 72/100</div>
            <div className="placeholder-bar" style={{ marginBottom: 4 }} />
            <div className="placeholder-bar" style={{ marginBottom: 4, width: "85%" }} />
            <div className="placeholder-bar" style={{ marginBottom: 14, width: "70%" }} />
            <div style={{ fontWeight: 600, fontSize: "0.7rem", color: "var(--prom-flame-primary)", marginBottom: 4 }}>AIO —</div>
            <div className="placeholder-bar" style={{ marginBottom: 4, opacity: 0.5 }} />
            <div className="placeholder-bar" style={{ marginBottom: 4, width: "70%", opacity: 0.5 }} />
          </div>
          <button style={{
            marginTop: 12, width: "100%", padding: "10px 12px",
            background: "transparent", color: "var(--prom-text-cream)",
            border: "1px solid var(--prom-border-dark)",
            fontFamily: "var(--prom-font-mono)", fontSize: "0.68rem",
            letterSpacing: "0.15em", textTransform: "uppercase"
          }}>↓ Download PDF</button>
        </aside>
      </div>
      <Annot n="1" x="1%" y={70} w={150}>Left rail: session history. Optional sign-in saves these.</Annot>
      <Annot n="2" x="28%" y={130} w={170}>Assistant turns use display serif for headline questions, mono for system traces.</Annot>
      <Annot n="3" x="28%" y={420} w={180}>Score card is a structured assistant output, not a free-text bubble.</Annot>
      <Annot n="4" x="78%" y={120} w={150}>Live PDF preview, populates as audit runs. Inline preview + download.</Annot>
      <Annot n="5" x="28%" y={620} w={170}>Persistent input bar for follow-ups & corrections.</Annot>
    </div>
  );
}

/* -------- Empty / placeholder workflow shell -------- */

function PlaceholderWorkflow({ num, title }) {
  return (
    <div style={{ background: "var(--prom-bg-primary)", minHeight: 540 }}>
      <TopNav />
      <div style={{ padding: "60px 60px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "5rem", color: "rgba(240,234,224,0.4)", fontStyle: "italic", lineHeight: 0.9, marginBottom: 18 }}>
          {num}
        </div>
        <div className="eye" style={{ marginBottom: 10 }}>Coming soon</div>
        <h2 style={{ fontFamily: "var(--prom-font-display)", fontSize: "3rem", fontWeight: 400, margin: 0 }}>
          {title}
        </h2>
        <p style={{ color: "rgba(240,234,224,0.7)", maxWidth: "55ch", fontSize: "1rem", marginTop: 14 }}>
          This wrapper is in development. Same shell as Rank Buddy: chat thread on left, live output preview on right, optional sign-in saves the session.
        </p>
        <div style={{
          marginTop: 36,
          border: "1px dashed var(--prom-border-dark)",
          height: 220,
          display: "grid", placeItems: "center",
          color: "var(--prom-text-muted)",
          fontFamily: "var(--prom-font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em"
        }}>
          [ TOOL UI — TBD ]
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
          <button style={{
            padding: "10px 16px", background: "transparent", color: "var(--prom-text-cream)",
            border: "1px solid var(--prom-border-dark)", fontFamily: "var(--prom-font-mono)",
            fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase"
          }}>← Back to tools</button>
          <button style={{
            padding: "10px 16px", background: "var(--prom-flame-primary)", color: "var(--prom-bg-primary)",
            border: "none", fontFamily: "var(--prom-font-mono)",
            fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600
          }}>Notify me when ready</button>
        </div>
      </div>
    </div>
  );
}

/* -------- Sign-in modal (optional) -------- */

function SignInModal() {
  return (
    <div style={{ background: "rgba(14,14,14,0.85)", minHeight: 540, position: "relative", display: "grid", placeItems: "center" }}>
      <TopNav />
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        width: 420, padding: 36,
        border: "1px solid var(--prom-border-dark)",
        background: "var(--prom-bg-deep)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)"
      }}>
        <div className="eye" style={{ marginBottom: 12 }}>Optional</div>
        <div style={{ fontFamily: "var(--prom-font-display)", fontSize: "1.8rem", fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>
          Save this audit to your <em style={{ color: "var(--prom-flame-primary)" }}>account.</em>
        </div>
        <div style={{ color: "rgba(240,234,224,0.65)", fontSize: "0.9rem", marginBottom: 22 }}>
          You can keep using Rank Buddy without signing in. Sign in to save reports and access them later.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "10px 14px", border: "1px solid var(--prom-border-dark)", color: "var(--prom-text-muted)", fontSize: "0.88rem" }}>
            you@example.com
          </div>
          <button style={{
            padding: "12px", background: "var(--prom-flame-primary)", color: "var(--prom-bg-primary)",
            border: "none", fontFamily: "var(--prom-font-mono)",
            fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600
          }}>Send magic link →</button>
          <button style={{
            padding: "10px", background: "transparent", color: "var(--prom-text-muted)",
            border: "none", fontFamily: "var(--prom-font-mono)", fontSize: "0.65rem",
            letterSpacing: "0.15em", textTransform: "uppercase"
          }}>Skip — keep using as guest</button>
        </div>
      </div>
    </div>
  );
}

window.TransitionA = TransitionA;
window.TransitionB = TransitionB;
window.TransitionC = TransitionC;
window.RankBuddyChat = RankBuddyChat;
window.PlaceholderWorkflow = PlaceholderWorkflow;
window.SignInModal = SignInModal;
