const fs = require('fs');
const readline = require('readline');

async function getStep1460() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const obj = JSON.parse(line);
    if (obj.step_index === 1460 || obj.step_index === 1459) {
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'edit_file') {
            console.log('REPLACEMENT IN STEP', obj.step_index);
            console.log(tc.args.Replacement);
          }
        }
      }
    }
  }
}

getStep1460();

