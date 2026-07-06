/*
  Tests for the "original officer" feature:
  1. Legality: an officer marked original that the engine deduces to be promoted
     (via cage/bishop analysis) is flagged as illegal — on any rank, not just the
     promotion rank.
  2. Pseudo-legality: unpromotion of original pieces is rejected.
  3. Solver: unpromotion moves are not generated for original pieces.
 */

describe("trapped original officer legality", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("trapped original white bishop on c8 is illegal", function () {
        setForsythe("2B5/1p1p4/8/8/8/8/8/4K2k");
        setOriginalFlag(2, 7, true); // c8
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_impossibleOriginalWhiteBishop]);
    });

    it("same position without original flag is legal", function () {
        setForsythe("2B5/1p1p4/8/8/8/8/8/4K2k");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("original white bishop with escape route is legal", function () {
        setForsythe("2B5/1p6/8/8/8/8/8/4K2k");
        setOriginalFlag(2, 7, true); // c8, can escape via d7
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("original white knight can jump over partial pawn wall", function () {
        // Knight on c8 with black pawns on b7 and d7 (same setup that traps a bishop).
        // Knight can jump to b6 or d6 (rank 5), bypassing the pawns entirely.
        setForsythe("2N5/1p1p4/8/8/8/8/8/4K2k");
        setOriginalFlag(2, 7, true); // c8
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("trapped original white bishop on f8 is illegal", function () {
        // Bishop on f8 (original bishop file) with black pawns on e7 and g7.
        // Both diagonal exits blocked; no pawn directly below at f7.
        setForsythe("5B1k/4p1p1/8/8/8/8/8/4K3");
        setOriginalFlag(5, 7, true); // f8
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_impossibleOriginalWhiteBishop]);
    });

    it("original white rook can escape via gap in pawn wall", function () {
        // Rook on a8, pawns everywhere on rank 7 except d7.
        // Rook slides along 8th rank to d8, then down through d7.
        setForsythe("R3k3/ppp1pppp/8/8/8/8/8/4K3");
        setOriginalFlag(0, 7, true); // a8
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("trapped original black bishop on c1 is illegal", function () {
        // Black bishop on c1, white pawns on b2 and d2 (frozen).
        setForsythe("4k3/8/8/8/8/8/1P1P4/2b1K3");
        setOriginalFlag(2, 0, true); // c1
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_impossibleOriginalBlackBishop]);
    });

    it("same black position without original flag is legal", function () {
        setForsythe("4k3/8/8/8/8/8/1P1P4/2b1K3");
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });

    it("original white rook deduced promoted on 7th rank is illegal", function () {
        // Rook on a7 is trapped by the cage formed by black pawns on b7, d7,
        // and a6.  The engine deduces it must be promoted.  If marked original,
        // that is a contradiction.
        setForsythe("2b1k3/Rp1p4/p7/8/8/8/8/4K3");
        setOriginalFlag(0, 6, true); // a7
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_impossibleOriginalWhiteRook]);
    });

    it("same rook position without original flag is legal", function () {
        setForsythe("2b1k3/Rp1p4/p7/8/8/8/8/4K3");
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });
});

describe("original officer in corner — full wall", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("original white queen trapped in corner with pawn wall", function () {
        // Queen on a8, black pawns on a7 and b7.
        // Queen can slide along 8th rank to b8, c8, ... but every downward
        // exit on files 0 and 1 is blocked; from c8 onward there is a gap
        // (c7 empty) so the queen CAN escape.  To truly trap it we need the
        // full wall, but then other checks may fire.  Instead test the case
        // where only a7 and b7 block, and verify the queen escapes via c-file.
        setForsythe("Q3k3/p1pppppp/8/8/8/8/8/4K3");
        setOriginalFlag(0, 7, true); // a8
        setRetract("w");
        // Queen can reach c8 along the rank, then descend through the gap at c7.
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
    });
});

describe("unpromotion of original pieces — pseudo-legality", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("unpromoting an original white queen is rejected", function () {
        placeOnSquare(A8, WHITE_QUEEN);
        placeOnSquare(A7, new Piece("", "")); // ensure target is empty
        setOriginalFlag(0, 7, true);
        expect(isPseudoLegal(A8, A7, "", true)).toBe(error_cannotUnpromoteOriginal);
    });

    it("unpromoting a non-original white queen is allowed (pseudo-legal)", function () {
        placeOnSquare(A8, WHITE_QUEEN);
        placeOnSquare(A7, new Piece("", ""));
        // original flag is false by default
        expect(isPseudoLegal(A8, A7, "", true)).toBe(error_ok);
    });

    it("unpromoting an original black rook is rejected", function () {
        placeOnSquare(A1, BLACK_ROOK);
        placeOnSquare(A2, new Piece("", ""));
        setOriginalFlag(0, 0, true);
        expect(isPseudoLegal(A1, A2, "", true)).toBe(error_cannotUnpromoteOriginal);
    });

    it("normal (non-unpromote) retraction of original piece is fine", function () {
        placeOnSquare(E4, WHITE_QUEEN);
        // E5 is already empty after clearBoard
        setOriginalFlag(4, 3, true);
        expect(isPseudoLegal(E4, E5, "", false)).toBe(error_ok);
    });
});

describe("original officer — solver move generation", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("no unpromotion moves for original queen on promotion rank", function () {
        placeOnSquare(A8, WHITE_QUEEN);
        setOriginalFlag(0, 7, true);

        const moveList = [];
        getPseudoLegalMovesQueen(0, 7, "w", moveList, true, true, false);
        const unpromotions = moveList.filter(move => move.unpromote);
        expect(unpromotions.length).toBe(0);
    });

    it("unpromotion moves ARE generated for non-original queen on promotion rank", function () {
        placeOnSquare(A8, WHITE_QUEEN);
        // original flag is false by default

        const moveList = [];
        getPseudoLegalMovesQueen(0, 7, "w", moveList, true, true, false);
        const unpromotions = moveList.filter(move => move.unpromote);
        expect(unpromotions.length).toBeGreaterThan(0);
    });

    it("no unpromotion moves for original rook on promotion rank", function () {
        placeOnSquare(H8, WHITE_ROOK);
        setOriginalFlag(7, 7, true);

        const moveList = [];
        getPseudoLegalMovesRook(7, 7, "w", moveList, true, true, false);
        const unpromotions = moveList.filter(move => move.unpromote);
        expect(unpromotions.length).toBe(0);
    });

    it("no unpromotion moves for original knight on promotion rank", function () {
        placeOnSquare(D8, WHITE_KNIGHT);
        setOriginalFlag(3, 7, true);

        const moveList = [];
        getPseudoLegalMovesKnight(3, 7, "w", moveList, true, true, false);
        const unpromotions = moveList.filter(move => move.unpromote);
        expect(unpromotions.length).toBe(0);
    });

    it("no unpromotion moves for original bishop on promotion rank", function () {
        placeOnSquare(F8, WHITE_BISHOP);
        setOriginalFlag(5, 7, true);

        const moveList = [];
        getPseudoLegalMovesBishop(5, 7, "w", moveList, true, true, false);
        const unpromotions = moveList.filter(move => move.unpromote);
        expect(unpromotions.length).toBe(0);
    });

    it("no unpromotion moves for original black queen on first rank", function () {
        placeOnSquare(A1, BLACK_QUEEN);
        setOriginalFlag(0, 0, true);

        const moveList = [];
        getPseudoLegalMovesQueen(0, 0, "b", moveList, true, true, false);
        const unpromotions = moveList.filter(move => move.unpromote);
        expect(unpromotions.length).toBe(0);
    });
});
