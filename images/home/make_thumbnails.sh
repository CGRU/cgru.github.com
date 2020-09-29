#!/bin/bash

for img in *.png; do
	echo "Image: ${img}"
	convert -verbose "${img}" -resize "300x-1" -quality "70%" "${img}.jpg"
done
