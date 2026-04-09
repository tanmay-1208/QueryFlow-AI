import re

with open('src/pages/FeaturesPage.js', 'r') as f:
    text = f.read()

text = re.sub(
    r'<p className="text-gray-400 max-w-2xl text-lg.*?</p>',
    r'''<p className="text-gray-400 max-w-2xl text-lg mb-20">
          QueryFlow integrates 50+ AI models designed exclusively for financial infrastructure. 
          Track, automate, and optimize your institutional-grade assets with real-time sub-5ms indexing and robust tax provisioning.
        </p>''',
    text,
    flags=re.DOTALL
)

with open('src/pages/FeaturesPage.js', 'w') as f:
    f.write(text)
