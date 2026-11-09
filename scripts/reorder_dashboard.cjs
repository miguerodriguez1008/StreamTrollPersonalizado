const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('src/Dashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8').replace(/\r\n/g, '\n');

const blockStartStr = `  // Persistent Config Disk Writer (guarantees settings stay saved across app restarts)\n  const persistConfigToDisk = useCallback((partialData) => {`;
const blockEndStr = `  // Mappings management\n  const saveGiftMappings = (updated) => {`;

const startIdx = content.indexOf(blockStartStr);
const endIdx = content.indexOf(blockEndStr);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find block boundaries:', { startIdx, endIdx });
  process.exit(1);
}

const timerBlock = content.slice(startIdx, endIdx);
console.log('Extracted timerBlock length:', timerBlock.length);

// Remove the timerBlock from its current position
content = content.slice(0, startIdx) + content.slice(endIdx);

// Target insertion point: right before `  const sendEffect = useCallback((effectName, durationSec = 8) => {`
const insertTarget = `  const sendEffect = useCallback((effectName, durationSec = 8) => {`;
const insertIdx = content.indexOf(insertTarget);

if (insertIdx === -1) {
  console.error('Could not find insert target');
  process.exit(1);
}

content = content.slice(0, insertIdx) + timerBlock + '\n' + content.slice(insertIdx);
console.log('Inserted timerBlock before sendEffect');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully reordered Dashboard.jsx! Total length:', content.length);

