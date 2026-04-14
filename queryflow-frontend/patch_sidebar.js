const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/pages/Vault.js';
let content = fs.readFileSync(file, 'utf8');

// For navigation tabs
content = content.replace(
  'onClick={() => setActiveTab(tab)}',
  'onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}'
);

// For Vault selection
content = content.replace(
  'setActiveVault(vault);',
  'setActiveVault(vault);\n                          setIsMobileMenuOpen(false);'
);

// For AI button
content = content.replace(
  'onClick={() => setIsAiOpen(true)}',
  'onClick={() => { setIsAiOpen(true); setIsMobileMenuOpen(false); }}'
);

// Team Access
content = content.replace(
  'onClick={() => setIsTeamOpen(true)}',
  'onClick={() => { setIsTeamOpen(true); setIsMobileMenuOpen(false); }}'
);

fs.writeFileSync(file, content);
console.log("Patched sidebars");
