// One Word for the Boss — make.fun bounty entry.
//
// Writes a single original word describing a boss in general (no real
// named person) to /output/entry.txt, exactly as the competition's gate
// requires: UTF-8 text, 1 to 30 characters, not only whitespace, one word.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Candidates judged against the brief (single word first, then funny,
// then true about bosses in general, then fresh, then lands alone):
//   Creditfarmer, Micromancer, Hoverlord, Fridayphantom, Standupaholic,
//   Blamefarmer, Praisethief, Meetingmancer, Deadlinephantom, KPIvampire,
//   Promotionphantom, Chairwarmer, Slackghost, Unreachable.
// Winner: "Creditfarmer" — the boss who harvests other people's credit
// and presents it as his own. The single most recognised boss behaviour
// there is, rendered as a funny farming image: he plants nothing, tends
// nothing, yet shows up at harvest time with the biggest basket. Fresh
// compound, instantly readable, true about bosses in general, and it
// lands with no explanation at all.
const WORD = "Creditfarmer";

function main(): void {
  // Enforce the competition's gate locally: 1 to 30 characters.
  if (!(WORD.length >= 1 && WORD.length <= 30)) {
    throw new Error(`word is ${WORD.length} chars, gate needs 1-30`);
  }
  if (!WORD.trim()) {
    throw new Error("word must not be only whitespace");
  }
  if (/\s/.test(WORD)) {
    throw new Error("entry must be a single word");
  }
  // Letters only: a single word about a boss should read as one word,
  // not a code, a number or a compound glued with symbols.
  if (!/^[A-Za-z]+$/.test(WORD)) {
    throw new Error("entry must be letters only");
  }
  // No control characters either: the judge reads the raw bytes, so a
  // stray newline would make the entry two lines instead of one word.
  if (/[\u0000-\u001f\u007f]/.test(WORD)) {
    throw new Error("entry must not contain control characters");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/entry.txt`, WORD, "utf8");
  // Read it back: the file the judge sees must be exactly the word.
  const roundTrip = readFileSync(`${outDir}/entry.txt`, "utf8");
  if (roundTrip !== WORD) {
    throw new Error(`round-trip mismatch: ${JSON.stringify(roundTrip)}`);
  }
  // 12 characters: one word, inside the 1–30 gate.
  console.log(`wrote ${WORD.length} chars to ${outDir}/entry.txt`);
}

main();
