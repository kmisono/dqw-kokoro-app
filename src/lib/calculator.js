import { RANKS } from './constants';

/**
 * Calculates the point value for each rank based on synthesis rules.
 * Base unit is D = 1 point.
 * @param {Object} synthesisRules { D_to_C, C_to_B, B_to_A, A_to_S }
 * @returns {Object} { S, A, B, C, D } points
 */
// 1. Calculate weighted point values based on synthesis rules
// D is always base 1.
export const getRankPoints = (synthesisRules) => {
    const D = 1;
    const C = D * (synthesisRules.D_to_C || 4);
    const B = C * (synthesisRules.C_to_B || 4);
    const A = B * (synthesisRules.B_to_A || 4);
    const S = A * (synthesisRules.A_to_S || 5);
    return { S, A, B, C, D };
};

/**
 * Calculate total points for a specific monster from logs
 * @param {Array} logs All battle logs
 * @param {Object} monster Monster configuration object
 * @returns {Object} { totalPoints, currentS, currentA, ...counts }
 */
export const calculateStats = (logs, monster) => {
    const monsterLogs = logs.filter(l => l.monsterId === monster.id);

    // Dynamically calculate rank points based on this monster's rules
    const rankPoints = getRankPoints(monster.synthesis || { D_to_C: 4, C_to_B: 4, B_to_A: 4, A_to_S: 5 });

    const counts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    let totalPoints = 0;

    monsterLogs.forEach(log => {
        if (counts[log.rank] !== undefined) {
            counts[log.rank]++;
            totalPoints += rankPoints[log.rank];
        }
    });

    const sProgress = rankPoints.S > 0 ? totalPoints / rankPoints.S : 0;
    const averagePoints = monsterLogs.length > 0 ? totalPoints / monsterLogs.length : 0;

    return {
        totalPoints,
        counts,
        sProgress,
        logs: monsterLogs,
        rankPoints, // Return calculated points for UI use
        averagePoints
    };
};

/**
 * Predict remaining battles
 */
export const predictRemainingBattles = (targetS, currentPoints, monster, expectedPointsPerBattle) => {
    const rankPoints = getRankPoints(monster.synthesis || { D_to_C: 4, C_to_B: 4, B_to_A: 4, A_to_S: 5 });
    const targetPoints = targetS * rankPoints.S;
    const remainingPoints = Math.max(0, targetPoints - currentPoints);

    if (remainingPoints === 0) return 0;
    if (expectedPointsPerBattle <= 0) return -1;

    return Math.ceil(remainingPoints / expectedPointsPerBattle);
};

/**
 * Calculates optimal inventory by simulating synthesis from bottom up.
 * @param {Object} rawCounts { S, A, B, C, D }
 * @param {Object} synthesisRules { D_to_C, C_to_B, B_to_A, A_to_S }
 * @returns {Object} Optimized counts { S, A, B, C, D }
 */
export const calculateOptimalInventory = (rawCounts, synthesisRules) => {
    // Clone counts to avoid mutation
    const inventory = { ...rawCounts };
    const rules = synthesisRules || { D_to_C: 4, C_to_B: 4, B_to_A: 4, A_to_S: 5 };

    // Process D -> C
    const dToC = Math.floor(inventory.D / rules.D_to_C);
    inventory.D %= rules.D_to_C;
    inventory.C += dToC;

    // Process C -> B
    const cToB = Math.floor(inventory.C / rules.C_to_B);
    inventory.C %= rules.C_to_B;
    inventory.B += cToB;

    // Process B -> A
    const bToA = Math.floor(inventory.B / rules.B_to_A);
    inventory.B %= rules.B_to_A;
    inventory.A += bToA;

    // Process A -> S
    const aToS = Math.floor(inventory.A / rules.A_to_S);
    inventory.A %= rules.A_to_S;
    inventory.S += aToS;

    return inventory;
};

export const calculateDefaultExpectedValue = (monster) => {
    const { S, A, B, C, D } = getRankPoints(monster.synthesis || { D_to_C: 4, C_to_B: 4, B_to_A: 4, A_to_S: 5 });
    return (0.03 * S) + (0.07 * A) + (0.15 * B) + (0.25 * C) + (0.50 * D);
}
