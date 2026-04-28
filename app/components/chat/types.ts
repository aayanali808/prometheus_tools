export type MessageKind = "question" | "trace" | "score" | "user";

export interface QuestionMessage {
  kind: "question";
  text: string;
}

export interface TraceMessage {
  kind: "trace";
  lines: string[];
}

export interface ScoreSection {
  doing_well?: string[];
  needs_work?: string[];
  top_fixes?: string[];
  top_actions?: string[];
  evidence?: string[];
  visible_to_ai?: string[];
  invisible_to_ai?: string[];
  seo_aio_gap?: string;
  blunt_insight?: string;
}

export interface ScoreMessage extends ScoreSection {
  kind: "score";
  scoreType: "SEO" | "AIO";
  score: number;
}

export interface UserMessage {
  kind: "user";
  text: string;
}

export type Message = QuestionMessage | TraceMessage | ScoreMessage | UserMessage;
