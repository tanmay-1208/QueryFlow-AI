import os
import re

# We will apply smart text replacements on the React components

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Replace global dark background colors
    content = re.sub(r'bg-\[\#050505\]', 'bg-[#080A0F]', content)
    content = re.sub(r'bg-\[\#0e0e0e\]', 'bg-[#080A0F]', content)
    
    # Surface cards
    content = re.sub(r'bg-\[\#131313\]', 'bg-[#0D1117]', content)
    content = re.sub(r'bg-\[\#181818\]', 'bg-[#0D1117]', content)
    content = re.sub(r'bg-\[\#1c1b1b\]', 'bg-[#0D1117]', content)
    
    # Border colors for surface cards
    content = re.sub(r'border-white\/5', 'border-[#C9A84C]/15', content)
    
    # Primary accent / Blue replacements
    content = re.sub(r'text-\[\#4182ff\]', 'text-[#C9A84C]', content)
    content = re.sub(r'bg-\[\#4182ff\]', 'bg-[#C9A84C]', content)
    content = re.sub(r'border-\[\#4182ff\]', 'border-[#C9A84C]', content)
    
    # Secondary accent (replacing text-[#4182ff] specifically for numbe    # Secondary accent (replacing text-[#4182ff] specifically C i    # Secondary accent ndle specific ones manually)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

# We actually want to manually patch some key components to perfectly match the prompt!

