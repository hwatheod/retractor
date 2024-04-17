describe("normal piece pseudolegal moves and captures", function () {
    beforeAll(function () {
        initializeBoard();
        setForsythe("2b5/5np1/3q2rk/1K6/2N1Q3/2B5/8/5R2");
    });

    const moveTests = [{
        pieceName: "white king",
        color: "w",
        startSquare: B5,
        expectedTargets: [
            A4, B4, A5, C5, A6, B6, C6
        ]
    }, {
        pieceName: "white queen",
        color: "w",
        startSquare: E4,
        expectedTargets: [
            D4, F4, G4, H4,
            E1, E2, E3, E5, E6, E7, E8,
            B1, C2, D3, F5,
            A8, B7, C6, D5, F3, G2, H1
        ]
    }, {
        pieceName: "white rook",
        color: "w",
        startSquare: F1,
        expectedTargets: [
            A1, B1, C1, D1, E1, G1, H1, F2, F3, F4, F5, F6
        ]
    }, {
        pieceName: "white bishop",
        color: "w",
        startSquare: C3,
        expectedTargets: [
            A1, B2, D4, E5, F6, A5, B4, D2, E1
        ]
    }, {
        pieceName: "white knight",
        color: "w",
        startSquare: C4,
        expectedTargets: [
            A3, A5, B6, E5, E3, D2, B2
        ]
    }, {
        pieceName: "black king",
        color: "b",
        startSquare: H6,
        expectedTargets: [
            H7, G5, H5
        ]
    }, {
        pieceName: "black queen",
        color: "b",
        startSquare: D6,
        expectedTargets: [
            A6, B6, C6, E6, F6,
            D1, D2, D3, D4, D5, D7, D8,
            A3, B4, C5, E7, F8,
            B8, C7, E5, F4, G3, H2
        ]
    }, {
        pieceName: "black rook",
        color: "b",
        startSquare: G6,
        expectedTargets: [
            G1, G2, G3, G4, G5, E6, F6
        ]
    }, {
        pieceName: "black bishop",
        color: "b",
        startSquare: C8,
        expectedTargets: [
            A6, B7, D7, E6, F5, G4, H3
        ]
    }, {
        pieceName: "black knight",
        color: "b",
        startSquare: F7,
        expectedTargets: [
            D8, H8, E5, G5
        ]
    }];

    moveTests.forEach(moveTest => {
        it(moveTest.pieceName + " moves", function () {
            setRetract(moveTest.color);
            const actualTargets = [];
            for (let file = 0; file < 8; file++) {
                for (let rank = 0; rank < 8; rank++) {
                    const square = new Square(file, rank);
                    if (isPseudoLegal(moveTest.startSquare, square, "", false) == error_ok) {
                        actualTargets.push(getSquareAlgNotation(square));
                    }
                }
            }
            expect(actualTargets.sort().toString()).toEqual(moveTest.expectedTargets.map(getSquareAlgNotation).sort().toString());
        });
    });

    const uncapturedUnitList = ["K", "Q", "R", "B", "N", "P"];

    moveTests.forEach(moveTest => {
        uncapturedUnitList.forEach(uncapturedUnit => {
            let expectedTargets = moveTest.expectedTargets;
            if (uncapturedUnit == "K" || (uncapturedUnit == "P" &&
                (moveTest.startSquare.mRank == 0 || moveTest.startSquare.mRank == 7))) {
                expectedTargets = [];
            }
            it(moveTest.pieceName + " uncaptures " + opposite(moveTest.color) + uncapturedUnit, function () {
                setRetract(moveTest.color);
                const actualTargets = [];
                for (let file = 0; file < 8; file++) {
                    for (let rank = 0; rank < 8; rank++) {
                        const square = new Square(file, rank);
                        if (isPseudoLegal(moveTest.startSquare, square, uncapturedUnit, false) == error_ok) {
                            actualTargets.push(getSquareAlgNotation(square));
                        }
                    }
                }
                expect(actualTargets.sort().toString()).toEqual(expectedTargets.map(getSquareAlgNotation).sort().toString());
            });
        })
    });
});

