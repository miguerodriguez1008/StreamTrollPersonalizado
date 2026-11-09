const fs = require('fs');
const readline = require('readline');

async function getStepsAfter1175() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT' && (obj.step_index > 1170 && obj.step_index < 3520)) {
        console.log(`[USER STEP ${obj.step_index}]:`, obj.content);
      }
    } catch (e) {}
  }
}

getStepsAfter1175();

