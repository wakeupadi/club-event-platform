const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components'];

function processDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Replace hardcoded blacks with bg-background and cards with bg-card
      content = content.replace(/bg-\[\#111111\]/g, 'bg-card/80 backdrop-blur-xl shadow-2xl');
      content = content.replace(/bg-\[\#121214\]/g, 'bg-card/90 backdrop-blur-xl shadow-lg');
      content = content.replace(/bg-black/g, 'bg-background');
      
      // Upgrade buttons to gradients
      content = content.replace(/bg-indigo-600 hover:bg-indigo-500/g, 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20');
      content = content.replace(/bg-white text-black hover:bg-zinc-200/g, 'bg-gradient-to-r from-teal-400 to-emerald-400 text-black hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-500/20 font-bold');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(dir => processDir(path.join(__dirname, dir)));
console.log("Color replacement complete.");
