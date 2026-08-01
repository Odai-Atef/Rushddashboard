#!/usr/bin/env python3
"""
Comprehensive dark theme fix script for Rushd frontend.
Replaces hardcoded colors with semantic CSS variable tokens.
"""

import os
import re
import sys

# Files/directories to skip
SKIP_DIRS = {'node_modules', '.git', 'dist', 'build', '.next'}
SKIP_FILES = {'.DS_Store'}

# Extensions to process
EXTENSIONS = {'.tsx', '.ts', '.css', '.scss'}

def should_process(path):
    """Check if file should be processed."""
    if any(d in path for d in SKIP_DIRS):
        return False
    if os.path.basename(path) in SKIP_FILES:
        return False
    return any(path.endswith(ext) for ext in EXTENSIONS)

def fix_file(filepath):
    """Fix hardcoded colors in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    original = content

    # Pattern 1: bg-white -> bg-[var(--card)] (for cards/containers)
    # Only replace when not part of a className with dark: variant already
    content = re.sub(
        r'className="([^"]*?)bg-white([^"]*?)"',
        lambda m: f'className="{m.group(1)}bg-[var(--card)]{m.group(2)}"',
        content
    )
    content = re.sub(
        r'className=\'([^\']*?)bg-white([^\']*?)\'',
        lambda m: f'className=\'{m.group(1)}bg-[var(--card)]{m.group(2)}\'',
        content
    )
    content = re.sub(
        r'className=\{cn\(([^)]*?)"bg-white"([^)]*?)\)\}',
        lambda m: f'className={{cn({m.group(1)}"bg-[var(--card)]"{m.group(2)})}}',
        content
    )

    # Pattern 2: text-white in button/badge contexts -> text-[var(--primary-foreground)]
    # But for most UI elements, text-white should map to text-[var(--card-foreground)]
    # We handle specific cases below

    # Pattern 3: text-gray-900 -> text-[var(--text-primary)]
    content = re.sub(r'text-gray-900', 'text-[var(--text-primary)]', content)

    # Pattern 4: dark:text-white -> remove (handled by CSS variables)
    content = re.sub(r'\s*dark:text-white', '', content)
    content = re.sub(r'dark:text-white\s*', '', content)

    # Pattern 5: dark:bg-[var(--card)]/50 -> remove (already handled by CSS variables in :root/.dark)
    content = re.sub(r'\s*dark:bg-\[var\(--card\)\]/50', '', content)
    content = re.sub(r'\s*dark:bg-card/50', '', content)

    # Pattern 6: dark:bg-white/10 -> remove (handled by variables)
    content = re.sub(r'\s*dark:bg-white/10', '', content)
    content = re.sub(r'\s*dark:bg-white/15', '', content)

    # Pattern 7: dark:hover:text-white -> remove (handled by variables)
    content = re.sub(r'\s*dark:hover:text-white', '', content)

    # Pattern 8: dark:data-[state=active]:text-white -> remove
    content = re.sub(r'\s*dark:data-\[state=active\]:text-white', '', content)

    # Pattern 9: dark:text-[var(--text-muted)] -> remove (handled by variables)
    content = re.sub(r'\s*dark:text-\[var\(--text-muted\)\]', '', content)

    # Pattern 10: dark:bg-[var(--muted)] -> remove (handled by variables)
    content = re.sub(r'\s*dark:bg-\[var\(--muted\)\]', '', content)
    content = re.sub(r'\s*dark:bg-\[var\(--muted\)\]/80', '', content)

    # Pattern 11: dark:bg-[var(--muted)]/60 -> remove
    content = re.sub(r'\s*dark:bg-\[var\(--muted\)\]/60', '', content)

    # Pattern 12: dark:hover:bg-[var(--muted)] -> remove
    content = re.sub(r'\s*dark:hover:bg-\[var\(--muted\)\]', '', content)

    # Pattern 13: dark:data-[state=active]:bg-[var(--card)] -> remove
    content = re.sub(r'\s*dark:data-\[state=active\]:bg-\[var\(--card\)\]', '', content)

    # Pattern 14: text-gray-500 -> text-[var(--text-muted)]
    content = re.sub(r'text-gray-500', 'text-[var(--text-muted)]', content)

    # Pattern 15: text-gray-400 -> text-[var(--text-muted)]
    content = re.sub(r'text-gray-400', 'text-[var(--text-muted)]', content)

    # Pattern 16: dark:text-gray-400 -> remove
    content = re.sub(r'\s*dark:text-gray-400', '', content)
    content = re.sub(r'\s*dark:text-gray-500', '', content)

    # Pattern 17: bg-gray-200 -> bg-[var(--border)]
    content = re.sub(r'bg-gray-200', 'bg-[var(--border)]', content)

    # Pattern 18: dark:bg-muted -> remove
    content = re.sub(r'\s*dark:bg-muted', '', content)

    # Pattern 19: dark:bg-white\[0.08\] -> remove
    content = re.sub(r'\s*dark:bg-white/\[0\.08\]', '', content)
    content = re.sub(r'\s*dark:bg-white/\[0\.06\]', '', content)

    # Pattern 20: dark:text-white/60 -> remove
    content = re.sub(r'\s*dark:text-white/60', '', content)

    # Pattern 21: dark:[&_[cmdk-group-heading]]:text-gray-400 -> remove
    content = re.sub(r'\s*dark:\[&_\[cmdk-group-heading\]\]:text-gray-400', '', content)

    # Pattern 22: bg-emerald-50 -> bg-[var(--primary)]/[0.08]
    content = re.sub(r'bg-emerald-50', 'bg-[var(--primary)]/[0.08]', content)

    # Pattern 23: text-emerald-900 -> text-[var(--primary)]
    content = re.sub(r'text-emerald-900', 'text-[var(--primary)]', content)

    # Pattern 24: dark:bg-emerald-900/30 -> remove
    content = re.sub(r'\s*dark:bg-emerald-900/30', '', content)
    content = re.sub(r'\s*dark:text-emerald-100', '', content)

    # Pattern 25: dark:bg-white -> remove
    content = re.sub(r'\s*dark:bg-white', '', content)

    # Pattern 26: dark:fill-white -> remove
    content = re.sub(r'\s*dark:fill-white', '', content)

    # Pattern 27: bg-black/50 -> bg-[var(--text-primary)]/[0.5]
    content = re.sub(r'bg-black/50', 'bg-[var(--text-primary)]/[0.5]', content)

    # Pattern 28: dark:hover:shadow-[var(--shadow-glow)] -> keep

    # Pattern 29: dark:backdrop-blur-md -> remove
    content = re.sub(r'\s*dark:backdrop-blur-md', '', content)

    # Pattern 30: dark:border-border -> remove
    content = re.sub(r'\s*dark:border-border', '', content)
    content = re.sub(r'\s*dark:border-border/50', '', content)
    content = re.sub(r'\s*dark:border-border/80', '', content)

    # Pattern 31: dark:shadow-lg -> remove
    content = re.sub(r'\s*dark:shadow-lg', '', content)

    # Remove double spaces that may have been created
    content = re.sub(r'  +', ' ', content)
    # Fix specific patterns where dark: removal created issues
    content = re.sub(r'className=" ', 'className="', content)
    content = re.sub(r"className=' ", "className='", content)

    if content != original:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    return False

def main():
    src_dir = sys.argv[1] if len(sys.argv) > 1 else 'src'
    modified_count = 0
    file_count = 0

    for root, dirs, files in os.walk(src_dir):
        # Skip node_modules and other directories
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
