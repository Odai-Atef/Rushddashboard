#!/usr/bin/env python3
"""
Fourth pass: Handle remaining dark: variants and color-specific patterns.
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

    # Remove dark:text-muted-foreground (redundant with CSS vars)
    content = re.sub(r'\s*dark:text-muted-foreground', '', content)
    content = re.sub(r'\s*dark:text-foreground', '', content)
    content = re.sub(r'\s*dark:text-background', '', content)

    # Fix remaining dark:bg-[var(--...)] patterns
    content = re.sub(r'\s*dark:bg-\[var\(--card\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--destructive\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--warning\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--secondary\)\]', '', content)

    # Fix dark:bg-color-950/40 etc
    content = re.sub(r"\s*dark:bg-emerald-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-blue-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-violet-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-amber-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-indigo-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-red-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-purple-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-green-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-sky-950/[\w.]+", '', content)

    # Fix dark:text-color-400 etc
    content = re.sub(r"\s*dark:text-green-400", '', content)
    content = re.sub(r"\s*dark:text-blue-400", '', content)
    content = re.sub(r"\s*dark:text-red-400", '', content)
    content = re.sub(r"\s*dark:text-indigo-400", '', content)
    content = re.sub(r"\s*dark:text-purple-400", '', content)
    content = re.sub(r"\s*dark:text-emerald-400", '', content)
    content = re.sub(r"\s*dark:text-emerald-300", '', content)
    content = re.sub(r"\s*dark:text-emerald-600", '', content)

    # Fix dark:border patterns
    content = re.sub(r"\s*dark:border-purple-800", '', content)
    content = re.sub(r"\s*dark:border-indigo-900", '', content)
    content = re.sub(r"\s*dark:border-blue-900", '', content)
    content = re.sub(r"\s*dark:border-green-900", '', content)
    content = re.sub(r"\s*dark:border-red-900", '', content)
    content = re.sub(r"\s*dark:border-amber-900", '', content)

    # Fix dark:from/to gradients
    content = re.sub(r"\s*dark:from-purple-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:to-blue-950/[\w.]+", '', content)

    # Fix dark:hover:bg patterns
    content = re.sub(r"\s*dark:hover:bg-\[var\(--destructive\)\]/\[0\.18\]", '', content)
    content = re.sub(r"\s*dark:hover:bg-\[var\(--warning\)\]/\[0\.18\]", '', content)
    content = re.sub(r"\s*dark:hover:bg-\[var\(--secondary\)\]/\[0\.18\]", '', content)

    # Fix bg-color-50
    content = re.sub(r'\bbg-blue-50\b', 'bg-[var(--secondary)]/[0.08]', content)
    content = re.sub(r'\bbg-emerald-50\b', 'bg-[var(--primary)]/[0.08]', content)
    content = re.sub(r'\bbg-green-50\b', 'bg-[var(--primary)]/[0.08]', content)
    content = re.sub(r'\bbg-violet-50\b', 'bg-[var(--secondary)]/[0.08]', content)
    content = re.sub(r'\bbg-amber-50\b', 'bg-[var(--warning)]/[0.08]', content)
    content = re.sub(r'\bbg-indigo-50\b', 'bg-[var(--secondary)]/[0.08]', content)
    content = re.sub(r'\bbg-red-50\b', 'bg-[var(--destructive)]/[0.08]', content)
    content = re.sub(r'\bbg-purple-50\b', 'bg-[var(--secondary)]/[0.08]', content)

    # Fix text-color-600
    content = re.sub(r'\btext-blue-600\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-emerald-600\b', 'text-[var(--primary)]', content)
    content = re.sub(r'\btext-green-600\b', 'text-[var(--primary)]', content)
    content = re.sub(r'\btext-violet-600\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-amber-600\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-indigo-700\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-red-600\b', 'text-[var(--destructive)]', content)
    content = re.sub(r'\btext-emerald-700\b', 'text-[var(--primary)]', content)
    content = re.sub(r'\btext-emerald-100\b', 'text-[var(--primary)]/[0.3]', content)

    # Fix border-color-100
    content = re.sub(r'\bborder-indigo-100\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-purple-200\b', 'border-[var(--secondary)]/[0.2]', content)

    # Fix bg-green-500/20
    content = re.sub(r'\bbg-green-500/20\b', 'bg-[var(--primary)]/[0.2]', content)

    # Fix dark:bg-[var(--...)]/[0.12] etc
    content = re.sub(r"\s*dark:bg-\[var\(--destructive\)\]/\[0\.12\]", '', content)
    content = re.sub(r"\s*dark:bg-\[var\(--warning\)\]/\[0\.12\]", '', content)
    content = re.sub(r"\s*dark:bg-\[var\(--secondary\)\]/\[0\.12\]", '', content)

    # Fix dark:bg-red-900/10
    content = re.sub(r"\s*dark:bg-red-900/[\w.]+", '', content)

    # Clean up double spaces
    content = re.sub(r'  +', ' ', content)
    content = re.sub(r'className=" ', 'className="', content)
    content = re.sub(r"className=' ", "className='", content)

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
