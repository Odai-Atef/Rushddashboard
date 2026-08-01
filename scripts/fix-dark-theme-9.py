#!/usr/bin/env python3
"""
Ninth pass: Fix remaining hardcoded colors.
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

    # Fix bg-green-400
    content = re.sub(r'\bbg-green-400\b', 'bg-[var(--primary)]/[0.7]', content)
    # Fix bg-green-500
    content = re.sub(r'\bbg-green-500\b', 'bg-[var(--primary)]', content)
    # Fix text-green-900
    content = re.sub(r'\btext-green-900\b', 'text-[var(--primary)]/[0.9]', content)
    # Fix text-green-100
    content = re.sub(r'\btext-green-100\b', 'text-[var(--primary)]/[0.4]', content)

    # Fix text-blue-100
    content = re.sub(r'\btext-blue-100\b', 'text-[var(--secondary)]/[0.4]', content)
    # Fix text-blue-300/30
    content = re.sub(r'\btext-blue-300/30\b', 'text-[var(--secondary)]/[0.3]', content)
    # Fix text-blue-900
    content = re.sub(r'\btext-blue-900\b', 'text-[var(--secondary)]/[0.9]', content)
    # Fix text-blue-800
    content = re.sub(r'\btext-blue-800\b', 'text-[var(--secondary)]/[0.8]', content)

    # Clean up
    content = re.sub(r'  +', ' ', content)

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
