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
  J: 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  T: 9,
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
  jokers?: number;
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

console.log(total);

function determineHand(hand: string[]): WinType {
  const counts = countCards(hand);

  let winType = WinType.HighCard;
  let maxMatch = 1;

  if (isFiveOfAKind(counts)) {
    winType = WinType.FiveOfAKind;
    maxMatch = 5;
  } else if (isFourOfAKind(counts)) {
    winType = WinType.FourOfAKind;
    maxMatch = 4;
  } else if (isFullHouse(counts)) {
    winType = WinType.FullHouse;
    maxMatch = 3;
  } else if (isThreeOfAKind(counts)) {
    winType = WinType.ThreeOfAKind;
    maxMatch = 3;
  } else if (isTwoPair(counts)) {
    winType = WinType.TwoPair;
    maxMatch = 2;
  } else if (isOnePair(counts)) {
    winType = WinType.OnePair;
    maxMatch = 2;
  }

  const jokers = hand.reduce((acc, card) => (card === 'J' ? acc + 1 : acc), 0);

  if (jokers > 0) {
    if (winType === WinType.TwoPair && jokers === 1) winType = WinType.FullHouse;
    else {
      maxMatch += jokers;

      switch (maxMatch) {
        case 2:
          winType = WinType.OnePair;
          break;
        case 3:
          winType = WinType.ThreeOfAKind;
          break;
        case 4:
          winType = WinType.FourOfAKind;
          break;
        case 5:
        case 6:
          winType = WinType.FiveOfAKind;
          break;
      }
    }
  }

  return winType;
}

function countCards(hand: string[]): number[] {
  const counts = new Array(13).fill(0);
  for (const card of hand) {
    if (card[0] !== 'J') {
      counts[countIndex[card[0]]]++;
    }
  }

  return counts;
}

function isFiveOfAKind(counts: number[]): boolean {
  return counts.includes(5);
}

function isFourOfAKind(counts: number[]): boolean {
  return counts.includes(4);
}

function isFullHouse(counts: number[]): boolean {
  return counts.includes(3) && counts.includes(2);
}

function isThreeOfAKind(counts: number[]): boolean {
  return counts.includes(3);
}

function isTwoPair(counts: number[]): boolean {
  return counts.filter((count) => count === 2).length === 2;
}

function isOnePair(counts: number[]): boolean {
  return counts.includes(2);
}
