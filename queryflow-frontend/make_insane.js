const fs = require('fs');
let code = fs.readFileSync('/Users/mac/Downloads/demo/queryflow-frontend/src/pages/FeaturesPage.js', 'utf-8');

// Upgrade the description text
code = code.replace(/<motion\.p[\s\S]*?<\/motion\.p>/, \`<motion.p 
            initial={{ opacity: 0, z: -500, rotateX: 60, scale: 0.5 }}
            whileInView={{ opacity: 1, z: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', bounce: 0.7, duration: 2, delay: 0.3 }}
            className="text-gray-400 max-w-2xl text-xl mb-24 drop-shadow-md origin-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            QueryFlow integrates 50+ AI models designed exclusively for financial infrastructure. 
            Track, automate, and optimize your institutional-grade assets with real-time sub-5ms indexing and robust tax provisioning.
          </motion.p>\`);

// Upgrade the grid cards
code = code.replace(/initial={{ opacity: 0, y: 100,code = code.replace(/initial={{code = code.replace(/ini-1000, rotateY: 180, rotateX: 180, scale: 0, filter: 'blur(20px)' }}\`);
code = code.replace(/whileInView={{ opacicode = code.replace(/whileIn, \`code = code.replace(/whileInView={{ opacicode = code.replace(/whille: 1, filter: 'blur(0px)' }}\`);
code = code.replace(/transition={{ duration: 0.8, delay: i \* 0.1, type: \"spring\" }}/g, \`transition={{ duration: 2, delay: i * 0.15, type: 'spring', bounce: 0.6, damping: 12 }}\`);

// Upgrade Deep Dive entrance
code = code.replace(/initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}/g, \`initial={{ opacity: 0, scale: 0.2, rotateX: 90, rotateY: -90, z: -2000, filter: 'blur(50px)' }}\`);
code = code.replace(/whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}/g, \`whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, z: 0, filter: 'blur(0px)' }}\`);
code = code.replace(/transition={{ duration: 1, type: \"spring\" }}/g, \`transition={{ duration: 3, type: 'spring', stiffness: 80, damping: 10, bounce: 0.6 }}\`);

// Add hovering 3d tilts to list items
code = code.replace(/whileHover={{ x: 10, color: \"#8b5cf6\" }}/g, \`whileHover={{ x: code = code.replace(/whileHover={{ x: 10, color: \"#8b5cf6\" }}/g, \`whileHover={{ x: code = code.replace(/whileHover={{ x: 10, color: \"#8b5cf6\" }}/g, \`whileHover={{ x:Sync('/Users/mac/Downloads/demo/queryflow-frontend/src/pages/SecurityPage.js', 'utf-8');
secCode = secCode.replace(/initial={{ opacity: 0, y: 50 }}/g, \`initial={{ opacity: 0, y: 200, rotateX: -90, scale: 0.4 }}\`);
secCode = secCode.replace(/animate={{ opacity: 1, y: 0 }}/g, \`animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}\`);
secCode = secCode.replace(/x: i === 0 \? -150 : 150, rotateY: i === 0 \? -30 : 30/g, \`x: i === 0 ? -500 : 500, y: 800, rotateY: i === 0 ? -180 : 180, rotateZ: i === 0 ? -90 : 90, z: -2000, scale: 0.1\`);
secCode = secCode.replace(/whileInView={{ opacity: 1, x: 0, rotateY: 0 }}/g, \`whileInView={{ opacity: 1, x: 0, y: 0, z: 0, rotateY: 0, rotateZ: 0, scale: 1 }}\`);
secCode = secCode.replasecCode = secCode.replasecCode = sec "spring", bounce: 0.4 }}/g, \`transition={{ duration: 2, type: 'spring', bounce: 0.6, damping: 12 }}\`);
fs.writeFileSync('/Users/mac/Downloads/demo/queryflow-frontend/src/pages/SecurityPage.js', secCode);

// Upgrade SolutionsPage entrances
let solCode = fs.readFileSync('/Users/mac/Downloads/demo/queryflow-frontend/src/pages/SolutionsPage.js', 'utf-8');
solCode = solCode.replace(/initial={{ opacity: 0, rotateX: 60, y: 150, scale: 0.8 }}/g, \`initial={{ opacity: 0, rotatsolCode = solCode.replace(/initial={{ opacity: 0, rotateX: 60, y: 150, scale: 0.8 }}/g, \`initial={{ opacity: 0, rotatX: 0, y: 0, scale: 1 }}/g, \`whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, y: 0, scale: 1 }}\`);
solCode = solCode.replace(/transition={{ duration: 0.8, delay: i \* 0.1, type: "spring", bounce: 0.solCode = solCode.replace(/transition={{ duration: 0.8, delay: i \* 0.1, type: "spring", bounce: 0.solCode = solCode.replace(/transition={{ duration: 0.8, delay: nd/src/pages/SolutionsPage.js', solCode);

fs.writeFileSync('/Users/mac/Downloads/demo/queryflow-frontend/src/pages/FeaturesPage.js', code);
