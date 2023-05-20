function verifyMoves(moveList, sourceSquare, fromUnit, targetSquares) {
    expect(moveList.length).toBe(targetSquares.length);
    moveList.forEach(move => {
        expect(move.from).toEqual(sourceSquare);
        expect(move.uncapturedUnit).toBe("");
        expect(move.unpromote).toBe(false);
        expect(move.fromUnit).toBe(fromUnit);
        expect(move.check).toBe(false);
    });
    const toSquares = moveList.map(move => move.to);
    targetSquares.forEach(square => {
        expect(toSquares).toContain(square);
    });
}

describe("Test king move generator", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Test king move in center", function() {
        placeOnSquare(E5, WHITE_KING);
        const targetSquares = [
            E4, E6, D5, F5, D6, D4, F6, F4
        ];
        const moveList = [];
        getPseudoLegalMovesKing(E5.mFile, E5.mRank, "w", moveList, true, false);
        verifyMoves(moveList, E5, "K", targetSquares);
    });

    it("Test king move with uncaptures", function() {
        placeOnSquare(E5, WHITE_KING);
        const moveList = [];
        getPseudoLegalMovesKing(E5.mFile, E5.mRank, "w", moveList, true, true);
        expect(moveList.length).toBe(48);
    });

    it("Test king move in center with blocking pieces", function() {
        placeOnSquare(E5, BLACK_KING);
        placeOnSquare(E6, BLACK_KNIGHT);
        placeOnSquare(E4, WHITE_BISHOP);
        const targetSquares = [
            D5, F5, D6, D4, F6, F4
        ];
        const moveList = [];
        getPseudoLegalMovesKing(E5.mFile, E5.mRank, "b", moveList, true, false);
        verifyMoves(moveList, E5, "K", targetSquares);
    });

    it("Test king move on edge", function() {
        placeOnSquare(H3, BLACK_KING);
        const targetSquares = [
            H2, H4, G2, G3, G4
        ];
        const moveList = [];
        getPseudoLegalMovesKing(H3.mFile, H3.mRank, "b", moveList, true, false);
        verifyMoves(moveList, H3, "K", targetSquares);
    });

    it("Test king move in corner", function() {
        placeOnSquare(A1, WHITE_KING);
        const targetSquares = [
            B1, A2, B2
        ];
        const moveList = [];
        getPseudoLegalMovesKing(A1.mFile, A1.mRank, "w", moveList, true, false);
        verifyMoves(moveList, A1, "K", targetSquares);
    });

    it("Test white queenside uncastling", function() {
        placeOnSquare(C1, WHITE_KING);
        placeOnSquare(D1, WHITE_ROOK);
        const targetSquares = [
            B1, B2, C2, D2,
            E1 // uncastling
        ];
        const moveList = [];
        getPseudoLegalMovesKing(C1.mFile, C1.mRank, "w", moveList, true, false);
        verifyMoves(moveList, C1, "K", targetSquares);
    });

    it("Test white kingside uncastling", function() {
        placeOnSquare(G1, WHITE_KING);
        placeOnSquare(F1, WHITE_ROOK);
        const targetSquares = [
            H1, H2, G2, F2,
            E1 // uncastling
        ];
        const moveList = [];
        getPseudoLegalMovesKing(G1.mFile, G1.mRank, "w", moveList, true, false);
        verifyMoves(moveList, G1, "K", targetSquares);
    });

    it("Test black queenside uncastling", function() {
        placeOnSquare(C8, BLACK_KING);
        placeOnSquare(D8, BLACK_ROOK);
        const targetSquares = [
            B8, B7, C7, D7,
            E8 // uncastling
        ];
        const moveList = [];
        getPseudoLegalMovesKing(C8.mFile, C8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, C8, "K", targetSquares);
    });

    it("Test black kingside uncastling", function() {
        placeOnSquare(G8, BLACK_KING);
        placeOnSquare(F8, BLACK_ROOK);
        const targetSquares = [
            H8, H7, G7, F7,
            E8 // uncastling
        ];
        const moveList = [];
        getPseudoLegalMovesKing(G8.mFile, G8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, G8, "K", targetSquares);
    });

    it("Test an illegal uncastling", function() {
        placeOnSquare(C8, BLACK_KING);
        placeOnSquare(D8, BLACK_ROOK);
        placeOnSquare(D1, WHITE_ROOK);
        const targetSquares = [
            B8, B7, C7, D7
        ];
        const moveList = [];
        getPseudoLegalMovesKing(C8.mFile, C8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, C8, "K", targetSquares);
    });
});

