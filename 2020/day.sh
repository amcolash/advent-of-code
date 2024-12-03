#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "usage: day.sh [day number]"
    exit 0
fi

mkdir src/day$1

cat <<EOT >> src/day$1/part1.js
const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();
EOT

cp src/day$1/part1.js src/day$1/part2.js