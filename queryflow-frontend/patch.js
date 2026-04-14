const fs = require('fs');

const modalFiles = [
  'AddAssetModal.js',
  'CreateVaultModal.js',
  'CSVImportModal.js',
  'EditAssetModal.js',
  'InvoiceModal.js',
  'OnboardingModal.js',
  'SellModal.js',
  'TeamModal.js'
];

modalFiles.forEach(fileName => {
  const filePath = '/Users/mac/Downloads/demo/queryflow-frontend/src/components/' + fileName;
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Change background overlay to be full screen
  content = content.replace(/className="([^"]*bg-\[\#0a0a0a\][^"]*|[^"]*bg-\[\#0f0f0f\][^"]*)"/g, (match, cls) => {
    let newCls = cls.replace(/rounded-\[.*?\]|rounded-2xl|rounded-3xl/, 'rounded-none sm:rounded-[2.5rem]');
    if (!newCls.includes('h-full')) {
      newCls += ' h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto w-full'; 
    }
    return `className="${newCls}"`;
  });
  
  // Make inputs 44px
  content = content.replace(/p-4/g, 'p-4 min-h-[44px]');
  content = co  content = co  contentp-  content = co  content / E  content = co  conur is top left properly
  content = content.repla  content = content.r*flex items-center justify-center[^"]*p-6/g, (match) => {
      return      return    p-6', 'p-0 sm:p-6').replace('items-center', 'items-start sm:items-center');
  });

  fs.writeFileSync(filePath, content);
  console.log("Patched " + fileName);
});
