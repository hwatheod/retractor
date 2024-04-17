describe("Test containsBoard", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Test positive results", function () {
        const boardArray = [];

        setForsythe("n1k2Rn1/BppppKp1/1p3p1p/8/8/8/8/8");
        const board1 = copyBoard();
        boardArray.push(board1);

        setForsythe("8/8/8/8/4k3/8/4pK2/5b1B");
        const board2 = copyBoard();
        boardArray.push(board2);

        setForsythe("7r/pp1p2nQ/5k1K/p6n/4p3/p7/p6P/8");
        const board3 = copyBoard();
        boardArray.push(board3);

        expect(containsBoard(boardArray, board1)).toBe(true);
        expect(containsBoard(boardArray, board2)).toBe(true);
        expect(containsBoard(boardArray, board3)).toBe(true);
    });

    it("Test negative results", function () {
        const boardArray = [];

        setForsythe("n1k2Rn1/BppppKp1/1p3p1p/8/8/8/8/8");
        boardArray.push(copyBoard());

        setForsythe("8/8/8/8/4k3/8/4pK2/5b1B");
        boardArray.push(copyBoard());

        setForsythe("7r/pp1p2nQ/5k1K/p6n/4p3/p7/p6P/R7");
        setFrozenFlag(0, 0, true); // a1 rook set to frozen
        boardArray.push(copyBoard());

        // change a8 from black knight to white knight
        setForsythe("N1k2Rn1/BppppKp1/1p3p1p/8/8/8/8/8");
        expect(containsBoard(boardArray, board)).toBe(false);

        // change f1 from black bishop to black queen
        setForsythe("8/8/8/8/4k3/8/4pK2/5q1B");
        expect(containsBoard(boardArray, board)).toBe(false);

        // change a1 rook from frozen to not frozen
        setForsythe("7r/pp1p2nQ/5k1K/p6n/4p3/p7/p6P/R7");
        expect(containsBoard(boardArray, board)).toBe(false);
    });
});

describe("Test boardContainsCage", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Positive test case 1", function () {
        setForsythe("6b1/5pp1/8/8/8/8/8/8");
        const cage = copyBoard();

        setForsythe("4k1b1/4qpp1/6p1/2QN4/2n1B1r1/5N2/8/4K3");
        expect(boardContainsCage(board, cage)).toBe(true);
    });

    it("Positive test case 2", function () {
        setForsythe("8/8/8/8/8/8/PPkPP3/KR1b4");
        const cage = copyBoard();

        setForsythe("5b2/4pp2/2NQ4/8/4R3/2n5/PPkPPP2/KRNb4");
        expect(boardContainsCage(board, cage)).toBe(true);
    });

    it("Positive test case 3 - frozen piece", function () {
        setForsythe("8/8/8/8/8/8/6PP/6Nq");
        setFrozenFlag(6, 0, true);
        const cage = copyBoard();

        setForsythe("6r1/1pp2p2/8/2k1B3/6B1/2b5/2RPN1PP/3K2Nq");
        setFrozenFlag(6, 0, true);
        expect(boardContainsCage(board, cage)).toBe(true);
    });

    it("Positive test case 4 - frozen piece on board only but not cage", function () {
        setForsythe("8/8/8/8/8/8/6PP/6Nq");
        const cage = copyBoard();

        setForsythe("6r1/1pp2p2/8/2k1B3/6B1/2b5/2RPN1PP/3K2Nq");
        setFrozenFlag(6, 0, true);
        expect(boardContainsCage(board, cage)).toBe(true);
    });

    it("Negative test case 1 - change g8 from black bishop to white bishop", function () {
        setForsythe("6b1/5pp1/8/8/8/8/8/8");
        const cage = copyBoard();

        setForsythe("4k1B1/4qpp1/6p1/2QN4/2n1B1r1/5N2/8/4K3");
        expect(boardContainsCage(board, cage)).toBe(false);
    });

    it("Negative test case 2 - change b1 from white rook to white bishop", function () {
        setForsythe("8/8/8/8/8/8/PPkPP3/KR1b4");
        const cage = copyBoard();

        setForsythe("5b2/4pp2/2NQ4/8/4R3/2n5/PPkPPP2/KBNb4");
        expect(boardContainsCage(board, cage)).toBe(false);
    });

    it("Negative test case 3 - frozen piece - change g1 knight from frozen to not frozen", function () {
        setForsythe("8/8/8/8/8/8/6PP/6Nq");
        setFrozenFlag(6, 0, true);
        const cage = copyBoard();

        setForsythe("6r1/1pp2p2/8/2k1B3/6B1/2b5/2RPN1PP/3K2Nq");
        expect(boardContainsCage(board, cage)).toBe(false);
    });
});