describe("Test queen move generator", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Test queen move in center", function() {
        const targetSquares = [
            C1, C2, C3, C5, C6, C7, C8,
            A4, B4, D4, E4, F4, G4, H4,
            A6, B5, D3, E2, F1,
            A2, B3, D5, E6, F7, G8
        ];
        placeOnSquare(C4, WHITE_QUEEN);
        const moveList = [];
        getPseudoLegalMovesQueen(C4.mFile, C4.mRank, "w", moveList, true, false);
        verifyMoves(moveList, C4, "Q", targetSquares);
    });

    it("Test queen move with uncaptures", function() {
        placeOnSquare(C4, BLACK_QUEEN);
        const moveList = [];
        getPseudoLegalMovesQueen(C4.mFile, C4.mRank, "b", moveList, true, true);
        expect(moveList.length).toBe(25 * 6);
    });

    it("Test queen move with blocking pieces", function() {
        const targetSquares = [
            C1, C2, C3, C5, C6,
            A4, B4, D4, E4,
            A6, B5, D3,
            A2, B3, D5, E6, F7, G8
        ];
        placeOnSquare(C4, BLACK_QUEEN);
        placeOnSquare(E2, BLACK_ROOK);
        placeOnSquare(C7, WHITE_KNIGHT);
        placeOnSquare(F4, BLACK_PAWN);
        const moveList = [];
        getPseudoLegalMovesQueen(C4.mFile, C4.mRank, "b", moveList, true, false);
        verifyMoves(moveList, C4, "Q", targetSquares);
    });

    it("Test queen move on edge", function() {
        const targetSquares = [
            A1, B1, C1, E1, F1, G1, H1,
            D2, D3, D4, D5, D6, D7, D8,
            C2, B3, A4,
            E2, F3, G4, H5
        ];
        placeOnSquare(D1, WHITE_QUEEN);
        const moveList = [];
        getPseudoLegalMovesQueen(D1.mFile, D1.mRank, "w", moveList, true, false);
        verifyMoves(moveList, D1, "Q", targetSquares);
    });

    it("Test queen move in corner", function() {
        const targetSquares = [
            A1, B1, C1, D1, E1, F1, G1,
            H2, H3, H4, H5, H6, H7, H8,
            G2, F3, E4, D5, C6, B7, A8
        ];
        placeOnSquare(H1, WHITE_QUEEN);
        const moveList = [];
        getPseudoLegalMovesQueen(H1.mFile, H1.mRank, "w", moveList, true, false);
        verifyMoves(moveList, H1, "Q", targetSquares);
    });
});

describe("Test rook move generator", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Test rook move in center", function() {
        const targetSquares = [
            B1, B2, B3, B4, B5, B7, B8,
            A6, C6, D6, E6, F6 ,G6, H6
        ];
        placeOnSquare(B6, WHITE_ROOK);
        const moveList = [];
        getPseudoLegalMovesRook(B6.mFile, B6.mRank, "w", moveList, true, false);
        verifyMoves(moveList, B6, "R", targetSquares);
    });

    it("Test rook move with uncaptures", function() {
        placeOnSquare(B6, BLACK_ROOK);
        const moveList = [];
        getPseudoLegalMovesRook(B6.mFile, B6.mRank, "b", moveList, true, true);
        expect(moveList.length).toBe(14 * 6);
    });

    it("Test rook move with blocking pieces", function() {
        const targetSquares = [
            B3, B4, B5, B7, B8,
            A6, C6
        ];
        placeOnSquare(B6, BLACK_ROOK);
        placeOnSquare(B2, WHITE_QUEEN);
        placeOnSquare(D6, WHITE_PAWN);
        const moveList = [];
        getPseudoLegalMovesRook(B6.mFile, B6.mRank, "w", moveList, true, false);
        verifyMoves(moveList, B6, "R", targetSquares);
    });

    it("Test rook move on edge", function() {
        const targetSquares = [
            H1, H2, H3, H5, H6, H7, H8,
            A4, B4, C4, D4, E4, F4, G4
        ];
        placeOnSquare(H4, WHITE_ROOK);
        const moveList = [];
        getPseudoLegalMovesRook(H4.mFile, H4.mRank, "w", moveList, true, false);
        verifyMoves(moveList, H4, "R", targetSquares);
    });

    it("Test rook move in corner", function() {
        const targetSquares = [
            A1, A2, A3, A4, A5, A6, A7,
            B8, C8, D8, E8, F8, G8, H8
        ];
        placeOnSquare(A8, BLACK_ROOK);
        const moveList = [];
        getPseudoLegalMovesRook(A8.mFile, A8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, A8, "R", targetSquares);
    });
});

