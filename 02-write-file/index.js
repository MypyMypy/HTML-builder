const fs = require('fs');
const readline = require('readline');

console.log('Sup! Enter some text here:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  fs.appendFile('./02-write-file/output.txt', input + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Text successfully written to file "output.txt"');
    }
  });
});

rl.on('close', () => {
  console.log('Check result in 02-write-file/output.txt');
});
