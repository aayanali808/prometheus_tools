export type MessageKind = "question" | "trace" | "score" | "user" | "answer";

export interface QuestionMessage {
  kind: "question";
  text: string;
}

export interface AnswerMessage {
  kind: "answer";
  text: string;
}

export interface TraceMessage {
  kind: "trace";
  lines: string[];
}

export interface ScoreCategory {
  name: string;
  score: number;
  max: number;
  doing_well?: string[];
  needs_work?: string[];
}

export interface PrioritizedFix {
  priority: number;
  action: string;
  why?: string;
  impact?: "high" | "medium" | "low";
}

export interface ScoreMessage {
  kind: "score";
  scoreType: "SEO" | "AIO";
  score: number;
  headline?: string;
  categories?: ScoreCategory[];
  top_fixes?: PrioritizedFix[];
  evidence?: string[];

  /* AIO-only */
  seo_aio_gap?: string;
  blunt_insight?: string;

  /* Legacy fields kept for back-compat with older streams */
  doing_well?: string[];
  needs_work?: string[];
  visible_to_ai?: string[];
  invisible_to_ai?: string[];
  top_actions?: string[];
}

export interface UserMessage {
  kind: "user";
  text: string;
}

export type Message =
  | QuestionMessage
  | AnswerMessage
  | TraceMessage
  | ScoreMessage
  | UserMessage;
