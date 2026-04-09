const fs = require('fs');
const babel = require('@babel/core');
['src/pages/FeaturesPage.js', 'src/pages/SecurityPage.js', 'src/pages/SolutionsPage.js'].forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  try {
    babel.transformSync(code, { presets: ['@babel/preset-react'] });
    console.log(file, 'JSX is valid!');
  } catch (e) {
    console.error(file, 'JSX parsing error:', e.message);
  }
});
