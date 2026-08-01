#!/usr/bin/env python3
"""
Fifth pass: Handle remaining dark: variants and special cases.
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
    content = re.sub(r"\s*dark:bg-\[var\(--danger\)\]/\[0\.12\]", '', content)
    content = re.sub(r"\s*dark:hover:bg-\[var\(--danger\)\]/\[0\.18\]", '', content)
    content = re.sub(r"\s*dark:bg-\[var\(--destructive\)\]/30", '', content)
    content = re.sub(r"\s*dark:text-\[var\(--destructive\)\]", '', content)
    content = re.sub(r"\s*dark:text-\[var\(--warning\)\]", '', content)
    content = re.sub(r"\s*dark:text-\[var\(--secondary\)\]", '', content)
    content = re.sub(r"\s*dark:bg-\[var\(--primary\)\]/\[0\.2\]", '', content)
    content = re.sub(r"\s*dark:text-amber-400", '', content)
    content = re.sub(r"\s*dark:text-yellow-400", '', content)
    content = re.sub(r"\s*dark:text-orange-400", '', content)
    content = re.sub(r"\s*dark:text-violet-400", '', content)
    content = re.sub(r"\s*dark:text-purple-400", '', content)
    content = re.sub(r"\s*dark:bg-orange-900/40", '', content)
    content = re.sub(r"\s*dark:bg-purple-500/10", '', content)
    content = re.sub(r"\s*dark:shadow-emerald-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-emerald-500/10", '', content)
    content = re.sub(r"\s*dark:shadow-red-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-green-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-blue-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-purple-500/5", '', content)
    content = re.sub(r"\s*dark:shadow-purple-500/10", '', content)
    content = re.sub(r"\s*dark:hover:shadow-emerald-500/10", '', content)
    content = re.sub(r"\s*dark:hover:shadow-purple-500/10", '', content)
    content = re.sub(r"\s*dark:border-\[var\(--primary-foreground\)\]/\[0\.1\]", '', content)
    content = re.sub(r"\s*dark:bg-\[#102942\]/80", '', content)
    content = re.sub(r"\s*dark:bg-\[#081A2E\]", '', content)
    content = re.sub(r"\s*dark:bg-white/\[0\.08\]", '', content)

    # Fix bg-yellow-500/20
    content = re.sub(r'\bbg-yellow-500/20\b', 'bg-[var(--warning)]/[0.2]', content)
    content = re.sub(r'\bbg-yellow-500/30\b', 'bg-[var(--warning)]/[0.3]', content)
    content = re.sub(r'\bbg-orange-100\b', 'bg-[var(--warning)]/[0.1]', content)
    content = re.sub(r'\bbg-orange-500/20\b', 'bg-[var(--warning)]/[0.2]', content)
    content = re.sub(r'\bbg-purple-500/20\b', 'bg-[var(--secondary)]/[0.2]', content)
    content = re.sub(r'\bbg-red-100/20\b', 'bg-[var(--destructive)]/[0.2]', content)
    content = re.sub(r'\bbg-red-100\b', 'bg-[var(--destructive)]/[0.1]', content)
    content = re.sub(r'\bbg-green-100\b', 'bg-[var(--primary)]/[0.1]', content)

    # Fix text-color-700
    content = re.sub(r'\btext-amber-700\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-orange-700\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-yellow-600\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-red-700\b', 'text-[var(--destructive)]', content)
    content = re.sub(r'\btext-green-700\b', 'text-[var(--primary)]', content)

    # Fix text-color-400
    content = re.sub(r'\btext-amber-400\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-yellow-400\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-orange-400\b', 'text-[var(--warning)]', content)
    content = re.sub(r'\btext-violet-400\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-purple-400\b', 'text-[var(--secondary)]', content)
    content = re.sub(r'\btext-sky-400\b', 'text-[var(--secondary)]', content)

    # Fix border-color-500/30
    content = re.sub(r'\bborder-yellow-500/30\b', 'border-[var(--warning)]/[0.3]', content)
    content = re.sub(r'\bborder-purple-500/30\b', 'border-[var(--secondary)]/[0.3]', content)

    # Fix remaining dark:bg-white patterns
    content = re.sub(r"\s*dark:bg-white", '', content)

    # Fix remaining dark:text-white patterns
    content = re.sub(r"\s*dark:text-white", '', content)

    # Fix text-[var(--warning)]/30 -> text-[var(--warning)] (remove opacity from text)
    content = re.sub(r'text-\[var\(--warning\)\]/30', 'text-[var(--warning)]', content)
    content = re.sub(r'text-\[var\(--secondary\)\]/30', 'text-[var(--secondary)]', content)

    # Fix bg-[#FFFFFF]
    content = re.sub(r'bg-\[#FFFFFF\]', 'bg-[var(--card)]', content)
    content = re.sub(r'bg-\[#081A2E\]', 'bg-[var(--card)]', content)

    # Fix border-[var(--border)]/80/50 -> border-[var(--border)]
    content = re.sub(r'border-\[var\(--border\)\]/80/50', 'border-[var(--border)]/[0.5]', content)

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
