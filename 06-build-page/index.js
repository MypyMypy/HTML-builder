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

function compileHTMLTemplate(
  templateFilePath,
  componentsFolderPath,
  outputFilePath,
) {
  fs.readFile(templateFilePath, 'utf8', (err, templateContent) => {
    if (err) {
      console.error('Error reading template file:', err);
      return;
    }

    fs.readdir(componentsFolderPath, (err, files) => {
      if (err) {
        console.error('Error reading components folder:', err);
        return;
      }

      files.forEach((file) => {
        const componentName = path.parse(file).name;
        const componentFilePath = path.join(componentsFolderPath, file);
        const componentContent = fs.readFileSync(componentFilePath, 'utf8');
        const componentPlaceholder = `{{${componentName}}}`;

        templateContent = templateContent.replace(
          componentPlaceholder,
          componentContent,
        );
      });

      fs.mkdir(path.dirname(outputFilePath), { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating output directory:', err);
          return;
        }

        fs.writeFile(outputFilePath, templateContent, 'utf8', (err) => {
          if (err) {
            console.error('Error writing output file:', err);
            return;
          }

          console.log('index.html was created');
        });
      });
    });
  });
}

const targetDir = './project-dist';

const componentsFolderPath = './components';
const templateFilePath = './template.html';
const outputHTMLFilePath = path.join(targetDir, './index.html');

const assetsFolderPath = './assets';
const targetAssetsPath = path.join(targetDir, assetsFolderPath);

const stylesFolderPath = './styles';
const outputStylesFile = path.join(targetDir, 'style.css');

copyDir(assetsFolderPath, targetAssetsPath);
compileHTMLTemplate(templateFilePath, componentsFolderPath, outputHTMLFilePath);
compileStyles(stylesFolderPath, targetDir, outputStylesFile);
