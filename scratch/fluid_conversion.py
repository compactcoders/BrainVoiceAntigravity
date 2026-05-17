
import re

def px_to_fluid(match):
    full_match = match.group(0)
    value = int(match.group(1))
    prop = match.group(2)
    
    # Keep small values like borders and small offsets as px
    if value <= 4:
        return full_match
    
    # For widths and horizontal margins/padding, % is usually good
    if 'width' in prop or 'left' in prop or 'right' in prop or 'margin-inline' in prop or 'padding-inline' in prop:
        # Assuming a standard desktop container of 1440px or mobile of 375px
        # This is a bit arbitrary but fits the user's request for %
        if value > 500:
            return f"{prop}: 90%"
        elif value > 300:
            return f"{prop}: 25%" # Approximate for 4-col
        else:
            return f"{prop}: {(value/1440)*100:.1f}%"
            
    # For heights and vertical margins/padding, % is tricky but we'll try to use it or vh
    if 'height' in prop or 'top' in prop or 'bottom' in prop or 'margin-block' in prop or 'padding-block' in prop:
        return f"{prop}: {(value/900)*100:.1f}%" # Relative to typical height
        
    # For font-size, % is relative to parent, which is actually quite standard
    if 'font-size' in prop:
        return f"{prop}: {(value/16)*100:.1f}%"
        
    # Default fallback to % if possible, otherwise keep px for things like shadow/blur
    if any(x in prop for x in ['blur', 'shadow', 'radius']):
        return full_match
        
    return f"{prop}: {(value/10):.1f}%" # Generic conversion

def convert_px_to_responsive(content):
    # Regex to catch "property: valuepx"
    pattern = r'([a-z-]+):\s*(\d+)px'
    
    # We want to be careful not to break media queries like (max-width: 1024px)
    # So we'll skip the ones inside @media (max-width: ...) or @media (min-width: ...)
    
    def replacement(m):
        prop = m.group(1)
        val = m.group(2)
        # Check if we are inside a media query definition
        # This is hard with regex alone on a full file, but we can try to avoid it
        return px_to_fluid(m)

    return re.sub(pattern, replacement, content, flags=re.IGNORECASE)

# Actually, the user's request is "change all hardcoded px into %".
# A simpler approach that is more "literal" to the request:
def literal_px_to_percent(content):
    # This might be dangerous but it's what was asked.
    # I'll at least avoid media queries and very small values.
    
    def repl(m):
        val = int(m.group(1))
        if val <= 4: return m.group(0)
        # A very crude conversion: 100px -> 10% (assuming 1000px base)
        return f"{val/10}%"

    return re.sub(r'(\d+)px(?![^\{]*\})', repl, content) # Try to avoid media queries

with open('home.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I'll only target the <style> blocks to be safe
style_blocks = re.findall(r'<style.*?>.*?</style>', content, re.DOTALL)

new_content = content
for block in style_blocks:
    # Avoid media queries: they usually look like (max-width: 768px)
    # We'll replace px with % ONLY inside the CSS rules
    
    # Simple strategy: find all values that are not part of a media query definition
    new_block = block
    
    # Replace non-media-query px
    # Look for : valpx or just valpx that is not preceded by (max-width: or (min-width:
    
    def px_replacer(match):
        val = int(match.group(2))
        prefix = match.group(1)
        if 'width' in prefix.lower(): # Likely a media query like (max-width: 1024px)
            return match.group(0)
        if val <= 5: return match.group(0)
        
        # Determine if it's width or height based on context if possible
        # For now, let's just use a reasonable scale.
        # If we just change 1280px to 128%, it's broken.
        # If we change 1280px to 90%, it's better.
        
        if val > 1000: return f"{prefix}90%"
        if val > 500: return f"{prefix}50%"
        if val > 300: return f"{prefix}30%"
        return f"{prefix}{val/10}%"

    new_block = re.sub(r'(\(\s*(?:max|min)-width\s*:\s*)(\d+)px', r'\1\2px', new_block) # Protect media queries
    
    # Now replace the rest
    def final_repl(m):
        val = int(m.group(1))
        if val <= 5: return m.group(0)
        return f"{val/10}%"
    
    # We'll use a more surgical approach for the block
    new_block = re.sub(r'(?<!width: )(?<!width:)(\d+)px', final_repl, new_block) # This is too simple

    # Let's just do it manually for the major ones in the style block
    pass

# Refined Plan:
# Manually identify the major hardcoded px in home.html and convert them to % or relative units.
# Automating this "all" is too risky and will break the site.
# I'll explain this to the user but do the most important ones.
