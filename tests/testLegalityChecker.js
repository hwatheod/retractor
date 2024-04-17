describe("too many units", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("too many white pawns", function () {
        setForsythe("K1k5/8/PPP5/PPPPPP2/8/nNbr4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyWhitePawns]);
    });

    it("too many black pawns", function () {
        setForsythe("K1k5/8/ppp5/pppppp2/8/nNbr4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyBlackPawns]);
    });

    it("too many promoted white queens", function () {
        setForsythe("K1k5/8/PPPP4/rnbqqb2/QQQ5/QQQ5/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteQueens]);
    });

    it("too many promoted black queens", function () {
        setForsythe("K1k5/8/ppppp3/rNBQQb2/qqq5/qq6/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackQueens]);
    });

    it("too many promoted white rooks", function () {
        setForsythe("K1k5/8/PPPP4/rnbqqb2/RRR5/RRRRR3/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteRooks]);
    });

    it("too many promoted black rooks", function () {
        setForsythe("K1k5/8/ppppp3/rNBQQb2/rrr5/rr6/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackRooks]);
    });

    it("too many promoted white dark square bishops", function () {
        setForsythe("K1k5/8/PPPP4/rnbqqb2/1B1B1B1B/B1B5/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteDarkSquareBishops]);
    });

    it("too many promoted black dark square bishops", function () {
        setForsythe("K1k5/8/pppp4/RnBqQB2/1b1b1b1b/b1b5/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackDarkSquareBishops]);
    });

    it("too many promoted white light square bishops", function () {
        setForsythe("K1k5/8/PPPP4/rnbqqb2/B1B1B1B1/1B1B4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteLightSquareBishops]);
    });

    it("too many promoted black light square bishops", function () {
        setForsythe("K1k5/8/pppp4/RnBqQB2/b1b1b1b1/1b1b4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackLightSquareBishops]);
    });

    it("too many promoted white knights", function () {
        setForsythe("K1k5/8/PPPP4/rnbqqb2/NNN5/NNNN4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteKnights]);
    });

    it("too many promoted black knights", function () {
        setForsythe("K1k5/8/pppp4/RnBqQB2/nnn5/nnnn4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackKnights]);
    });

    it("too many promoted white knights", function () {
        setForsythe("K1k5/8/PPPP4/rnbqqb2/NNN5/NNNN4/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteKnights]);
    });

    it("too many promoted white pieces", function () {
        setForsythe("K1k5/8/PPPP4/RRRNNN2/QQQB1B2/rnbqbn2/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhitePieces]);
    });

    it("too many promoted black pieces", function () {
        setForsythe("K1k5/8/pppp4/rrrnnn2/1bbbbb2/RNBQBN2/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackPieces]);
    });

    it("Number of promoted pieces ok", function () {
        setForsythe("K1k5/p1ppp3/8/RRRNNN2/QQBBB3/rrnnbbq1/P1PPP3/4rnbq");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });
});

describe("simple checks", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("opposite side in check", function () {
        setForsythe("K1k4Q/8/8/8/8/8/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_oppositeSideInCheck]);
    });

    it("retractor side in check ok", function () {
        setForsythe("K1k4Q/8/8/8/8/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("check by white pawn on second rank", function () {
        setForsythe("8/8/8/8/2K5/5k2/6P1/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_checkByPawnOnSecondRank]);
    });

    it("check by black pawn on second rank", function () {
        setForsythe("8/3p4/2K2k2/8/8/8/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_checkByPawnOnSecondRank]);
    });

    it("triple check", function () {
        setForsythe("K1k4Q/8/2R1B3/8/8/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_moreThanTwoCheckers]);
    });
});

describe("legal double checks", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("R+B ok", function () {
        setForsythe("K1k5/8/8/2R5/6B1/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Q+N ok", function () {
        setForsythe("K1k5/8/1n6/8/8/8/8/q7");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    })

    it("Q+promoted R ok", function () {
        setForsythe("K1kR4/8/8/8/8/2Q5/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Q+promoted N ok", function () {
        setForsythe("2k5/8/8/8/8/8/1K2q3/3n4");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("R+B en passant, black king on 3rd rank ok", function () {
        setForsythe("2K5/8/4Pk2/8/8/8/1B3R2/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Q+B en passant, white king on 3rd rank ok", function () {
        setForsythe("2k5/8/1b2q3/8/8/3pK3/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("R+B en passant, black king on 5th rank ok", function () {
        setForsythe("1B6/5R2/4P3/8/5k2/8/2K5/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Q+B en passant, white king on 5th rank ok", function () {
        setForsythe("8/8/3r4/5K2/8/4kqpb/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    })
});

describe("illegal double checks", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Q+B no interposition possible", function () {
        setForsythe("2K5/8/5k2/8/3B4/8/5Q2/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalDoubleCheck]);
    });

    it("R+N no interposition possible", function () {
        setForsythe("2K3r1/4n3/8/8/8/8/6k1/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalDoubleCheck]);
    });

    it("Q+B king still in check after interposition", function () {
        setForsythe("2K5/8/8/3B4/6Q1/8/6k1/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalDoubleCheck]);
    });

    it("Q+B king still in check after unpromotion interposition", function () {
        setForsythe("6Qk/2K5/8/8/8/2B5/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalDoubleCheck]);
    });

    it("R+B en passant blocked", function () {
        setForsythe("2K5/4r3/4Pk2/8/8/8/1B3R2/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalDoubleCheck]);
    });

    it("Q+B en passant blocked", function () {
        setForsythe("2k5/8/1b2q3/8/8/3pK3/3P4/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalDoubleCheck]);
    })
});

describe("too many pawn captures", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Impossible pawn structure", function () {
        setForsythe("8/2K5/8/8/8/5P2/4PPP1/2k5");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_impossiblePawnStructure]);
    });

    it("Too many white pawn captures", function () {
        setForsythe("r1b1kbnr/pp2pp1p/3p4/2p5/5P2/3P1P2/PP1PPP2/RNBQKBNR");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyWhiteCaptures]);
    });

    it("Too many black pawn captures", function () {
        setForsythe("rnbqkbnr/2p1pppp/1pp1p3/8/1P4P1/2P5/P2PPP1P/RNB1K1NR");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyBlackCaptures]);
    });

    it("Too many pawn captures", function () {
        setForsythe("rnbqkbnr/ppp2ppp/4p3/3P4/3p4/4P3/PPP2PPP/RNBQKBNR");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyCaptures]);
    });

    it("Pawn captures ok", function () {
        setForsythe("rn2kb1r/p2ppp2/1p4p1/4pp2/8/2P2PP1/P1PPPP2/R1B1KB2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });
});

describe("too many total captures", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("too many cage captures plus pawn captures", function () {
        setForsythe("rn1qkbnr/ppppppp1/8/7P/7p/8/PPPPPPP1/R2QKBNR");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyCaptures]);
    });

    it("total captures ok", function () {
        setForsythe("rn1qkbnr/ppppppp1/8/7P/7p/8/PPPPPPP1/R2QKBN1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });
});

describe("illegalities related to bishops", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Illegal white bishop on first rank", function () {
        setForsythe("8/8/3k4/8/8/2K5/3P1P2/4B3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteBishop]);
    });

    it("Illegal black bishop on eighth rank", function () {
        setForsythe("7b/6p1/3k4/8/8/2K5/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackBishop]);
    });

    it("Frozen bishops on c1, f1, c8, f8 ok", function () {
        setForsythe("2b2b2/1p1pp1p1/3k4/8/8/2K5/1P1PP1P1/2B2B2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(getPieceAt(C1).frozen).toBe(true);
        expect(getPieceAt(C8).frozen).toBe(true);
        expect(getPieceAt(F1).frozen).toBe(true);
        expect(getPieceAt(F8).frozen).toBe(true);
    });

    it("Frozen bishop cannot be promoted", function () {
        setForsythe("2b2b2/1p1pp1p1/3k4/8/8/2K5/1P1PP1P1/2B2B2");
        setRetract("b");
        setPromotedFlag(C1.mFile, C1.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_impossiblePromotedWhiteBishop]);
    });

    it("Missing bishops on c1, f1, c8, f8 count as captures", function () {
        setForsythe("8/1p1pp1p1/8/3K4/5k2/8/1P1PP1P1/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });

    it("Missing bishops on c1, f1 require too many black captures", function () {
        setForsythe("r3kb1r/p1p2pp1/1qnpp1p1/1pR5/2P1NP2/8/PP1PP1PP/3QK1NR");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyBlackCaptures]);
    })

    it("Missing bishops on c8, f8 require too many white captures", function () {
        setForsythe("4k2r/pp1pp1p1/1np2n1p/qr3p2/2PP1N1P/B1PQP1PB/P2KNPR1/R7");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyWhiteCaptures]);
    })

    const bishopOriginalFiles = [2, 5];
    const pawnColors = ["w", "b"];
    const rookColors = ["w", "b"];

    // illegal bishop + pawn + rook cages, where bishop and pawns are the same color.
    // must be on c or f file.
    bishopOriginalFiles.forEach(bishopOriginalFile => {
        pawnColors.forEach(pawnColor => {
            rookColors.forEach(rookColor => {
                const bishopColor = pawnColor;
                const specName = "Illegal " + bishopColor + "B+" + pawnColor + "P+" + rookColor + "R configuration on "
                    + "abcdefgh".charAt(bishopOriginalFile) + " file";
                const expectedError =
                    rookColor == "w" ? error_illegallyPlacedWhiteRook : error_illegallyPlacedBlackRook;
                const firstRank = pawnColor == "w" ? 0 : 7;
                const secondRank = pawnColor == "w" ? 1 : 6;
                const thirdRank = pawnColor == "w" ? 2 : 5;
                it(specName, function () {
                    placeOnSquare(A5, WHITE_KING);
                    placeOnSquare(H5, BLACK_KING);
                    placePieceAt(bishopOriginalFile - 1, secondRank, new Piece(pawnColor, "P"));
                    placePieceAt(bishopOriginalFile + 1, secondRank, new Piece(pawnColor, "P"));
                    placePieceAt(bishopOriginalFile, thirdRank, new Piece(pawnColor, "P"));
                    placePieceAt(bishopOriginalFile, firstRank, new Piece(bishopColor, "B"));
                    placePieceAt(bishopOriginalFile, secondRank, new Piece(rookColor, "R"));
                    setRetract("b");
                    expect(errorText[startPlay()]).toBe(errorText[expectedError]);
                })
            })
        })
    });

    // illegal bishop + pawn + rook cages, where bishop and pawns are opposite colors.
    // can be on any file.  (we arbitrary choose 2 for testing)
    const bishopArbitraryFiles = [1, 4];
    bishopArbitraryFiles.forEach(bishopArbitraryFile => {
        pawnColors.forEach(pawnColor => {
            rookColors.forEach(rookColor => {
                const bishopColor = opposite(pawnColor);
                const specName = "Illegal " + bishopColor + "B+" + pawnColor + "P+" + rookColor + "R configuration on "
                    + "abcdefgh".charAt(bishopArbitraryFile) + " file";
                const firstRank = pawnColor == "w" ? 0 : 7;
                const secondRank = pawnColor == "w" ? 1 : 6;
                const thirdRank = pawnColor == "w" ? 2 : 5;
                it(specName, function () {
                    placeOnSquare(H7, WHITE_KING);
                    placeOnSquare(H5, BLACK_KING);
                    placePieceAt(bishopArbitraryFile - 1, secondRank, new Piece(pawnColor, "P"));
                    placePieceAt(bishopArbitraryFile + 1, secondRank, new Piece(pawnColor, "P"));
                    placePieceAt(bishopArbitraryFile, thirdRank, new Piece(pawnColor, "P"));
                    placePieceAt(bishopArbitraryFile, firstRank, new Piece(bishopColor, "B"));
                    placePieceAt(bishopArbitraryFile, secondRank, new Piece(rookColor, "R"));
                    setRetract("w");
                    expect(errorText[startPlay()]).toBe(errorText[error_illegalBishopRookPawnConfiguration]);
                })
            })
        })
    });

    it("Illegal promoted white bishop", function () {
        setForsythe("5B2/4ppp1/8/2K5/8/5k2/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteBishop]);
    });

    it("Illegal promoted black bishop", function () {
        setForsythe("8/8/8/2K5/8/5k2/PP6/b7");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackBishop]);
    });

    it("Promoted white bishop with capture ok", function () {
        setForsythe("B7/1p6/p7/5k2/3K4/8/8/8");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wBL"]).toBe(1);
        expect(positionData.totalCaptureCounts["w"]).toBe(1);
        expect(getPieceAt(A8).promoted).toBe(true);
    });

    it("Promoted white bishop without capture ok", function () {
        setForsythe("3B4/2p1p3/8/5k2/3K4/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wBD"]).toBe(1);
        expect(positionData.totalCaptureCounts["w"]).toBe(0);
        expect(getPieceAt(D8).promoted).toBe(true);
    });

    it("Promoted black bishop with capture ok", function () {
        setForsythe("8/8/8/2K5/8/1P3k2/P1P5/1b6");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bBL"]).toBe(1);
        expect(positionData.totalCaptureCounts["b"]).toBe(1);
        expect(getPieceAt(B1).promoted).toBe(true);
    });

    it("Promoted black bishop without capture ok", function () {
        setForsythe("8/8/8/2K5/8/5k2/1P6/b7");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bBD"]).toBe(1);
        expect(positionData.totalCaptureCounts["b"]).toBe(0);
        expect(getPieceAt(A1).promoted).toBe(true);
    });

    it("Too many promoted black light square bishops", function () {
        setForsythe("4kb2/pp3p1p/2qppr2/1Pp3p1/3P1PQ1/6P1/P1P1P2P/RNBbKBNR");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackLightSquareBishops]);
    });

    it("Too many promoted black dark square bishops", function () {
        setForsythe("4kb2/pp3p1p/2qppr2/1Pp3p1/6Q1/3KP1P1/P1PP1P1P/RNB1bBNR");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackDarkSquareBishops]);
    });

    it("Too many promoted white light square bishops", function () {
        setForsythe("rn1qBb1r/p1pp1p1p/1p4k1/4p1p1/1P2P3/2P1K1P1/P2P1P1P/R1B3N1");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteLightSquareBishops]);
    });

    it("Too many promoted white dark square bishops", function () {
        setForsythe("rn1B1b1r/p1p1pp1p/1p3qk1/3p2p1/1P2P3/2P1K1P1/P2P1P1P/R1B3N1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteDarkSquareBishops]);
    });

    it("Promoted white bishop requires too many white captures", function () {
        setForsythe("1n1B1b1r/p1p1pp1p/1p1p1qk1/5bp1/1P5n/1PP1K1P1/3P1P1P/RB4N1");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyWhiteCaptures]);
    });

    it("Promoted black bishop requires too many black captures", function () {
        setForsythe("1n5r/1ppbp2p/1p1p1qk1/P5p1/7n/1PPKP1P1/R2P1P1P/RBB1b1NN");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyBlackCaptures]);
    });

    it("Promoted bishops are not duplicate counted", function () {
        setForsythe("5b2/8/8/2k1K3/8/8/3P1P2/4b3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bBD"]).toBe(1); // not 2
        expect(getPieceAt(E1).promoted).toBe(true);
    });

    it("Capture of an original bishop on a square occupied by a promoted enemy bishop is counted", function () {
        setForsythe("r2qkbnr/ppp1p2p/2np2p1/8/2P5/8/PP1PP1PP/RNBQKbN1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["b"]).toBe(1);
        expect(positionData.promotedCounts["bBL"]).toBe(1);
        expect(board[F1.mFile][F1.mRank].promoted).toBe(true);
    });

    it("Bishops of the same color outside cage are marked promoted", function () {
        setForsythe("4kb2/1p1pp1p1/2bbb3/8/3BBB2/8/1P1PP1P1/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wBL"]).toBe(1);
        expect(positionData.promotedCounts["wBD"]).toBe(2);
        expect(positionData.promotedCounts["bBL"]).toBe(2);
        expect(positionData.promotedCounts["bBD"]).toBe(1);
        expect(board[C6.mFile][C6.mRank].promoted).toBe(true);
        expect(board[D6.mFile][D6.mRank].promoted).toBe(true);
        expect(board[E6.mFile][E6.mRank].promoted).toBe(true);
        expect(board[D4.mFile][D4.mRank].promoted).toBe(true);
        expect(board[E4.mFile][E4.mRank].promoted).toBe(true);
        expect(board[F4.mFile][F4.mRank].promoted).toBe(true);
        expect(board[F8.mFile][F8.mRank].promoted).toBe(false); // original bishop in cage
    });

    it("Bishop on the opposite color square outside cage are not marked promoted", function () {
        setForsythe("4k3/8/8/3B4/8/8/1P1P4/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(board[D5.mFile][D5.mRank].promoted).toBe(false);
    });

    it("Enemy bishop outside cage is not marked promoted", function () {
        setForsythe("4k3/8/8/4b3/8/8/1P1P4/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(board[E5.mFile][E5.mRank].promoted).toBe(false);
    });

    it("Illegal bishop configuration in corner - white", function () {
        setForsythe("4k3/8/8/8/8/1P6/bPP5/1b2K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalBishopAndPawnInCorner]);
    });

    it("Illegal bishop configuration in corner - black", function () {
        setForsythe("4k1B1/5ppB/6p1/8/8/8/8/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegalBishopAndPawnInCorner]);
    });
});

describe("strong cage tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("white strong cage test 1", function () {
        setForsythe("r2qkb1r/p1p2p1p/1pn3p1/3ppb2/8/7P/PPPPPPP1/R1K2B1R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isStrongCage(-1, 5, 0)).toBe(true);
        expect(isStrongCage(5, 8, 0)).toBe(false);
    });

    it("white strong cage test 2", function () {
        setForsythe("r2qkb1r/p1p2p1p/1pn3p1/3ppb2/8/3P4/PPP1PPPP/3RK2R");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        setFrozenFlag(H1.mFile, H1.mRank, true);
        expect(isStrongCage(4, 7, 0)).toBe(true);
        expect(isStrongCage(1, 4, 0)).toBe(false);
    });

    it("white strong cage test 3", function () {
        setForsythe("r2qkb1r/p1p2p1p/1pn3p1/3ppb2/8/8/PPPPPPPP/2K2B2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isStrongCage(-1, 5, 0)).toBe(true);
        expect(isStrongCage(5, 8, 0)).toBe(true);
    })

    it("black strong cage test 1", function () {
        setForsythe("r1b1kbnr/1ppppp1p/p5p1/3n4/1NP1P3/3P1P2/PP4PP/R2QKBN1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isStrongCage(2, 5, 1)).toBe(true);
        expect(isStrongCage(-1, 2, 1)).toBe(false);
        expect(isStrongCage(5, 8, 1)).toBe(false);
    });

    it("black strong cage test 2", function () {
        setForsythe("r1n1kb1r/pppppp1p/6p1/3n4/1NP1P3/3P1P2/PP4PP/R2QKBN1");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        setFrozenFlag(A8.mFile, A8.mRank, true);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        expect(isStrongCage(0, 4, 1)).toBe(true);
        expect(isStrongCage(4, 8, 1)).toBe(false);
    });

    it("black strong cage test 3", function () {
        setForsythe("3rkr2/pppppppp/8/3n4/1NP1P3/3P1P2/PP4PP/R2QKBN1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isStrongCage(-1, 8, 1)).toBe(true);
    });
});

function regionEquality(r1, r2) {
    if (!(Array.isArray(r1) && Array.isArray(r2))) {
        return undefined;
    }

    if (r1.length != r2.length) {
        return false;
    }

    return r1.every(r1square => r2.some(r2square => r1square[0] == r2square[0] && r1square[1] == r2square[1]));
}

describe("strong cage region tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
        jasmine.addCustomEqualityTester(regionEquality);
    });

    it("white strong cage region test", function () {
        setForsythe("r2qkb1r/p1p2p1p/1pn3p1/3ppb2/8/7P/PPPPPPP1/R1K2B1R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const leftRegion = getStrongCageRegion(-1, 5, 0);
        const expectedLeftRegion = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
        expect(leftRegion).toEqual(expectedLeftRegion);

        const rightRegion = getStrongCageRegion(5, 8, 0);
        expect(rightRegion).toBe(null);
    });

    it("black strong cage region test", function () {
        setForsythe("r1n1k2r/p1pppppp/8/1p1n4/1NP1P3/3P1P2/PP4PP/R2QKBN1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setFrozenFlag(H8.mFile, H8.mRank, true);

        const leftRegion = getStrongCageRegion(0, 4, 1);
        expect(leftRegion).toBe(null);
        const rightRegion = getStrongCageRegion(4, 7, 1);
        const expectedRightRegion = [[5, 7], [6, 7]];
        expect(rightRegion).toEqual(expectedRightRegion);
    });
});

describe("illegalities related to strong cages", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("white king illegally placed out of friendly cage", function () {
        setForsythe("rnbqkb2/p1p1p2p/3p1p2/1p4p1/P3K3/7P/1PPPPPP1/RNBQ1BNR");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteKing]);
    });

    it("black king illegally placed out of friendly cage", function () {
        setForsythe("rnbq4/1ppppppp/5k2/p3N3/1BP3B1/3P1PP1/PP2P2P/R3KR2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackKing]);
    });

    it("white king illegally placed in enemy cage", function () {
        setForsythe("K1bqkbnr/pppp3p/5p2/2N1p1p1/2P3n1/3P1P2/PP2P1PP/R1B2B1R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteKing]);
    });

    it("black king illegally placed in enemy cage", function () {
        setForsythe("8/pp5p/4p1p1/2pp1p2/P7/8/1PPPPPPP/R1BQKN1k");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackKing]);
    })

    const nonKnightPieces = ["Q", "R", "B"];
    nonKnightPieces.forEach(piece => {
        it("white " + piece + " illegally placed in enemy cage", function () {
            setForsythe("r1" + piece + "nkb1r/ppppp2p/5p1n/6p1/1P1P4/2P1P3/P4PPP/4K3");
            setRetract("b");
            setFrozenFlag(A8.mFile, A8.mRank, true);
            setFrozenFlag(E8.mFile, E8.mRank, true);
            switch (piece) {
                case "Q":
                    expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteQueen]);
                    break;
                case "R":
                    expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteRook]);
                    break;
                case "B":
                    expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteBishop]);
                    break;
            }
        });
    })

    it("white N in enemy cage ok", function () {
        setForsythe("r1Nnkb1r/ppppp2p/5p1n/6p1/1P1P4/2P1P3/P4PPP/4K3");
        setRetract("w");
        setFrozenFlag(A8.mFile, A8.mRank, true);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    nonKnightPieces.forEach(piece => {
        it("black " + piece + " illegally placed in enemy cage", function () {
            setForsythe("8/pp5p/4p1p1/2pp1p2/P3k3/8/1PPPPPPP/R1BQKN1" + piece.toLowerCase());
            setRetract("b");
            switch (piece) {
                case "Q":
                    expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackQueen]);
                    break;
                case "R":
                    expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackRook]);
                    break;
                case "B":
                    expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackBishop]);
                    break;
            }
        });
    });

    it("black N in enemy cage ok", function () {
        setForsythe("8/pp5p/4p1p1/2pp1p2/P3k3/8/1PPPPPPP/R1BQKN1n");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("too many white queens in friendly cage 1", function () {
        setForsythe("r1b1kbn1/1p1p1ppp/2p5/4p1q1/2N5/8/1PPPPPPP/R1BQQ1K1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteQueen]);
    });

    it("too many white queens in friendly cage 2", function () {
        setForsythe("r1b1kbn1/1p1p1ppp/2p1q3/4p3/2N2P2/4P1KR/PPPP2P1/Q1B5");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteQueen]);
    });

    it("queen in friendly cage cannot be promoted", function () {
        setForsythe("r1b1kbn1/1p1p1ppp/2p1q3/4p3/2N4R/8/1PPPPPPP/2B1Q1K1");
        setRetract("b");
        setPromotedFlag(E1.mFile, E1.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_impossiblePromotedWhiteQueen]);
    });

    it("too many black queens in friendly cage 1", function () {
        setForsythe("rq1qk2r/ppppp3/2nb1ppn/6P1/2P1N3/1Q1P1P2/PP1KP2P/2R2B1R");
        setRetract("b");
        setFrozenFlag(A8.mFile, A8.mRank, true);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackQueen]);
    });

    it("too many black queens in friendly cage 2", function () {
        setForsythe("1qb4r/pppp1k2/5ppn/3rp1P1/2PnN3/1Q1P1P2/PP1KP2P/2R2B1R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackQueen]);
    });

    it("too many white rooks in friendly cage 1", function () {
        setForsythe("2b1k1nr/1pp2pp1/3qp3/1r1p3p/8/8/1PPPPPPP/2BR1RK1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteRook]);
    });

    it("too many white rooks in friendly cage 2", function () {
        setForsythe("2b1k2r/1p2p1p1/2p2n2/1r1p1pnp/5q2/8/1PPPPPP1/2BRKB2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteRook]);
    });

    // r1brkb2/1pppppp1/p1n5/8/2PPNP2/1R1N1K2/PP2P1PP/3B3R
    it("too many black rooks in friendly cage 1", function () {
        setForsythe("r1brkb2/1pppppp1/p1n5/8/2PPNP2/1R1N1K2/PP2P1PP/3B3R");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackRook]);
    });

    it("too many black rooks in friendly cage 2", function () {
        setForsythe("2br1r1k/1ppppppp/2n5/2N5/2P1BPN1/1R3K2/P2P2PP/7R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackRook]);
    });

    it("rook in friendly cage cannot be promoted", function () {
        setForsythe("2br3k/1ppppppp/2n5/2N5/2P1BPN1/1R3K2/P2P2PP/7R");
        setRetract("b");
        setPromotedFlag(D8.mFile, D8.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_impossiblePromotedBlackRook]);
    });

    it("count missing queens and rooks in strong cages as captures 1", function () {
        setForsythe("r1bk1bn1/1p1ppppp/8/q2Nn3/P7/2N5/1PPPPPPP/R1B1KB2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(1);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });

    it("count missing queens and rooks strong cages as captures 2", function () {
        setForsythe("2bqkb2/pppppppp/2n2n2/8/8/2N2N2/PPPPPPPP/2B1KB2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(3);
    });

    it("too many white captures in black strong cages", function () {
        setForsythe("2bqkb2/pppppppp/8/2n2n2/2P1NP2/1P1P1K1B/1P2P1QP/R1B5");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyWhiteCaptures]);
    });

    it("too many black captures in white strong cages", function () {
        setForsythe("rn2kb2/pp5p/2bppp2/2p2p2/2Nq4/5N2/PPPPPPPP/2B1KB2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyBlackCaptures]);
    });

    it("white queen and king have illegally switched positions in a strong cage", function () {
        setForsythe("2b4r/p2p1pp1/2p1r2p/1p2q1k1/P1Nnp3/8/1PPPPPPP/R1B1KQ1R");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallySwitchedWhiteQueenKing]);
    });

    it("black queen and king have illegally switched positions in a strong cage", function () {
        setForsythe("2bkqb2/1pppppp1/8/pr2n1rP/3P4/PN1RP3/1PPB1PP1/4KB1R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallySwitchedBlackQueenKing]);
    });

    const rqkOrders = ["RQK", "QRK", "QKR"];
    const possibleQueensideRqkOrders = ["RQK"];
    const possibleKingsideRqkOrders = ["QKR", "QRK"];

    rqkOrders.forEach(rqkOrder => {
        const specName = possibleKingsideRqkOrders.indexOf(rqkOrder) != -1 ?
            "possible order white " + rqkOrder + " on kingside strong cage ok" :
            "impossible order white " + rqkOrder + " on kingside strong cage";
        const expectedError = possibleKingsideRqkOrders.indexOf(rqkOrder) != -1 ?
            error_ok :
            error_illegalOrderWhiteRookQueenKing;
        it(specName, function () {
            setForsythe("3r3r/p2p1p1p/b1p2kp1/1p1npq1n/P7/8/1PPPPPPP/RNB2" + rqkOrder);
            setRetract("b");
            expect(errorText[startPlay()]).toBe(errorText[expectedError]);
        });
    });

    rqkOrders.forEach(rqkOrder => {
        const specName = possibleQueensideRqkOrders.indexOf(rqkOrder) != -1 ?
            "possible order white " + rqkOrder + " on queenside strong cage ok" :
            "impossible order white " + rqkOrder + " on queenside strong cage";
        const expectedError = possibleQueensideRqkOrders.indexOf(rqkOrder) != -1 ?
            error_ok :
            error_illegalOrderWhiteRookQueenKing;
        it(specName, function () {
            setForsythe("4b2r/p1p2p1p/1q3kp1/1p1pp2n/2Nb2nP/1R6/PPPPPPP1/1" + rqkOrder + "1B2");
            setRetract("w");
            expect(errorText[startPlay()]).toBe(errorText[expectedError]);
        });
    });

    rqkOrders.forEach(rqkOrder => {
        const specName = possibleKingsideRqkOrders.indexOf(rqkOrder) != -1 ?
            "possible order black " + rqkOrder + " on kingside strong cage ok" :
            "impossible order black " + rqkOrder + " on kingside strong cage";
        const expectedError = possibleKingsideRqkOrders.indexOf(rqkOrder) != -1 ?
            error_ok :
            error_illegalOrderBlackRookQueenKing;
        it(specName, function () {
            setForsythe("2b2" + rqkOrder.toLowerCase() + "/1ppppppp/8/pP2Q3/3P1P1B/3R3P/PNP1N1P1/2R4K" + rqkOrder);
            setRetract("b");
            expect(errorText[startPlay()]).toBe(errorText[expectedError]);
        });
    });

    rqkOrders.forEach(rqkOrder => {
        const specName = possibleQueensideRqkOrders.indexOf(rqkOrder) != -1 ?
            "possible order black " + rqkOrder + " on queenside strong cage ok" :
            "impossible order black " + rqkOrder + " on queenside strong cage";
        const expectedError = possibleQueensideRqkOrders.indexOf(rqkOrder) != -1 ?
            error_ok :
            error_illegalOrderBlackRookQueenKing;
        it(specName, function () {
            setForsythe("2" + rqkOrder.toLowerCase() + "b2/ppppppp1/8/1PN5/2P1N2B/P2P2RP/1Q3PP1/3BK3");
            setRetract("w");
            expect(errorText[startPlay()]).toBe(errorText[expectedError]);
        });
    });

    const rqkrOrders = ["RQRK", "RQKR", "RRQK", "QRRK", "QRKR", "QKRR"];
    const possibleRqkrOrders = ["RQRK", "RQKR"];

    rqkrOrders.forEach(rqkrOrder => {
        const specName = possibleRqkrOrders.indexOf(rqkrOrder) != -1 ?
            "possible order white " + rqkrOrder + " on full back rank strong cage ok" :
            "impossible order white " + rqkrOrder + " on full back rank strong cage";
        const expectedError = possibleRqkrOrders.indexOf(rqkrOrder) != -1 ?
            error_ok :
            error_illegalOrderWhiteRookQueenKing;
        it(specName, function () {
            setForsythe("7r/p1pp1p1p/1n2bk2/1p1q2pn/2Nb4/8/PPPPPPPP/3" + rqkrOrder + "1");
            setRetract("b");
            expect(errorText[startPlay()]).toBe(errorText[expectedError]);
        });
    });

    rqkrOrders.forEach(rqkrOrder => {
        const specName = possibleRqkrOrders.indexOf(rqkrOrder) != -1 ?
            "possible order black " + rqkrOrder + " on full back rank strong cage ok" :
            "impossible order black " + rqkrOrder + " on full back rank strong cage";
        const expectedError = possibleRqkrOrders.indexOf(rqkrOrder) != -1 ?
            error_ok :
            error_illegalOrderBlackRookQueenKing;
        it(specName, function () {
            setForsythe("1" + rqkrOrder.toLowerCase() + "3/pppppppp/8/8/2NP1P1B/1P1Q1KPN/P1P1P2P/3R1R2");
            setRetract("w");
            expect(errorText[startPlay()]).toBe(errorText[expectedError]);
        });
    });

    it("Friendly queens outside a strong cage containing the d-file should be marked promoted", function () {
        setForsythe("4k3/ppppp3/5qq1/8/3Q4/8/PPPPP3/Q3K3");
        setFrozenFlag(E1.mFile, E1.mRank, true);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wQ"]).toBe(1);
        expect(positionData.promotedCounts["bQ"]).toBe(2);
        expect(board[D4.mFile][D4.mRank].promoted).toBe(true);
        expect(board[F6.mFile][F6.mRank].promoted).toBe(true);
        expect(board[G6.mFile][G6.mRank].promoted).toBe(true);
        expect(board[A1.mFile][A1.mRank].promoted).toBe(false); // in cage
    });

    it("Enemy queens outside a strong cage containing the d-file should not be marked promoted", function () {
        setForsythe("4k3/8/5q2/8/8/8/PPPPP3/4K3");
        setFrozenFlag(E1.mFile, E1.mRank, true);
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(board[F6.mFile][F6.mRank].promoted).toBe(false);
    })
});

describe("weak cage tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("white weak cage e2-f1-g2-h3", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E2, WHITE_PAWN);
        placeOnSquare(G2, WHITE_PAWN);
        placeOnSquare(H3, WHITE_PAWN);
        placeOnSquare(F1, WHITE_BISHOP);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(5, 8, 0)).toBe(true);
    });

    it("white weak non-cage e2-f1-g2-h4", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E2, WHITE_PAWN);
        placeOnSquare(G2, WHITE_PAWN);
        placeOnSquare(H4, WHITE_PAWN);
        placeOnSquare(F1, WHITE_BISHOP);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(5, 8, 0)).toBe(false);
    });

    it("white weak cage a2-b2-c3-d2-e1", function () {
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D2, WHITE_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 0)).toBe(true);
    });

    it("white weak cage a2-b2-c2-d3-e2-e1", function () {
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        placeOnSquare(D3, WHITE_PAWN);
        placeOnSquare(E2, WHITE_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 0)).toBe(true);
    });

    it("white weak non-cage a2-b2-c2-d3-e1", function () {
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        placeOnSquare(D3, WHITE_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 0)).toBe(false);
    });

    it("white weak non-cage a2-b3-c3-d2-e1", function () {
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(B3, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D2, WHITE_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 0)).toBe(false);
    });

    it("white weak cage a2-b3-c3-d2-e1 (black has 15 pieces)", function () {
        setForsythe('rnbqkbnr/ppppppp1/8/8/8/8/8/8');
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B3, WHITE_PAWN);
        placeOnSquare(C3, WHITE_PAWN);
        placeOnSquare(D2, WHITE_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 0)).toBe(true);
    });

    it("white weak non-cage a2-b2-c2-d3-e3 (black has 15 pieces)", function () {
        setForsythe('rnbqkbnr/ppppppp1/8/8/8/8/8/8');
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        placeOnSquare(D3, WHITE_PAWN);
        placeOnSquare(E3, WHITE_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 0)).toBe(false);
    });

    it("black weak cage b7-c8-d7-e7-f8-g7", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(F8, BLACK_BISHOP);
        placeOnSquare(G7, BLACK_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(2, 5, 1)).toBe(true);
    });

    it("black weak cage b7-c8-d7-e7-f7-g7-h6", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(2, 8, 1)).toBe(true);
    });

    it("black weak non-cage b7-c8-d7-e5-f7-g7-h6", function () {
        placeOnSquare(C3, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E5, BLACK_PAWN);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(2, 8, 1)).toBe(false);
    });

    it("black weak non-cage b7-c8-d7-e7-f7-g6-h6", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(G6, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(2, 8, 1)).toBe(false);
    });

    it("black weak cage b7-c8-d7-e7-f7-g6-h6 (white has 15 pieces)", function () {
        setForsythe('8/8/8/8/8/8/PPPPPPP1/RNBQKBNR');
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(G6, BLACK_PAWN);
        placeOnSquare(H6, BLACK_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(2, 8, 1)).toBe(true);
    });

    it("black weak cage a6-b6-c7-d7-e8 (white has 15 pieces)", function () {
        setForsythe('8/8/8/8/8/8/PPPPPPP1/RNBQKBNR');
        placeOnSquare(A6, BLACK_PAWN);
        placeOnSquare(B6, BLACK_PAWN);
        placeOnSquare(C7, BLACK_PAWN);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E8, BLACK_KING);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(-1, 4, 1)).toBe(true);
    });

    it("black weak cage e8-f7-g7-h8", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(E8, BLACK_KING);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(H8, BLACK_ROOK);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setFrozenFlag(H8.mFile, H8.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(4, 7, 1)).toBe(true);
    });

    it("black weak non-cage e8-f6-g7-h8", function () {
        placeOnSquare(E4, WHITE_KING);
        placeOnSquare(E8, BLACK_KING);
        placeOnSquare(F6, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(H8, BLACK_ROOK);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setFrozenFlag(H8.mFile, H8.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(isWeakCage(4, 7, 1)).toBe(false);
    });
});

