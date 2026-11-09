const fs = require('fs');
const readline = require('readline');

async function searchSliderHistory() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepNum = 0;
  for await (const line of rl) {
    stepNum++;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT' && obj.content && (obj.content.toLowerCase().includes('slider') || obj.content.toLowerCase().includes('carrusel') || obj.content.toLowerCase().includes('regalo') || obj.content.toLowerCase().includes('ticker') || obj.content.toLowerCase().includes('pantalla'))) {
        console.log(`[USER STEP ${obj.step_index || stepNum}]:`, obj.content);
      }
    } catch (e) {}
  }
}

searchSliderHistory();

