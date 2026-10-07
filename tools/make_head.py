# -*- coding: utf-8 -*-
"""src/head.html from 点点岛's head (the one visual language: CSS, screens) + what 字字岛 adds (glyph cards, writing
paper, the treasure book, practice). Run once; afterwards src/head.html is edited directly."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(r'D:\ClaudeCode\kidmath3\index.html', encoding='utf-8').read().split('\n')
head = '\n'.join(src[0:259])
head = head.replace('点点岛', '字字岛')
head = '\n'.join(l for l in head.split('\n') if 'apple-touch-startup-image' not in l)
extra = open(os.path.join(ROOT, 'tools', 'head_extra.css'), encoding='utf-8').read()
head = head.replace('</style>', extra + '\n</style>', 1)
body = open(os.path.join(ROOT, 'tools', 'head_body.html'), encoding='utf-8').read()
open(os.path.join(ROOT, 'src', 'head.html'), 'w', encoding='utf-8', newline='\n').write(head + '\n' + body)
print('ok')
