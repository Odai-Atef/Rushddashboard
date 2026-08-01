#!/usr/bin/env python3
"""
Sixth pass: Clean up remaining dark: variants and specific color patterns.
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

    # Remove remaining dark: variants
    content = re.sub(r"\s*dark:bg-\[var\(--danger\)\]/30", '', content)
    content = re.sub(r"\s*dark:text-orange-300", '', content)
    content = re.sub(r"\s*dark:bg-amber-500/10", '', content)
    content = re.sub(r"\s*dark:bg-violet-500/10", '', content)
    content = re.sub(r"\s*dark:bg-blue-900/20", '', content)
    content = re.sub(r"\s*dark:border-emerald-500/30", '', content)
    content = re.sub(r"\s*dark:border-blue-500/30", '', content)
    content = re.sub(r"\s*dark:border-violet-500/30", '', content)
    content = re.sub(r"\s*dark:border-white/\[0\.08\]", '', content)

    # Fix dark:border-color-900
    content = re.sub(r"\s*dark:border-emerald-900", '', content)
    content = re.sub(r"\s*dark:border-violet-900", '', content)
    content = re.sub(r"\s*dark:border-sky-900", '', content)
    content = re.sub(r"\s*dark:border-indigo-900", '', content)
    content = re.sub(r"\s*dark:border-amber-900", '', content)
    content = re.sub(r"\s*dark:border-blue-900", '', content)
    content = re.sub(r"\s*dark:border-red-900", '', content)

    # Fix border-color-100
    content = re.sub(r'\bborder-emerald-100\b', 'border-[var(--primary)]/[0.2]', content)
    content = re.sub(r'\bborder-violet-100\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-sky-100\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-indigo-100\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-amber-100\b', 'border-[var(--warning)]/[0.2]', content)
    content = re.sub(r'\bborder-blue-100\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-red-100\b', 'border-[var(--destructive)]/[0.2]', content)

    # Fix bg-sky-50
    content = re.sub(r'\bbg-sky-50\b', 'bg-[var(--secondary)]/[0.1]', content)

    # Fix text-sky-600
    content = re.sub(r'\btext-sky-600\b', 'text-[var(--secondary)]', content)

    # Fix remaining text-color-600
    content = re.sub(r'\btext-orange-600\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-cyan-600\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-pink-600\b', 'text-[var(--destructive)]', content)
    content = re.sub(r'\btext-teal-600\b', 'text-[var(--primary)]', content)

    # Fix border-color-500/20, border-color-500/30
    content = re.sub(r'\bborder-emerald-500/20\b', 'border-[var(--primary)]/[0.2]', content)
    content = re.sub(r'\bborder-emerald-500/30\b', 'border-[var(--primary)]/[0.3]', content)
    content = re.sub(r'\bborder-blue-500/20\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-blue-500/30\b', 'border-[var(--secondary)]/[0.3]', content)
    content = re.sub(r'\bborder-violet-500/20\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-violet-500/30\b', 'border-[var(--secondary)]/[0.3]', content)

    # Fix bg-gradient-to-l from-color-500/5
    content = re.sub(r'bg-gradient-to-l from-emerald-500/5 to-transparent', 'bg-gradient-to-l from-[var(--primary)]/[0.05] to-transparent', content)
    content = re.sub(r'bg-gradient-to-l from-blue-500/5 via-violet-500/5 to-transparent', 'bg-gradient-to-l from-[var(--secondary)]/[0.05] via-[var(--secondary)]/[0.05] to-transparent', content)

    # Fix bg-[var(--card)] rounded-2xl border border-[var(--border)]/[0.5] -> simplify
    content = re.sub(r'border-\[var\(--border\)\]/\[0\.5\]', 'border-[var(--border)]/[0.5]', content)
    content = re.sub(r'border-\[var\(--border\)\]/80', 'border-[var(--border)]/[0.8]', content)

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
