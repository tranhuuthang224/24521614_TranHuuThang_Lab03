/**
 * pubgArenaData.js - Domain data schema for KRAFTON PUBG Vietnam Arena (Slide 29)
 * Contains PVS Grand Finals Tickets, G-Coin Crates, and Vietnamese Esports Squads.
 */

// Drops: Airdrop timer set to 3 minutes in the future from now for interactive live demonstration
export function getInitialCrateDrops() {
  const now = Date.now();
  return [
    {
      id: 'pvs-vip-pass',
      title: 'PVS Finals VIP Pass + 5,000 G-Coin',
      type: 'VIP_PASS',
      priceVnd: 450000,
      stock: 8,
      targetEpochMs: now + 180000, // 3 minutes countdown
      rarity: 'Mythic',
    },
    {
      id: 'contraband-crate',
      title: 'Contraband Gear Crate (Beryl M762 Progressive)',
      type: 'CONTRABAND',
      priceVnd: 120000,
      stock: 25,
      targetEpochMs: now + 300000, // 5 minutes countdown
      rarity: 'Legendary',
    },
    {
      id: 'airdrop-crate-lvl3',
      title: 'Level 3 Military Spetsnaz Tactical Armor',
      type: 'SUPPLY_DROP',
      priceVnd: 85000,
      stock: 40,
      targetEpochMs: now + 420000, // 7 minutes countdown
      rarity: 'Rare',
    },
  ];
}

// Vietnamese Top Squad Standings (PVS 2026 Grand Finals)
export const INITIAL_SQUAD_STANDINGS = [
  {
    squadId: 'te',
    squadName: 'The Expendables',
    tag: 'TE',
    wwcdCount: 4,
    placementPts: 58,
    killPts: 76,
    coach: 'Scary',
  },
  {
    squadId: 'ces',
    squadName: 'Cerberus Esports',
    tag: 'CES',
    wwcdCount: 3,
    placementPts: 54,
    killPts: 82,
    coach: 'SsuBang',
  },
  {
    squadId: 'ge',
    squadName: 'GameHome Esports',
    tag: 'GE',
    wwcdCount: 2,
    placementPts: 43,
    killPts: 51,
    coach: 'Kowalsky',
  },
  {
    squadId: 'agg',
    squadName: 'All Gamers Global (VN)',
    tag: 'AGG',
    wwcdCount: 1,
    placementPts: 38,
    killPts: 45,
    coach: 'Viper',
  },
  {
    squadId: 're',
    squadName: 'Roy Esports',
    tag: 'RE',
    wwcdCount: 1,
    placementPts: 31,
    killPts: 39,
    coach: 'Ken',
  },
];

export function formatVnd(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
