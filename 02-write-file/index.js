const fs = require('fs');
const readline = require('readline');

console.log('Sup! Enter some text here:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  fs.writeFile('output.txt', input, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Text successfully written to file "output.txt"');
    }
    rl.close();
  });
});
