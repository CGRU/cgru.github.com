#!/usr/bin/env python3

SrcFolder = 'photos/history'
TbmFolder = '%s/thumbnails' % SrcFolder
OutFile = 'data_images_history.js'

import os
import time

CmdTemplate = 'convert %s -resize 400x200 %s'
OutData = '// ' + time.ctime();
OutData += '\nvar DataImagesHistory = [\n'

ImgCount = 0
for afile in sorted(os.listdir(SrcFolder)):
    src = os.path.join(SrcFolder, afile)

    if not os.path.isfile(src):
        continue
    print(src)

    dst = os.path.join(TbmFolder, afile) + '.jpg'
    cmd = CmdTemplate % (src, dst)

    print(cmd)
    os.system(cmd)

    if ImgCount:
        OutData += ',\n'

    OutData += '{"src":"%s","tbn":"%s"}' % (src, dst)
    ImgCount += 1

OutData += '\n];'

file = open(OutFile, 'w')
file.write("%s" % OutData)
file.close()

