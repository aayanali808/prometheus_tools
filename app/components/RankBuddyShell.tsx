"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import TopNav from "./TopNav";
import MessageQuestion from "./chat/MessageQuestion";
import MessageAnswer from "./chat/MessageAnswer";
import MessageTrace from "./chat/MessageTrace";
import MessageScore from "./chat/MessageScore";
import MessageUser from "./chat/MessageUser";
import PdfPreview from "./PdfPreview";
import { Message, ScoreMessage } from "./chat/types";
import styles from "./RankBuddyShell.module.css";

const INITIAL_MESSAGE: Message = {
  kind: "question",
  text: "Paste your website URL (homepage preferred).",
};

function extractUrl(text: string): string | null {
  const trimmed = text.trim();
  const httpMatch = trimmed.match(/https?:\/\/\S+/i);
  if (httpMatch) return httpMatch[0].replace(/[.,;:!?)]+$/, "");
  const domainMatch = trimmed.match(
    /\b((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,})(\/\S*)?/i
  );
  if (domainMatch) {
    return `https://${domainMatch[1]}${domainMatch[2] ?? ""}`.replace(
      /[.,;:!?)]+$/,
      ""
    );
  }
  return null;
}

export default function RankBuddyShell() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
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

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { kind: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    let resolvedUrl = currentUrl;
    if (!resolvedUrl) {
      const detected = extractUrl(text);
      if (detected) {
        resolvedUrl = detected;
        setCurrentUrl(detected);
      }
    }

    try {
      const res = await fetch("/api/rank-buddy/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          url: resolvedUrl ?? undefined,
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
              }
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch {
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

  async function emailReport(email: string) {
    if (!currentUrl) {
      throw new Error("No audit URL on this session yet.");
    }
    const res = await fetch("/api/rank-buddy/email-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: currentUrl, scores: pdfData, email }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? "Failed to send report.");
    }
  }

  return (
    <div className={styles.shell}>
      <TopNav />
      <div className={styles.columns}>
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
              if (msg.kind === "answer") {
                return <MessageAnswer key={i} text={msg.text} />;
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
                    onSendReport={emailReport}
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

        <aside className={`${styles.pdfPanel} ${showPdfPanel ? styles.pdfPanelVisible : ""}`}>
          <PdfPreview scores={pdfData} url={currentUrl} />
        </aside>
      </div>
    </div>
  );
}
