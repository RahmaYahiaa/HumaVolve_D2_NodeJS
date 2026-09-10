const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'source', 'original.txt');
const destinationPath = path.join(__dirname, 'destination', 'manual-copy.txt');

const readStream = fs.createReadStream(sourcePath);
const writeStream = fs.createWriteStream(destinationPath);

readStream.on('data', (chunk) => {
  console.log(`Received chunk of size: ${chunk.length} bytes`);
  writeStream.write(chunk);
});

readStream.on('end', () => {
  writeStream.end();
  console.log('Reading finished. Writing completed.');
});

readStream.on('error', (err) => {
  console.error('Error reading source file:', err.message);
});

writeStream.on('finish', () => {
  console.log('Destination file has been written successfully.');

  const originalContent = fs.readFileSync(sourcePath, 'utf8');
  const copiedContent = fs.readFileSync(destinationPath, 'utf8');

  if (originalContent === copiedContent) {
    console.log('Verification passed: destination content matches source content.');
  } else {
    console.log('Verification failed: content does not match.');
  }
});

writeStream.on('error', (err) => {
  console.error('Error writing destination file:', err.message);
});