#!/usr/bin/env python3

import os
import sys
import time

InputFolder = 'show'
OutputFile = 'show_data.js'
ThumbnailSuffix = '_thumbnail.jpg'

ImgFiles = []
Thumbnails = []

Data = '// ' + time.ctime();
Data += '\nvar ShowData = [\n'

def isFileNewer(i_file, i_other):
    if not os.path.isfile(i_other):
        return True
    return os.path.getmtime(i_file) > os.path.getmtime(i_other)

ImgCount = 0
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

        if ext == '.png':
            ext = '.jpg'
            conv_name = name + ext
            conv_path = os.path.join(root, conv_name)
            if isFileNewer(fpath, conv_path):
                cmd = 'convert -verbose -strip -interlace Plane -quality 85%% "%s" "%s"' % (fpath, conv_path)
                os.system(cmd)
                fname = conv_name
                fpath = conv_path
            else:
                continue
        elif not ext in ['.jpg','.jpeg']:
            print('Not a ".jpg"(".jpeg") or ".png" file "%s", skipping...' % fname)
            continue

        thumbnail = fpath + ThumbnailSuffix

        ImgFiles.append(fpath)
        Thumbnails.append(thumbnail)

ImgCount = 0
for img in ImgFiles:
    thumb = Thumbnails[ImgCount]

    if ImgCount:
        Data += ',\n'

    Data += '{"image":"%s","thumbnail":"%s"}' % (img, thumb)

    ImgCount += 1

Data += '\n];'

file = open(OutputFile, 'w')
file.write("%s" % Data)
file.close()

ImgCount = 0
for img in ImgFiles:
    thumb = Thumbnails[ImgCount]

    if isFileNewer(img, thumb):
        cmd = 'convert -verbose "%s" -resize "300x-1" -quality "70%%" "%s"' % (img, thumb)
        print(cmd)
        os.system(cmd)

    ImgCount += 1
