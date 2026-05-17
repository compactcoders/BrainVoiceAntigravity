
import re

with open('home.html', 'r', encoding='utf-8') as f:
    content = f.read()

opens = re.findall(r'<p[ >]', content)
closes = re.findall(r'</p>', content)

print(f"Opening <p> tags: {len(opens)}")
print(f"Closing </p> tags: {len(closes)}")

# Find lines with unclosed p tags
lines = content.split('\n')
for i, line in enumerate(lines):
    if '<p' in line and '</p>' not in line:
        # Check if it spans multiple lines
        pass
