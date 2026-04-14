import re

with open('/Users/mac/Downloads/demo/pom.xml', 'r') as f:
    pom = f.read()

lombok_dep = """
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.36</version>
            <scope>provided</scope>
        </dependency>
"""

pom = re.sub(r'<dependency>\s*<groupId>org\.projectlombok</groupId>\s*<artifactId>lombok</artifactId>\s*<optional>true</optional>\s*</dependency>', lombok_dep, pom)

with open('/Users/mac/Downloads/demo/pom.xml', 'w') as f:
    f.write(pom)

