#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "usage: test.sh [day] [part]"
    exit 0
fi


nodemon --watch src/day$1 src/day$1/part$2.js