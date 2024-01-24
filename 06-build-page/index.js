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

      let fileCount = 0;

      files.forEach((file) => {
        const componentName = path.parse(file).name;
        const componentFilePath = path.join(componentsFolderPath, file);

        fs.readFile(componentFilePath, 'utf8', (err, componentContent) => {
          if (err) {
            console.error('Error reading component file:', err);
            return;
          }

          const componentPlaceholder = `{{${componentName}}}`;
          templateContent = templateContent.replace(
            componentPlaceholder,
            componentContent,
          );

          fileCount++;

          if (fileCount === files.length) {
            fs.mkdir(
              path.dirname(outputFilePath),
              { recursive: true },
              (err) => {
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
              },
            );
          }
        });
      });
    });
  });
}

const rootDir = './06-build-page';
const targetDir = './project-dist';

const componentsFolderPath = path.join(rootDir, './components');
const templateFilePath = path.join(rootDir, './template.html');
const stylesFolderPath = path.join(rootDir, './styles');
const assetsFolderPath = path.join(rootDir, './assets');

const outputHTMLFilePath = path.join(rootDir, targetDir, './index.html');
const outputStylesFile = path.join(rootDir, targetDir, './style.css');
const outputAssetsPath = path.join(rootDir, targetDir, './assets');

copyDir(assetsFolderPath, outputAssetsPath);
compileHTMLTemplate(templateFilePath, componentsFolderPath, outputHTMLFilePath);
compileStyles(stylesFolderPath, targetDir, outputStylesFile);
