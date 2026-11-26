// One Line, One Laugh — entry program.
//
// Pipeline: load the joke from entry.txt, validate it against the gate,
// then emit it twice — once to /output/entry.txt for the grader and once
// to stdout. The gate needs UTF-8 text of 1-140 characters, a single line,
// and more than whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 140;
const OUTPUT_PATH = "/output/entry.txt";

function loadEntry(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(here, "entry.txt"), "utf8");
  return raw.replace(/\r\n?/g, "\n").trim();
}

function validateEntry(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${chars.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  // Round-trip through UTF-8 to prove the text is valid UTF-8.
  const roundTripped = Buffer.from(line, "utf8").toString("utf8");
  if (roundTripped !== line) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

function emitEntry(line: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line + "\n", "utf8");
  process.stdout.write(line + "\n");
}

const entry = loadEntry();
validateEntry(entry);
emitEntry(entry);
