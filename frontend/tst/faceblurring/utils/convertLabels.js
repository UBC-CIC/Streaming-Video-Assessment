import fs from "fs";

const filePath = './wider_face_val_bbx_gt.txt';
const fileContent = fs.readFileSync(filePath, 'utf-8');

const lines = fileContent.split('\n');

let jsonData = {};
let currentImage;

for (const line of lines) {
  if (line.endsWith('.jpg')) {
    currentImage = line.trim();
    jsonData[currentImage] = []
  } else {
    const annotationData = line.split(' ').map(Number);
    if (annotationData.length == 1) {
        jsonData[currentImage].push(annotationData)
    } else {
        jsonData[currentImage].push(annotationData.splice(0, annotationData.length - 1))
    }
  }
}

const jsonContent = JSON.stringify(jsonData, null, 2);

const jsonFilePath = '../labels.json';
fs.writeFileSync(jsonFilePath, jsonContent, 'utf-8');

console.log('Conversion complete. JSON file written to:', jsonFilePath);
