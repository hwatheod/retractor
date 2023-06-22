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

describe("promoted bishops as pawns", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
        placeOnSquare(E4, WHITE_KING);
        placeOnSquare(G5, BLACK_KING);
        setRetract("b");
    });

    it("Promoted bishop on g8", function() {
        placeOnSquare(G8, WHITE_BISHOP);
        placeOnSquare(G7, WHITE_PAWN);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(H7, BLACK_PAWN);
        placeOnSquare(G6, BLACK_PAWN);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(2);
        expect(positionData.pawnCaptureCounts["b"]).toBe(0);
        expect(positionData.pawnCaptureCounts["t"]).toBe(2);
    });

    it("Promoted bishop on a1", function() {
        placeOnSquare(A1, BLACK_BISHOP);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(A4, WHITE_PAWN);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(0);
        expect(positionData.pawnCaptureCounts["b"]).toBe(0);
        expect(positionData.pawnCaptureCounts["t"]).toBe(1);
    });

    it("Promoted bishop on a7", function() {
        placeOnSquare(A7, WHITE_BISHOP);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        placeOnSquare(B6, BLACK_PAWN);
        placeOnSquare(A6, WHITE_PAWN);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(2);
        expect(positionData.pawnCaptureCounts["b"]).toBe(1);
        expect(positionData.pawnCaptureCounts["t"]).toBe(3);
    });

    it("Promoted bishop on g1", function() {
        placeOnSquare(G1, BLACK_BISHOP);
        placeOnSquare(G2, WHITE_PAWN);
        placeOnSquare(G3, WHITE_PAWN);
        placeOnSquare(F2, WHITE_PAWN);
        placeOnSquare(H2, BLACK_PAWN);
        placeOnSquare(G4, BLACK_PAWN);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(1);
        expect(positionData.pawnCaptureCounts["b"]).toBe(3);
        expect(positionData.pawnCaptureCounts["t"]).toBe(4);
    });

    it("Promoted bishops on a1 and b1 with a7, b7, c7 black pawns", function() {
        placeOnSquare(A1, BLACK_BISHOP);
        placeOnSquare(B1, BLACK_BISHOP);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        placeOnSquare(B3, WHITE_PAWN);
        placeOnSquare(A7, BLACK_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(1);
        expect(positionData.pawnCaptureCounts["b"]).toBe(8);
        expect(positionData.pawnCaptureCounts["t"]).toBe(9);
    });
});

