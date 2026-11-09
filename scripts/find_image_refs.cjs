const fs = require('fs');
const readline = require('readline');

async function findImageRefs() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('ea2c5358') || line.includes('8f739781')) {
      const obj = JSON.parse(line);
      if (obj.thinking) {
        console.log(`[THINKING STEP ${obj.step_index}]:\n`, obj.thinking.slice(0, 1500));
      }
    }
  }
}

findImageRefs();

