#!/usr/bin/env python3
"""
Third pass: Handle remaining special cases.
"""

import os
import re

SKIP_DIRS = {'node_modules', '.git', 'dist', 'build', '.next'}
EXTENSIONS = {'.tsx', '.ts'}

def should_process(path):
    if any(d in path for d in SKIP_DIRS):
        return False
    return any(path.endswith(ext) for ext in EXTENSIONS)

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    original = content

    # Fix remaining text-white that should be primary-foreground
    content = re.sub(r'\btext-white\b(?!-[\w-])', 'text-[var(--primary-foreground)]', content)

    # Fix remaining bg-white
    content = re.sub(r'\bbg-white\b(?!-[\w-])', 'bg-[var(--card)]', content)

    # Fix remaining bg-black patterns
    content = re.sub(r'\bbg-black/10\b', 'bg-[var(--text-primary)]/[0.1]', content)
    content = re.sub(r'\bbg-black/20\b', 'bg-[var(--text-primary)]/[0.2]', content)
    content = re.sub(r'\bbg-black/30\b', 'bg-[var(--text-primary)]/[0.3]', content)
    content = re.sub(r'\bbg-black/40\b', 'bg-[var(--text-primary)]/[0.4]', content)
    content = re.sub(r'\bbg-black/50\b', 'bg-[var(--text-primary)]/[0.5]', content)

    # Fix remaining hover:bg-white/10, hover:bg-white/5 etc
    content = re.sub(r'hover:bg-white/10', 'hover:bg-[var(--primary-foreground)]/[0.1]', content)
    content = re.sub(r'hover:bg-white/5', 'hover:bg-[var(--primary-foreground)]/[0.05]', content)
    content = re.sub(r'bg-white/10', 'bg-[var(--primary-foreground)]/[0.1]', content)
    content = re.sub(r'bg-white/5', 'bg-[var(--primary-foreground)]/[0.05]', content)
    content = re.sub(r'bg-white/20', 'bg-[var(--primary-foreground)]/[0.2]', content)
    content = re.sub(r'bg-white/30', 'bg-[var(--primary-foreground)]/[0.3]', content)
    content = re.sub(r'bg-white/40', 'bg-[var(--primary-foreground)]/[0.4]', content)
    content = re.sub(r'bg-white/50', 'bg-[var(--primary-foreground)]/[0.5]', content)
    content = re.sub(r'bg-white/60', 'bg-[var(--primary-foreground)]/[0.6]', content)
    content = re.sub(r'bg-white/70', 'bg-[var(--primary-foreground)]/[0.7]', content)
    content = re.sub(r'bg-white/80', 'bg-[var(--primary-foreground)]/[0.8]', content)
    content = re.sub(r'bg-white/90', 'bg-[var(--primary-foreground)]/[0.9]', content)

    # Fix border-white/10, border-white/20 etc
    content = re.sub(r'border-white/10', 'border-[var(--primary-foreground)]/[0.1]', content)
    content = re.sub(r'border-white/20', 'border-[var(--primary-foreground)]/[0.2]', content)
    content = re.sub(r'border-white/30', 'border-[var(--primary-foreground)]/[0.3]', content)
    content = re.sub(r'border-white/40', 'border-[var(--primary-foreground)]/[0.4]', content)

    # Fix text-white/40, text-white/70 etc (remaining)
    content = re.sub(r'text-white/40', 'text-[var(--primary-foreground)]/[0.4]', content)
    content = re.sub(r'text-white/70', 'text-[var(--primary-foreground)]/[0.7]', content)
    content = re.sub(r'text-white/80', 'text-[var(--primary-foreground)]/[0.8]', content)
    content = re.sub(r'text-white/90', 'text-[var(--primary-foreground)]/[0.9]', content)

    # Fix remaining placeholder:text-white
    content = re.sub(r'placeholder:text-white/40', 'placeholder:text-[var(--primary-foreground)]/[0.4]', content)
    content = re.sub(r'placeholder:text-white/50', 'placeholder:text-[var(--primary-foreground)]/[0.5]', content)
    content = re.sub(r'placeholder:text-white/60', 'placeholder:text-[var(--primary-foreground)]/[0.6]', content)

    # Fix text-black
    content = re.sub(r'\btext-black\b(?!-[\w-])', 'text-[var(--text-primary)]', content)

    # Fix remaining dark: variants on bg
    content = re.sub(r'\s*dark:bg-\[var\(--card\)\]/60', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--card\)\]/50', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--primary\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--muted\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--hover\)\]', '', content)

    # Fix remaining dark:text
    content = re.sub(r'\s*dark:text-\[var\(--text-muted\)\]', '', content)
    content = re.sub(r'\s*dark:text-\[var\(--text-primary\)\]', '', content)
    content = re.sub(r'\s*dark:text-\[var\(--text-secondary\)\]', '', content)
    content = re.sub(r'\s*dark:text-\[var\(--card-foreground\)\]', '', content)

    # Fix remaining dark:hover:text
    content = re.sub(r'\s*dark:hover:text-white', '', content)

    # Fix remaining dark:bg-white patterns
    content = re.sub(r'\s*dark:bg-white/[\w.]+', '', content)

    # Clean up double spaces
    content = re.sub(r'  +', ' ', content)
    content = re.sub(r'className=" ', 'className="', content)
    content = re.sub(r"className=' ", "className='", content)
    content = re.sub(r'className=\{cn\(" ', 'className={cn("', content)
    content = re.sub(r'className=\{cn\(\' ', 'className={cn(\'', content)
    content = re.sub(r'className=\{\[([^\]]*?)  ([^\]]*?)\]\}', r'className={\[\1 \2\]}', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    modified_count = 0
    file_count = 0

    for root, dirs, files in os.walk('src'):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for filename in files:
            filepath = os.path.join(root, filename)
            if should_process(filepath):
                file_count += 1
                if fix_file(filepath):
                    modified_count += 1
                    print(f"  Modified: {filepath}")

    print(f"\nDone. Processed {file_count} files, modified {modified_count}.")

if __name__ == '__main__':
    main()