describe("weak cage region tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
        jasmine.addCustomEqualityTester(regionEquality);
    });

    it("white weak cage region e2-f1-g2-h3", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E2, WHITE_PAWN);
        placeOnSquare(G2, WHITE_PAWN);
        placeOnSquare(H3, WHITE_PAWN);
        placeOnSquare(F1, WHITE_BISHOP);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const region = getWeakCageRegion(5, 8, 0);
        const expectedRegion = [[6, 0], [7, 0], [7, 1]];
        expect(region).toEqual(expectedRegion);
    });

    it("white weak non-cage region a2-b2-c2-d3-e1", function () {
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(E1, WHITE_KING);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        placeOnSquare(A2, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C2, WHITE_PAWN);
        placeOnSquare(D3, WHITE_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const region = getWeakCageRegion(-1, 4, 0);
        expect(region).toBe(null);
    });

    it("black weak cage region b7-c8-d7-e6-f7-g6-h7", function () {
        placeOnSquare(E5, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E6, BLACK_PAWN);
        placeOnSquare(F7, BLACK_PAWN);
        placeOnSquare(G6, BLACK_PAWN);
        placeOnSquare(H7, BLACK_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const region = getWeakCageRegion(2, 8, 1);
        const expectedRegion = [[3, 7], [4, 7], [4, 6], [5, 7], [6, 7], [6, 6], [7, 7]];
        expect(region).toEqual(expectedRegion);
    });

    it("black weak non-cage region e8-f6-g7-h8", function () {
        placeOnSquare(E4, WHITE_KING);
        placeOnSquare(E8, BLACK_KING);
        placeOnSquare(F6, BLACK_PAWN);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(H8, BLACK_ROOK);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setFrozenFlag(H8.mFile, H8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const region = getWeakCageRegion(4, 7, 1);
        expect(region).toBe(null);
    });
});

describe("Illegalities related to weak cages", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("friendly white rook in cage ok", function () {
        placeOnSquare(H3, WHITE_KING);
        placeOnSquare(H5, BLACK_KING);
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C1, WHITE_BISHOP);
        placeOnSquare(D2, WHITE_PAWN);
        placeOnSquare(B1, WHITE_ROOK);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("friendly rook in cage cannot be promoted", function () {
        placeOnSquare(H3, WHITE_KING);
        placeOnSquare(H5, BLACK_KING);
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C1, WHITE_BISHOP);
        placeOnSquare(D2, WHITE_PAWN);
        placeOnSquare(B1, WHITE_ROOK);
        setPromotedFlag(B1.mFile, B1.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_impossiblePromotedWhiteRook]);
    });

    it("too many friendly white rooks in cage", function () {
        placeOnSquare(H3, WHITE_KING);
        placeOnSquare(H5, BLACK_KING);
        placeOnSquare(A3, WHITE_PAWN);
        placeOnSquare(B2, WHITE_PAWN);
        placeOnSquare(C1, WHITE_BISHOP);
        placeOnSquare(D2, WHITE_PAWN);
        placeOnSquare(A1, WHITE_ROOK);
        placeOnSquare(B1, WHITE_ROOK);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteRook]);
    });

    it("too many friendly black rooks in cage", function () {
        placeOnSquare(H3, WHITE_KING);
        placeOnSquare(H5, BLACK_KING);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(E7, BLACK_PAWN);
        placeOnSquare(F8, BLACK_BISHOP);
        placeOnSquare(G7, BLACK_PAWN);
        placeOnSquare(D8, BLACK_ROOK);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackRook]);
    });

    it("too many promoted white rooks in cage", function () {
        setForsythe("5bR1/4p1pp/8/4P1P1/1P1P1P1P/P1P1K1k1/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteRooks]);
    });

    it("too many promoted black rooks in cage", function () {
        setForsythe("8/p1p2pp1/1p5p/1k2K3/8/5P2/1P1PPrPP/2B1rr2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackRooks]);
    });

    it("too many white captures due to cage", function () {
        setForsythe("1nbqk1n1/p1pp1pp1/1p2p2p/4P3/1P6/3N1N1P/PPP2PP1/R1B1KB1R");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyWhiteCaptures]);
    });

    it("too many black captures due to cage", function () {
        setForsythe("2r2b1r/p3p1pp/1pn1bn2/2p3kp/8/P1P2P1P/1P1PP1P1/3QK1N1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyBlackCaptures]);
    });

    it("promoted black rooks in white cage ok", function () {
        placeOnSquare(A8, WHITE_KING);
        placeOnSquare(A6, BLACK_KING);
        placeOnSquare(E2, WHITE_PAWN);
        placeOnSquare(F1, WHITE_BISHOP);
        placeOnSquare(G2, WHITE_PAWN);
        placeOnSquare(H2, WHITE_PAWN);
        placeOnSquare(G1, BLACK_ROOK);
        placeOnSquare(H1, BLACK_ROOK);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(board[G1.mFile][G1.mRank].promoted).toBe(true);
        expect(board[H1.mFile][H1.mRank].promoted).toBe(true);
        expect(positionData.promotedCounts["bR"]).toBe(2);
        expect(positionData.totalCaptureCounts["b"]).toBe(3);
    });

    it("missing black rook in black cage counts as capture ok", function () {
        placeOnSquare(A1, WHITE_KING);
        placeOnSquare(A3, BLACK_KING);
        placeOnSquare(A6, BLACK_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(1);
    });

    it("missing black rook plus white pawn in black cage ok", function () {
        placeOnSquare(A1, WHITE_KING);
        placeOnSquare(A3, BLACK_KING);
        placeOnSquare(A6, BLACK_PAWN);
        placeOnSquare(B7, BLACK_PAWN);
        placeOnSquare(C8, BLACK_BISHOP);
        placeOnSquare(D7, BLACK_PAWN);
        placeOnSquare(A7, WHITE_PAWN);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(1);
    });

    it("three promoted black rooks in cage ok", function () {
        setForsythe("8/p2p4/1p6/1k2K3/8/4P2P/1P1P1PP1/2B1rrr1");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(board[E1.mFile][E1.mRank].promoted).toBe(true);
        expect(board[F1.mFile][F1.mRank].promoted).toBe(true);
        expect(board[G1.mFile][G1.mRank].promoted).toBe(true);
        expect(positionData.promotedCounts["bR"]).toBe(3);
        expect(positionData.totalCaptureCounts["b"]).toBe(3);
    });

    it("full back row cage with missing white rooks and black pawn inside ok", function () {
        setForsythe("8/8/8/4k3/8/1P1P2P1/P1PpPP1P/5K2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["b"]).toBe(2);
    });

    // make sure we don't duplicate count promoted black rooks
    it("white cage with promoted black rook and 3 outside black rooks ok", function () {
        setForsythe("8/8/8/4k3/rr6/Pr6/1P1P4/r1B2K2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["b"]).toBe(1);
        expect(positionData.promotedCounts["bR"]).toBe(2);
        expect(board[A1.mFile][A1.mRank].promoted).toBe(true);
    });

    it("2 weak and 1 strong cage on white's side ok", function () {
        setForsythe("8/8/8/4k3/8/P6P/1PPPPPP1/2B1KB2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["b"]).toBe(3);
    });

    it("1 white and 1 black weak cage with promoted white rook ok", function () {
        setForsythe("5b1R/4p1pp/8/4k3/6K1/P7/1P1P4/2B5");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.totalCaptureCounts["w"]).toBe(1);
        expect(positionData.totalCaptureCounts["b"]).toBe(1);
        expect(positionData.promotedCounts["wR"]).toBe(1);
        expect(board[H8.mFile][H8.mRank].promoted).toBe(true);
    });
});

describe("multiple cages", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("2 promoted black rooks in 2 cages", function () {
        setForsythe("1nbqkbn1/2pppp2/8/8/3QK3/P6P/1P1PP1P1/RrB2BrR");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bR"]).toBe(2);
    });

    it("3 promoted white rooks in 2 cages", function () {
        setForsythe("1Rb1kbnR/Rp1pp1p1/p6p/8/8/8/3PPP2/1NBQKBN1");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wR"]).toBe(3);
    });
});

describe("promoted rooks from cages", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("White has an a-rook strong cage and 2 outside rooks", function () {
        setForsythe("4k3/8/8/8/8/5RR1/PPPP4/2B1K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wR"]).toBe(1);
    })

    it("White has an a-rook weak cage and h-rook weak cage, and 2 outside rooks", function () {
        setForsythe("3k4/8/8/3K4/8/P3RR1P/1P1PP1P1/2B2B2");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wR"]).toBe(2);
    });

    it("Black has an h-rook strong cage, and 4 outside rooks", function () {
        setForsythe("4k3/4pppp/8/rrrr4/8/8/8/4K3");
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bR"]).toBe(3);
    });

    it("Black has an a-rook weak cage and h-rook strong cage and 1 outside rook with 8 pawns", function () {
        setForsythe("r1b2k2/1ppppppp/p7/8/4r3/8/8/3K4");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackRooks]);
    });

    it("Entire white first rank is a strong cage for both rooks", function () {
        setForsythe("4k3/8/8/6R1/8/8/PPPPPPPP/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteRooks]);
    });

    it("Entire white first rank is a weak cage for both rooks", function () {
        setForsythe("4k3/8/7R/8/8/1P6/P1PPPPPP/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedWhiteRooks]);
    });

    it("Entire black first rank is a strong cage for both rooks", function () {
        setForsythe("4k3/pppppppp/8/3r4/8/8/8/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackRooks]);
    });

    it("Entire black first rank is a weak cage for both rooks", function () {
        setForsythe("4k3/pp1p1p1p/2p1p1p1/3r4/8/8/8/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_tooManyPromotedBlackRooks]);
    });

    it("Frozen white rook on a1 with rest of first rank as cage", function () {
        setForsythe("4k3/8/8/3R4/8/2P1P2P/1P1P1PP1/R3K3");
        setFrozenFlag(A1.mFile, A1.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wR"]).toBe(1);
    });

    it("Frozen white rook on h1 with rest of first rank as cage", function () {
        setForsythe("4k3/8/8/R7/8/1P2P3/P1PP1PP1/4K2R");
        setFrozenFlag(H1.mFile, H1.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["wR"]).toBe(1);
    });

    it("Frozen black rook on a8 with rest of first rank as cage", function () {
        setForsythe("r3k3/1pp1ppp1/3p3p/8/3r4/8/8/4K3");
        setFrozenFlag(A8.mFile, A8.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bR"]).toBe(1);
    });

    it("Frozen black rook on h8 with rest of first rank as cage", function () {
        setForsythe("4k2r/1pp1ppp1/p2p4/8/3r4/8/8/4K3");
        setFrozenFlag(H8.mFile, H8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        expect(positionData.promotedCounts["bR"]).toBe(1);
    });
});

describe("king in enemy pawn cage tests", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("All black pawns on its second rank, white king behind them", function () {
        setForsythe("2K1k3/pppppppp/8/8/8/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteKing]);
    });

    it("White pawns on b2, c2, d2, f2, g2, black king behind pawns", function () {
        setForsythe("8/8/8/8/8/P3P2P/1PPP1PP1/2k2K2");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackKing]);
    });


    it("All black pawns on its second rank, white king outside ok", function () {
        setForsythe("4k3/pppppppp/8/5K2/8/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("White pawns on a2, b3, c2, d2, e2, f2, g2, h2, black king behind them ok", function () {
        setForsythe("8/8/8/8/8/1P6/P1PPPPPP/1k2K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Black pawns e7, f7, g7, h6; black bishop f8; white king h8", function () {
        setForsythe("3k1b1K/4ppp1/7p/8/8/8/8/8");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteKing]);
    });

    it("Frozen white king e1, white pawns g2, g3; black king h1", function () {
        setForsythe("8/8/8/8/8/6P1/6P1/4K2k");
        setFrozenFlag(E1.mFile, E1.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackKing]);
    });

    it("Not frozen white king e1, white pawns g2, g3; black king h1", function () {
        setForsythe("8/8/8/8/8/6P1/6P1/4K2k");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Frozen black bishop c8, black pawns a7, c7, d7, white king a8", function () {
        setForsythe("K1b1k3/p1pp4/8/8/8/8/8/8");
        setFrozenFlag(C8.mFile, C8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteKing]);
    });

    it("Frozen white bishop c1, white pawns a2, b2, d2, black king a1 ok", function () {
        setForsythe("8/8/8/8/8/8/PP1P4/k1B1K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("Frozen white queen d1, white pawns d2, g2, h2, black king f2", function () {
        setForsythe("8/8/8/6K1/8/8/3P1kPP/3Q4");
        setFrozenFlag(D1.mFile, D1.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedBlackKing]);
    });

    it("Frozen black knight g8, frozen black king e8, black pawn f7, white king g7", function () {
        setForsythe("4k1n1/5pK1/8/8/8/8/8/8");
        setFrozenFlag(G8.mFile, G8.mRank, true);
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_illegallyPlacedWhiteKing]);
    });
});

