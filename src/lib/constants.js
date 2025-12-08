// Default Rank Points if no specific overrides
const DEFAULT_RANK_POINTS = { S: 240, A: 48, B: 12, C: 4, D: 1 };

export const RANKS = ['S', 'A', 'B', 'C', 'D'];

export const RANK_COLORS = {
    S: 'text-yellow-400',
    A: 'text-pink-400',
    B: 'text-blue-400',
    C: 'text-green-400',
    D: 'text-white'
};

export const DEFAULT_MONSTER_TEMPLATE = {
    name: '',
    isVisible: true,
    sTarget: 4,
    manualEV: 0, // Override for Expected Value per battle. 0 = disabled.
    // Synthesis rules: How many of Rank X to make Rank X+1
    // D->C, C->B, B->A, A->S
    synthesis: {
        D_to_C: 3,
        C_to_B: 4,
        B_to_A: 4,
        A_to_S: 5
    },
    // We will calculate rankPoints dynamically from synthesis rules + D=1 base.
};
