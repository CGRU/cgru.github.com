#!/bin/bash

docker run --rm -v `pwd`/`dirname $0`:/usr/local/apache2/htdocs/ -p "80:80" --name=cgru_github_com httpd