describe("Test getZoneSquares", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
        jasmine.addCustomEqualityTester(matchSquareArrayUnordered);
    });

    it("Lower left corner", function () {
        setForsythe("8/8/8/8/8/1R6/PP6/Kn6");
        expect(getZoneSquares()).toEqual(
            [A1, B1, C1, A2, B2, C2, A3, B3, C3, A4, B4, C4]);
    });

    it("Lower side", function () {
        setForsythe("8/8/8/8/8/3R4/2Kqk3/3nB3");
        expect(getZoneSquares()).toEqual(
            [B1, C1, D1, E1, F1,
                B2, C2, D2, E2, F2,
                B3, C3, D3, E3, F3,
                C4, D4, E4]);
    });

    it("Lower right corner", function () {
        setForsythe("8/8/8/8/8/6k1/6Pp/5b1K");
        expect(getZoneSquares()).toEqual(
            [E1, F1, G1, H1,
                E2, F2, G2, H2,
                F3, G3, H3,
                F4, G4, H4]);
    });

    it("Upper left corner", function () {
        setForsythe("1k6/Nn6/1KP5/8/8/8/8/8");
        expect(getZoneSquares()).toEqual(
            [A8, B8, C8,
                A7, B7, C7, D7,
                A6, B6, C6, D6,
                A5, B5, C5, D5]);
    });

    it("Upper side", function () {
        setForsythe("3Rk3/3B4/3nK3/8/8/8/8/8");
        expect(getZoneSquares()).toEqual(
            [C8, D8, E8, F8,
                C7, D7, E7, F7,
                C6, D6, E6, F6,
                C5, D5, E5, F5]);
    });

    it("Upper right corner", function () {
        setForsythe("6qQ/7k/5K1P/8/8/8/8/8");
        expect(getZoneSquares()).toEqual(
            [F8, G8, H8,
                E7, F7, G7, H7,
                E6, F6, G6, H6,
                E5, F5, G5, H5]);
    });
});

describe("Test inHomeSquares", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Positive test case 1 - black pieces", function () {
        setForsythe("rnb5/1ppp4/8/8/8/8/8/8");
        expect(inHomeSquares([A8, B8, C8, B7, C7, D7])).toBe(true);
    });

    it("Positive test case 2 - black pieces", function () {
        setForsythe("3qkbnr/p3pppp/8/8/8/8/8/8");
        expect(inHomeSquares([D8, E8, F8, G8, H8, A7, E7, F7, G7, H7])).toBe(true);
    });

    it("Positive test case 3 - white pieces", function () {
        setForsythe("8/8/8/8/8/8/P1PP2PP/R3KBN1");
        expect(inHomeSquares([A2, C2, D2, G2, H2, A1, E1, F1, G1])).toBe(true);
    });

    it("Positive test case 4 - white pieces", function () {
        setForsythe("8/8/8/8/8/8/1P2PP2/1NBQ3R");
        expect(inHomeSquares([B2, E2, F2, B1, C1, D1, H1])).toBe(true);
    });

    it("Negative test case 1 - change b8 from black knight to white knight", function () {
        setForsythe("rNb5/1ppp4/8/8/8/8/8/8");
        expect(inHomeSquares([A8, B8, C8, B7, C7, D7])).toBe(false);
    });

    it("Negative test case 2 - black queen and king are interchanged on d8 and e8", function () {
        setForsythe("3kq3/1ppp4/8/8/8/8/8/8");
        expect(inHomeSquares([D8, E8, B7, C7, D7])).toBe(false);
    });

    it("Negative test case 3 - change f1 from white bishop to black bishop", function () {
        setForsythe("8/8/8/8/8/8/P1PP2PP/R3KbN1");
        expect(inHomeSquares([A2, C2, D2, G2, H2, A1, E1, F1, G1])).toBe(false);
    });

    it("Negative test case 4 - a white bishop moved from f1 to g3", function () {
        setForsythe("8/8/8/8/8/6B1/P1PP2PP/R3K1N1");
        expect(inHomeSquares([A2, C2, D2, G2, H2, A1, E1, G1, G3])).toBe(false);
    });
});

