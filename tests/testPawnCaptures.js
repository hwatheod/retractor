describe("White pawns only", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("empty board edge case 0 0 0", function() {
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(0);
    });

    it("a2-a3-b2 impossible", function() {
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(IMPOSSIBLE);
        expect(getBlackPawnCaptures(board)).toBe(IMPOSSIBLE);
        expect(getTotalPawnCaptures(board)).toBe(IMPOSSIBLE);
    });

    it("b2-b3-c2 1", function() {
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(B3, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(1);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("a2-a3-a4-a5-a6-a7 chain 0,1,3,6,10,15", function() {
        placeOnSquare(A2, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(0);

        placeOnSquare(A3, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(1);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(1);

        placeOnSquare(A4, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(3);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(3);

        placeOnSquare(A5, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(6);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(6);

        placeOnSquare(A6, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(10);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(10);

        placeOnSquare(A7, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(15);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(15);
    });

    it("e3-e4-e5 2", function() {
        placeOnSquare(E3, WHITE_PAWN);
        placeOnSquare(E4, WHITE_PAWN);
        placeOnSquare(E5, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(2);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });
    
    it("a2-a4-b3-c3 3", function() {
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(A4, WHITE_PAWN);
        placeOnSquare(B3, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(3);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(3);
    })

    it("a7-b7-c7-a6-b6-c6-d6-e6 15", function() {
        setForsythe("8/PPP5/PPPPP3/8/8/8/8/8");
        expect(getWhitePawnCaptures(board)).toBe(15);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(15);
    })
});

describe("Black pawns only", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("h7-h6-g7 impossible", function() {
        placeOnSquare(H7, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(IMPOSSIBLE);
        expect(getBlackPawnCaptures(board)).toBe(IMPOSSIBLE);
        expect(getTotalPawnCaptures(board)).toBe(IMPOSSIBLE);
    });

    it("a7-b6-c7-a5 impossible", function() {
        placeOnSquare(A7, BLACK_PAWN);
        placeOnSquare(B6, BLACK_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        placeOnSquare(A5, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(IMPOSSIBLE);
        expect(getBlackPawnCaptures(board)).toBe(IMPOSSIBLE);
        expect(getTotalPawnCaptures(board)).toBe(IMPOSSIBLE);
    });

    it("d7-e7-e6 1", function() {
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(E6, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(1);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("a2-a3-a4-a5-a6-a7 chain 0,1,3,6,10,15", function() {
        placeOnSquare(A7, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(0);

        placeOnSquare(A6, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(1);
        expect(getTotalPawnCaptures(board)).toBe(1);

        placeOnSquare(A5, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(3);
        expect(getTotalPawnCaptures(board)).toBe(3);

        placeOnSquare(A4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(6);
        expect(getTotalPawnCaptures(board)).toBe(6);

        placeOnSquare(A3, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(10);
        expect(getTotalPawnCaptures(board)).toBe(10);

        placeOnSquare(A2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(15);
        expect(getTotalPawnCaptures(board)).toBe(15);
    });

    it("e3-e4-e5 2", function() {
        placeOnSquare(E3, BLACK_PAWN);
        placeOnSquare(E4, BLACK_PAWN);
        placeOnSquare(E5, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });
    
    it("c7-d7-c6-d6 2", function() {
        placeOnSquare(C7, BLACK_PAWN);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(C6, BLACK_PAWN);
        placeOnSquare(D6, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });
});

describe("untangled positions", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("b2-b3-c4 h7-h6-h5 1 3 4", function() {
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(B3, WHITE_PAWN);
        placeOnSquare(C4, WHITE_PAWN);
        placeOnSquare(H7, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        placeOnSquare(H5, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(1);
        expect(getBlackPawnCaptures(board)).toBe(3);
        expect(getTotalPawnCaptures(board)).toBe(4);
    });

    it("f7xe6 g7xf6xe5 b2xc3 f2xe3 h2xg3xf4 4 3 7", function() {
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D2, WHITE_PAWN);
        placeOnSquare(E2, WHITE_PAWN);
        placeOnSquare(E3, WHITE_PAWN);
        placeOnSquare(F4, WHITE_PAWN);
        placeOnSquare(G2, WHITE_PAWN);
        placeOnSquare(A7, BLACK_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(E6, BLACK_PAWN);
        placeOnSquare(E5, BLACK_PAWN);
        placeOnSquare(H7, BLACK_PAWN);

        expect(getWhitePawnCaptures(board)).toBe(4);
        expect(getBlackPawnCaptures(board)).toBe(3);
        expect(getTotalPawnCaptures(board)).toBe(7);
    });
});

describe("tangled positions", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("one pawn passed the other: e5 e4 0 0 1", function() {
        placeOnSquare(E5, WHITE_PAWN);
        placeOnSquare(E4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("a3-b2 a2 0 1 1", function() {
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(A2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(1);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("h7 g7-h6 1 0 1", function() {
        placeOnSquare(H7, WHITE_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(1);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("b2-c3-d2 c2 0 1 1", function() {
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D2, WHITE_PAWN);
        placeOnSquare(C2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(1);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("f7 e7-f6-g7 1 0 1", function() {
        placeOnSquare(F7, WHITE_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(F6, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(1);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(1);
    });

    it("a3-b2 a2-b7 0 2 2", function() {
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(A2, BLACK_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });

    it("a3-b2 a2-b7-c7 0 2 2", function() {
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(A2, BLACK_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });

    it("b2-c3-d3-e2 c2-d2 0 1 2", function() {
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D3, WHITE_PAWN);
        placeOnSquare(E2, WHITE_PAWN);
        placeOnSquare(C2, BLACK_PAWN);
        placeOnSquare(D2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(1);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });

    it("c7-d7 b7-c6-d6-e7 1 0 2", function() {
        placeOnSquare(C7, WHITE_PAWN);
        placeOnSquare(D7, WHITE_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C6, BLACK_PAWN);
        placeOnSquare(D6, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(1);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(2);
    });

    it("b2-c3-d3-e3-f2 c2-d2-e2 0 2 3", function() {
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D3, WHITE_PAWN);
        placeOnSquare(E3, WHITE_PAWN);
        placeOnSquare(F2, WHITE_PAWN);
        placeOnSquare(C2, BLACK_PAWN);
        placeOnSquare(D2, BLACK_PAWN);
        placeOnSquare(E2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(3);
    });

    it("a2-b2-c2-d5-e5-f2-g2-h2 a7-b7-c7-d4-e4-f7-g7-h7 0 0 4", function() {
        setForsythe("8/ppp2ppp/8/3PP3/3pp3/8/PPP2PPP/8");
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(4);
    });

    it("full board but only one tangled column 8/6p1/4p2p/pppp4/PP1P4/4P2P/5PPp/8 0 2 2", function() {
        setForsythe("8/6p1/4p2p/pppp4/PP1P4/4P2P/5PPp/8");
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(2);
    })

    it("column of 3 black pawns behind white pawn a5 a4-a3-a2 0 3 4", function() {
        placeOnSquare(A5, WHITE_PAWN);
        placeOnSquare(A4, BLACK_PAWN);
        placeOnSquare(A3, BLACK_PAWN);
        placeOnSquare(A2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(3);
        expect(getTotalPawnCaptures(board)).toBe(4);
    });

    it("column of 3 black pawns behind white pawn, plus extra white pawn a5-b2 a4-a3-a2 0 3 5", function() {
        placeOnSquare(A5, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(A4, BLACK_PAWN);
        placeOnSquare(A3, BLACK_PAWN);
        placeOnSquare(A2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(3);
        expect(getTotalPawnCaptures(board)).toBe(5);
    });

    it("column of 4 black pawns behind white pawn, plus extra white pawn a6-b2 a5-a4-a3-a2 0 6 8", function() {
        placeOnSquare(A6, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(A5, BLACK_PAWN);
        placeOnSquare(A4, BLACK_PAWN);
        placeOnSquare(A3, BLACK_PAWN);
        placeOnSquare(A2, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(6);
        expect(getTotalPawnCaptures(board)).toBe(8);
    });

    it("buggy configuration 1", function() {
        setForsythe("8/8/4PP2/6P1/4pp2/4pp2/3P4/8");
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(2);
        expect(getTotalPawnCaptures(board)).toBe(4);
    });

    /* https://www.janko.at/Retros/Masterworks/Part5.htm
       #45 - L. Ceriani - La Genesi delle Posizioni, 1961
     */
    it("buggy configuration 2", function() {
        setForsythe("8/2P2p1p/2p3p1/1PP5/1p2P1P1/4p1P1/2k1PP2/K7");
        expect(getWhitePawnCaptures(board)).toBe(4);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(4);
    })
});

describe("slow cases", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("row of pawns in the middle", function() {
        placeOnSquare(A5, WHITE_PAWN);
        placeOnSquare(A4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(1);

        placeOnSquare(B5, WHITE_PAWN);
        placeOnSquare(B4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(2);

        placeOnSquare(C5, WHITE_PAWN);
        placeOnSquare(C4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(3);

        placeOnSquare(D5, WHITE_PAWN);
        placeOnSquare(D4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(4);

        placeOnSquare(E5, WHITE_PAWN);
        placeOnSquare(E4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(5);

        placeOnSquare(F5, WHITE_PAWN);
        placeOnSquare(F4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(6);

        placeOnSquare(G5, WHITE_PAWN);
        placeOnSquare(G4, BLACK_PAWN);
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(7);

        // too slow for now
        // placeOnSquare(H5, WHITE_PAWN);
        // placeOnSquare(H4, BLACK_PAWN);
        // expect(getWhitePawnCaptures(board)).toBe(IMPOSSIBLE);
        // expect(getBlackPawnCaptures(board)).toBe(IMPOSSIBLE);
        // expect(getTotalPawnCaptures(board)).toBe(IMPOSSIBLE);
    });

    // too slow for now
    xit("both sides have 7 pawns on opponent's starting rank", function() {
        setForsythe("8/PPPPPPP1/8/8/8/8/ppppppp1/8");
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(7);
    });

    /* A position from a real retro problem
       https://www.janko.at/Retros/Masterworks/Part5.htm
       #44 - L. Ceriani - La Genesi delle Posizioni, 1961 - Ded. T. H. Willcocks
       1B1NKb2/n1NnpPrp/1PPkPrP1/1pRPppp1/2p4P/3p4/8/8
    */
});