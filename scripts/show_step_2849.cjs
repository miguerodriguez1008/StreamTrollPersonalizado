const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/MI PC/.gemini/antigravity/brain/4a219bdd-76a9-4280-a037-bcd1dc31d54a/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if ([2849, 2853].includes(entry.step_index)) {
        console.log(`\n================ STEP ${entry.step_index} Target ================`);
        console.log(entry.tool_calls[0].args.Target);
        console.log(`\n================ STEP ${entry.step_index} Replacement ================`);
        console.log(entry.tool_calls[0].args.Replacement);
      }
    } catch {}
  }
}
processLineByLine();

