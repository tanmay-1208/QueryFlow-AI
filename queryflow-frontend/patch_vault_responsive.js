const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/pages/Vault.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add sidebar state
if(!content.includes('isMobileMenuOpen')) {
    content = content.replace(
        'const [loadingItems, setLoadingItems] = useState(false);',
        'const [loadingItems, setLoadingItems] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);'
    );
}

// 2. Hide sidebar on mobile
content = content.replace(
    '<aside className="w-64 border-r border-white/5 p-8 flex flex-col justify-between bg-black/40 backdrop-blur-xl shrink-0 z-20">',
    'x{ASIDE}'
);

// We need a wrapper with hamburger if mobile menu is open. So let's replace <main> header
content = content.replace(
    /<main className="flex-1 flex flex-col min-w-0 bg=\[\#050505\] relative transition-all duration-500 ease-in-out">[\s\S]*?<header className="h-2    /<main className="flex-1 flex flex-col min-w-0 bg=\[\#050505\] relative transitio`<main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative transition-all duration-500 ease-in-out">
        <header className="h-auto min-h-[6rem] py-4 border-b border-white/5 flex flex-col md:flex-row md:justify-between items-start md:items-center px-6 md:px-12 shrink-0 gap-4 md:gap-0">
          <div classN          <div classN          <div classN          <div classN          <div classN          <div classN          <div classN      -none" onClick={() => setIsMobileMenuOpen(          <div classN              <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
            </button>
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] text-white/20 italic">
              {activeTab} _Interface
            </h2>
          </div>`
);

content = content.replace(
    'x{ASIDE}',
    `<aside className={\`w-64 border-r border-white/5 p-8 flex flex-col justify-between bg-black/90 md:bg-black/40 backdrop-blur-xl shrink-0 z-50 absolute md:relative top-0 bottom-0 left-0 transition-transform duration-300 \${isMobileMenuOpen ? "translate-x-0" : "    `<aside className={\`w-64 border-r border-white/5 p-8 flex flex-col justify-between bg-black/90 md:bg-black/40 backdrop-blu
    '<div className="flex items-center gap-6">',
    '<div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-end">'
);
content = content.replace(
    '<div className="flex items-center gap-3">',
    '<div className="flex items-center gap-2 sm:gap-3">'
);


// Replace Vault screen padding
content = content.replace(
    '<div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">',
    '<div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 space-y-6 md:space-y-10 custom-scrollbar">'
);

// Replace flex h-screen
content = content.replace(
    '<div className="flex h-screen bg-[#050505] font-[\'JetB    '<div className="flex h-screen bg-[#050505] font-[\'JetB    '<div className="flex h-screen bg-[#050505] font-[\'JetB    '<div className="flex h-screen bg-[#050505] font-[\'JetB    '<div className="flex h-screen bg-[#050505] font-[\'JetB    '<div className="flex h-screen bg-[#050505] font-[\'JetB    '<div className="flex h-screen bg-[#050505] font-[\'JetB   w-[400px] opacity-100" : "w-0    '<div className="flex h-screen bg-[#05050sName={`h-full bg-[#080808] border-l border-white/10 transition-all duration-500 ease-in-out overflow-hidden shrink-0 z-30 ${isAiOpen ? "w-full md:w-[400px] absolute md:relative right-0 opacity-100" : "w-0 opacity-0 border-transparent"} flex flex-col`}'
);

content = content.replace(
    '<button onClick={() => setIsAiOpen(false)} className="text-white/40 hover:text-white transition-colors">',
    '<button onClick={() => setIsAiOpen(false)} className="text-white/40 hover:text-white transition-colors p-2">'
);

// Add missing material icons if necessary (in index.html), but we just assume they're there (since it's used elsewhere for "download" icon)
if (!content.includes('material-symbols-outlined') && content.includes('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />')) {
  // It's in index.html probably.
}

content = content.replace(/px-12/g, "px-6 sm:px-8 md:px-12");

fs.writeFileSync(file, content);
console.log("Patched Vault.js layout to be mobile responsive");
