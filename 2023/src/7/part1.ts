import { readFileSync } from 'fs';
import { join } from 'path';

enum WinType {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  OnePair = 1,
  HighCard = 0,
}

const cardRank = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5,
  '8': 6,
  '9': 7,
  T: 8,
  J: 9,
  Q: 10,
  K: 11,
  A: 12,
};

const countIndex = {
  A: 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
};

type Hand = {
  hand: string[];
  handType: WinType;
  bid: number;
  rank?: number;
  winnings?: number;
};

const data = readFileSync(join(__dirname, 'input.txt')).toString();
const lines = data.trim().split('\n');

const hands = lines.map<Hand>((line) => {
  const els = line.split(' ');
  const hand = els[0].split('');
  const bid = Number.parseInt(els[1]);

  const handType = determineHand(hand);

  return { hand, handType, bid };
});

hands.sort((a, b) => {
  if (a.handType === b.handType) {
    for (let i = 0; i < a.hand.length; i++) {
      const aRank = cardRank[a.hand[i]];
      const bRank = cardRank[b.hand[i]];
      if (aRank !== bRank) {
        return aRank - bRank;
      }
    }
  }
  return a.handType - b.handType;
});

let total = 0;
hands.forEach((hand, index) => {
  hand.rank = index + 1;
  hand.winnings = hand.rank * hand.bid;

  total += hand.winnings;
});

// console.log(hands);
console.log(total);

function determineHand(hand: string[]): WinType {
  if (isFiveOfAKind(hand)) {
    return WinType.FiveOfAKind;
  }
  if (isFourOfAKind(hand)) {
    return WinType.FourOfAKind;
  }
  if (isFullHouse(hand)) {
    return WinType.FullHouse;
  }
  if (isThreeOfAKind(hand)) {
    return WinType.ThreeOfAKind;
  }
  if (isTwoPair(hand)) {
    return WinType.TwoPair;
  }
  if (isOnePair(hand)) {
    return WinType.OnePair;
  }

  return WinType.HighCard;
}

function countCards(hand: string[]): number[] {
  const counts = new Array(13).fill(0);
  for (const card of hand) {
    counts[countIndex[card[0]]]++;
  }
  return counts;
}

function isFiveOfAKind(hand: string[]): boolean {
  const counts = countCards(hand);
  return counts.includes(5);
}

function isFourOfAKind(hand: string[]): boolean {
  const counts = countCards(hand);
  return counts.includes(4);
}

function isFullHouse(hand: string[]): boolean {
  const counts = countCards(hand);
  return counts.includes(3) && counts.includes(2);
}

function isThreeOfAKind(hand: string[]): boolean {
  const counts = countCards(hand);
  return counts.includes(3);
}

function isTwoPair(hand: string[]): boolean {
  const counts = countCards(hand);
  return counts.filter((count) => count === 2).length === 2;
}

function isOnePair(hand: string[]): boolean {
  const counts = countCards(hand);
  return counts.includes(2);
}
