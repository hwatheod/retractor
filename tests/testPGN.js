describe("backward move to forward move", function() {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
        setForsythe("2n1k2r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/R3K3");
    });

    const forwardMoveTests = [
        // pawn
        {
            "backwardNotation": "e4-e5",
            "backwardMove": new Move(E5, E4, "", false, "P", false),
            "forwardNotation": "e5",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPpPn2/1q1p3p/2Q3RB/1N4rp/R3K3"
        },
        {
            "backwardNotation": "e4xNf5",
            "backwardMove": new Move(F5, E4, "N", false, "P", false),
            "forwardNotation": "exf5",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1P2/1q1p3p/2Q3RB/1N4rp/R3K3"
        },
        {
            "backwardNotation": "d4xQc3",
            "backwardMove": new Move(C3, D4, "Q", false, "P", false),
            "forwardNotation": "dxc3",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q2P2p/2p3RB/1N4rp/R3K3"
        },
        {
            "backwardNotation": "d4-d3",
            "backwardMove": new Move(D3, D4, "", false, "P", false),
            "forwardNotation": "d3",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q2P2p/2Qp2RB/1N4rp/R3K3"
        },

        // promotions
        {
            "backwardNotation": "b7xNc8=Q+",
            "backwardMove": new Move(C8, B7, "N", true, "Q", true),
            "forwardNotation": "bxc8=Q+",
            "newForsythe": "2Q1k2r/6P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/R3K3"
        },
        {
            "backwardNotation": "h2-h1=B",
            "backwardMove": new Move(H1, H2, "", true, "B", false),
            "forwardNotation": "h1=B",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4r1/R3K2b"
        },

        // en passant
        {
            "backwardNotation": "c5xd6ep",
            "backwardMove": new Move(D6, C5, "ep", false, "P", false),
            "forwardNotation": "cxd6",
            "newForsythe": "2n1k2r/1P4P1/R2P4/1b3n2/1q1pP2p/2Q3RB/1N4rp/R3K3"
        },
        {
            "backwardNotation": "d4xe3ep",
            "backwardMove": new Move(E3, D4, "ep", false, "P", false),
            "forwardNotation": "dxe3",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q5p/2Q1p1RB/1N4rp/R3K3"
        },

        // knight
        {
            "backwardNotation": "Nb2-c4",
            "backwardMove": new Move(C4, B2, "", false, "N", false),
            "forwardNotation": "Nc4",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1qNpP2p/2Q3RB/6rp/R3K3"
        },        
        {
            "backwardNotation": "Nf5xRg3",
            "backwardMove": new Move(G3, F5, "R", false, "N", false),
            "forwardNotation": "Nxg3",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp4/1q1pP2p/2Q3nB/1N4rp/R3K3"
        },
        {
            "backwardNotation": "Nc8-d6",
            "backwardMove": new Move(D6, C8, "", false, "N", false),
            "forwardNotation": "Ncd6",
            "newForsythe": "4k2r/1P4P1/R2n4/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/R3K3"
        },

        // bishop
        {
            "backwardNotation": "Bh3xRg2",
            "backwardMove": new Move(G2, H3, "R", false, "B", false),
            "forwardNotation": "Bxg2",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3R1/1N4Bp/R3K3"
        },
        {
            "backwardNotation": "Bb5-f1",
            "backwardMove": new Move(F1, B5, "", false, "B", false),
            "forwardNotation": "Bf1",
            "newForsythe": "2n1k2r/1P4P1/R7/2Pp1n2/1q1pP2p/2Q3RB/1N4rp/R3Kb2"
        },

        // rook
        {
            "backwardNotation": "Ra1-a5",
            "backwardMove": new Move(A5, A1, "", false, "R", false),
            "forwardNotation": "R1a5",
            "newForsythe": "2n1k2r/1P4P1/R7/RbPp1n2/1q1pP2p/2Q3RB/1N4rp/4K3"
        },        
        {
            "backwardNotation": "Rg2xNb2",
            "backwardMove": new Move(B2, G2, "N", false, "R", false),
            "forwardNotation": "Rxb2",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1r5p/R3K3"
        },

        // queen
        {
            "backwardNotation": "Qc3xQb4",
            "backwardMove": new Move(B4, C3, "Q", false, "Q", false),
            "forwardNotation": "Qxb4",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1Q1pP2p/6RB/1N4rp/R3K3"         
        },
        {
            "backwardNotation": "Qb4xQc3+",
            "backwardMove": new Move(C3, B4, "Q", false, "Q", true),
            "forwardNotation": "Qxc3+",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/3pP2p/2q3RB/1N4rp/R3K3"         
        },

        // king
        {
            "backwardNotation": "Ke1-d1",
            "backwardMove": new Move(D1, E1, "", false, "K", false),
            "forwardNotation": "Kd1",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/R2K4"         
        },
        {
            "backwardNotation": "Ke8-f8",
            "backwardMove": new Move(F8, E8, "", false, "K", false),
            "forwardNotation": "Kf8",
            "newForsythe": "2n2k1r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/R3K3"      
        },

        // castling
        {
            "backwardNotation": "O-O-O",
            "backwardMove": new Move(C1, E1, "", false, "K", false),
            "forwardNotation": "O-O-O",
            "newForsythe": "2n1k2r/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/2KR4"      
        },
        {
            "backwardNotation": "O-O",
            "backwardMove": new Move(G8, E8, "", false, "K", false),
            "forwardNotation": "O-O",
            "newForsythe": "2n2rk1/1P4P1/R7/1bPp1n2/1q1pP2p/2Q3RB/1N4rp/R3K3"      
        },
    ]

    forwardMoveTests.forEach(forwardMoveTest => {
        it(forwardMoveTest["backwardNotation"], function() {
            const backwardMove = forwardMoveTest["backwardMove"];
            const forwardNotation = backwardMoveToForwardMove(backwardMove, board);
            expect(forwardNotation).toBe(forwardMoveTest["forwardNotation"]);
            playForwardMove(backwardMove, board);
            const newForsythe = getForsythe(board);
            expect(newForsythe).toBe(forwardMoveTest["newForsythe"]);
        });
    });

});