describe("no available promotion squares", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("white queen", function () {
        setForsythe("4k3/pppppppp/8/8/2QQ4/8/8/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_noWhitePromotionSquaresForQueen]);
    });

    it("white rook - with some frozen black pieces", function () {
        setForsythe("4k3/p1pp1pp1/1p5p/8/8/1RRR4/8/4K3");
        setFrozenFlag(E8.mFile, E8.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_noWhitePromotionSquaresForRook]);
    });

    it("white light squared bishop - with some frozen black pieces", function () {
        setForsythe("4k1n1/1p1p1p2/8/8/8/3B4/2B5/4K3");
        setFrozenFlag(G8.mFile, G8.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_noWhitePromotionSquaresForBishop]);
    });

    it("white dark squared bishop", function () {
        setForsythe("4k3/p1p1p1p1/8/8/3B4/4B3/8/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_noWhitePromotionSquaresForBishop]);
    });

    it("white knight", function () {
        setForsythe("4k3/pppppppp/8/8/1NNN4/8/8/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_noWhitePromotionSquaresForKnight]);
    });

    it("black queen - with some frozen white pieces", function () {
        setForsythe("4k3/8/6q1/6q1/8/8/PPP2PPP/2BQKB2");
        setFrozenFlag(C1.mFile, C1.mRank, true);
        setFrozenFlag(D1.mFile, D1.mRank, true);
        setFrozenFlag(E1.mFile, E1.mRank, true);
        setFrozenFlag(F1.mFile, F1.mRank, true);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_noBlackPromotionSquaresForQueen]);
    });

    it("black rook", function () {
        setForsythe("4k3/8/3rr3/4r3/8/1P1P3P/P1P1PPP1/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_noBlackPromotionSquaresForRook]);
    });

    it("black light squared bishop", function () {
        setForsythe("4k3/8/2b5/3b4/8/8/P1P1P1P1/4K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_noBlackPromotionSquaresForBishop]);
    });

    it("black dark squared bishop", function () {
        setForsythe("4k3/8/3b4/2b5/8/8/1P1P1P1P/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_noBlackPromotionSquaresForBishop]);
    });

    it("black knight - with some frozen white pieces", function () {
        setForsythe("4k3/5n2/5n2/5n2/8/8/PP1PPPPP/1NBQ3K");
        setFrozenFlag(B1.mFile, B1.mRank, true);
        setFrozenFlag(C1.mFile, C1.mRank, true);
        setFrozenFlag(D1.mFile, D1.mRank, true);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_noBlackPromotionSquaresForKnight]);
    });
});
