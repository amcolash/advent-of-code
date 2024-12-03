const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const passports = input.split('\n\n');
const parsed = passports.map((p) => {
  const items = p.split(/\s/);
  const passport = {};

  items.forEach((i) => {
    const split = i.split(':');
    const key = split[0];
    const value = split[1];
    if (key.length > 0 && value) {
      if (key === 'byr' || key === 'iyr' || key === 'eyr') passport[key] = Number.parseInt(value);
      else passport[key] = value;
    }
  });

  return passport;
});

const eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

let valid = 0;
parsed.forEach((p) => {
  let invalid = false;
  if (!p.byr || p.byr < 1920 || p.byr > 2002) invalid = true;
  if (!p.iyr || p.iyr < 2010 || p.iyr > 2020) invalid = true;
  if (!p.eyr || p.eyr < 2020 || p.eyr > 2030) invalid = true;

  console.log(invalid, p.byr, p.byr < 1920, p.byr > 2002);

  if (p.hgt && p.hgt.search(/cm|in/) !== -1) {
    const value = Number.parseInt(p.hgt);
    if (p.hgt.indexOf('cm') !== -1 && (value < 150 || value > 193)) invalid = true;
    else if (p.hgt.indexOf('in') !== -1 && (value < 59 || value > 76)) invalid = true;
  } else {
    invalid = true;
  }

  if (!p.hcl || p.hcl.search(/#[\da-fA-F]{6}/) === -1 || p.hcl.length !== 7) invalid = true;
  if (!p.ecl || eyeColors.indexOf(p.ecl) === -1) invalid = true;
  if (!p.pid || p.pid.search(/[0-9]{9}/) === -1 || p.pid.length !== 9) invalid = true;

  if (!invalid) valid++;
});

console.log(valid);
