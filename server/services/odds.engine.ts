export const oddsEngine = {
  calculateOdds(homeTeam: any, awayTeam: any, marginPercent: number = 5) {
    const homeAdvantage = 5;
    const homeStrength = (homeTeam.attack_strength + homeTeam.midfield_strength + homeAdvantage) / 2;
    const awayStrength = (awayTeam.attack_strength + awayTeam.midfield_strength) / 2;
    
    // Very basic probability estimation based on strength ratio
    let p1 = (homeStrength / (homeStrength + awayStrength)) * 1.1; // Home win bias
    let p2 = (awayStrength / (homeStrength + awayStrength)) * 0.9;
    let pX = 1 - (p1 + p2);

    // Normalize
    const sum = p1 + p2 + pX;
    p1 /= sum;
    p2 /= sum;
    pX /= sum;

    // Apply sportsbook margin (overround)
    const margin = 1 + (marginPercent / 100);
    
    const odds1X2 = {
      "1": margin / p1,
      "X": margin / pX,
      "2": margin / p2
    };

    // Double Chance
    const oddsDC = {
      "1X": margin / (p1 + pX),
      "12": margin / (p1 + p2),
      "X2": margin / (pX + p2)
    };

    // BTTS (simplistic derived from attack vs defense)
    const avgGoals = (homeTeam.attack_strength / awayTeam.defense_strength) + (awayTeam.attack_strength / homeTeam.defense_strength);
    const pYes = Math.min(0.9, Math.max(0.1, (avgGoals / 4)));
    const pNo = 1 - pYes;

    const oddsBTTS = {
      "Yes": margin / pYes,
      "No": margin / pNo
    };

    // Over/Under 2.5
    const pOver25 = Math.min(0.9, Math.max(0.1, (avgGoals / 3)));
    const pUnder25 = 1 - pOver25;

    const oddsOU25 = {
      "Over": margin / pOver25,
      "Under": margin / pUnder25
    };

    return {
      "Match Winner": odds1X2,
      "Double Chance": oddsDC,
      "Both Teams To Score": oddsBTTS,
      "Over/Under 2.5 Goals": oddsOU25
    };
  }
};