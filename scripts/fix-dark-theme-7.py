#!/usr/bin/env python3
"""
Seventh pass: Final cleanup of remaining dark: variants and specific patterns.
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
    content = re.sub(r"\s*dark:bg-teal-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-pink-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-orange-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-rose-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-cyan-950/[\w.]+", '', content)
    content = re.sub(r"\s*dark:bg-yellow-500/10", '', content)
    content = re.sub(r"\s*dark:bg-yellow-500/20", '', content)
    content = re.sub(r"\s*dark:bg-orange-500/10", '', content)
    content = re.sub(r"\s*dark:bg-green-500/10", '', content)
    content = re.sub(r"\s*dark:bg-amber-500/10", '', content)
    content = re.sub(r"\s*dark:bg-amber-500/20", '', content)
    content = re.sub(r"\s*dark:bg-amber-900/50", '', content)
    content = re.sub(r"\s*dark:bg-blue-900/50", '', content)
    content = re.sub(r"\s*dark:bg-slate-950/50", '', content)
    content = re.sub(r"\s*dark:bg-violet-300", '', content)
    content = re.sub(r"\s*dark:bg-violet-100", '', content)
    content = re.sub(r"\s*dark:bg-primary/10", '', content)
    content = re.sub(r"\s*dark:bg-green-500/10", '', content)

    content = re.sub(r"\s*dark:border-teal-900", '', content)
    content = re.sub(r"\s*dark:border-pink-900", '', content)
    content = re.sub(r"\s*dark:border-orange-900", '', content)
    content = re.sub(r"\s*dark:border-rose-900", '', content)
    content = re.sub(r"\s*dark:border-cyan-900", '', content)
    content = re.sub(r"\s*dark:border-red-800", '', content)
    content = re.sub(r"\s*dark:border-amber-800", '', content)
    content = re.sub(r"\s*dark:border-blue-800", '', content)
    content = re.sub(r"\s*dark:border-violet-800", '', content)
    content = re.sub(r"\s*dark:border-emerald-800", '', content)
    content = re.sub(r"\s*dark:border-green-500/30", '', content)
    content = re.sub(r"\s*dark:border-green-200/80", '', content)
    content = re.sub(r"\s*dark:border-\[var\(--secondary\)\]/\[0\.3\]", '', content)
    content = re.sub(r"\s*dark:border-\[var\(--warning\)\]/\[0\.3\]", '', content)
    content = re.sub(r"\s*dark:border-yellow-200/80", '', content)

    content = re.sub(r"\s*dark:text-violet-300", '', content)
    content = re.sub(r"\s*dark:text-indigo-300", '', content)
    content = re.sub(r"\s*dark:text-slate-400", '', content)
    content = re.sub(r"\s*dark:text-\[var\(--secondary\)\]", '', content)
    content = re.sub(r"\s*dark:text-primary", '', content)
    content = re.sub(r"\s*dark:text-rose-500", '', content)
    content = re.sub(r"\s*dark:text-amber-500", '', content)
    content = re.sub(r"\s*dark:text-blue-500", '', content)
    content = re.sub(r"\s*dark:text-\[var\(--warning\)\]", '', content)

    content = re.sub(r"\s*dark:shadow-yellow-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-yellow-500/10", '', content)
    content = re.sub(r"\s*dark:shadow-orange-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-orange-500/10", '', content)
    content = re.sub(r"\s*dark:shadow-green-500/10", '', content)
    content = re.sub(r"\s*dark:shadow-\[var\(--shadow-glow\)\]", '', content)

    content = re.sub(r"\s*dark:hover:shadow-yellow-500/10", '', content)
    content = re.sub(r"\s*dark:hover:shadow-orange-500/10", '', content)
    content = re.sub(r"\s*dark:hover:shadow-green-500/10", '', content)

    content = re.sub(r"\s*dark:bg-gradient-to-r dark:from-\[var\(--primary\)\] dark:to-\[var\(--secondary\)\]", '', content)

    # Fix bg-teal-50, bg-pink-50, bg-orange-50, bg-rose-50, bg-cyan-50
    content = re.sub(r'\bbg-teal-50\b', 'bg-[var(--primary)]/[0.1]', content)
    content = re.sub(r'\bbg-pink-50\b', 'bg-[var(--destructive)]/[0.1]', content)
    content = re.sub(r'\bbg-orange-50\b', 'bg-[var(--warning)]/[0.1]', content)
    content = re.sub(r'\bbg-rose-50\b', 'bg-[var(--destructive)]/[0.1]', content)
    content = re.sub(r'\bbg-cyan-50\b', 'bg-[var(--secondary)]/[0.1]', content)
    content = re.sub(r'\bbg-yellow-50\b', 'bg-[var(--warning)]/[0.1]', content)
    content = re.sub(r'\bbg-slate-100\b', 'bg-[var(--hover)]', content)

    # Fix border-teal-100, border-pink-100, etc
    content = re.sub(r'\bborder-teal-100\b', 'border-[var(--primary)]/[0.2]', content)
    content = re.sub(r'\bborder-pink-100\b', 'border-[var(--destructive)]/[0.2]', content)
    content = re.sub(r'\bborder-orange-100\b', 'border-[var(--warning)]/[0.2]', content)
    content = re.sub(r'\bborder-rose-100\b', 'border-[var(--destructive)]/[0.2]', content)
    content = re.sub(r'\bborder-cyan-100\b', 'border-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bborder-yellow-200\b', 'border-[var(--warning)]/[0.3]', content)
    content = re.sub(r'\bborder-yellow-200/80\b', 'border-[var(--warning)]/[0.3]', content)
    content = re.sub(r'\bborder-red-200\b', 'border-[var(--destructive)]/[0.3]', content)
    content = re.sub(r'\bborder-amber-200\b', 'border-[var(--warning)]/[0.3]', content)
    content = re.sub(r'\bborder-blue-200\b', 'border-[var(--secondary)]/[0.3]', content)
    content = re.sub(r'\bborder-violet-200\b', 'border-[var(--secondary)]/[0.3]', content)
    content = re.sub(r'\bborder-emerald-200\b', 'border-[var(--primary)]/[0.3]', content)
    content = re.sub(r'\bborder-emerald-300\b', 'border-[var(--primary)]/[0.3]', content)
    content = re.sub(r'\bborder-green-200/80\b', 'border-[var(--primary)]/[0.3]', content)

    # Fix text-color-500
    content = re.sub(r'\btext-rose-500\b', 'text-[var(--destructive)]', content)
    content = re.sub(r'\btext-amber-500\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-blue-500\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-violet-500\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-violet-700\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-sky-700\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-slate-700\b', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'\btext-slate-400\b', 'text-[var(--text-muted)]', content)

    # Fix bg-violet-100
    content = re.sub(r'\bbg-violet-100\b', 'bg-[var(--secondary)]/[0.1]', content)
    content = re.sub(r'\bbg-violet-200\b', 'bg-[var(--secondary)]/[0.2]', content)

    # Fix hover:bg-emerald-100
    content = re.sub(r'\bhover:bg-emerald-100\b', 'hover:bg-[var(--primary)]/[0.1]', content)
    content = re.sub(r'\bhover:bg-violet-200\b', 'hover:bg-[var(--secondary)]/[0.2]', content)

    # Clean up
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
