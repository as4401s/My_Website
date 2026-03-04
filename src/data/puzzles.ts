export interface ChessPuzzle {
    id: number;
    difficulty: 'Easy' | 'Intermediate' | 'Hard' | 'Grandmaster';
    fen: string; // Starting board state
    solution: string[]; // Sequential UCI moves (e.g. ['e2e4', 'e7e5'])
    description: string;
}

export const CHESS_PUZZLES: ChessPuzzle[] = [
    // --- EASY (1-10): Basic Checkmates & Forks ---
    {
        id: 1,
        difficulty: 'Easy',
        fen: '8/8/8/8/8/6k1/8/5R1K w - - 0 1',
        solution: ['f1f3'],
        description: 'Mate in 1: Cornered King.',
    },
    {
        id: 2,
        difficulty: 'Easy',
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
        solution: ['h5f7'],
        description: "Mate in 1: Scholar's Mate pattern.",
    },
    {
        id: 3,
        difficulty: 'Easy',
        fen: '6k1/5ppp/8/8/8/8/8/1R4K1 w - - 0 1',
        solution: ['b1b8'],
        description: 'Mate in 1: Back Rank Mate.',
    },
    {
        id: 4,
        difficulty: 'Easy',
        fen: '3r2k1/p4ppp/1p6/8/8/P7/1P3PPP/4R1K1 w - - 0 1',
        solution: ['e1e8'],
        description: 'Mate in 1: Rook infiltration.',
    },
    {
        id: 5,
        difficulty: 'Easy',
        fen: '6k1/5ppp/8/8/2B5/8/8/6K1 w - - 0 1',
        solution: ['c4f7'],
        description: 'Find the free pawn capture.',
    },
    {
        id: 6,
        difficulty: 'Easy',
        fen: '4k3/8/8/8/8/4Q3/8/4K3 w - - 0 1',
        solution: ['e3e8'],
        description: 'Deliver Checkmate.',
    },
    {
        id: 7,
        difficulty: 'Easy',
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/5P2/8/PPPPP1PP/RNBQKBNR w KQkq - 0 2',
        solution: ['f4e5'],
        description: "King's Gambit accepted/declined pattern capture.",
    },
    {
        id: 8,
        difficulty: 'Easy',
        fen: '8/8/8/8/3Q4/5k2/8/7K w - - 0 1',
        solution: ['d4d3'],
        description: 'Force the King backward.',
    },
    {
        id: 9,
        difficulty: 'Easy',
        fen: '7k/6pp/8/8/8/8/8/1R4K1 w - - 0 1',
        solution: ['b1b8'],
        description: 'Find the back rank.',
    },
    {
        id: 10,
        difficulty: 'Easy',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3',
        solution: ['c4f7'],
        description: 'Classic Bishop sacrifice.',
    },

    // --- INTERMEDIATE (11-20): 2-Move Combinations ---
    {
        id: 11,
        difficulty: 'Intermediate',
        fen: 'r1b1k2r/pppp1ppp/8/4P3/1b1Qn2q/2N5/PPP2PPP/R1B1KB1R w KQkq - 3 8',
        solution: ['d4b4'],
        description: 'Find the unprotected piece.',
    },
    {
        id: 12,
        difficulty: 'Intermediate',
        fen: 'rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
        solution: ['c4f7', 'e8f7', 'f3e5'],
        description: 'Double attack sequence.',
    },
    {
        id: 13,
        difficulty: 'Intermediate',
        fen: '3rkr2/p1pNn2p/2p5/8/2B1P3/8/PPP3PP/2KR4 w - - 3 24',
        solution: ['d7f6'],
        description: 'Knight Fork.',
    },
    {
        id: 14,
        difficulty: 'Intermediate',
        fen: '8/8/8/8/p6p/P4K1P/8/5k2 w - - 3 48',
        solution: ['f3g4'],
        description: 'Winning the endgame pawn race.',
    },
    {
        id: 15,
        difficulty: 'Intermediate',
        fen: 'r3kb1r/1p3ppp/pqn1pn2/1Bpp1b2/3P1B2/1QP1PN2/PP1N1PPP/R3K2R w KQkq - 0 9',
        solution: ['b5c6'],
        description: 'Exploiting the pin.',
    },
    {
        id: 16,
        difficulty: 'Intermediate',
        fen: '8/pp3k2/2p3p1/2P2p2/1P1R1P2/r5P1/7P/3K4 w - - 0 35',
        solution: ['d4d7'],
        description: 'Rook endgame activity.',
    },
    {
        id: 17,
        difficulty: 'Intermediate',
        fen: '2r1k2r/pp1n1ppp/1q2p1n1/3pP3/1b1P4/1PN1BN2/P2Q1PPP/R1R3K1 w k - 5 14',
        solution: ['c3d5'],
        description: 'Discovered attack & pin.',
    },
    {
        id: 18,
        difficulty: 'Intermediate',
        fen: '7r/p1k1bp2/2R1p1p1/P3P2p/1P3B2/2P5/6PP/6K1 w - - 1 31',
        solution: ['c6c5'],
        description: 'Forcing the King.',
    },
    {
        id: 19,
        difficulty: 'Intermediate',
        fen: 'r1bq1rk1/1pp1bppp/p1np1n2/4p1B1/2B1P3/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 8',
        solution: ['g5f6'],
        description: 'Removing the defender.',
    },
    {
        id: 20,
        difficulty: 'Intermediate',
        fen: '8/8/3R2r1/8/8/3k2p1/6K1/8 w - - 2 54',
        solution: ['d6g6'],
        description: 'Simplify into a winning endgame.',
    },

    // --- HARD (21-27): Complex multi-move tactics ---
    {
        id: 21,
        difficulty: 'Hard',
        fen: '1rb1nrk1/p1q1bppp/1pn1p3/2p1P3/2Pp1B2/3P1NP1/PP3PBP/R2QRNK1 w - - 1 13',
        solution: ['f3d4', 'c5d4'],
        description: 'Opening lines creatively.',
    },
    {
        id: 22,
        difficulty: 'Hard',
        fen: '3rkr2/p1pNn2p/2p5/8/2B1P3/8/PPP3PP/2KR4 w - - 3 24',
        solution: ['d7f6', 'f8f6', 'd1d8'],
        description: 'Clearance sacrifice.',
    },
    {
        id: 23,
        difficulty: 'Hard',
        fen: 'r2qk2r/ppp2pp1/2np1n1p/2b1p2b/2B1P2B/2NP1N1P/PPP2PP1/R2QK2R w KQkq - 1 9',
        solution: ['g2g4'],
        description: 'Breaking the pin aggressively.',
    },
    {
        id: 24,
        difficulty: 'Hard',
        fen: '8/5pk1/1R4p1/8/5P1p/r3P2P/5P1K/8 w - - 2 35',
        solution: ['b6b3'],
        description: 'Defending a worse rook endgame.',
    },
    {
        id: 25,
        difficulty: 'Hard',
        fen: '8/8/8/3Q4/8/5k2/8/7K w - - 0 1',
        solution: ['d5d3', 'f3f4', 'h1g2'],
        description: 'Queen vs King mating net.',
    },
    {
        id: 26,
        difficulty: 'Hard',
        fen: 'r3kb1r/1bqp1pp1/p1n1pn2/1pp4p/4P3/P1NP1N1P/BPP2PP1/R1BQ1RK1 w kq - 0 10',
        solution: ['e4e5', 'c6e5', 'f3e5'],
        description: 'Central pawn tension.',
    },
    {
        id: 27,
        difficulty: 'Hard',
        fen: '3r2k1/pb1rqp1p/1pp1p1p1/4Q3/2PP4/1P4P1/P4PBP/3RR1K1 w - - 9 24',
        solution: ['d4d5'],
        description: 'Finding the crucial lever.',
    },

    // --- GRANDMASTER (28-30): Devastating sacrifices ---
    {
        id: 28,
        difficulty: 'Grandmaster',
        fen: 'r1b1qrk1/1p3p1p/p5p1/2n1b3/2P5/2N2B2/PPQ2PPP/3R1RK1 w - - 0 18',
        solution: ['c3d5', 'c5e6', 'f1e1'],
        description: 'Positional domination and tempo.',
    },
    {
        id: 29,
        difficulty: 'Grandmaster',
        fen: '3r4/p1p3b1/4k2p/2p1p1p1/4P3/1P1K1PP1/P2N3P/5R2 w - - 1 30',
        solution: ['d3c2'],
        description: 'Deep king walk calculation.',
    },
    {
        id: 30,
        difficulty: 'Grandmaster',
        fen: 'r4rk1/pp1b1p1p/1q2p1p1/3pP3/1P1N4/P2B4/5PPP/R2Q1RK1 w - - 1 17',
        solution: ['d4f5', 'e6f5', 'd3a6'],
        description: 'Brilliant structural dismantling.',
    }
];
