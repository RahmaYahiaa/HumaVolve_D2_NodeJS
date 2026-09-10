const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'source', 'original.txt');
const destinationPath = path.join(__dirname, 'destination', 'pipe-copy.txt');

const readStream = fs.createReadStream(sourcePath);
const writeStream = fs.createWriteStream(destinationPath);

readStream.pipe(writeStream);

readStream.on('error', (err) => {
  console.error('Error reading source file:', err.message);
});

writeStream.on('error', (err) => {
  console.error('Error writing destination file:', err.message);
});

writeStream.on('finish', () => {
  console.log('Pipe copy completed successfully.');

  const originalContent = fs.readFileSync(sourcePath, 'utf8');
  const copiedContent = fs.readFileSync(destinationPath, 'utf8');

  if (originalContent === copiedContent) {
    console.log('Verification passed: destination content matches source content.');
  } else {
    console.log('Verification failed: content does not match.');
  }
});