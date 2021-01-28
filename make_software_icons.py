#!/usr/bin/env python3

import os
import sys
import time

InputFolder = 'software_icons'
OutputFile  = 'data_software_icons.js'

Data = '// ' + time.ctime();
Data += '\nvar SoftwareIconsData = [\n'

IconsCount = 0
for fname in sorted(os.listdir(InputFolder)):

    fpath = os.path.join(InputFolder, fname)
    if not os.path.isfile(fpath):
        print('Not a file "%s", skipping...' % fname)
        continue

    name, ext = os.path.splitext(fname)
    if ext != '.png':
        print('Not a ".png" file "%s", skipping...' % fname)
        continue

    if IconsCount:
        Data += ',\n'

    Data += '{"icon":"%s"}' % fpath

    IconsCount += 1

Data += '\n];'

file = open(OutputFile, 'w')
file.write(Data)
file.close()

