const fs = require('fs');
const glob = require('glob');
const path = require('path');

const walkSync = function(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('build')) {
         walkSync(fullPath, filelist);
      }
    } else if (fullPath.endsWith('.js')) {
      filelist.push(fullPath);
    }
  });
  return filelist;
};

const allJsFiles = walkSync('/Users/mac/Downloads/demo/queryflow-frontend/src');

allJsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace text-[7px], text-[8px], text-[9px], text-[10px], text-[11px], text-[12px]
  content = content.replace(/text-\[(\d+)px\]/g, (match, p1) => {
    const size = parseInt(p1, 10);
    // If less than 14px, enforce 14px min on mobile, keep original on md:
    if (size < 14) {
      return `text-[14px] md:text-[${size}px]`;
    }
    return match;
  });

  // Ensure text-xs becomes text-[14px] md:text-xs (12px)
                              e text-xs might already have md:text-xs
  content =  content =  content =  content =  consm:)text-xs/g, 'text-[14px] md:text-xs');

  fs.writeFileSync(file, content);
});

console.log("Patched fonts in " + allJsFiles.length + " files");
