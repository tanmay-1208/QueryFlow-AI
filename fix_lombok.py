import os, glob

for filepath in glob.glob('/Users/mac/Downloads/demo/src/main/java/com/example/demo/*.java'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if '@Entity' in content and '@Data' not in content:
        content = content.replace('@Entity\r\n', '@Entity\n').replace('@Entity\n', '@Entity\n@Data\n')
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {os.path.basename(filepath)}")
