const fs = require('fs');
const path = require('path');

function copyDir(sourceDir, targetDir) {
  fs.mkdir(targetDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(sourceDir, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        fs.lstat(sourcePath, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }

          if (stats.isFile()) {
            fs.copyFile(sourcePath, targetPath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          } else if (stats.isDirectory()) {
            copyDir(sourcePath, targetPath);
          }
        });
      });
    });
  });
}

const sourceDir = './04-copy-directory/files';
const targetDir = './04-copy-directory/files-copy';

copyDir(sourceDir, targetDir);
