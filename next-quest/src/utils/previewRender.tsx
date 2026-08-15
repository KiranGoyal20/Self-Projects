import { createElement, type ReactNode } from "react";
import type { PreviewNode } from "../types/curriculum";

const ALLOWED_TAGS = new Set([
  "div",
  "span",
  "p",
  "a",
  "ul",
  "ol",
  "li",
  "section",
  "article",
  "header",
  "footer",
  "nav",
  "main",
  "aside",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "code",
  "pre",
  "button",
  "input",
  "img",
  "form",
  "label",
]);

const VOID_TAGS = new Set(["input", "img", "br", "hr"]);

/**
 * Render a sandbox-safe PreviewNode tree to React.
 * We strip event handler props (anything starting with "on") so user code can't bind handlers.
 */
export function renderPreview(node: PreviewNode | string, key = "0"): ReactNode {
  if (typeof node === "string") return node;
  const { tag, props = {}, children = [] } = node;
  const reactProps: Record<string, unknown> = { key };
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined) continue;
    const lower = k.toLowerCase();
    if (lower === "class") reactProps.className = v;
    else if (lower.startsWith("on")) continue;
    else reactProps[k] = v;
  }
  const tagName = ALLOWED_TAGS.has(tag) ? tag : "div";
  if (VOID_TAGS.has(tagName)) {
    return createElement(tagName, reactProps);
  }
  const kids = children.map((c, i) => renderPreview(c, `${key}.${i}`));
  return createElement(tagName, reactProps, ...kids);
}