describe("Disambiguation", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
        setForsythe("4k3/8/8/8/8/Q7/8/QQ2K3");
    });

    it("Full square disambiguation", function() {
        const backwardMove = new Move(A2, A1, "", false, "Q", false);
        const forwardNotation = backwardMoveToForwardMove(backwardMove, board);
        expect(forwardNotation).toBe("Qa1a2");
    });
});

function parsePGN(pgn) {
    const pgnSplit = pgn.split("\n");
    let fen = "";
    let moveText = "";

    for (let i = 0; i < pgnSplit.length; i++) {
        const line = pgnSplit[i].trim();
        if (line.startsWith("[FEN")) {
            fen = line.substring(4, line.length - 1).trim(); 
        }
        if (line.startsWith("1.")) {
            moveText = line;
            break;
        }
    }
    return {
        'FEN': fen,
        'moveText': moveText
    };
}

describe("Generate PGN", function() {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    pgnTests = [
        {
            "name": "Black en passant target, black to move",
            "forsythe": "2kr2N1/8/2P5/r7/3BpP2/2Q5/8/1N3RK1",
            "backwardMoves": [
                new Move(A1, A5, "Q", false, "R", false),
                new Move(A1, C3, "", false, "Q", false),
                new Move(F3, E4, "ep", false, "P", false)
            ],
            "fenRest": "b - f3 0 1",
            "moveText": "1... exf3 2. Qa1 Rxa1"
        },
        {
            "name": "Castling and unpromotions, white to move",
            "forsythe": "r3k3/6P1/2P5/8/3B4/5p2/1p6/QN2K2R",
            "backwardMoves": [
                new Move(C8, E8, "", false, "K", false),
                new Move(G1, E1, "", false, "K", false),
                new Move(A1, B2, "Q", true, "R", false),
                new Move(G8, G7, "", true, "N", false),
            ],
            "fenRest": "w Kq - 0 1",
            "moveText": "1. g8=N bxa1=R 2. O-O O-O-O"
        },
        {
            "name": "Castling, white en passant target",
            "forsythe": "r3k2r/8/8/3pP3/8/8/8/R3K2R",
            "backwardMoves": [
                new Move(C1, E1, "", false, "K", false),
                new Move(G8, E8, "", false, "K", false),
                new Move(D6, E5, "ep", false, "P", false)
            ],
            "fenRest": "w KQkq d6 0 1",
            "moveText": "1. exd6 O-O 2. O-O-O"
        }
    ];

    pgnTests.forEach(pgnTest => {
        it(pgnTest["name"], function() {
            const forsythe = pgnTest['forsythe']
            setForsythe(forsythe);
            const pgn = generatePGN(pgnTest['backwardMoves'], board);
            const parsedPGN = parsePGN(pgn);
            const fen = parsedPGN['FEN'];
            const moveText = parsedPGN['moveText'];

            expect(fen).toBe(`"${forsythe} ${pgnTest['fenRest']}"`);
            expect(moveText).toBe(`${pgnTest['moveText']} *`);
        });
    });
});