describe("Test getCheckingUnits with unblockableOnly=true", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
        jasmine.addCustomEqualityTester(matchSquareArrayUnordered);
    });

    it("Black king in unblockable check by bishop and pawn, blockable check by rook", function () {
        setForsythe("4k3/3B1P2/4R3/8/8/8/8/4K3");
        expect(getCheckingUnits('b', true)).toEqual([D7, F7]);
    });

    it("Black king in unblockable check by knight, queen, rook, blockable check by bishop", function () {
        setForsythe("8/8/6R1/5Qk1/4N3/8/8/2B1K3");
        expect(getCheckingUnits('b', true)).toEqual([E4, F5, G6]);
    });

    it("White king in unblockable check by pawn, pawn, rook, blockable check by rook, bishop", function () {
        setForsythe("4k3/8/8/3prp2/r3K3/8/8/7b");
        expect(getCheckingUnits('w', true)).toEqual([D5, E5, F5]);
    });

    it("White king in unblockable check by knight, queen, bushop, blockable check by queen", function () {
        setForsythe("3q4/8/8/8/2k1n3/8/3Kq3/4b3");
        expect(getCheckingUnits('w', true)).toEqual([E1, E2, E4]);
    });

    it("White king in blockable check by bishop", function () {
        setForsythe("4k3/3pp3/4Bn2/8/1b2Q3/8/1PP1R3/4K3");
        expect(getCheckingUnits('w', true)).toEqual([]);
    });
});

describe("Test cage serialization", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Test cageToString - simple case", function () {
        setForsythe("4k3/8/8/8/8/1P6/BPP5/4K3");
        const cage = new RequestedCage(copyBoard(), 10);
        expect(cageToString(cage)).toBe("4k3/8/8/8/8/1P6/BPP5/4K3 depth=10");
    });

    it("Test cageToString - frozen piece", function () {
        setForsythe("8/8/8/8/8/7P/4P2P/4K1k1");
        setFrozenFlag(4, 0, true); // E1
        const cage = new RequestedCage(copyBoard(), 20);
        expect(cageToString(cage)).toBe("8/8/8/8/8/7P/4P2P/4K1k1 frozen=e1 depth=20");
    });

    it("Test cageToString - two frozen pieces", function () {
        setForsythe("8/8/8/8/8/8/1PPP4/1NrQ4");
        setFrozenFlag(1, 0, true); // B1
        setFrozenFlag(3, 0, true); // D1
        const cage = new RequestedCage(copyBoard(), 15);
        expect(cageToString(cage)).toBe("8/8/8/8/8/8/1PPP4/1NrQ4 frozen=b1,d1 depth=15");
    });
});