describe("Test bishop move generator", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Test bishop move in center", function() {
        const targetSquares = [
            H2, F4, E5, D6, C7, B8,
            H4, F2, E1
        ];
        placeOnSquare(G3, BLACK_BISHOP);
        const moveList = [];
        getPseudoLegalMovesBishop(G3.mFile, G3.mRank, "b", moveList, true, false);
        verifyMoves(moveList, G3, "B", targetSquares);
    });

    it("Test bishop move with uncaptures", function() {
        placeOnSquare(G3, WHITE_BISHOP);
        const moveList = [];
        getPseudoLegalMovesBishop(G3.mFile, G3.mRank, "w", moveList, true, true);
        expect(moveList.length).toBe(9 * 6);
    });

    it("Test bishop move with blocking pieces", function() {
        const targetSquares = [
            H2, F4, E5,
            H4
        ];
        placeOnSquare(G3, WHITE_BISHOP);
        placeOnSquare(F2, BLACK_KNIGHT);
        placeOnSquare(D6, BLACK_BISHOP);
        const moveList = [];
        getPseudoLegalMovesBishop(G3.mFile, G3.mRank, "w", moveList, true, false);
        verifyMoves(moveList, G3, "B", targetSquares);
    });

    it("Test bishop move on edge", function() {
        const targetSquares = [
            B7, A6,
            D7, E6, F5, G4, H3
        ];
        placeOnSquare(C8, BLACK_BISHOP);
        const moveList = [];
        getPseudoLegalMovesBishop(C8.mFile, C8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, C8, "B", targetSquares);
    });

    it("Test bishop move in corner", function() {
        const targetSquares = [
            G7, F6, E5, D4, C3, B2, A1
        ];
        placeOnSquare(H8, BLACK_BISHOP);
        const moveList = [];
        getPseudoLegalMovesBishop(H8.mFile, H8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, H8, "B", targetSquares);
    });
});

describe("Test knight move generator", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("Test knight move in center", function() {
        const targetSquares = [
            B3, B5, C6, E6, F5, F3, E2, C2
        ];
        placeOnSquare(D4, BLACK_KNIGHT);
        const moveList = [];
        getPseudoLegalMovesKnight(D4.mFile, D4.mRank, "b", moveList, true, false);
        verifyMoves(moveList, D4, "N", targetSquares);
    });

    it("Test knight move with uncaptures", function() {
        placeOnSquare(D4, WHITE_KNIGHT);
        const moveList = [];
        getPseudoLegalMovesKnight(D4.mFile, D4.mRank, "w", moveList, true, true);
        expect(moveList.length).toBe(8 * 6);
    });

    it("Test knight move on edge", function() {
        const targetSquares = [
            A2, B3, D3, E2
        ];
        placeOnSquare(C1, WHITE_KNIGHT);
        const moveList = [];
        getPseudoLegalMovesKnight(C1.mFile, C1.mRank, "w", moveList, true, false);
        verifyMoves(moveList, C1, "N", targetSquares);
    });

    it("Test knight move in corner", function() {
        const targetSquares = [
            F7, G6
        ];
        placeOnSquare(H8, BLACK_KNIGHT);
        const moveList = [];
        getPseudoLegalMovesKnight(H8.mFile, H8.mRank, "b", moveList, true, false);
        verifyMoves(moveList, H8, "N", targetSquares);
    });
});

