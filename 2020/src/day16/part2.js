const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().trim();

const rules = input
  .split('\n')
  .map((r) => {
    const match = r.match(/([\w ]+): ([\d\-]+) or ([\d\-]+)/);
    if (match) {
      return {
        name: match[1],
        range1: {
          start: Number.parseInt(match[2].split('-')[0]),
          end: Number.parseInt(match[2].split('-')[1]),
        },
        range2: {
          start: Number.parseInt(match[3].split('-')[0]),
          end: Number.parseInt(match[3].split('-')[1]),
        },
      };
    }
  })
  .filter((r) => r !== undefined);

const yourTicketMatch = input.match(/your ticket:\n([\d,]+)/);
const yourTicket = yourTicketMatch[1].split(',').map((n) => Number.parseInt(n));

const nearbyString = input.substring(input.indexOf('nearby tickets:') + 'nearby tickets:'.length, input.length).trim();
const otherTickets = nearbyString.split('\n').map((t) => t.split(',').map((n) => Number.parseInt(n)));

const allRuleArray = new Array(1000).fill(false);

const eachRuleArray = {};
rules.forEach((r) => {
  eachRuleArray[r.name] = new Array(1000).fill(false);
});

rules.forEach((r) => {
  for (let i = r.range1.start; i <= r.range1.end; i++) {
    allRuleArray[i] = true;
    eachRuleArray[r.name][i] = true;
  }

  for (let i = r.range2.start; i <= r.range2.end; i++) {
    allRuleArray[i] = true;
    eachRuleArray[r.name][i] = true;
  }
});

const validTickets = otherTickets
  .map((t) => {
    let valid = true;
    t.forEach((v) => {
      if (!allRuleArray[v]) valid = false;
    });

    if (valid) return t;
  })
  .filter((t) => t !== undefined);

// From https://stackoverflow.com/a/2450976/2303432
function shuffle(a) {
  // Make clone of array
  const array = [...a];

  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let iteration = 0;
let counter = 0;

console.log(rules.length);

let ruleMapping = {};
const stats = {};
console.log('Generating Stats');
while (Object.values(ruleMapping).length !== rules.length && iteration < 100000) {
  ruleMapping = {};
  shuffle(rules).forEach((r) => {
    // console.log(eachRuleArray[ri].slice(0, 10));

    for (let c = 0; c < rules.length; c++) {
      if (Object.values(ruleMapping).indexOf(c) !== -1) continue;

      let validCol = true;

      validTickets.forEach((t) => {
        // console.log(eachRuleArray[ri][t[c]], t[c]);
        if (!eachRuleArray[r.name][t[c]]) validCol = false;
      });

      if (validCol) {
        ruleMapping[r.name] = c;

        if (!stats[r.name]) stats[r.name] = {};
        stats[r.name][c] = stats[r.name][c] ? stats[r.name][c] + 1 : 1;

        break;
      }
    }

    // if (Object.keys(ruleMapping).length > 18) console.log(iteration, Object.keys(ruleMapping).length);
  });

  if (counter === 10000) {
    console.log(iteration);
    counter = 0;
  }
  counter++;

  // if (iteration % 1000 === 0) console.log('iteration', iteration);
  iteration++;
}

function validateMapping(mapping) {
  let isValid = true;

  filteredRules.forEach((rule) => {
    const r = mapping[rule.name];
    if (r === undefined) {
      isValid = false;
      return;
    }

    // These two are fixed and always work
    // if (r.name === 'duration' || r.name === 'arrival_platform') return;

    for (let i = 0; i < validTickets.length; i++) {
      if (!eachRuleArray[rule.name][validTickets[i][r]]) {
        isValid = false;
        break;
      }
    }
  });

  // console.log('validate', mapping, isValid);

  return isValid;
}

console.log(stats);

const numVariations = 3;
const topStats = {};
Object.entries(stats).forEach((s) => {
  const vals = Object.entries(s[1]).sort((a, b) => b[1] - a[1]);
  topStats[s[0]] = vals.slice(0, numVariations).map((v) => Number.parseInt(v[0]));
});
console.log('stats', topStats);

// if (!validateMapping(ruleMapping)) {
let checked = 0;
const mapped = new Set();
const mapping = {};
// let variation = ''.padStart(filteredRules.length, '0');
let validMap = true;

// console.log('Generating Variations');
// const variations = new Array(3486600000);
// variations.forEach((v, i) => (variations[i] = i.toString(3).padStart(filteredRules.length, '0')));

// There are 2 values that are always fixed
const filteredRules = rules.filter((r) => r.name !== 'duration' && r.name !== 'arrival platform');
// const filteredRules = rules;

let variation = new Array(filteredRules.length).fill(0);

let lastTime = Date.now();
const numRuns = Math.pow(numVariations, filteredRules.length);
while (checked < numRuns) {
  // variation = variations[checked];
  // variation = checked.toString(3).padStart(filteredRules.length, '0');

  variation[variation.length - 1]++;
  let checkNext = false;
  for (i = variation.length - 1; i >= 0; i--) {
    if (variation[i] === numVariations && i !== 0) {
      variation[i] = 0;
      variation[i - 1]++;
      checkNext = true;
    }
    if (!checkNext) break;
  }

  validMap = true;
  mapped.clear();
  for (let i = 0; i < filteredRules.length; i++) {
    if (mapped.has(variation[i])) validMap = false;
    else mapped.add(variation[i]);
  }

  checked++;
  if (checked % 1000000 === 0) {
    const percent = (checked / numRuns) * 100;
    const duration = Date.now() - lastTime;
    console.log(
      percent.toFixed(2).padStart(5, '0'),
      variation.join().replace(/,/g, ''),
      duration,
      (((((100 - percent) / 100) * numRuns) / 1000000) * duration) / 60000
    );
    lastTime = Date.now();
  }

  if (validMap) {
    rules.forEach((r, i) => {
      mapping[r.name] = topStats[r.name][variation[i] % topStats[r.name].length];
    });
    rules.duration = 12;
    rules.arrival_platform = 0;

    console.log(variation, variation, mapping);

    if (validateMapping(mapping)) {
      console.log('\nvalid', mapping);
      ruleMapping = mapping;
      break;
    }
  }
}
// }

let product = 1;

Object.entries(ruleMapping).forEach((r) => {
  if (r[0].indexOf('departure') !== -1) {
    product *= yourTicket[r[1]];
  }
});

// Too High: 11110792443259
// Too High: 4005373803649

console.log();
if (validateMapping(ruleMapping)) console.log(product);
else console.error('Could not find valid mapping');
