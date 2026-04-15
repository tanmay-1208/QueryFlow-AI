import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Colors replacements
    # General Dark background -> #080A0F
    content = re.sub(r'bg-\[\#0e0e0e\]', 'bg-[#080A0F]', content)
    content = re.sub(r'bg-\[\#050505\]', 'bg-[#080A0F]', content)
    content = re.sub(r'bg-black\/90', 'bg-[#080A0F]/90', content)
    content = re.sub(r'bg-black\/40', 'bg-[#080A0F]/40', content)
    content = re.sub(r'bg-black', 'bg-[#080A0F]', content)

    # Surface cards -> #0D1117
    content = re.sub(r'bg-\[\#131313\]', 'bg-[#0D1117]', content)
    content = re.sub(r'bg-\[\#181818\]', 'bg-[#0D1117]', content)
    content = re.sub(r'bg-\[\#1c1b1b\]', 'bg-[#0D1117]', content)

    # Primary accent: Muted Gold #C9A84C
    # Replacing most #4182ff but the prompt actually said:
    # "Secondary accent: #4A9EFF (cool electric blue for data/numbers)" 
    # Let me hold off and actually just do CSS overrides. It's safer and less destructive to the functional code.