describe("Test unpromotions", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    const promotionTests = [{
        pieceName: 'white queen',
        color: 'w',
        fromUnit: 'Q',
        piece: WHITE_QUEEN,
        sourceSquare: E8,
        noCaptureSquare: E7,
        captureSquares: [D7, F7],
        normalMoveCount: 21,
        moveFunction: getPseudoLegalMovesQueen
    }, {
        pieceName: 'black queen',
        color: 'b',
        fromUnit: 'Q',
        piece: BLACK_QUEEN,
        sourceSquare: D1,
        noCaptureSquare: D2,
        captureSquares: [C2, E2],
        normalMoveCount: 21,
        moveFunction: getPseudoLegalMovesQueen
    }, {
        pieceName: 'white rook',
        color: 'w',
        fromUnit: 'R',
        piece: WHITE_QUEEN,
        sourceSquare: A8,
        noCaptureSquare: A7,
        captureSquares: [B7],
        normalMoveCount: 14,
        moveFunction: getPseudoLegalMovesRook
    }, {
        pieceName: 'black rook',
        color: 'b',
        fromUnit: 'R',
        piece: BLACK_QUEEN,
        sourceSquare: H1,
        noCaptureSquare: H2,
        captureSquares: [G2],
        normalMoveCount: 14,
        moveFunction: getPseudoLegalMovesRook
    }, {
        pieceName: 'white bishop',
        color: 'w',
        fromUnit: 'B',
        piece: WHITE_BISHOP,
        sourceSquare: C8,
        noCaptureSquare: C7,
        captureSquares: [B7, D7],
        normalMoveCount: 7,
        moveFunction: getPseudoLegalMovesBishop
    }, {
        pieceName: 'black bishop',
        color: 'b',
        fromUnit: 'B',
        piece: BLACK_BISHOP,
        sourceSquare: B1,
        noCaptureSquare: B2,
        captureSquares: [A2, C2],
        normalMoveCount: 7,
        moveFunction: getPseudoLegalMovesBishop
    }, {
        pieceName: 'white knight',
        color: 'w',
        fromUnit: 'N',
        piece: WHITE_KNIGHT,
        sourceSquare: F8,
        noCaptureSquare: F7,
        captureSquares: [E7, G7],
        normalMoveCount: 4,
        moveFunction: getPseudoLegalMovesKnight
    }, {
        pieceName: 'black knight',
        color: 'b',
        fromUnit: 'N',
        piece: BLACK_KNIGHT,
        sourceSquare: G1,
        noCaptureSquare: G2,
        captureSquares: [F2, H2],
        normalMoveCount: 3,
        moveFunction: getPseudoLegalMovesKnight
    }];

    promotionTests.forEach(promotionTest => {
        it("Test " + promotionTest.pieceName + " unpromotion", function() {
            placeOnSquare(promotionTest.sourceSquare, promotionTest.piece);
            const moveList = [];
            promotionTest.moveFunction(promotionTest.sourceSquare.mFile, promotionTest.sourceSquare.mRank,
                promotionTest.color, moveList, true, true);
            const uncapturePromotions =
                (promotionTest.sourceSquare.mFile == 0 || promotionTest.sourceSquare.mFile == 7) ? 1 : 2;
            expect(moveList.length).toBe(
                promotionTest.normalMoveCount * 5 + uncapturePromotions * 4 + 1);
            // Above is calculated as normal moves * (4 uncaptures + 1 no uncapture) + (1 or 2) unpromotions * 4 uncaptures +
            // 1 unpromotion without uncapture

            moveList.forEach(move => {
                expect(move.from).toEqual(promotionTest.sourceSquare);
                expect(move.fromUnit).toBe(promotionTest.fromUnit);
                expect(move.check).toBe(false);
            });

            const unpromotions = moveList.filter(move => move.unpromote);
            expect(unpromotions.length).toBe(uncapturePromotions * 4 + 1);
            const unpromotionsWithoutCapture = unpromotions.filter(move => move.uncapturedUnit == "");
            expect(unpromotionsWithoutCapture.length).toBe(1);
            expect(unpromotionsWithoutCapture[0].to).toEqual(new Square(
                promotionTest.noCaptureSquare.mFile, promotionTest.noCaptureSquare.mRank));

            const expectedCapturedPieces = ["Q", "R", "B", "N"];
            promotionTest.captureSquares.forEach(captureSquare => {
                const unpromotionsWithCapture = unpromotions.filter(move =>
                    move.uncapturedUnit != "" && move.to.mFile == captureSquare.mFile &&
                    move.to.mRank == captureSquare.mRank);
                expect(unpromotionsWithCapture.length).toBe(4);
                const capturedPieces = unpromotionsWithCapture.map(move => move.uncapturedUnit);
                expectedCapturedPieces.forEach(piece => {
                    expect(capturedPieces).toContain(piece);
                });
            });
        });
    });
});

