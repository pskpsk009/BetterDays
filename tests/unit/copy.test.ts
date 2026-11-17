/// <reference types="node" />
// TC04: no clinical labels in user-facing text (rule.md "Safety and
// non-diagnostic use"; LR8). Scans every string literal and JSX text in
// frontend/ with the TypeScript parser, so code comments are not checked.
// A string may use a banned word only to say what the app is NOT (a disclaimer).
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it } from "node:test";
import ts from "typescript";

const ROOT = join(__dirname, "..", "..");
const FRONTEND = join(ROOT, "frontend");

/** From rule.md: "diagnosis, disorder, clinical risk, recovered, medically healthy, or treatment result". */
const BANNED = [/\bdiagnos\w*/i, /\bdisorders?\b/i, /\bclinical risk\b/i, /\brecovered\b/i, /\bmedically healthy\b/i, /\btreatment\b/i];

/** Words that turn a sentence into a disclaimer ("isn't ... a diagnosis"). */
const NEGATION = /\b(not|no|never|isn't|aren't|doesn't|don't|can't|won't|without)\b/i;

type Found = { file: string; line: number; text: string };

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function userStrings(file: string): Found[] {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const found: Found[] = [];
  const visit = (node: ts.Node) => {
    // Module paths are not text anyone reads.
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node) || ts.isTemplateLiteralToken(node)) {
      const text = node.getText(source);
      if (text.trim()) {
        found.push({
          file: relative(ROOT, file),
          line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
          text,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** Splits a string into sentences so one disclaimer can't excuse a whole paragraph. */
function sentences(text: string) {
  return text.split(/(?<=[.!?])\s+/);
}

describe("TC04 user-facing copy", () => {
  const files = sourceFiles(FRONTEND);
  const strings = files.flatMap(userStrings);

  it("finds the app's text to scan", () => {
    assert.ok(files.length > 50, `only ${files.length} files found`);
    assert.ok(strings.length > 500, `only ${strings.length} strings found`);
  });

  it("uses banned clinical words only inside a disclaimer", () => {
    const problems = strings.flatMap(({ file, line, text }) =>
      sentences(text)
        .filter((sentence) => BANNED.some((word) => word.test(sentence)) && !NEGATION.test(sentence))
        .map((sentence) => `${file}:${line}  ${sentence.trim()}`),
    );
    assert.deepEqual(problems, []);
  });

  it("the privacy summary says the app is not a diagnosis (LR8)", () => {
    const privacy = strings.filter((s) => s.file.endsWith("privacyRules.ts")).map((s) => s.text).join(" ");
    assert.match(privacy, /isn't therapy, medical advice, or a diagnosis/);
  });
});
