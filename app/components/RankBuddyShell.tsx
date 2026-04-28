"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import TopNav from "./TopNav";
import MessageQuestion from "./chat/MessageQuestion";
import MessageTrace from "./chat/MessageTrace";
import MessageScore from "./chat/MessageScore";
import MessageUser from "./chat/MessageUser";
import PdfPreview from "./PdfPreview";
import SignInModal from "./SignInModal";
import { Message, ScoreMessage } from "./chat/types";
import styles from "./RankBuddyShell.module.css";

interface AuditSession {
  id: string;
  url: string;
  date: string;
  seoScore?: number;
}

const INITIAL_MESSAGE: Message = {
  kind: "question",
  text: "Paste your website URL (homepage preferred).",
};

export default function RankBuddyShell() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessions, setSessions] = useState<AuditSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [auditCount, setAuditCount] = useState(0);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<ScoreMessage[]>([]);
  const [showPdfPanel, setShowPdfPanel] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function newAudit() {
    setMessages([INITIAL_MESSAGE]);
    setCurrentUrl(null);
    setPdfData([]);
    setActiveSession(null);
    setInput("");
    inputRef.current?.focus();
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { kind: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    if (!currentUrl && text.trim().startsWith("http")) {
      setCurrentUrl(text.trim());
    }

    try {
      const res = await fetch("/api/rank-buddy/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          url: currentUrl || (text.trim().startsWith("http") ? text.trim() : undefined),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.kind) {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (parsed.kind === "trace" && last?.kind === "trace") {
                  return [
                    ...prev.slice(0, -1),
                    { ...last, lines: [...last.lines, ...parsed.lines] },
                  ];
                }
                return [...prev, parsed as Message];
              });

              if (parsed.kind === "score") {
                setPdfData((prev) => [...prev, parsed as ScoreMessage]);
                setShowPdfPanel(true);

                const urlForSession =
                  currentUrl ||
                  (text.trim().startsWith("http") ? text.trim() : "audit");
                const newSession: AuditSession = {
                  id: Date.now().toString(),
                  url: urlForSession,
                  date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
                  seoScore: parsed.scoreType === "SEO" ? parsed.score : undefined,
                };
                setSessions((prev) => [newSession, ...prev.slice(0, 9)]);
                setActiveSession(newSession.id);
                setAuditCount((c) => {
                  const next = c + 1;
                  if (next === 1) {
                    setTimeout(() => setShowSignIn(true), 1500);
                  }
                  return next;
                });
              }
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          kind: "question",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  async function handleRunAIO() {
    await sendMessage("Run AIO analysis");
  }

  async function handleGeneratePDF() {
    await sendMessage("Generate PDF report");
  }

  function getLastScoreMessage(): ScoreMessage | undefined {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].kind === "score") return messages[i] as ScoreMessage;
    }
    return undefined;
  }

  const lastScore = getLastScoreMessage();
  const hasSEO = messages.some((m) => m.kind === "score" && (m as ScoreMessage).scoreType === "SEO");
  const hasAIO = messages.some((m) => m.kind === "score" && (m as ScoreMessage).scoreType === "AIO");

  return (
    <div className={styles.shell}>
      <TopNav onSignIn={() => setShowSignIn(true)} />
      <div className={styles.columns}>
        {/* Left: history rail */}
        <aside className={styles.history}>
          <span className="eyebrow">Rank Buddy</span>
          <button className={styles.newAudit} onClick={newAudit}>
            + New audit
          </button>
          {sessions.length > 0 && (
            <>
              <span className={styles.recentLabel}>Recent</span>
              <ul className={styles.sessionList}>
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className={`${styles.sessionItem} ${
                      s.id === activeSession ? styles.sessionActive : ""
                    }`}
                  >
                    <span className={styles.sessionUrl}>
                      {s.url.replace(/^https?:\/\//, "")}
                    </span>
                    <span className={styles.sessionMeta}>
                      {s.seoScore !== undefined ? `SEO ${s.seoScore} · ` : ""}
                      {s.date}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {sessions.length === 0 && (
            <p className={styles.emptyHistory}>
              Your recent audits will appear here.
            </p>
          )}
          <Link href="/" className={styles.backLink}>
            ← All tools
          </Link>
        </aside>

        {/* Center: chat thread */}
        <main className={styles.chatCol}>
          <div className={styles.thread} ref={threadRef}>
            {messages.map((msg, i) => {
              const isLastScore =
                msg.kind === "score" &&
                messages
                  .slice(i + 1)
                  .every((m) => m.kind !== "score");

              if (msg.kind === "question") {
                return <MessageQuestion key={i} text={msg.text} />;
              }
              if (msg.kind === "trace") {
                return <MessageTrace key={i} lines={msg.lines} />;
              }
              if (msg.kind === "score") {
                return (
                  <MessageScore
                    key={i}
                    message={msg}
                    showActions={isLastScore && !isStreaming}
                    onRunAIO={hasSEO && !hasAIO ? handleRunAIO : undefined}
                    onGeneratePDF={handleGeneratePDF}
                  />
                );
              }
              if (msg.kind === "user") {
                return <MessageUser key={i} text={msg.text} />;
              }
              return null;
            })}
            {isStreaming && (
              <div className={styles.streaming}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            )}
          </div>
          <div className={styles.inputBar}>
            <div className={styles.inputWrap}>
              <span className={styles.inputPrefix}>›</span>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Type a URL or follow-up…"
                disabled={isStreaming}
                autoFocus
              />
              <button
                className={styles.sendBtn}
                onClick={() => sendMessage(input)}
                disabled={isStreaming || !input.trim()}
                aria-label="Send"
              >
                ↵ SEND
              </button>
            </div>
          </div>
        </main>

        {/* Right: PDF preview */}
        <aside className={`${styles.pdfPanel} ${showPdfPanel ? styles.pdfPanelVisible : ""}`}>
          <PdfPreview
            scores={pdfData}
            url={currentUrl}
            onDownload={async () => {
              if (!currentUrl) return;
              const params = new URLSearchParams({ url: currentUrl });
              const res = await fetch(`/api/rank-buddy/pdf?${params}`);
              if (res.ok) {
                const blob = await res.blob();
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `rank-buddy-${new URL(currentUrl).hostname}.html`;
                a.click();
              }
            }}
          />
        </aside>
      </div>

      {showSignIn && (
        <SignInModal onClose={() => setShowSignIn(false)} />
      )}
    </div>
  );
}
