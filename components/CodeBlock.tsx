/*
 * Copyright (c) 2026 Riadh MNASRI. All rights reserved.
 *
 * Minimal syntax highlighting for the snippet dialects used by the pack:
 * gcloud/shell commands, YAML manifests and Terraform (HCL). A handwritten
 * tokenizer keeps the bundle free of a heavy highlighting dependency; good
 * enough for the short, curated snippets used in lessons and exercises.
 */
import type { ReactNode } from "react";

const KEYWORDS = new Set([
  // CLIs seen in snippets
  "gcloud", "gsutil", "bq", "kubectl", "terraform", "curl", "docker",
  // shell
  "if", "then", "else", "fi", "for", "do", "done", "export", "echo", "set",
  // Terraform / HCL
  "resource", "module", "variable", "output", "provider", "data", "locals",
  // YAML manifest markers and common literals
  "apiVersion", "kind", "metadata", "spec", "null", "true", "false",
]);

type Token = {
  text: string;
  kind: "kw" | "str" | "com" | "num" | "flag" | "plain";
};

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  // Order matters: comments, then strings, then flags, words and numbers.
  const re =
    /(#[^\n]*|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(--?[A-Za-z][A-Za-z0-9-]*)|(\b\d[\d_.]*\b)|([A-Za-z_][A-Za-z0-9_-]*)|([\s\S])/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(code)) !== null) {
    const [, com, str, flag, num, word, other] = match;
    if (com) tokens.push({ text: com, kind: "com" });
    else if (str) tokens.push({ text: str, kind: "str" });
    else if (flag) tokens.push({ text: flag, kind: "flag" });
    else if (num) tokens.push({ text: num, kind: "num" });
    else if (word)
      tokens.push({ text: word, kind: KEYWORDS.has(word) ? "kw" : "plain" });
    else tokens.push({ text: other, kind: "plain" });
  }
  return tokens;
}

const COLOR: Record<Token["kind"], string> = {
  kw: "text-accent font-medium",
  str: "text-teal",
  com: "text-muted italic",
  num: "text-gold",
  flag: "text-gold",
  plain: "",
};

export function CodeBlock({
  code,
  caption,
}: {
  code: string;
  caption?: ReactNode;
}) {
  return (
    <figure className="my-3">
      <pre className="rounded-xl border border-border bg-surface-2 p-4 text-[13px] leading-relaxed overflow-x-auto">
        <code>
          {tokenize(code).map((token, i) => (
            <span key={i} className={COLOR[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
      {caption && (
        <figcaption className="mt-1.5 text-xs text-muted px-1">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
