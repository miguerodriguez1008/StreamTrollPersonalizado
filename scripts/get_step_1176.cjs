const fs = require('fs');
const readline = require('readline');

async function getStep1176() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const obj = JSON.parse(line);
    if (obj.step_index === 1175 || obj.step_index === 1176) {
      if (obj.type === 'PLANNER_RESPONSE') {
        console.log('--- THINKING OF STEP', obj.step_index, '---');
        console.log(obj.thinking?.slice(0, 1500));
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            console.log('TOOL CALL:', tc.name, tc.args?.Path);
          }
        }
      }
    }
  }
}

getStep1176();

