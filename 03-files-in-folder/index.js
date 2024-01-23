const fs = require('fs');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      const fileInfo = `${file} - ${path.extname(file).slice(1)} - ${
        stats.size
      }b`;
      console.log(fileInfo);
    });
  });
});
