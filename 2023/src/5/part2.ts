import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

enum Section {
  Seeds,
  SeedSoil,
  SoilFertilizer,
  FertilizerWater,
  WaterLight,
  LightTemperature,
  TemperatureHumidity,
  HumidityLocation,
}

type Range = { srcStart: number; destStart: number; range: number };
type mapping = Range[];

const seeds: { start: number; length: number }[] = [];
const seedSoil: mapping = [];
const soilFertilizer: mapping = [];
const fertilizerWater: mapping = [];
const waterLight: mapping = [];
const lightTemperature: mapping = [];
const temperatureHumidity: mapping = [];
const humidityLocation: mapping = [];

const sectionToMap = {
  [Section.SeedSoil]: seedSoil,
  [Section.SoilFertilizer]: soilFertilizer,
  [Section.FertilizerWater]: fertilizerWater,
  [Section.WaterLight]: waterLight,
  [Section.LightTemperature]: lightTemperature,
  [Section.TemperatureHumidity]: temperatureHumidity,
  [Section.HumidityLocation]: humidityLocation,
};

let currentSection: Section = Section.Seeds;

function parseData() {
  lines.forEach((l, i) => {
    if (i === 0) {
      const allSeeds = l
        .split(':')[1]
        .trim()
        .split(' ')
        .map((s) => parseInt(s));

      for (let i = 0; i < allSeeds.length; i += 2) {
        seeds.push({ start: allSeeds[i], length: allSeeds[i + 1] });
      }
    } else {
      parseMapping(l);
    }
  });
}

function parseMapping(l: string) {
  const map = sectionToMap[currentSection];

  if (l.includes('map:')) return;
  else if (l.trim().length === 0) {
    currentSection++;
    return;
  } else {
    const split = l.split(' ');
    const destStart = Number.parseInt(split[0]);
    const srcStart = Number.parseInt(split[1]);
    const rangeLength = Number.parseInt(split[2]);

    map.push({ destStart, srcStart, range: rangeLength });
  }
}

let minLocation = Number.MAX_SAFE_INTEGER;

function lookupLocations() {
  seeds.forEach((seedRange, j) => {
    let counter = 0;

    for (let i = seedRange.start; i < seedRange.start + seedRange.length; i++) {
      const seed = i;

      const soil = findMapping(seed, seedSoil);
      const fertilizer = findMapping(soil, soilFertilizer);
      const water = findMapping(fertilizer, fertilizerWater);
      const light = findMapping(water, waterLight);
      const temperature = findMapping(light, lightTemperature);
      const humidity = findMapping(temperature, temperatureHumidity);
      const location = findMapping(humidity, humidityLocation);

      counter++;
      if (counter % 1000000 === 0) console.log(`[${j + 1}/${seeds.length}]: ${((counter / seedRange.length) * 100).toFixed(1)}%`);

      minLocation = Math.min(minLocation, location);
    }
  });

  console.log();
  console.log(minLocation);
}

function findMapping(value: number, mapping: Range[]): number {
  for (let i = 0; i < mapping.length; i++) {
    const { srcStart, destStart, range } = mapping[i];
    if (value >= srcStart && value < srcStart + range) {
      const offset = value - srcStart;
      return destStart + offset;
    }
  }

  return value;
}

parseData();
lookupLocations();
