const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const passports = input.split('\n\n');
const parsed = passports.map((p) => {
  const items = p.split(/\s/);
  const passport = {};

  items.forEach((i) => {
    const split = i.split(':');
    if (split[0].length > 0) passport[[split[0]]] = split[1];
  });

  return passport;
});

let valid = 0;
parsed.forEach((p) => {
  if (p.byr && p.iyr && p.eyr && p.hgt && p.hcl && p.ecl && p.pid) valid++;
});

console.log(valid);