describe("pawn pseudolegal moves and uncaptures", function () {
    beforeAll(function () {
        initializeBoard();
        setForsythe("8/8/2k5/p1p2P2/3P2P1/6K1/2p5/8");
    });

    const moveTests = [{
        pieceName: "white pawn d4",
        color: "w",
        startSquare: D4,
        expectedNoCaptureTargets: [D2, D3],
        expectedCaptureTargets: [C3, E3]
    }, {
        pieceName: "white pawn f5",
        color: "w",
        startSquare: F5,
        expectedNoCaptureTargets: [F4],
        expectedCaptureTargets: [E4]
    }, {
        pieceName: "white pawn g4",
        color: "w",
        startSquare: G4,
        expectedNoCaptureTargets: [],
        expectedCaptureTargets: [F3, H3]
    }, {
        pieceName: "black pawn c2",
        color: "b",
        startSquare: C2,
        expectedNoCaptureTargets: [C3],
        expectedCaptureTargets: [B3, D3]
    }, {
        pieceName: "black pawn a5",
        color: "b",
        startSquare: A5,
        expectedNoCaptureTargets: [A6, A7],
        expectedCaptureTargets: [B6]
    }, {
        pieceName: "black pawn c5",
        color: "b",
        startSquare: C5,
        expectedNoCaptureTargets: [],
        expectedCaptureTargets: [B6, D6]
    }];

    moveTests.forEach(moveTest => {
        it(moveTest.pieceName + " moves", function () {
            setRetract(moveTest.color);
            const actualTargets = [];
            for (let file = 0; file < 8; file++) {
                for (let rank = 0; rank < 8; rank++) {
                    const square = new Square(file, rank);
                    if (isPseudoLegal(moveTest.startSquare, square, "", false) == error_ok) {
                        actualTargets.push(getSquareAlgNotation(square));
                    }
                }
            }
            expect(actualTargets.sort().toString()).toEqual(moveTest.expectedNoCaptureTargets.map(getSquareAlgNotation).sort().toString());
        });
    });

    const uncapturedUnitList = ["K", "Q", "R", "B", "N", "P"];

    moveTests.forEach(moveTest => {
        uncapturedUnitList.forEach(uncapturedUnit => {
            let expectedTargets = moveTest.expectedCaptureTargets;
            if (uncapturedUnit == "K" || (uncapturedUnit == "P" &&
                (moveTest.startSquare.mRank == 0 || moveTest.startSquare.mRank == 7))) {
                expectedTargets = [];
            }
            it(moveTest.pieceName + " uncaptures " + opposite(moveTest.color) + uncapturedUnit, function () {
                setRetract(moveTest.color);
                const actualTargets = [];
                for (let file = 0; file < 8; file++) {
                    for (let rank = 0; rank < 8; rank++) {
                        const square = new Square(file, rank);
                        if (isPseudoLegal(moveTest.startSquare, square, uncapturedUnit, false) == error_ok) {
                            actualTargets.push(getSquareAlgNotation(square));
                        }
                    }
                }
                expect(actualTargets.sort().toString()).toEqual(expectedTargets.map(getSquareAlgNotation).sort().toString());
            });
        })
    });
});