function verifyPawnMoves(pawnSquare, color, expectedNoUncaptureSquares, expectedCaptureSquares) {
    placeOnSquare(pawnSquare, color == "w" ? WHITE_PAWN : BLACK_PAWN);
    const moveList = [];
    getPseudoLegalMovesPawn(pawnSquare.mFile, pawnSquare.mRank, color, moveList, true, true);
    expect(moveList.length).toBe(expectedCaptureSquares.length * 5 + expectedNoUncaptureSquares.length);
    moveList.forEach(move => {
        expect(move.from).toEqual(pawnSquare);
        expect(move.unpromote).toBe(false);
        expect(move.fromUnit).toBe("P");
        expect(move.check).toBe(false);
    });
    const noUncaptureSquares = moveList.filter(move => move.uncapturedUnit == "").map(move => move.to);
    expect(noUncaptureSquares.length).toBe(expectedNoUncaptureSquares.length);
    noUncaptureSquares.forEach(square => {
        expect(expectedNoUncaptureSquares).toContain(square);
    })

    const expectedUncapturedUnits = ["Q", "R", "B", "N", "P"];
    expectedCaptureSquares.forEach(uncaptureSquare => {
        const uncaptures = moveList.filter(move =>
            move.to.mFile == uncaptureSquare.mFile && move.to.mRank == uncaptureSquare.mRank);
        expect(uncaptures.length).toBe(expectedUncapturedUnits.length);
        const uncapturedUnits = uncaptures.map(move => move.uncapturedUnit);
        expectedUncapturedUnits.forEach(expectedUncapturedUnit => {
            expect(uncapturedUnits).toContain(expectedUncapturedUnit);
        });
    });
}

describe("Test pawn move generator", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    /*
      no moves (original rank)
      single retreat
      double retreat
      double retreat blocked
      en passant
     */

    it("White pawn on original rank has no move", function() {
        verifyPawnMoves(C2, "w", [], []);
    });

    it("Black pawn on original rank has no move", function() {
        verifyPawnMoves(E7, "b", [], []);
    });

    it("White pawn on higher rank has 1 non-uncapture and 2 uncaptures", function() {
        verifyPawnMoves(D5, "w", [D4], [C4, E4]);
    });

    it("Black pawn on higher rank has 1 non-uncapture and 2 uncaptures", function() {
        verifyPawnMoves(B6, "b", [B7], [A7, C7]);
    });

    it("White pawn on 4th rank can retreat either 1 or 2 squares", function() {
        verifyPawnMoves(F4, "w", [F3, F2], [E3, G3]);
    });

    it("Black pawn on 4th rank can retreat either 1 or 2 squares", function() {
        verifyPawnMoves(H5, "b", [H6, H7], [G6]);
    });

    it("White pawn on 4th rank blocked cannot retreat", function() {
        placeOnSquare(E3, BLACK_ROOK);
        verifyPawnMoves(E4, "w", [], [D3, F3]);
    });

    it("Black pawn on 4th rank blocked cannot retreat", function() {
        placeOnSquare(A6, BLACK_KING);
        verifyPawnMoves(A5, "b", [], [B6]);
    });

    it("White pawn on 6th rank can uncapture en passant", function() {
        placeOnSquare(F6, WHITE_PAWN);
        const moveList = [];
        getPseudoLegalMovesPawn(F6.mFile, F6.mRank, "w", moveList, true, true);
        expect(moveList.length).toBe(2 * 5 + 1 + 2); // 2 normal uncaptures * 5 pieces, 1 no-uncapture, 2 en passant
        moveList.forEach(move => {
            expect(move.from).toEqual(F6);
            expect(move.unpromote).toBe(false);
            expect(move.fromUnit).toBe("P");
            expect(move.check).toBe(false);
        });
        const enPassantUncaptures = moveList.filter(move => move.uncapturedUnit == "ep");
        expect(enPassantUncaptures.length).toBe(2);
        const enPassantUncaptureTargets = enPassantUncaptures.map(move => move.to);
        expect(enPassantUncaptureTargets).toContain(E5);
        expect(enPassantUncaptureTargets).toContain(G5);
    });

    it("Black pawn on 6th rank can uncapture en passant", function() {
        placeOnSquare(D3, BLACK_PAWN);
        const moveList = [];
        getPseudoLegalMovesPawn(D3.mFile, D3.mRank, "b", moveList, true, true);
        expect(moveList.length).toBe(2 * 5 + 1 + 2); // 2 normal uncaptures * 5 pieces, 1 no-uncapture, 2 en passant
        moveList.forEach(move => {
            expect(move.from).toEqual(D3);
            expect(move.unpromote).toBe(false);
            expect(move.fromUnit).toBe("P");
            expect(move.check).toBe(false);
        });
        const enPassantUncaptures = moveList.filter(move => move.uncapturedUnit == "ep");
        expect(enPassantUncaptures.length).toBe(2);
        const enPassantUncaptureTargets = enPassantUncaptures.map(move => move.to);
        expect(enPassantUncaptureTargets).toContain(C4);
        expect(enPassantUncaptureTargets).toContain(E4);
    });
});