describe("pawn captures with promoted pieces", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("White promoted bishop must have promoted on g8, test 1", function() {
        setForsythe("4k3/1p1p1p2/8/8/8/5B2/4PPPP/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(3);
        expect(positionData.pawnCaptureCounts["b"]).toBe(0);
        expect(positionData.pawnCaptureCounts["t"]).toBe(3);
    });

    it("White promoted bishop must have promoted on g8, test 2", function() {
        setForsythe("4k3/1p1p1pp1/8/8/8/5B2/4PPPP/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(5);
        expect(positionData.pawnCaptureCounts["b"]).toBe(0);
        expect(positionData.pawnCaptureCounts["t"]).toBe(5);
    });

    it("White promoted queen, shortest path b to f", function() {
        setForsythe("4k3/ppppp3/8/8/8/QQ6/2PPPPPP/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(4);
        expect(positionData.pawnCaptureCounts["b"]).toBe(0);
        expect(positionData.pawnCaptureCounts["t"]).toBe(4);
    });

    it("Black promoted knight, shortest path g to b", function() {
        setForsythe("4k3/pppppp2/8/8/3nnn2/8/2PPPPPP/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(0);
        expect(positionData.pawnCaptureCounts["b"]).toBe(5);
        expect(positionData.pawnCaptureCounts["t"]).toBe(5);
    });

    it("Black promoted knight with frozen white king, shortest path e-d", function() {
        setForsythe("4k3/8/2n5/2nn4/8/8/PPPP4/4K3");
        setFrozenFlag(E1.mFile, E1.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(0);
        expect(positionData.pawnCaptureCounts["b"]).toBe(1);
        expect(positionData.pawnCaptureCounts["t"]).toBe(1);
    });

    it("Black promoted rook and white promoted queen, shortest path White e-d and Black d-e", function() {
        setForsythe("4k3/4pppp/8/5rr1/2QQ2r1/8/PPPP4/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.pawnCaptureCounts["w"]).toBe(1);
        expect(positionData.pawnCaptureCounts["b"]).toBe(1);
        expect(positionData.pawnCaptureCounts["t"]).toBe(2);
    });
});

describe("Pawn captures with one missing friendly rook cage", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Rook cage in a8 corner with possible bishop promotion on b8", function() {
        setForsythe("2b1k3/pp1p4/8/8/3B4/2B5/8/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(1);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Rook cage in a8 corner with bishop promotion outside cage", function() {
        setForsythe("2b1k3/pp1p4/8/8/4B3/3B2P1/4PP1P/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Rook cage in h8 corner with promoted rook inside cage, shortest path e-g", function() {
        setForsythe("4kb2/4p1pR/5p1p/8/8/8/5PPP/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Rook cage in h8 corner with promoted queen from 1 capture outside", function() {
        setForsythe("4kb2/p1ppp1pp/8/8/8/6P1/1P2PP2/1QQ1K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Rook cage in a1 corner with promoted rook inside cage plus an extra black pawn on c2", function() {
        setForsythe("4k3/ppp5/8/8/8/P1P5/rPpP4/2B1K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(4);
    });

    it("Rook cage in a1 corner two promoted rooks inside cage", function() {
        setForsythe("4k3/8/8/8/8/P1P5/rP1P4/1rB1K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(3);
    });

    it("Rook cage in h1 corner from frozen king", function() {
        setForsythe("4k3/p1ppp3/5n2/5nn1/8/8/1P3PPP/4K3");
        setFrozenFlag(E1.mFile, E1.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });

    it("Strong rook cage in h1 corner with outside promoted black queen, shortest path e-d", function() {
        setForsythe("4k3/p1pp4/1p6/5q2/5q2/8/4PPPP/4KB2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });
});

describe("Pawn captures with multiple missing friendly rook cages", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Rook cages in a1 and h1 corners", function() {
        setForsythe("4k3/8/8/3b4/2b5/P5KP/1P1PP1P1/2B2B2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });

    it("Rook cages in a1, h1, h8 corners with promoted rooks in a1, h8 cages", function() {
        setForsythe("4kbR1/1p2p1pp/5p2/8/8/P6P/1PPPP1P1/r1B1KB2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(3);
        expect(positionData.totalCaptureCounts["b"]).toBe(3);
    });
});

describe("Pawn captures with rook cage with two missing rooks", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Two missing rooks on black's side with one promoted white knight", function () {
        setForsythe("4k3/p1pp1p1p/1p2p1p1/8/3N4/3NN3/8/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Two missing rooks on white's side with promoted black queen and knight", function () {
        setForsythe("4k3/8/nn1q4/1n1q4/8/1P4P1/P1PPPP1P/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });
});

describe("Special configuration for pawn captures", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Black's side special, white promotion needs 1 capture in cage", function() {
        setForsythe("4k3/p1p1pp1p/1p1p2p1/8/4N3/4NN2/8/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Black's side special, white promotion needs 2 captures in cage", function() {
        setForsythe("4k3/p1pppp1p/1p4p1/8/8/3B4/2B5/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("Black's side special, white promotion needs 2 captures in cage plus 1 outside", function() {
        setForsythe("4k3/p1pppp1p/1p4p1/8/4B3/5B2/PPP5/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(3);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
    });

    it("White's side special, black has a promoted rook inside the cage", function() {
        setForsythe("4k3/5pp1/8/8/8/P2P2P1/1PPKPP1P/r7");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });

    it("White's side special, black has a pawn inside the cage", function() {
        setForsythe("4k3/8/8/8/8/P2P2P1/1PPKPPpP/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
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

    /* https://www.janko.at/Retros/Masterworks/Part5.htm
       #44 - L. Ceriani - La Genesi delle Posizioni, 1961 - Ded. T. H. Willcocks
    */
    it("Tangled position from Ceriani problem", function() {
        setEnableSeparateCaptureTracking(true);
        setForsythe("1B1NKb2/n1NnpPrp/1PPkPrP1/1pRPppp1/2p4P/3p4/8/8");
        expect(getWhitePawnCaptures(board)).toBe(2);
        expect(getBlackPawnCaptures(board)).toBe(4);
        expect(getTotalPawnCaptures(board)).toBe(6);

        // remove all pieces but keep all pawns, make sure previous result is not cached (no longer correct)
        setForsythe("4K3/4pP1p/1PPkP1P1/1p1Pppp1/2p4P/3p4/8/8");
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(4);
        expect(getTotalPawnCaptures(board)).toBe(6);
        setEnableSeparateCaptureTracking(false);
    });
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

    it("both sides have 7 pawns on opponent's starting rank", function() {
        setForsythe("8/PPPPPPP1/8/8/8/8/ppppppp1/8");
        expect(getWhitePawnCaptures(board)).toBe(0);
        expect(getBlackPawnCaptures(board)).toBe(0);
        expect(getTotalPawnCaptures(board)).toBe(7);
    });
});