describe("uncastling tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    describe("white queenside uncastling", function () {
        beforeEach(function () {
            placeOnSquare(E5, BLACK_KING);
            placeOnSquare(C1, WHITE_KING);
            placeOnSquare(D1, WHITE_ROOK);
            setRetract("w");
        });

        it("normal uncastling ok", function () {
            expect(errorText[isPseudoLegal(C1, E1, "", false)]).toBe(errorText[error_ok]);
        });

        it("uncastling with uncapture", function () {
            expect(errorText[isPseudoLegal(C1, E1, "B", false)]).toBe(errorText[error_uncastlingCannotUncapture]);
        });

        it("missing rook", function () {
            emptyPieceAt(D1.mFile, D1.mRank);
            expect(errorText[isPseudoLegal(C1, E1, "", false)]).toBe(errorText[error_uncastlingRookNotInPosition]);
        });

        it("a1 square blocked", function () {
            placeOnSquare(A1, BLACK_KNIGHT);
            expect(errorText[isPseudoLegal(C1, E1, "", false)]).toBe(errorText[error_uncastlingSquareOccupied]);
        });

        it("b1 square blocked", function () {
            placeOnSquare(B1, WHITE_BISHOP);
            expect(errorText[isPseudoLegal(C1, E1, "", false)]).toBe(errorText[error_uncastlingSquareOccupied]);
        });

        it("uncastling into check", function () {
            placeOnSquare(F2, BLACK_PAWN);
            expect(errorText[isPseudoLegal(C1, E1, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });

        it("uncastling through check", function () {
            placeOnSquare(H4, BLACK_BISHOP);
            expect(errorText[isPseudoLegal(C1, E1, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });
    });

    describe("white kingside uncastling", function () {
        beforeEach(function () {
            placeOnSquare(E5, BLACK_KING);
            placeOnSquare(G1, WHITE_KING);
            placeOnSquare(F1, WHITE_ROOK);
            setRetract("w");
        });

        it("normal uncastling ok", function () {
            expect(errorText[isPseudoLegal(G1, E1, "", false)]).toBe(errorText[error_ok]);
        });

        it("uncastling with uncapture", function () {
            expect(errorText[isPseudoLegal(G1, E1, "N", false)]).toBe(errorText[error_uncastlingCannotUncapture]);
        });

        it("missing rook", function () {
            emptyPieceAt(F1.mFile, F1.mRank);
            expect(errorText[isPseudoLegal(G1, E1, "", false)]).toBe(errorText[error_uncastlingRookNotInPosition]);
        });

        it("h1 square blocked", function () {
            placeOnSquare(H1, BLACK_QUEEN);
            expect(errorText[isPseudoLegal(G1, E1, "", false)]).toBe(errorText[error_uncastlingSquareOccupied]);
        });

        it("uncastling into check", function () {
            placeOnSquare(C2, BLACK_KNIGHT);
            expect(errorText[isPseudoLegal(G1, E1, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });

        it("uncastling through check", function () {
            placeOnSquare(F4, BLACK_ROOK);
            expect(errorText[isPseudoLegal(G1, E1, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });
    });

    describe("black queenside uncastling", function () {
        beforeEach(function () {
            placeOnSquare(E5, WHITE_KING);
            placeOnSquare(C8, BLACK_KING);
            placeOnSquare(D8, BLACK_ROOK);
            setRetract("b");
        });

        it("normal uncastling ok", function () {
            expect(errorText[isPseudoLegal(C8, E8, "", false)]).toBe(errorText[error_ok]);
        });

        it("uncastling with uncapture", function () {
            expect(errorText[isPseudoLegal(C8, E8, "Q", false)]).toBe(errorText[error_uncastlingCannotUncapture]);
        });

        it("missing rook", function () {
            emptyPieceAt(D8.mFile, D8.mRank);
            expect(errorText[isPseudoLegal(C8, E8, "", false)]).toBe(errorText[error_uncastlingRookNotInPosition]);
        });

        it("a8 square blocked", function () {
            placeOnSquare(A8, BLACK_ROOK);
            expect(errorText[isPseudoLegal(C8, E8, "", false)]).toBe(errorText[error_uncastlingSquareOccupied]);
        });

        it("b8 square blocked", function () {
            placeOnSquare(B8, WHITE_KNIGHT);
            expect(errorText[isPseudoLegal(C8, E8, "", false)]).toBe(errorText[error_uncastlingSquareOccupied]);
        });

        it("uncastling into check", function () {
            placeOnSquare(F6, WHITE_KNIGHT);
            expect(errorText[isPseudoLegal(C8, E8, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });

        it("uncastling through check", function () {
            placeOnSquare(G5, WHITE_QUEEN);
            expect(errorText[isPseudoLegal(C8, E8, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });
    });

    describe("black kingside uncastling", function () {
        beforeEach(function () {
            placeOnSquare(E5, WHITE_KING);
            placeOnSquare(G8, BLACK_KING);
            placeOnSquare(F8, BLACK_ROOK);
            setRetract("b");
        });

        it("normal uncastling ok", function () {
            expect(errorText[isPseudoLegal(G8, E8, "", false)]).toBe(errorText[error_ok]);
        });

        it("uncastling with uncapture", function () {
            expect(errorText[isPseudoLegal(G8, E8, "R", false)]).toBe(errorText[error_uncastlingCannotUncapture]);
        });

        it("missing rook", function () {
            emptyPieceAt(F8.mFile, F8.mRank);
            expect(errorText[isPseudoLegal(G8, E8, "", false)]).toBe(errorText[error_uncastlingRookNotInPosition]);
        });

        it("h8 square blocked", function () {
            placeOnSquare(H8, BLACK_BISHOP);
            expect(errorText[isPseudoLegal(G8, E8, "", false)]).toBe(errorText[error_uncastlingSquareOccupied]);
        });

        it("uncastling into check", function () {
            placeOnSquare(G6, WHITE_BISHOP);
            expect(errorText[isPseudoLegal(G8, E8, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });

        it("uncastling through check", function () {
            placeOnSquare(F1, WHITE_QUEEN);
            expect(errorText[isPseudoLegal(G8, E8, "", false)]).toBe(errorText[error_uncastlingCannotUncastleThroughOrIntoCheck]);
        });
    });
});

describe("en passant tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    ["w", "b"].forEach(color => {
        const sourceRank = (color == "w") ? 5 : 2;
        const targetRank = (color == "w") ? 4 : 3;
        const pawn = (color == "w") ? WHITE_PAWN : BLACK_PAWN;
        for (let sourceFile = 0; sourceFile < 8; sourceFile++) {
            [sourceFile - 1, sourceFile + 1].forEach(targetFile => {
                if (targetFile >= 0 && targetFile <= 7) {
                    it("en passant uncapture " + color + " " + "abcdefgh".charAt(targetFile) + "x" +
                        "abcdefgh".charAt(sourceFile) + " ok", function () {
                        placeOnSquare(H1, WHITE_KING);
                        placeOnSquare(H8, BLACK_KING);
                        placePieceAt(sourceFile, sourceRank, pawn);
                        expect(errorText[isPseudoLegal(
                            new Square(sourceFile, sourceRank),
                            new Square(targetFile, targetRank),
                            "ep",
                            false
                        )]).toBe(errorText[error_ok]);
                    });
                }
            });
        }
    });

    it("source unit must be a pawn", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(B6, WHITE_KNIGHT);
        setRetract("w");
        const result = isPseudoLegal(B6, A5, "ep", false);
        expect(errorText[result]).toBe(errorText[error_enPassantPawnOnly]);
    });

    it("source white pawn must be on the proper rank", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(A4, WHITE_PAWN);
        setRetract("w");
        const result = isPseudoLegal(A4, B3, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("source black pawn must be on the proper rank", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(A4, BLACK_PAWN);
        setRetract("b");
        const result = isPseudoLegal(A4, B5, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("white pawn must make a diagonal move", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(D6, WHITE_PAWN);
        setRetract("w");
        const result = isPseudoLegal(D6, D5, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("black pawn must make a diagonal move", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(F3, WHITE_PAWN);
        setRetract("b");
        const result = isPseudoLegal(F3, F4, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("square of uncaptured black pawn must be empty", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(E6, WHITE_PAWN);
        placeOnSquare(E5, WHITE_KNIGHT);
        setRetract("w");
        const result = isPseudoLegal(E6, D5, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("square of uncaptured white pawn must be empty", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(D3, BLACK_PAWN);
        placeOnSquare(D4, WHITE_BISHOP);
        setRetract("b");
        const result = isPseudoLegal(D3, E4, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("square of the follow-up double step must be empty, white", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(C6, WHITE_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        setRetract("w");
        const result = isPseudoLegal(C6, D5, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });

    it("square of the follow-up double step must be empty, black", function () {
        placeOnSquare(H1, WHITE_KING);
        placeOnSquare(H8, BLACK_KING);
        placeOnSquare(G3, BLACK_PAWN);
        placeOnSquare(G2, BLACK_ROOK);
        setRetract("b");
        const result = isPseudoLegal(G3, F4, "ep", false);
        expect(errorText[result]).toBe(errorText[error_illegalEnPassant]);
    });
});

describe("unpromotion tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    const pieces = ["Q", "R", "B", "N"];
    ["w", "b"].forEach(color => {
        const promotionRank = (color == "w") ? 7 : 0;
        const previousRank = (color == "w") ? 6 : 1;
        for (let sourceFile = 0; sourceFile <= 7; sourceFile++) {
            const targetFiles = [sourceFile - 1, sourceFile, sourceFile + 1];
            targetFiles.forEach(targetFile => {
                if (0 <= targetFile && targetFile <= 7) {
                    pieces.forEach(promotedPiece => {
                        const promotionMove =
                            (sourceFile == targetFile ? "abcdefgh".charAt(targetFile) + (promotionRank + 1) + "=" + promotedPiece :
                                    "abcdefgh".charAt(targetFile) + "x" + "abcdefgh".charAt(sourceFile) + (promotionRank + 1) + "="
                                    + promotedPiece
                            );
                        it(promotionMove + " ok", function () {
                            if (color == "w") {
                                placeOnSquare(E2, WHITE_KING);
                                placeOnSquare(E4, BLACK_KING);
                            } else {
                                placeOnSquare(E5, WHITE_KING);
                                placeOnSquare(E7, BLACK_KING);
                            }
                            placePieceAt(sourceFile, promotionRank, new Piece(color, promotedPiece));
                            setRetract(color);
                            const result = isPseudoLegal(
                                new Square(sourceFile, promotionRank),
                                new Square(targetFile, previousRank),
                                sourceFile == targetFile ? "" : promotedPiece,
                                true
                            );
                            expect(errorText[result]).toBe(errorText[error_ok]);
                        });
                    });
                }
            });
        }
    });

    it("cannot unpromote white king", function () {
        placeOnSquare(E1, BLACK_KING);
        placeOnSquare(D8, WHITE_KING);
        setRetract("w");
        const result = isPseudoLegal(D8, D7, "", true);
        expect(errorText[result]).toBe(errorText[error_cannotUnpromoteKing]);
    });

    it("cannot unpromote black king", function () {
        placeOnSquare(E1, BLACK_KING);
        placeOnSquare(D8, WHITE_KING);
        setRetract("b");
        const result = isPseudoLegal(E1, E2, "", true);
        expect(errorText[result]).toBe(errorText[error_cannotUnpromoteKing]);
    });
});