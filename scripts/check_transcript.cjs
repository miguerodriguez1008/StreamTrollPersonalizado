const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/MI PC/.gemini/antigravity/brain/4a219bdd-76a9-4280-a037-bcd1dc31d54a/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if ([2853, 2941, 2945, 2951].includes(entry.step_index)) {
        console.log(`=== STEP ${entry.step_index} ===`);
        if (entry.tool_calls) {
          entry.tool_calls.forEach(tc => {
            console.log(`Tool: ${tc.name}`);
            if (tc.args && tc.args.Path) console.log(`Path: ${tc.args.Path}`);
            if (tc.args && tc.args.Target) console.log(`Target length: ${tc.args.Target.length}`);
            if (tc.args && tc.args.Replacement) console.log(`Replacement length: ${tc.args.Replacement.length}`);
          });
        }
      }
    } catch {}
  }
}
processLineByLine();

