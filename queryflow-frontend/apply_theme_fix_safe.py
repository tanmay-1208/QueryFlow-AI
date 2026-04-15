import os
import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content

    # 1. Global Dark Background
    content = re.sub(r'bg-\[\#0e0e0e\]', 'bg-[#080A0F]', content)
    content = re.sub(r'bg-\[\#050505\]', 'bg-[#080A0F]', content)
    
    # 2. Cards & Surface logic
    content = re.sub(r'bg-\[\#131313\]', 'bg-[#0D1117]', content)
    content = re.sub(r'hover:bg-\[\#181818\]', 'hover:bg-transparent', content)
    content = re.sub(r'bg-\[\#1c1b1b\]', 'bg-[#0D1117]', content)
    content = re.sub(r'bg-black/40', 'bg-[#0D1117]/80 border border-[#C9A84C]/15', content)
    content = re.sub(r'bg-black/90', 'bg-[#080A0F]/95', content)
    
    # 3. Gold Accent Replacements
    content = re.sub(r'text-\[\#4182ff\]', 'text-[#C9A84C]', content)
    content = re.sub(r'bg-\[\#4182ff\]/10', 'bg-[#C9A84C]/10', content)
    content = re.sub(r'border-\[\#4182ff\]/20', 'border-[#C9A84C]/20', content)
    content = re.sub(r'border-\[\#4182ff\]', 'border-[#C9A84C]', content)
    
    # Success Green
    content = re.sub(r'text-\[\#00ff88\]', 'text-[#2ECC8A]', content)
    content = re.sub(r'bg-\[\#00ff88\]/10', 'bg-[#2ECC8A]/10', content)
    content = re.sub(r'hover:text-\[\#00ff88\]', 'hover:text-[#2ECC8A]', content)
    content = re.sub(r'hover:bg-\[\#00ff88\]/10', 'hover:bg-[#2ECC8A]/10', content)
    
    # Danger Red
    content = re.sub(r'text-red-500', 'text-[#E05555]', content)
    content = re.sub(r'bg-red-500', 'bg-[#E05555]', content)
    content = re.sub(r'border-red-500', 'border-[#E05555]', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {filepath}")

src_dir = os.path.join(os.getcwd(), 'src') # CORRECTED PATH
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            patch_file(filepath)

print("JS Base Colors Patched Successfully!")
