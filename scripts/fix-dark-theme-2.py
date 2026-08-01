#!/usr/bin/env python3
"""
Second pass: Fix remaining hardcoded colors that need specific context handling.
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

    # Remove remaining dark: variants that are now redundant
    content = re.sub(r'\s*dark:bg-red-600', '', content)
    content = re.sub(r'\s*dark:hover:bg-red-500', '', content)
    content = re.sub(r'\s*dark:text-\[var\(--text-primary\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--primary\)\]', '', content)
    content = re.sub(r'\s*dark:hover:bg-\[var\(--primary\)\]/90', '', content)
    content = re.sub(r'\s*dark:bg-card/60', '', content)

    # Fix remaining bg-white in className contexts (cards/panels)
    content = re.sub(r'bg-white ', 'bg-[var(--card)] ', content)
    content = re.sub(r' bg-white"', ' bg-[var(--card)]"', content)
    content = re.sub(r'"bg-white"', '"bg-[var(--card)]"', content)

    # Fix remaining text-white in contexts that should use foreground
    # For primary buttons/icons on colored backgrounds, keep text-[var(--primary-foreground)]
    # For cards with dark backgrounds, use text-[var(--card-foreground)]

    # Fix bg-blue-500/600 in button contexts -> use semantic primary
    content = re.sub(r'bg-blue-600', 'bg-[var(--primary)]', content)
    content = re.sub(r'bg-blue-500', 'bg-[var(--primary)]', content)
    content = re.sub(r'hover:bg-blue-700', 'hover:bg-[var(--primary)]/90', content)
    content = re.sub(r'hover:bg-blue-600', 'hover:bg-[var(--primary)]/90', content)

    # Fix bg-red-600 in button contexts
    content = re.sub(r'bg-red-600', 'bg-[var(--destructive)]', content)
    content = re.sub(r'bg-red-500', 'bg-[var(--destructive)]', content)
    content = re.sub(r'hover:bg-red-700', 'hover:bg-[var(--destructive)]/90', content)
    content = re.sub(r'hover:bg-red-600', 'hover:bg-[var(--destructive)]/90', content)

    # Fix bg-emerald-600
    content = re.sub(r'bg-emerald-600', 'bg-[var(--primary)]', content)
    content = re.sub(r'hover:bg-emerald-700', 'hover:bg-[var(--primary)]/90', content)

    # Fix remaining text-white on gradient backgrounds -> keep as primary-foreground
    content = re.sub(r' text-white ', ' text-[var(--primary-foreground)] ', content)
    content = re.sub(r'"text-white"', '"text-[var(--primary-foreground)]"', content)

    # Fix text-white/90, text-white/80 -> text-[var(--primary-foreground)]/90 etc
    content = re.sub(r'text-white/90', 'text-[var(--primary-foreground)]/90', content)
    content = re.sub(r'text-white/80', 'text-[var(--primary-foreground)]/80', content)
    content = re.sub(r'text-white/70', 'text-[var(--primary-foreground)]/70', content)
    content = re.sub(r'text-white/60', 'text-[var(--primary-foreground)]/60', content)
    content = re.sub(r'text-white/50', 'text-[var(--primary-foreground)]/50', content)

    # Fix remaining dark:border patterns
    content = re.sub(r'\s*dark:border-\[var\(--border\)\]', '', content)
    content = re.sub(r'\s*dark:border-\[var\(--border\)\]/50', '', content)
    content = re.sub(r'\s*dark:border-\[var\(--border\)\]/80', '', content)
    content = re.sub(r'\s*dark:shadow-lg', '', content)
    content = re.sub(r'\s*dark:shadow-md', '', content)
    content = re.sub(r'\s*dark:shadow-sm', '', content)

    # Fix dark:bg-card -> remove
    content = re.sub(r'\s*dark:bg-card', '', content)

    # Fix remaining dark: variants on text
    content = re.sub(r'\s*dark:text-gray-600', '', content)
    content = re.sub(r'\s*dark:text-gray-700', '', content)
    content = re.sub(r'\s*dark:text-gray-800', '', content)
    content = re.sub(r'\s*dark:text-gray-900', '', content)

    # Fix remaining dark: variants on bg
    content = re.sub(r'\s*dark:bg-gray-600', '', content)
    content = re.sub(r'\s*dark:bg-gray-700', '', content)
    content = re.sub(r'\s*dark:bg-gray-800', '', content)
    content = re.sub(r'\s*dark:bg-gray-900', '', content)
    content = re.sub(r'\s*dark:bg-gray-950', '', content)

    # Fix remaining dark: variants on border
    content = re.sub(r'\s*dark:border-gray-600', '', content)
    content = re.sub(r'\s*dark:border-gray-700', '', content)
    content = re.sub(r'\s*dark:border-gray-800', '', content)

    # Fix remaining bg-gray patterns
    content = re.sub(r'bg-gray-50', 'bg-[var(--hover)]', content)
    content = re.sub(r'bg-gray-100', 'bg-[var(--hover)]', content)
    content = re.sub(r'bg-gray-200', 'bg-[var(--border)]', content)
    content = re.sub(r'bg-gray-300', 'bg-[var(--border)]', content)
    content = re.sub(r'bg-gray-400', 'bg-[var(--text-muted)]', content)
    content = re.sub(r'bg-gray-500', 'bg-[var(--text-muted)]', content)
    content = re.sub(r'bg-gray-600', 'bg-[var(--text-secondary)]', content)
    content = re.sub(r'bg-gray-700', 'bg-[var(--text-primary)]', content)
    content = re.sub(r'bg-gray-800', 'bg-[var(--card)]', content)
    content = re.sub(r'bg-gray-900', 'bg-[var(--card)]', content)

    # Fix remaining text-gray patterns
    content = re.sub(r'text-gray-50', 'text-[var(--card-foreground)]', content)
    content = re.sub(r'text-gray-100', 'text-[var(--card-foreground)]', content)
    content = re.sub(r'text-gray-200', 'text-[var(--text-muted)]', content)
    content = re.sub(r'text-gray-300', 'text-[var(--text-muted)]', content)
    content = re.sub(r'text-gray-400', 'text-[var(--text-muted)]', content)
    content = re.sub(r'text-gray-500', 'text-[var(--text-muted)]', content)
    content = re.sub(r'text-gray-600', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'text-gray-700', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'text-gray-800', 'text-[var(--text-primary)]', content)

    # Fix remaining border-gray patterns
    content = re.sub(r'border-gray-200', 'border-[var(--border)]', content)
    content = re.sub(r'border-gray-300', 'border-[var(--border)]', content)

    # Fix remaining dark:hover:bg patterns
    content = re.sub(r'\s*dark:hover:bg-\[var\(--hover\)\]', '', content)
    content = re.sub(r'\s*dark:hover:bg-\[var\(--muted\)\]', '', content)

    # Fix remaining dark:hover:text
    content = re.sub(r'\s*dark:hover:text-\[var\(--text-primary\)\]', '', content)

    # Fix remaining dark:bg-opacity patterns
    content = re.sub(r'\s*dark:bg-opacity-\d+', '', content)

    # Clean up double spaces
    content = re.sub(r'  +', ' ', content)
    content = re.sub(r'className=" ', 'className="', content)
    content = re.sub(r"className=' ", "className='", content)
    content = re.sub(r'className=\{cn\(" ', 'className={cn("', content)

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
