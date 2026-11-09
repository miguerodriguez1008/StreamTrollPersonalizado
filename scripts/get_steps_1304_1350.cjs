const fs = require('fs');
const readline = require('readline');

async function getSteps1304to1350() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const obj = JSON.parse(line);
    if (obj.step_index >= 1304 && obj.step_index <= 1350) {
      if (obj.type === 'PLANNER_RESPONSE') {
        console.log(`=== STEP ${obj.step_index} ===`);
        console.log(obj.thinking?.slice(0, 1000));
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            console.log('CALL:', tc.name, tc.args?.Path, tc.args?.CommandLine);
          }
        }
      }
    }
  }
}

getSteps1304to1350();

