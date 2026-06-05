const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.push('./index.html');
let changedCount = 0;

const colorsToReplace = [
  'emerald', 'sky', 'orange', 'purple', 'yellow', 'red', 'teal', 'cyan', 'indigo', 'rose', 'pink'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content;

  colorsToReplace.forEach(color => {
    const rx = new RegExp(`bg-${color}-`, 'g');
    newContent = newContent.replace(rx, `bg-blue-`);

    const rxT = new RegExp(`text-${color}-`, 'g');
    newContent = newContent.replace(rxT, `text-blue-`);
    
    const rxB = new RegExp(`border-${color}-`, 'g');
    newContent = newContent.replace(rxB, `border-blue-`);

    const rxR = new RegExp(`ring-${color}-`, 'g');
    newContent = newContent.replace(rxR, `ring-blue-`);
    
    const rxS = new RegExp(`shadow-${color}-`, 'g');
    newContent = newContent.replace(rxS, `shadow-blue-`);
  });

  if (content !== newContent) {
    fs.writeFileSync(f, newContent, 'utf8');
    changedCount++;
  }
});

console.log(`Done. Changed ${changedCount} files.`);
