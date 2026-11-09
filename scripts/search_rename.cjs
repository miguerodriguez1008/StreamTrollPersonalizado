const fs = require('fs');
const readline = require('readline');

async function searchRenameHistory() {
  const fileStream = fs.createReadStream('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('customLabel') || line.includes('renombrar') || line.includes('editingMappingId')) {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'edit_file' && tc.args.Replacement && (tc.args.Replacement.includes('customLabel') || tc.args.Replacement.includes('editingMappingId'))) {
            fs.writeFileSync('C:\\Users\\MI PC\\.gemini\\antigravity\\brain\\4a219bdd-76a9-4280-a037-bcd1dc31d54a\\scratch\\rename_edit.txt', tc.args.Replacement, 'utf8');
            console.log('Found rename edit! Length:', tc.args.Replacement.length);
          }
        }
      }
    }
  }
}

searchRenameHistory();