describe("Test import cages", function () {
    beforeAll(function () {
        initializeBoard();
    });

    afterEach(function () {
        clearCages();
    });

    const twoBadTwoGoodCages = "8/8/8/8/8/1P6/BPP5/8 depth=30\n" + // good
        "8/8/8/8/1P6/8/BPP5/8 depth=30\n" + // bad
        "8/8/8/1P6/8/8/BPP5/8 depth=30\n" + // bad
        "6b1/5pp1/6p1/8/8/8/8/8 depth=30"; // good
    const invalidFrozenSquares =
        ["8/8/8/8/8/7P/4P2P/4K1k1 frozen=e1,j3",
            "8/8/8/8/8/7P/4P2P/4K1k1 frozen=a12,e1",
            "8/8/8/8/8/7P/4P2P/4K1k1 frozen=1e",
            "8/8/8/8/8/8/8/NBR5 frozen=c1",
            "Rnb5/8/8/8/8/8/8/8 frozen=a8",
            "Rbn5/8/8/8/8/8/8/8 frozen=c8"
        ];
    const invalidDepth = "8/8/8/8/8/1P6/BPP5/8 depth=30\n" +
        "6b1/5pp1/6p1/8/8/8/8/8 depth=3a\n";
    const badForsytheOnLine3 = "8/8/8/8/8/1P6/BPP5/8 depth=30\n" +
        "6b1/5pp1/6p1/8/8/8/8/8 depth=30\n" +
        "8/1Q6/abc depth=30";
    const goodCages = "  8/8/8/8/8/1P6/BPP5/8 depth=30\n" +
        "6b1/5pp1/6p1/8/8/8/8/8 depth=30\n" +
        "  \n" +
        "    8/8/8/8/8/7P/4P2P/4K1k1 froZen=e1  ";

    it("Test bad cages on lines 2, 3", function () {
        expect(importCages(twoBadTwoGoodCages)).toEqual([[2, 3], 2, 0]);
        expect(serializedRequestedCages).toEqual(
            ["8/8/8/8/8/1P6/BPP5/8 depth=30", "6b1/5pp1/6p1/8/8/8/8/8 depth=30"]
        );
    });

    it("Test bad forsythe on line 3", function () {
        expect(importCages(badForsytheOnLine3)).toEqual([3]);
        expect(serializedRequestedCages).toEqual([]);
    });

    it("Test importing 3 good cages", function () {
        expect(importCages(goodCages)).toEqual([[], 3, 0]);
        expect(serializedRequestedCages).toEqual(
            ["8/8/8/8/8/1P6/BPP5/8 depth=30",
                "6b1/5pp1/6p1/8/8/8/8/8 depth=30",
                "8/8/8/8/8/7P/4P2P/4K1k1 frozen=e1 depth=30"]);
    });

    it("Test a sequence of imports with duplicates", function () {
        expect(importCages(twoBadTwoGoodCages)).toEqual([[2, 3], 2, 0]);
        expect(serializedRequestedCages).toEqual(
            ["8/8/8/8/8/1P6/BPP5/8 depth=30", "6b1/5pp1/6p1/8/8/8/8/8 depth=30"]
        );

        // import some good cages which but 2 of them are duplicates of the two good cages above
        expect(importCages(goodCages)).toEqual([[], 1, 2]);
        expect(serializedRequestedCages).toEqual(
            ["8/8/8/8/8/1P6/BPP5/8 depth=30",
                "6b1/5pp1/6p1/8/8/8/8/8 depth=30",
                "8/8/8/8/8/7P/4P2P/4K1k1 frozen=e1 depth=30"]);

        // import the bad cages again, but now the good cages are duplicates. Make sure reported line numbers are correct.
        expect(importCages(twoBadTwoGoodCages)).toEqual([[2, 3], 0, 2]);
        expect(serializedRequestedCages).toEqual(
            ["8/8/8/8/8/1P6/BPP5/8 depth=30",
                "6b1/5pp1/6p1/8/8/8/8/8 depth=30",
                "8/8/8/8/8/7P/4P2P/4K1k1 frozen=e1 depth=30"]);
    });

    invalidFrozenSquares.forEach(invalidCage => {
        it("Test invalid frozen squares " + invalidCage, function () {
            const validCage = "8/8/8/8/8/1P6/BPP5/8 depth=30\n";
            expect(importCages(validCage + invalidCage)).toEqual([2]);
        });
    })

    it("Test invalid depth", function () {
        expect(importCages(invalidDepth)).toEqual([2]);
    });
});


function matchSquareArrayUnordered(first, second) {
    if (Array.isArray(first) && Array.isArray(second)) {
        if (first.length != second.length) {
            return false;
        }
        return first.every(firstElement => second.some(secondElement => squareEquals(firstElement, secondElement)));
    }
    return undefined;
}