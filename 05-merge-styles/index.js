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
    cssFiles.forEach((file) => {
      const filePath = path.join(stylesFolderPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      bundleContent += fileContent;
    });

    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    fs.writeFileSync(outputFile, bundleContent, 'utf8');

    console.log('bundle.css was created');
  });
}

const stylesFolderPath = './05-merge-styles/styles';
const outputFolderPath = './05-merge-styles/project-dist';
const outputFile = path.join(outputFolderPath, 'bundle.css');

compileStyles(stylesFolderPath, outputFolderPath, outputFile);
