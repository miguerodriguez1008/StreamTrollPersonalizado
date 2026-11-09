const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/MI PC/.gemini/antigravity/brain/4a219bdd-76a9-4280-a037-bcd1dc31d54a/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        entry.tool_calls.forEach(tc => {
          if (tc.name === 'edit_file' && tc.args?.Path?.includes('Dashboard.jsx')) {
            console.log(`\n================ STEP ${entry.step_index} (${tc.args.Target?.length} -> ${tc.args.Replacement?.length}) ================`);
            console.log('Target start:', JSON.stringify(tc.args.Target?.slice(0, 100)));
            console.log('Replacement start:', JSON.stringify(tc.args.Replacement?.slice(0, 150)));
          }
        });
      }
    } catch {}
  }
}
processLineByLine();

