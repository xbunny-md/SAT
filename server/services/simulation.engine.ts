import crypto from "crypto";
import { db } from "../db/index";

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'corner' | 'shot_on_target' | 'substitution' | 'injury';
  teamId: string;
  player?: string; // Optional for now
  description: string;
}

export interface MatchSimulationResult {
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: {
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeCorners: number;
    awayCorners: number;
  };
  integrityHash: string;
}

export const simulationEngine = {
  async simulateMatch(homeTeam: any, awayTeam: any): Promise<MatchSimulationResult> {
    const events: MatchEvent[] = [];
    let homeScore = 0;
    let awayScore = 0;
    
    // Base stats + home advantage
    const homeAdvantage = 5;
    const homeStrength = (homeTeam.attack_strength + homeTeam.midfield_strength + homeAdvantage) / 2;
    const awayStrength = (awayTeam.attack_strength + awayTeam.midfield_strength) / 2;
    
    let homePossession = Math.round((homeStrength / (homeStrength + awayStrength)) * 100);
    let awayPossession = 100 - homePossession;

    let homeShots = 0;
    let awayShots = 0;
    let homeCorners = 0;
    let awayCorners = 0;

    // Simulate 90 minutes + added time (1-5 mins)
    const addedTime = Math.floor(Math.random() * 5) + 1;
    const totalMinutes = 90 + addedTime;

    for (let minute = 1; minute <= totalMinutes; minute++) {
      // Very basic probability engine
      const rand = Math.random() * 1000;

      // Home Goal Probability
      const homeGoalProb = (homeTeam.attack_strength / awayTeam.defense_strength) * 2; 
      if (rand < homeGoalProb) {
        homeScore++;
        homeShots++;
        events.push({ minute, type: 'goal', teamId: homeTeam.id, description: `Goal for ${homeTeam.name}!` });
      }

      // Away Goal Probability
      const awayGoalProb = (awayTeam.attack_strength / homeTeam.defense_strength) * 2;
      if (rand > 500 && rand < 500 + awayGoalProb) {
        awayScore++;
        awayShots++;
        events.push({ minute, type: 'goal', teamId: awayTeam.id, description: `Goal for ${awayTeam.name}!` });
      }

      // Shots
      if (rand > 100 && rand < 130) homeShots++;
      if (rand > 130 && rand < 160) awayShots++;

      // Corners
      if (rand > 200 && rand < 215) {
        homeCorners++;
        events.push({ minute, type: 'corner', teamId: homeTeam.id, description: `Corner for ${homeTeam.name}` });
      }
      if (rand > 215 && rand < 230) {
        awayCorners++;
        events.push({ minute, type: 'corner', teamId: awayTeam.id, description: `Corner for ${awayTeam.name}` });
      }

      // Cards
      if (rand > 300 && rand < 305) {
        events.push({ minute, type: 'yellow_card', teamId: homeTeam.id, description: `Yellow card for ${homeTeam.name}` });
      }
      if (rand > 305 && rand < 310) {
        events.push({ minute, type: 'yellow_card', teamId: awayTeam.id, description: `Yellow card for ${awayTeam.name}` });
      }
    }

    // Generate Integrity Hash
    const seedString = JSON.stringify({ homeScore, awayScore, events, timestamp: Date.now() });
    const integrityHash = crypto.createHash("sha256").update(seedString).digest("hex");

    return {
      homeScore,
      awayScore,
      events,
      stats: {
        homePossession,
        awayPossession,
        homeShots,
        awayShots,
        homeCorners,
        awayCorners
      },
      integrityHash
    };
  }
};