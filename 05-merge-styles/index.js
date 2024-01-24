const fs = require('fs');
const path = require('path');

function compileStyles(stylesFolderPath, outputFolderPath, outputFile) {
  fs.readdir(stylesFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading styles folder:', err);
      return;
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    let bundleContent = '';
    let fileCount = 0;

    cssFiles.forEach((file) => {
      const filePath = path.join(stylesFolderPath, file);
      fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
        bundleContent += fileContent;
        fileCount++;

        if (fileCount === cssFiles.length) {
          fs.mkdir(outputFolderPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Error creating output folder:', err);
              return;
            }

            fs.writeFile(outputFile, bundleContent, 'utf8', (err) => {
              if (err) {
                console.error('Error writing file:', err);
                return;
              }
              console.log('bundle.css was created');
            });
          });
        }
      });
    });
  });
}

const stylesFolderPath = './05-merge-styles/styles';
const outputFolderPath = './05-merge-styles/project-dist';
const outputFile = path.join(outputFolderPath, 'bundle.css');

compileStyles(stylesFolderPath, outputFolderPath, outputFile);
