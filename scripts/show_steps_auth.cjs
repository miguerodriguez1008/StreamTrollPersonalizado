const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/MI PC/.gemini/antigravity/brain/4a219bdd-76a9-4280-a037-bcd1dc31d54a/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if ([2818, 2850, 2854].includes(entry.step_index)) {
        console.log(`\n================ STEP ${entry.step_index} ================`);
        if (entry.tool_calls) {
          entry.tool_calls.forEach(tc => {
            console.log(`Tool: ${tc.name}, Path: ${tc.args?.Path}`);
            console.log('Target:\n', tc.args?.Target?.slice(0, 200));
            console.log('Replacement:\n', tc.args?.Replacement?.slice(0, 300));
          });
        }
      }
    } catch {}
  }
}
processLineByLine();

