const fs = require('fs');
const readline = require('readline');

async function getStep1175() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('podrias dejar el slider que manejamos de este estilo')) {
      const obj = JSON.parse(line);
      console.log('FULL USER REQUEST:\n', obj.content);
      return;
    }
  }
}

getStep1175();