describe("Full board test", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    const testPositions = [{
        forsythe: "2kr1B2/8/1n3Pp1/p3K2p/PP2Q3/1N4pP/2q5/1b3R2",
        expectedMoveCounts:[
            { color: "b", square: C8, noCapture: 5, capture: 16},
            { color: "b", square: D8, noCapture: 8, capture: 32},
            { color: "w", square: F8, noCapture: 6, capture: 28},
            { color: "b", square: B6, noCapture: 4, capture: 20},
            { color: "w", square: F6, noCapture: 1, capture: 6},
            { color: "b", square: G6, noCapture: 1, capture: 10},
            { color: "b", square: A5, noCapture: 2, capture: 0},
            { color: "w", square: E5, noCapture: 6, capture: 30},
            { color: "b", square: H5, noCapture: 2, capture: 0},
            { color: "w", square: A4, noCapture: 2, capture: 0},
            { color: "w", square: B4, noCapture: 0, capture: 10},
            { color: "w", square: E4, noCapture: 17, capture: 85},
            { color: "w", square: B3, noCapture: 5, capture: 25},
            { color: "b", square: G3, noCapture: 1, capture: 12},
            { color: "w", square: H3, noCapture: 1, capture: 5},
            { color: "b", square: C2, noCapture: 15, capture: 75},
            { color: "b", square: B1, noCapture: 2, capture: 8},
            { color: "w", square: F1, noCapture: 9, capture: 36}
        ]
    }];

    testPositions.forEach(position => {
        it(position.forsythe, function() {
            setForsythe(position.forsythe);
            const whiteMoveList = getPseudoLegalMoves("w", true, false);
            const blackMoveList = getPseudoLegalMoves("b", true, false);
            let totalExpectedMoves = 0;
            position.expectedMoveCounts.forEach(expectedMoveCount => {
                totalExpectedMoves += expectedMoveCount.noCapture + expectedMoveCount.capture;
                const movesFound =
                    (expectedMoveCount.color == "w" ? whiteMoveList : blackMoveList).filter(
                        move => move.from.mFile == expectedMoveCount.square.mFile &&
                            move.from.mRank == expectedMoveCount.square.mRank);
                expect(movesFound.filter(move => move.uncapturedUnit == "").length).toBe(expectedMoveCount.noCapture);
                expect(movesFound.filter(move => move.uncapturedUnit != "").length).toBe(expectedMoveCount.capture);
            });
            expect(whiteMoveList.length + blackMoveList.length).toBe(totalExpectedMoves);
        });

        it(position.forsythe + " no uncaptures", function() {
            setForsythe(position.forsythe);
            const whiteMoveList = getPseudoLegalMoves("w", false, false);
            const blackMoveList = getPseudoLegalMoves("b", false, false);
            let totalExpectedMoves = 0;
            position.expectedMoveCounts.forEach(expectedMoveCount => {
                totalExpectedMoves += expectedMoveCount.noCapture;
                const movesFound =
                    (expectedMoveCount.color == "w" ? whiteMoveList : blackMoveList).filter(
                        move => move.from.mFile == expectedMoveCount.square.mFile &&
                            move.from.mRank == expectedMoveCount.square.mRank);
                expect(movesFound.filter(move => move.uncapturedUnit == "").length).toBe(expectedMoveCount.noCapture);
                expect(movesFound.filter(move => move.uncapturedUnit != "").length).toBe(0);
            });
            expect(whiteMoveList.length + blackMoveList.length).toBe(totalExpectedMoves);
        });
    });
});