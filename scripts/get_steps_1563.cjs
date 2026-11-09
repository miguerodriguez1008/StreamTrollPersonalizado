const fs = require('fs');
const readline = require('readline');

async function getSteps1563() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const obj = JSON.parse(line);
    if (obj.step_index >= 1563 && obj.step_index <= 1585) {
      if (obj.type === 'PLANNER_RESPONSE') {
        console.log(`=== STEP ${obj.step_index} ===`);
        console.log(obj.thinking?.slice(0, 1000));
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            console.log('CALL:', tc.name, tc.args?.Path);
          }
        }
      }
    }
  }
}

getSteps1563();

