#!/usr/bin/env python3

import os
import sys
import time

InputFolder = 'show'
OutputFile = 'show_data.js'
ThumbnailSuffix = '_thumbnail.jpg'

ImgFiles = []
Thumbnails = []

for root, dirs, files in os.walk(InputFolder):
    for fname in files:

        fpath = os.path.join(root, fname)
        if not os.path.isfile(fpath):
            print('Not a file "%s", skipping...' % fname)
            continue

        if fname != fname.lower():
            os.rename(fpath, fpath.lower())
            print("%s renamed to lower." % fpath)
            fname = fname.lower()
            fpath = fpath.lower()

        if fname.count(ThumbnailSuffix):
            continue

        name, ext = os.path.splitext(fname)
        if not ext in ['.jpg','.jpeg']:
            print('Not a ".jpg" or ".jpeg" file "%s", skipping...' % fname)
            continue

        thumbnail = fpath + ThumbnailSuffix

        ImgFiles.append(fpath)
        Thumbnails.append(thumbnail)

Data = '// ' + time.ctime();
Data += '\nvar ShowData = [\n'

count = 0
for img in ImgFiles:
    thumb = Thumbnails[count]

    if count:
        Data += ',\n'

    Data += '{"image":"%s","thumbnail":"%s"}' % (img, thumb)

    count += 1

Data += '\n];'

file = open(OutputFile, 'w')
file.write("%s" % Data)
file.close()

count = 0
for img in ImgFiles:
    thumb = Thumbnails[count]
    cmd = 'convert -verbose "%s" -resize "300x-1" -quality "70%%" "%s"' % (img, thumb)
    print(cmd)
    os.system(cmd)

    count += 1
