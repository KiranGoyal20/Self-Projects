import type { CheckRule } from "../types/curriculum";

export type CheckResult = {
  ok: boolean;
  failed: CheckRule[];
  failedMessages: string[];
};

function ruleMatches(rule: CheckRule, code: string): boolean {
  switch (rule.kind) {
    case "regex": {
      try {
        const re = new RegExp(rule.pattern, rule.flags ?? "");
        return re.test(code);
      } catch {
        return false;
      }
    }
    case "regexNot": {
      try {
        const re = new RegExp(rule.pattern, rule.flags ?? "");
        return !re.test(code);
      } catch {
        return true;
      }
    }
    case "includes":
      return code.includes(rule.text);
    case "excludes":
      return !code.includes(rule.text);
    case "all":
      return rule.items.every((t) => code.includes(t));
    case "answer":
      return (
        code.trim().toLowerCase() === rule.answer.trim().toLowerCase()
      );
  }
}

export function runChecks(code: string, rules: CheckRule[]): CheckResult {
  const failed: CheckRule[] = [];
  for (const rule of rules) {
    if (!ruleMatches(rule, code)) failed.push(rule);
  }
  return {
    ok: failed.length === 0,
    failed,
    failedMessages: failed.map((r) => r.message),
  };
}
