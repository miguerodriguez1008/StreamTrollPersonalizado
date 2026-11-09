const fs = require('fs');
const dest = 'C:\\Users\\MI PC\\AppData\\Local\\Programs\\troll-you\\resources\\app.asar';

try {
  const fd = fs.openSync(dest, 'r+');
  fs.closeSync(fd);
  console.log('File can be opened for writing!');
} catch (e) {
  console.log('Error opening file:', e.code, e.message);
}

