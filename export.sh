#!/bin/bash

dest=cgru.info

credentials=export_credentials.sh
if [ ! -f $credentials ]; then
	echo $credentials file not founded
	exit 1
fi
source $credentials

echo USER=$FTP_USER
echo DEST=$dest

ftp -in $dest <<END_SCRIPT
quote USER $FTP_USER
quote PASS $FTP_PASS

cd www
cd cgru.info

cd content
lcd content
mput *.html
ls

cd afanasy
lcd afanasy
mput *.html
ls
cdup
lcd ..

cd rules
lcd rules
mput *.html
ls
cdup
lcd ..

cd software
lcd software
mput *.html
ls
cdup
lcd ..

cdup
lcd ..

mput *.html *.css *.js *.ico
ls

END_SCRIPT
