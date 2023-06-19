/*
  To test if any unsolved problems have become solved, set testSolved to false and testUnsolved to true in the
  constants below.  Set otherTest to xdescribe.

  Run the tests. Click over to the full "Spec List". Any new solved problems will show up in blue (passed) in Jasmine.
  If there are any new solved problems, change them from xtestProblem to testProblem in the actual test case, and
  update the numbers in the table below. Reset all testSolved to true and testUnsolved to false, and otherTest to
  describe, before committing.

  Type    Solved     Solved with cages     Unsolved     Total
  other   10                                  0           10
  A       29                24                6           59
  B       33                18                0           51 (duplicates of type A have been excluded)
  C       53                 7                0           60
  D       86                28               47          161
  ----------------------------------------------------------
  total  211                77               53          341
 */

const typeA = {testSolved: true, testUnsolved: false};
const typeB = {testSolved: true, testUnsolved: false};
const typeC = {testSolved: true, testUnsolved: false};
const typeD = {testSolved: true, testUnsolved: false};
const otherProblems = {testSolved: true, testUnsolved: false};
const otherTest = describe;
const defaultExtraDepth = 3;

otherTest("test solve parameters", function() {
    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    it("no more than 10 solutions", function() {
        placeOnSquare(A1, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const solveParameters = new SolveParameters(1, 3, 10);
        const solutions = solve(solveParameters);
        expect(solutions.length).toBe(10);
    });

    it("no white uncaptures", function() {
        placeOnSquare(A1, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        setRetract("w");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const solveParameters = new SolveParameters(1, 3, 10, true, false);
        const solutions = solve(solveParameters);
        expect(solutions.length).toBe(3);
    });

    it("no black uncaptures", function() {
        placeOnSquare(A1, WHITE_KING);
        placeOnSquare(C5, BLACK_KING);
        setRetract("b");
        expect(errorText[startPlay()]).toBe(errorText[error_ok]);
        const solveParameters = new SolveParameters(1, 3, 10, false, true);
        const solutions = solve(solveParameters);
        expect(solutions.length).toBe(8);
    });

});

describe("some problems with unique solutions", function() {
    function testProblem(testPositionAndCages, solution, toRetract, parameters, func) {
        parameters = parameters ?? {};
        const extraDepth = parameters['extraDepth'] ?? defaultExtraDepth;

        if (func == null) {
            func = otherProblems.testSolved ? it : xit;
        }
        let forsythe;
        if (typeof testPositionAndCages == 'string') {
            forsythe = testPositionAndCages;
        } else {
            forsythe = testPositionAndCages[0];
        }

        func(forsythe + " " + toRetract + " " + solution.length, function() {
            setEnableSeparateCaptureTracking(parameters['ENABLE_SEPARATE_CAPTURE_TRACKING'] ?? false);
            setForsythe(forsythe);
            setRetract(toRetract);
            expect(errorText[startPlay()]).toBe(errorText[error_ok]);
            const solveParameters = new SolveParameters(solution.length, extraDepth, 10);
            const solutions = solve(solveParameters);
            expect(solutions.length).toBe(1);
            expect(solutions[0].map(moveToString)).toEqual(solution);
            setEnableSeparateCaptureTracking(false);
        });
    }

    function xtestProblem(testPositionAndCages, solution, toRetract, parameters) {
        if (toRetract == null) {
            toRetract = "w";
        }
        testProblem(testPositionAndCages, solution, toRetract, parameters ?? {}, otherProblems.testUnsolved ? it : xit);
    }

    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    /* simplest possible retro problem */
    testProblem("8/8/8/8/1k6/P7/1K6/8", ["a2-a3+"], "w");

    /*  The next few problems are at https://www.janko.at/Retros/PedagogicalCollection.htm
        The problem numbers are the numbers on that page
     */

    // #5, Eric Angelini - Europe Echecs 433, Apr. 1995
    testProblem("8/8/3r4/4K3/8/4kqpb/8/8", ["Kf5xNe5", "f4xg3ep+", "g2-g4"], "w");

    // #8, F. Amelung - Düna Zeitung, 1897
    testProblem("7R/7p/5P1k/4PKpP/8/8/8/8", ["g7-g5"], "b");

    // #15, Raymond Smullyan - Manchester Guardian, 1957
    testProblem("8/8/8/1r1b4/B7/2K5/8/3k4", ["Kb3xPc3+", "b4xc3ep+", "c2-c4"], "w");

    // #17 - G. Husserl - Prize, Israel Ring Tourney, 1966/71
    testProblem("B1kRN3/Pp6/2QK1R2/8/8/8/8/8", ["c7xNd8=R+"], "w");

    // #20 - Leonid Borodatov, Krimskaja Pravda, 1970
    testProblem("8/8/8/8/8/6P1/3P2Pk/2KR3N", ["Kg1xNh2"], "b");

    // #26 - N. Petrovic - Problem, 1954 - 1st/2nd Prize 4th Thematic Tourney
    testProblem("6K1/7B/4Pk2/8/6Q1/4Q3/8/B7",
        ["d5xe6ep+", "e7-e5", "d4-d5+", "Ke6xPf6", "e5xf6ep+", "f7-f5"], "w");

    /*
      The next few problems are from https://www.janko.at/Retros/Masterworks/index.htm
      The problem numbers are the numbers on that page
     */

    // #11 - M. Myllyniemi - Suomen Tehtäväniekat, 1955 - 1st Prize
    testProblem("6b1/1Q5n/1N1k1P2/1rp5/8/1Kp4B/6p1/4R3",
        ["b4xc3ep+", "c2-c4", "Ke6xNd6+", "e5xf6ep+", "f7-f5"], "b");

    // #18 - Dr. Niels Høeg - Retrograde Analysis, 1915
    const hoegSolution = ["Rd8-d7+", "d7-d6", "f5xe6ep+", "e7-e5", "f4-f5+", "Kd6-c7", "b5xc6ep+", "c7-c5", "b4-b5+", "Ke6-d6",
        "g5xf6ep+", "f7-f5", "g4-g5+"];
    testProblem("bN6/pPkR3p/PpPpPP2/8/2KP4/B6B/1q1P2PQ/br1R2Nr", hoegSolution, "w",
        {'ENABLE_SEPARATE_CAPTURE_TRACKING': true});


    // #33 - H. Eriksson - Stella Polaris, 1969 - 1st Prize
    const erikksonSolution = ["h4xg3ep+", "g2-g4", "Rf5-c5+", "b5xc6ep+", "c7-c5", "b4-b5+", "Kc6-d6", "c5xb6ep+",
        "b7-b5", "Nb5-c3+"];
    testProblem("8/3pp2p/1PPkb2R/2r3Rr/B1Q2P2/BPN1PNpK/1P6/8", erikksonSolution, "b",
        {'ENABLE_SEPARATE_CAPTURE_TRACKING': true});
});

/*
  The type A,B,C,D and ELM (equal last move) problems are from:

  https://www.janko.at/Retros/Records/LastMove/index.htm   (types A,B,C)
  https://www.janko.at/Retros/Records/LastMove/TypeD.htm   (type D)
  https://www.janko.at/Retros/Records/EqualLastMove/index.htm  (equal last move)
 */

function addCage(cageString) {
    const cage = parseSerializedCage(cageString);
    restoreBoard(cage.board);
    setRetract("w");
    startPlay(false);
    expect(verifyCageInternal(true).isCageVerified).toBe(true);
    stopPlay(false);
}

describe("type A last move problems", function() {
    function testProblem(testPositionAndCages, solution, toRetract, parameters, func) {
        parameters = parameters ?? {};
        const extraDepth = parameters['extraDepth'] ?? defaultExtraDepth;
        if (func == null) {
            func = typeA.testSolved ? it : xit;
        }
        if (toRetract == null) {
            toRetract = "w";
        }
        let forsythe;
        if (typeof testPositionAndCages == 'string') {
            forsythe = testPositionAndCages;
        } else {
            forsythe = testPositionAndCages[0];
        }
        func(forsythe, function() {
            setEnableSeparateCaptureTracking(parameters['ENABLE_SEPARATE_CAPTURE_TRACKING'] ?? false);
            if (typeof testPositionAndCages != 'string') {
                testPositionAndCages.slice(1).forEach(addCage);
            }
            setForsythe(forsythe);
            setRetract(toRetract);
            expect(errorText[startPlay()]).toBe(errorText[error_ok]);
            const solveParameters = new SolveParameters(1, extraDepth, 10);
            const solutions = solve(solveParameters);
            expect(solutions.length).toBe(1);
            expect(solutions[0][0]).toEqual(solution);

            stopPlay();
            setRetract(opposite(toRetract));
            if (startPlay() == error_ok) {
                expect(solve(solveParameters).length).toBe(0);
            }
            setEnableSeparateCaptureTracking(false);
        });
    }

    function xtestProblem(testPositionAndCages, solution, toRetract, parameters) {
        if (toRetract == null) {
            toRetract = "w";
        }
        testProblem(testPositionAndCages, solution, toRetract, parameters ?? {}, typeA.testUnsolved ? it : xit);
    }

    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
        jasmine.addCustomEqualityTester(matchMoveTypeWithMove);
    });

    afterEach(function() {
        clearCages();
    });

    /* Brandis, Albrecht */
    testProblem(["8/8/8/8/8/1P6/1PkPP3/KR1b4", "8/8/8/8/8/8/PPkPP3/KR1b4"], "K-");
    /* Ceriani, Luigi */
    testProblem("3bkN1K/pppprp1p/4p1p1/8/8/8/8/8", "KxQ");
    /* Brandis, Albrecht; August, Hugo; Hoeg, Niels; Dawson, Thomas R.; Onitiu,
        Valerian */
    testProblem(["8/8/8/8/8/1P1P4/1PPRP3/K1k5", "8/8/8/8/8/3P4/PPPRP3/K1k5"], "KxR");
    /* Hoeg, Niels; August, Hugo */
    testProblem("8/8/8/8/8/P7/KPkPP3/2qb4", "KxB");
    /* August, Hugo; Brennert, Otto; Dawson, Thomas R.; Hoeg, Niels; Onitiu, Valerian */
    testProblem("8/8/8/8/P7/kP6/prP5/K7", "KxN", "b");
    /* Christiaans, Frank */
    xtestProblem("8/4p1p1/8/2PP4/K1kPN3/B3R3/PPPP4/8", "KxP");
    /* Ceriani, Luigi */
    testProblem("8/8/8/8/8/4PPPk/3PPprb/5KQ1", "Q-");
    /* Bartolovic, Vojko; Buljan, Rudolf */
    testProblem(["k1bQ2b1/ppKppp1B/2p3p1/8/8/8/8/8", "8/ppKpppp1/2p5/8/8/8/8/8", "k1br2b1/ppKppp1B/2p3p1/8/8/8/8/8"],
        "QxQ");
    /* Willcocks, Theophilus Harding and Keym, Werner */
    testProblem("1qkB4/P1brp3/Kppp4/1p6/8/8/8/8", "QxR", "b");
    /* Bartolovic, Vojko; Gajdos, Istvan; Maslar, Zdravko */
    testProblem(["4BQrk/3ppK1p/4p1p1/8/8/8/8/8", "4B1rk/3ppKpp/4p3/8/8/8/8/8"], "QxB");
    /* Fabel, Karl */
    testProblem("8/8/8/8/8/8/P1PPP1P1/k1KQ1B2", "QxN");
    /* Christiaans, Frank */
    xtestProblem("k7/B1P1p1p1/BQ1B4/1K6/8/4B3/PPPP4/8", "QxP");
    /* Fabel, Karl */
    testProblem("8/8/8/8/8/kPP5/b1PP4/KRb5", "R-");
    /* Gajdos, Istvan */
    testProblem("1RK1kb2/1pRpppp1/b1p5/1p6/8/8/8/8", "RxQ");
    /* Willcocks, Theophilus Harding */
    testProblem("3B2Rb/2p1pkPK/3ppp1p/8/8/8/8/8", "RxR");
    /* Cross, Harold Holgate */
    testProblem(["R1qk4/K1ppRppp/pp2p3/8/8/8/8/8", "1rqk4/K1ppRppp/pp2p3/8/8/8/8/8"], "RxB");
    /* Fabel, Karl and Willcocks, Theophilus Harding */
    testProblem("2b1RK1k/1p1ppp1p/8/8/8/8/8/8", "RxN");
    /* Keym, Werner and Christiaans, Frank */
    xtestProblem("8/1N2p1p1/K7/1RP5/k2P4/B3B3/PPPP4/8", "RxP");
    /* Fabel, Karl */
    testProblem(["8/8/8/8/8/P2P4/P1kPP3/K1Bb4", "8/8/8/8/8/3P4/PPkPP3/K1Bb4"], "B-");
    /* Keym, Werner */
    // a cage can exclude B- but not BxQ vs BxR
    xtestProblem("4nb1k/p1pppKpB/1p3pp1/8/8/8/8/8", "BxQ");
    /* Willcocks, Theophilus Harding */
    testProblem(["5kb1/2pRRp2/3ppKpp/8/8/8/8/8", "8/5ppb/6p1/8/8/8/8/8"], "BxR", "b",
        {'extraDepth': 4});
    /* Bartolovic, Vojko; Gajdos, Istvan; Maslar, Zdravko */
    testProblem(["4BBrk/3ppK1p/4p1p1/8/8/8/8/8", "4B1rk/3ppKpp/4p3/8/8/8/8/8"], "BxB");
    /* Hoeg, Niels */
    testProblem(["8/8/8/8/1P6/kP6/2PP4/KBb5", "8/8/8/8/8/1PP5/2PP4/1B6", "8/8/8/8/1P6/kP6/BrPP4/K1b5"], "BxN");
    /* Caillaud, Michel */
    testProblem("8/8/8/P7/RP6/K1PP4/1BqRP3/1kBB4", "BxP");
    /* Willcocks, Theophilus Harding */
    testProblem("8/8/8/8/8/3P4/PPkPP3/K1Nb4", "N-");
    /* Willcocks, Theophilus Harding */
    testProblem(["4BNNk/3ppKR1/4ppp1/8/8/8/8/8", "4BN1k/3ppK1p/4pp2/8/8/8/8/8", "4BN1k/3ppKRb/4ppp1/8/8/8/8/8"],
        "NxQ");
    /* Fabel, Karl */ // can solve as type B problem without specifying cage
    testProblem(["8/8/8/8/8/1P1P4/1PkPP3/K1nb4", "8/8/8/8/8/3P4/PPkPP3/K1nb4"], "NxR", "b");
    /* Willcocks, Theophilus Harding */
    testProblem(["4BNrk/3ppK1p/6pp/8/8/8/8/8", "4B1rk/3ppKpp/6p1/8/8/8/8/8"], "NxB");
    /* August, Hugo; Brandis, Albrecht; Dawson, Thomas R. */
    testProblem(["8/8/8/8/8/8/PPkPP3/K1nb4", "8/8/8/8/8/8/PPkPP3/K1Rb4"], "NxN", "b");
    /* Bartolovic, Vojko; Maslar, Zdravko */
    testProblem("5k1K/3pRP2/4pRqN/5prb/6p1/8/8/8", "NxP");
    /* Fabel, Karl */
    testProblem("8/8/8/8/8/1P1P4/PPprP3/k1K5", "P-", "b");
    /* Keym, Werner */
    testProblem(["k1KB4/PpRpp1p1/b1p2p2/1p6/8/8/8/8", "2K5/1p1pppp1/1pp5/8/8/8/8/8", "k1KB4/rpRpppp1/b1p5/1p6/8/8/8/8"],
        "PxQ");
    /* Willcocks, Theophilus Harding */
    testProblem(["5kbK/3pRp1P/4pp1P/6p1/8/8/8/8", "5k1K/3pRpp1/4p3/8/8/8/8/8", "5kb1/3pRp2/4ppp1/8/8/8/8/8", "5kbK/3pRp2/4pp1p/8/8/8/8/8"],
        "PxR");
    /* Dawson, Thomas R. */
    testProblem("k1Kb4/PpRpp3/b1p5/1p6/8/8/8/8", "PxB");
    /* Willcocks, Theophilus Harding */
    testProblem(["5k1K/3pRp1P/4p1pP/7p/8/8/8/8", "5k1K/3pRpp1/4p3/8/8/8/8/8"], "PxN");
    /* Frolkin, Andrej; Keym, Werner */
    testProblem("7k/5BpP/6PP/5BK1/6BP/7P/6P1/8", "PxP");
    /* Keym, Werner */
    // This one needs extraDepth of 7
    testProblem(["1Qn5/2PPpp2/kPKpp3/p1p5/8/8/8/8", "1rn5/P1PPpp2/kPKpp3/p1p5/8/8/8/8"], "P-=Q", "w", {'extraDepth': 7});
    /* Cross, Harold Holgate */
    testProblem("Q1n1Kb2/B1kppppp/1prp4/2p5/8/8/8/8", "PxQ=Q");
    /* Willcocks, Theophilus Harding */
    testProblem("4bKQ1/3prB2/4pRPk/5ppp/8/8/8/8", "PxR=Q");
    /* Willcocks, Theophilus Harding */
    testProblem(["4BQrr/pp1ppK1k/2p1p1pp/8/8/8/8/8", "8/pppppKp1/4p1p1/8/8/8/8/8", "4Bnrr/pppppK1k/4p1pp/8/8/8/8/8"],
        "PxB=Q");
    /* Willcocks, Theophilus Harding */ // can solve as type B problem without specifying cage
    testProblem(["4BQ1q/3ppK1k/4pp1p/8/8/8/8/8", "4BQ1q/3ppKpk/4p2p/8/8/8/8/8"], "PxN=Q");
    /* Keym, Werner */
    testProblem("bRr1B3/k1pKpp2/ppp5/8/8/8/8/8", "P-=R");
    /* Mortensen, Jan */
    testProblem(["k1KQRb2/ppppp1p1/5p2/7p/8/8/8/8", "k1KQrb2/ppppp1p1/5p2/8/8/8/8/8", "k1KQnb2/ppppp1p1/5p2/8/8/8/8/8"],
        "PxQ=R");
    /* Keym, Werner */
    xtestProblem("1RbRRK1k/1p1ppppp/2p5/8/8/8/8/8", "PxR=R");
    /* Keym, Werner */
    testProblem(["RK1k4/r1ppRpp1/pp2p2p/8/8/8/8/8", "1K6/1ppp1ppp/p3p3/8/8/8/8/8", "1K6/1ppp1ppp/1p2p3/8/8/8/8/8", "nK1k4/r1ppRppp/pp2p3/8/8/8/8/8"],
        "PxB=R");
    /* Fabel, Karl */
    testProblem("3BRK1k/2p1pp1p/8/8/8/8/8/8", "PxN=R");
    /* Røpke, Vilhelm */
    testProblem("3Brk1K/2p1pp1p/8/8/8/8/8/8", "P-=B");
    /* Keym, Werner */
    testProblem("kB1K4/1p1ppppp/pB1B4/1pB5/8/8/8/8", "PxQ=B");
    /* Willcocks, Theophilus Harding */
    testProblem(["kBRB4/1pKpp1p1/1pp5/7p/8/8/8/8", "kBRB4/ppKpp3/2p5/8/8/8/8/8", "1nRB4/ppKpp3/2p5/8/8/8/8/8", "1nRB4/1pKpp3/1pp5/8/8/8/8/8"],
        "PxR=B");
    /* Kuner, Hans Theo */
    testProblem("5BBK/1p1pp1p1/5pPk/7B/5P1P/5B2/8/8", "PxB=B");
    /* Darvall, Robert J. */
    xtestProblem("KBrk4/1pppRp2/1p2p3/8/8/8/8/8", "PxN=B");
    /* Vinje, Oskar E. */
    testProblem("Nrk1K3/1pp1prp1/5p2/8/8/8/8/8", "P-=N");
    /* Bartolovic, Vojko; Maslar, Zdravko */
    testProblem("2bK1kN1/1pppprp1/5p1p/8/8/8/8/8", "PxQ=N");
    /* Willcocks, Theophilus Harding */ // can solve as type B problem without specifying cages
    testProblem(["3BN1qk/2pRK1pp/3ppp2/8/8/8/8/8", "3B1rqk/2pRKppp/3pp3/8/8/8/8/8", "3BN1qk/2pRKppp/3p1p2/8/8/8/8/8"],
        "PxR=N");
    /* Ceriani, Luigi */
    testProblem(["2bk1K1N/1ppp1p1q/p5pp/8/8/8/8/8", "2bk1K1n/1ppp1p1q/6pp/8/8/8/8/8"], "PxB=N");
    /* Willcocks, Theophilus Harding */
    testProblem("K1krNB2/p1ppp1p1/5p2/8/8/8/8/8", "PxN=N");
    /* Willcocks, Theophilus Harding */
    testProblem("7B/6p1/7P/6PP/5KPk/5B1p/7P/8", "P--");
    /* Vinje, Oskar E. */
    testProblem("8/P1p5/PN6/1P6/P1N5/Pk6/pP6/2KR4", "O-O-O");
    /* Borodatow, Leonid N. */
    testProblem("8/1p5P/6P1/5B1P/6PP/5BNk/7P/5RK1", "O-O");
});

describe("type B last move problems", function() {
    function testProblem(testPositionAndCages, solution, toRetract, parameters, func) {
        parameters = parameters ?? {};
        const extraDepth = parameters['extraDepth'] ?? defaultExtraDepth;
        if (func == null) {
            func = typeB.testSolved ? it : xit;
        }
        if (toRetract == null) {
            toRetract = "w";
        }
        let forsythe;
        if (typeof testPositionAndCages == 'string') {
            forsythe = testPositionAndCages;
        } else {
            forsythe = testPositionAndCages[0];
        }
        func(forsythe, function() {
            setEnableSeparateCaptureTracking(parameters['ENABLE_SEPARATE_CAPTURE_TRACKING'] ?? false);
            if (typeof testPositionAndCages != 'string') {
                testPositionAndCages.slice(1).forEach(addCage);
            }
            setForsythe(forsythe);
            setRetract(toRetract);
            expect(errorText[startPlay()]).toBe(errorText[error_ok]);
            const solveParameters = new SolveParameters(1, extraDepth, 10);
            const solutions = solve(solveParameters);
            expect(solutions.length).toBe(1);
            expect(solutions[0][0]).toEqual(solution);
            setEnableSeparateCaptureTracking(false);
        });
    }

    function xtestProblem(testPositionAndCages, solution, toRetract, parameters) {
        if (toRetract == null) {
            toRetract = "w";
        }
        testProblem(testPositionAndCages, solution, toRetract, parameters ?? {}, typeB.testUnsolved ? it : xit);
    }

    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
        jasmine.addCustomEqualityTester(matchMoveTypeWithMove);
    });

    afterEach(function() {
        clearCages();
    });

    /* Mortensen, Jan */
    testProblem("8/8/8/8/1k6/8/K7/bn6", "K-");
    /* Ceriani, Luigi */
    testProblem("3bkN1K/pppprp1p/4p1p1/8/8/8/8/8", "KxQ");
    /* Mortensen, Jan */
    testProblem("8/8/8/8/1p6/bk6/8/nK6", "KxR");
    /* Mortensen, Jan and Borodatow Leonid N. */
    testProblem("2rk4/Kpp5/8/8/8/8/8/8", "KxB");
    /* Mortensen, Jan */
    testProblem("6b1/7p/8/8/8/8/8/K1k5", "KxN");
    /* Mortensen, Jan */
    testProblem("8/8/8/1q1r4/q7/2K5/8/2k5", "KxP");
    /* Buchanan, Andrew */
    testProblem(["Qb6/1rp5/ppK1k3/8/8/8/8/8", "qb6/Qrp5/pp6/8/8/8/8/8", "rb6/Qrp5/pp6/8/8/8/8/8",
        "bb6/Qrp5/pp6/8/8/8/8/8", "nb6/Qrp5/pp6/8/8/8/8/8", "1b6/Prp5/pp6/8/8/8/8/8"], "Q-");
    /* Willcocks, Theophilus Harding and Keym, Werner */
    testProblem("1qkB4/P1brp3/Kppp4/1p6/8/8/8/8", "QxR", "b");
    /* Mortensen, Jan */
    testProblem("qQK1k3/p1p5/1p6/8/8/8/8/8", "QxN");
    /* Bartolovic, Vojko; Buljan, Rudolf */
    testProblem("7r/pp1p2nQ/5k1K/p6n/4p3/p7/p6P/8", "QxP");
    /* Hildebrand, Alexander */
    testProblem(["8/8/8/6k1/8/5pKP/5PP1/6bR", "8/8/8/8/8/7P/5PPR/6bq", "8/8/8/8/8/7P/5PPR/6br"], "R-");
    /* Gajdos, Istvan */
    testProblem("1RK1kb2/1pRpppp1/b1p5/1p6/8/8/8/8", "RxQ");
    /* Willcocks, Theophilus Harding */
    testProblem("3B2Rb/2p1pkPK/3ppp1p/8/8/8/8/8", "RxR");
    /* Bartolovic, Vojko; Buljan, Rudolf */
    testProblem("8/8/8/8/6PP/5Prk/4Pr2/5bRK", "RxB");
    /* Mortensen, Jan */
    testProblem("qRK1k3/p1p5/1p6/8/8/8/8/8", "RxN");
    /* Bartolovic, Vojko; Buljan, Rudolf; Maslar, Zdravko */
    testProblem("6kB/4pR1p/5ppK/8/8/8/8/8", "B-");
    /* Keym, Werner */
    testProblem(["4KBBk/2prpp2/3p2pp/8/8/8/8/8", "5B2/4ppp1/8/8/8/8/8/8", "4KBrk/2prpp1B/3p2pp/8/8/8/8/8",
            "4KB1k/2prpp1P/3p2pp/8/8/8/8/8"], "BxQ");
    /* Varnholt, Jörn */
    testProblem("4Bb1B/3ppK1k/5ppp/8/8/8/8/8", "BxR");
    /* Bajtay, Jozsef; Hernitz, Zvonimir */
    testProblem(["8/8/8/8/8/6P1/5Pr1/3k1KBr", "8/8/8/8/8/6P1/5PrB/6br"], "BxN");
    /* Caillaud, Michel */
    testProblem("8/8/8/P7/RP6/K1PP4/1BqRP3/1kBB4", "BxP");
    /* Uppström, Rolf */
    testProblem("8/8/8/8/8/1P6/kP1PP3/N1Kb4", "N-");
    /* Bartolovic, Vojko; Buljan, Rudolf */
    testProblem(["2bk2NR/1p1ppppK/7p/8/8/8/8/8", "2b3rR/1p1ppppK/7p/8/8/8/8/8", "6nR/4pppK/7p/8/8/8/8/8"], "NxQ");
    /* Uppström, Rolf */
    testProblem("4bk1N/3pp1pK/6p1/8/8/8/8/8", "NxR");
    /* Bartolovic, Vojko; Maslar, Zdravko */
    testProblem("5k1K/3pRP2/4pRqN/5prb/6p1/8/8/8", "NxP");
    /* Dawson, Thomas R. */
    testProblem("K7/P1k5/8/8/8/8/8/8", "P-");
    /* Bartolovic, Vojko; Grinblat, Uri */
    testProblem("BbK1k3/Pp2ppp1/p1p5/1p6/8/8/8/8", "PxQ");
    /* Dawson, Thomas R. */
    testProblem("k1Kb4/PpRpp3/b1p5/1p6/8/8/8/8", "PxB");
    /* Mortensen, Jan */
    testProblem("BK1k4/Pp6/p7/8/8/8/8/8", "PxN");
    /* Cate, Pieter; Egmont, S.; Fabel, Karl; Hernitz, Zvonimir; Hildebrand, Alexander;
        Vorgic, Veljko */
    testProblem("QKn5/1p6/1k6/8/p7/8/8/8", "P-=Q");
    /* Keym, Werner */
    testProblem(["nQr1B3/1ppKpp2/kp6/8/8/8/8/8", "nrr1B3/1ppKpp2/1p6/8/8/8/8/8", "1b6/1pp5/1p6/8/8/8/8/8"],
        "PxQ=Q");
    /* Mortensen, Jan; Keym, Werner */
    testProblem(["4n1QB/4p1pK/4pkpp/8/8/8/8/8", "6nB/4p1pK/6pp/8/8/8/8/8"], "PxR=Q");
    /* Mortensen, Jan */
    testProblem(["KQb5/Rp1p4/p1pp4/k7/8/8/8/8", "Knb5/Rp1p4/p1p5/8/8/8/8/8"], "PxB=Q");
    /* Abdurahmanovic, Fadil; Bartolovic, Vojko; Birek, Vladimir; Buljan, Rudolf;
        Cate, Pieter; Ehrlich, Dov; Grinblat, Uri; Hernitz, Zvonimir; Hildebrand, Alexander;
        Maslar, Zdravko; Myllyniemi, Matti Arvo; Tucakov, Jozo */
    testProblem(["KQn5/1pp5/kp6/8/8/8/8/8", "1b6/1pp5/1p6/8/8/8/8/8"], "PxN=Q");
    /* Abdurahmanovic, Fadil; Bartolovic, Vojko; Birek, Vladimir; Cate, Pieter;
        Egmont, S.; Ehrlich, Dov; Gajdos, Istvan; Grinblat, Uri; Hernitz, Zvonimir;
        Hillel, Yechezkel; Maslar, Zdravko; Myllyniemi, Matti Arvo; Ruppin, Rafi; Vorgic,
        Veljko */
    testProblem("4n1RK/5k1p/6p1/8/8/8/8/8", "P-=R");
    /* Keym, Werner */
    testProblem(["nRr1B3/1ppKpp2/kp6/8/8/8/8/8", "nrr1B3/1ppKpp2/1p6/8/8/8/8/8", "1b6/1pp5/1p6/8/8/8/8/8"],
        "PxQ=R");
    /* Mortensen, Jan; Keym, Werner */
    testProblem(["k4BRB/4p1pK/6pp/8/8/8/8/8", "6nB/4p1pK/6pp/8/8/8/8/8"], "PxR=R");
    /* Mortensen, Jan */
    testProblem(["k4bRK/4p1pR/5p1p/8/8/8/8/8", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "PxB=R");
    /* Mortensen, Jan; Keym, Werner */
    testProblem(["KRn5/1pp5/kp6/8/8/8/8/8", "1b6/1pp5/1p6/8/8/8/8/8"], "PxN=R");
    /* Mortensen, Jan */
    testProblem("B7/1p6/8/8/8/8/5k1P/7K", "P-=B");
    /* Mortensen, Jan; Keym, Werner */
    testProblem("5nBK/ppppp1p1/4npkp/8/8/8/8/8", "PxQ=B");
    /* Bartolovic, Vojko */
    testProblem(["RBk5/Kp1p3p/pp1p3p/8/8/8/8/8", "Rn6/Kp1p4/pp6/8/8/8/8/8"], "PxR=B");
    /* Mortensen, Jan */
    testProblem(["KBb5/Rp1p4/p1pp4/k7/8/8/8/8", "Knb5/Rp1p4/p1p5/8/8/8/8/8"], "PxB=B");
    /* Mortensen, Jan */
    testProblem("4nbBr/4pKp1/7p/5k2/8/8/8/8", "PxN=B");
    /* Bartolovic, Vojko; ten Cate, Pieter; Egmont, S. */
    testProblem("6NK/4pk1p/5p2/8/8/8/8/8", "P-=N");
    /* Bartolovic, Vojko; Maslar, Zdravko */
    testProblem("2bK1kN1/1pppprp1/5p1p/8/8/8/8/8", "PxQ=N");
    /* Mortensen, Jan */
    testProblem(["BNk5/Kp1p4/ppb5/8/8/8/8/8", "Bn6/Kp1p4/pp6/8/8/8/8/8"], "PxR=N");
    /* Mortensen, Jan */
    testProblem(["k4bNK/4p1pR/5p1p/8/8/8/8/8", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "PxB=N");
    /* Fabel, Karl */
    testProblem(["5KN1/3kppp1/6pn/8/8/8/8/8", "6b1/5pp1/6p1/8/8/8/8/8"], "PxN=N");
    /* Mortensen, Jan */
    testProblem("8/8/8/8/Pk6/1q6/2q5/K7", "P--");
    /* Mortensen, Jan */
    testProblem("4k3/8/8/8/8/n7/1r1P4/2KR1n2", "O-O-O");
    /* Mortensen, Jan */
    testProblem("8/8/8/8/4k3/7p/5n1r/3n1RK1", "O-O");
});

describe("type C last move problems", function() {
    function testProblem(testPositionAndCages, solution, parameters, func) {
        parameters = parameters ?? {};
        const extraDepth = parameters['extraDepth'] ?? defaultExtraDepth;
        if (func == null) {
            func = typeC.testSolved ? it : xit;
        }
        let forsythe;
        if (typeof testPositionAndCages == 'string') {
            forsythe = testPositionAndCages;
        } else {
            forsythe = testPositionAndCages[0];
        }
        func(forsythe, function() {
            setEnableSeparateCaptureTracking(parameters['ENABLE_SEPARATE_CAPTURE_TRACKING'] ?? false);
            if (typeof testPositionAndCages != 'string') {
                testPositionAndCages.slice(1).forEach(addCage);
            }
            setForsythe(forsythe);
            setRetract("w");
            expect(errorText[startPlay()]).toBe(errorText[error_ok]);
            expect(isInCheck("b")).toBe(true);
            const solveParameters = new SolveParameters(1, extraDepth, 10);
            const solutions = solve(solveParameters);
            expect(solutions.length).toBe(1);
            expect(solutions[0][0]).toEqual(solution);
            setEnableSeparateCaptureTracking(false);
        });
    }

    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
        jasmine.addCustomEqualityTester(matchMoveTypeWithMove);
    });

    afterEach(function() {
        clearCages();
    });

    function xtestProblem(testPositionAndCages, solution, parameters) {
        testProblem(testPositionAndCages, solution, parameters ?? {}, typeC.testUnsolved ? it : xit);
    }

    /* Stambuk, Sveto */
    testProblem("8/8/8/8/4k3/8/4pK2/5b1B", "K-");
    /* Keym, Werner */
    testProblem("n1k2Rn1/BppppKp1/1p3p1p/8/8/8/8/8", "KxQ");
    /* Pavlovic, Branko */
    testProblem("k7/8/1K6/8/b7/1p6/8/7B", "KxR");
    /* Pavlovic, Branko */
    testProblem("k7/p1K5/r7/P7/8/8/8/7B", "KxB");
    /* Pavlovic, Branko */
    testProblem("b7/8/6k1/8/5K2/8/P7/1B6", "KxN");
    /* Pavlovic, Branko */
    testProblem("8/8/8/4b1r1/7B/5K2/8/4k3", "KxP");
    /* Pavlovic, Branko and Borodatow, Leonid. N. */
    testProblem("8/8/8/8/4P3/7P/5P1k/5K1Q", "Q-");
    /* Stambuk, Sveto */
    testProblem(["k7/QRp1K3/1p6/pP6/8/8/8/8", "k7/bRp5/1p6/8/8/8/8/8"], "QxQ");
    /* Niemann, John; Ceriani, Luigi; Stambuk, Sveto */
    testProblem("Qk6/1PR5/1K6/p7/8/8/8/8", "QxR");
    /* Bartolovic, Vojko; Slezinger, M.; Mortensen, Jan; Slipcevic, Boris */
    testProblem("8/8/8/8/6P1/5PKN/4P2Q/7k", "QxB");
    /* Kahl, Klaus Peter; Mortensen, Jan; Suboticanec, Drazen */
    testProblem("8/8/8/8/7P/6P1/5K1Q/7k", "QxN");
    /* Bartolovic, Vojko; Slezinger, M.; Mortensen, Jan; Presic, S. */
    testProblem("8/8/8/P7/1P6/1KP5/Q1P5/kB6", "QxP");
    /* Niemann, John; Bartolovic, Vojko; Slezinger, M.; Ceriani, Luigi; Tucakov,
        Jozo; Mortensen, Jan; Slipcevic, Boris; Buljan, Rudolf; Suboticanec, D.; Stambuk,
        Sveto */
    testProblem("8/8/8/8/8/5P1P/5P1k/5K1R", "R-");
    /* Mortensen, Jan; Stambuk, Sveto */
    testProblem(["k7/R1p1K3/Rp6/1P6/8/8/8/8", "k7/bRp5/1p6/8/8/8/8/8"], "RxQ");
    /* Stambuk, Sveto */
    testProblem("Rk6/1PR5/1K6/P7/8/8/8/8", "RxR");
    /* Cross, William */
    testProblem("5K1k/7R/5BPP/6P1/8/8/8/8", "RxB");
    /* Pavlovic, Branko */
    testProblem("8/8/8/8/8/6P1/6Pk/5K1R", "RxN");
    /* Pavlovic, Branko */
    testProblem("8/8/8/8/PP6/1KB5/R7/kN6", "RxP");
    /* Niemann, John; Bartolovic, Vojko; Slezinger, M.; Mortensen, Jan; Slipcevic,
        Boris; Buljan, Rudolf; Skunca, I.; Stambuk, Sveto */
    testProblem("8/8/8/8/8/5R2/4NR1k/5K1B", "B-");
    /* Keym, Werner */
    testProblem(["4R2k/4ppBB/6pp/7P/3K4/8/8/8", "5B1k/4pprB/6pp/8/8/8/8/8"], "BxQ");
    /* Bartolovic, Vojko; Slezinger, M. */
    testProblem("8/8/8/8/8/PPP5/k2R4/bBK5", "BxR");
    /* Stambuk, Sveto */
    testProblem("2K5/BN6/R1k5/pp1R4/8/8/8/8", "BxB");
    /* Slipcevic, Boris; Buljan, Rudolf */
    testProblem("8/8/8/8/8/4P3/6Pk/5KBN", "BxN");
    /* Stambuk, Sveto */
    testProblem("8/8/8/3K4/8/P7/BN1R4/R1k5", "BxP");
    /* Stambuk, Sveto and Keym, Werner */
    testProblem("3K3N/6pk/7P/8/8/8/B7/1B6", "N-");
    /* Ceriani, Luigi */
    testProblem(["BNN5/1ppp4/kp6/8/1K6/8/8/8", "1b6/1pp5/1p6/8/8/8/8/8"], "NxQ");
    /* Bartolovic, Vojko; Slezinger, M.; Ceriani, Luigi; Mortensen, Jan; Slipcevic,
        Boris; Buljan, Rudolf; Stambuk, Sveto */
    testProblem("8/8/8/8/8/8/5kPK/4RN1N", "NxR");
    /* Keym, Werner */
    testProblem("8/8/8/8/3P4/PPk5/NN6/2K5", "NxB");
    /* Bartolovic, Vojko; Slezinger, M.; Ceriani, Luigi; Slipcevic, Boris; Buljan,
        Rudolf */
    testProblem("6kN/6PN/8/8/8/8/B7/1K6", "NxN");
    /* Stambuk, Sveto */
    testProblem("8/8/4K3/8/7P/4B1PN/6BN/6k1", "NxP");
    /* Hoeg, Niels */
    testProblem("8/8/6k1/7P/6K1/8/8/8", "P-");
    /* Willcocks, Theophilus Harding */
    testProblem(["5B1k/2K1ppPB/6pp/5P1P/8/8/8/8", "5B1k/4pprB/6pp/8/8/8/8/8"], "PxQ");
    /* Pavlovic, Branko */
    testProblem("5Nkn/5p1P/5K1P/6P1/8/8/8/8", "PxR");
    /* Stambuk, Sveto */
    testProblem("2K5/PN6/R1k5/pp1R4/8/8/8/8", "PxB");
    /* Ceriani, Luigi; Mortensen, Jan; Slipcevic, Boris; Buljan, Rudolf; Suboticanec,
        D.; Skunca, I.; Stambuk, Sveto */
    testProblem("6kB/4K2P/7P/8/8/8/8/8", "PxN");
    /* Stambuk, Sveto */
    testProblem("3K4/8/P7/PN1R4/R1k5/pR6/8/8", "PxP");
    /* Pavlovic, Branko */
    testProblem("6KQ/6p1/7k/8/8/8/8/8", "P-=Q");
    /* Fabel, Karl; Mortensen, Jan; Suboticanec, D.; Stambuk, Sveto */
    testProblem("kQK5/1p1ppppp/R1p5/p7/8/8/8/8", "PxQ=Q");
    /* Niemann, John; Bartolovic, Vojko; Slezinger, M.; Burbach, Johannes Jacob;
        Ceriani, Luigi */
    testProblem("Qk6/2N5/PKP5/8/8/8/8/8", "PxR=Q");
    /* Skunca, I.; Stambuk, Sveto */
    testProblem("1Qk5/1N1p4/K1R5/8/8/8/8/8", "PxB=Q");
    /* Bartolovic, Vojko; Slezinger, M.; Ceriani, Luigi; Slipcevic, Boris; Buljan,
        Rudolf; Suboticanec, D.; Skunca, I.; Stambuk, Sveto */
    testProblem("Qk6/N7/2K5/8/8/8/8/8", "PxN=Q");
    /* Pavlovic, Branko */
    testProblem("6KR/6p1/7k/8/8/8/8/8", "P-=R");
    /* Frolkin, Andrej */
    testProblem(["bRk5/1RbRp3/ppKp4/8/8/8/8/8", "3b4/2p1p3/8/8/8/8/8/8", "brk5/PRbRp3/pp1p4/8/8/8/8/8", "bbk5/PRbRp3/pp1p4/8/8/8/8/8"],
        "PxQ=R");
    /* Ceriani, Luigi */
    testProblem("6KR/5p2/6Pk/6R1/6P1/8/8/8", "PxR=R");
    /* Skunca, I.; Stambuk, Sveto */
    testProblem("5kR1/4p1N1/5R1K/8/8/8/8/8", "PxB=R");
    /* Niemann, John; Bartolovic, Vojko; Slezinger, M.; Ceriani, Luigi; Suboticanec,
        D.; Stambuk, Sveto; Vuckovic, Vladan */
    testProblem("6kR/4K2p/8/8/8/8/8/8", "PxN=R");
    /* Hoeg, Niels */
    testProblem("2B5/1K1k4/8/8/8/8/8/8", "P-=B");
    /* Ceriani, Luigi */
    testProblem("2BR1b2/p1prp1p1/kp1p4/8/K7/8/8/8", "PxQ=B");
    /* Keym, Werner */
    testProblem("BK6/2NR4/BPk5/2P5/8/8/8/8", "PxR=B");
    /* Bartolovic, Vojko; Slezinger, M. */
    testProblem(["5bBK/4p1pR/5p1p/3k4/8/8/8/8", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "PxB=B");
    /* Stambuk, Sveto */
    testProblem("6BB/7p/8/8/8/8/P7/k1K5", "PxN=B");
    /* Pavlovic, Branko */
    testProblem("6NB/8/5k1K/8/8/8/8/8", "P-=N");
    /* Borodatow, Leonid. */
    testProblem("rN3b2/pp1pp1p1/k1p5/P1K5/8/8/8/8", "PxQ=N");
    /* Keym, Werner */
    testProblem("6KN/5R2/6kN/6Pp/8/8/8/8", "PxR=N");
    /* Niemann, John; Stambuk, Sveto */
    testProblem("5RN1/4p1N1/5k1K/4R3/8/8/8/8", "PxB=N");
    /* Bartolovic, Vojko; Slezinger, M.; Vuckovic, Vladimir */
    testProblem("6RN/4pk1R/8/5K2/8/8/8/8", "PxN=N");
    /* Pavlovic, Branko */
    testProblem("8/8/8/8/5P1k/8/3K4/4B3", "P--");
    /* Hoeg, Niels */
    testProblem("8/3K4/4Pk2/8/8/8/8/B7", "ep");
    /* Pavlovic, Branko */
    testProblem("8/8/8/8/8/8/3P4/2KR2k1", "O-O-O");
    /* Pavlovic, Branko */
    testProblem("8/8/8/8/8/8/5P2/2k2RK1", "O-O");
});

describe("type D last move problems", function() {
    function testProblem(testPositionAndCages, solution1, solution2, parameters, func) {
        parameters = parameters ?? {};
        const extraDepth = parameters['extraDepth'] ?? defaultExtraDepth;
        if (func == null) {
            func = typeD.testSolved ? it : xit;
        }
        let forsythe;
        if (typeof testPositionAndCages == 'string') {
            forsythe = testPositionAndCages;
        } else {
            forsythe = testPositionAndCages[0];
        }
        func(forsythe, function() {
            setEnableSeparateCaptureTracking(parameters['ENABLE_SEPARATE_CAPTURE_TRACKING'] ?? false);
            if (typeof testPositionAndCages != 'string') {
                testPositionAndCages.slice(1).forEach(addCage);
            }
            const solveParameters = new SolveParameters(1, extraDepth, 2);

            setForsythe(forsythe);
            setRetract("w");
            expect(errorText[startPlay()]).toBe(errorText[error_ok]);
            const solutionsWhite = solve(solveParameters);
            expect(solutionsWhite.length).toBe(1);
            stopPlay();
            setRetract("b");
            expect(errorText[startPlay()]).toBe(errorText[error_ok]);
            const solutionsBlack = solve(solveParameters);
            expect(solutionsBlack.length).toBe(1);
            setEnableSeparateCaptureTracking(false);
        });
    }

    beforeAll(function() {
        initializeBoard();
    });

    beforeEach(function() {
        clearBoard();
    });

    afterEach(function() {
        clearCages();
    });

    function xtestProblem(testPositionAndCages, solution1, solution2, parameters) {
        testProblem(testPositionAndCages, solution1, solution2, parameters ?? {}, typeD.testUnsolved ? it : xit);
    }

    /* Andrew Buchanan */
    xtestProblem("BK6/Bpp5/1p6/8/8/1P6/bPP5/bk6", "K-", "K-");
    /* Andrew Buchanan */
    testProblem("k2KRn1n/pppppp1p/6p1/8/8/8/8/8", "K-", "KxN");
    /* Werner Keym */
    xtestProblem("n1K5/k1pp4/Pp6/1p6/qP6/pP6/p1PP4/8", "K-", "Q-");
    /* Werner Keym */
    xtestProblem("k7/Pppp4/rp6/1K6/1P6/pP6/p1PP4/8", "K-", "R-");
    /* Werner Keym */
    xtestProblem("k7/P1pp4/Pp6/1p6/8/1P6/bPPP4/2K5", "K-", "B-");
    /* Mario Richter */
    testProblem("5K1N/3prppk/4p2p/8/8/8/8/8", "K-", "N-");
    /* Mario Richter */
    testProblem("8/8/8/8/8/5PPP/3PPKpk/4Bn1B", "K-", "NxR");
    /* Werner Keym */
    testProblem("8/1p6/p7/8/8/PP6/1PkPP3/KR1b4", "K-", "P-");
    /* Werner Keym */
    testProblem(["8/7p/7p/8/8/PP4P1/1PkPPP1P/KR1bRN1N", "8/8/8/8/8/1P6/PPkPP3/KR1b4",
        "8/8/8/8/8/PP6/KPkPP3/bR1b4", "8/8/8/8/8/PP6/KPkPP3/nR1b4"], "K-", "PxQ");
    /* Mario Richter */
    testProblem("8/8/8/8/8/1PPP4/KpPRP3/Bnk5", "K-", "PxN");
    /* Werner Keym */
    testProblem(["8/8/8/8/7P/5PPR/3PPk1K/4bqr1", "8/8/8/8/7P/6PR/3PPkPK/4bqr1"], "K-", "PxN=Q");
    /* Andrew Buchanan, Werner Keym */
    xtestProblem("5bKR/4p1pR/5p1p/8/7P/6P1/4P1Pk/5Brr", "K-", "PxN=R");
    /* Werner Keym */
    testProblem("8/8/8/8/8/PP6/1PkPP1P1/KR1b1b2", "K-", "P-=B");
    /* Bernd Schwarzkopf, Werner Keym */
    xtestProblem("7k/3pp1pP/6PP/5pKp/7B/6P1/4PP1p/8", "K-", "P--");
    /* Werner Keym */
    testProblem("8/p7/8/8/8/1P1PkPP1/bPPR1RPN/2KR1QB1", "K-", "O-O-O");
    /* Werner Keym, Bernd Schwarzkopf */
    xtestProblem("8/5ppp/8/8/6P1/3PkPPp/1PPR1RPr/2BQ1RK1", "K-", "O-O");
    /* Bernd Schwarzkopf, Werner Keym */
    testProblem(["nnrNK2k/Bbrpp2p/ppp5/8/8/1P6/P1PPPPPP/N7", "nnrb4/Bbrpp3/ppp5/8/8/8/8/8"],
        "KxQ", "KxQ");
    /* Andrew Buchanan,Bernd Schwarzkopf  */
    testProblem("2bbk2K/pppprp1p/4p1p1/8/8/8/8/8", "KxQ", "KxN");
    /* Jorge Lois & Roberto Osorio */
    testProblem(["nBqb4/K1Bpp3/1ppp4/8/8/1PPP4/k1bPP3/NbQB4",
        "nBqb4/KpBpp3/1p1p4/8/8/8/8/8", "8/8/8/8/8/1P1P4/kPbPP3/NbQB4"], "KxR", "KxR");
    /* Jorge Lois & Roberto Osorio */
    testProblem("8/8/8/8/8/1PPP4/k1KPP3/BnQB4", "KxR", "B-");
    /* Werner Keym */
    testProblem("4B2q/3ppKpp/8/8/8/8/PPkPP3/Q2b4", "KxB", "KxB");
    /* Bernd Schwarzkopf */
    testProblem(["8/8/8/8/8/3P1P2/1PPRPrPP/2B1k2K", "8/8/8/8/8/5P2/1PPPP1PP/5k2", "8/8/8/8/8/3P1P2/1PP1PrPP/4Nk1K"],
        "KxB", "KxN");
    /* Mario Richter */
    testProblem("8/8/8/8/8/PP6/KPkPP3/R2b4", "KxB", "R-");
    /* Werner Keym */
    testProblem("3B2qk/2ppKppp/p7/8/8/8/8/8", "KxB", "P-");
    /* Mario Richter  */
    testProblem("8/8/8/8/8/P7/KPkPP1P1/2qb1b2", "KxB", "P-=B");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/4P3/2PPRPPP/3BK2k", "KxN", "KxN");
    /* Bernd Schwarzkopf */
    testProblem(["rk2NRB1/prpppKpp/1p3p2/8/8/8/8/8", "4nRB1/2pppKpp/5p2/8/8/8/8/8"], "KxN", "NxQ");
    /* U. Grinblat */
    testProblem(["RNk5/Kppp4/p7/8/8/8/8/8", "Rnk5/Kppp4/p7/8/8/8/8/8"], "KxN", "NxR");
    /* Bernd Schwarzkopf  */
    testProblem(["8/8/8/8/6PP/5PRQ/1P1PPRRB/4Knrk", "8/8/8/8/6PP/5PRQ/4PRRB/5Brk"], "KxN", "NxN");
    /* Bernd Schwarzkopf, Werner Keym */
    testProblem(["2bk1bRK/1pppp1pR/5p1p/8/8/8/8/8", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "KxN", "PxB=R");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/2P2P1P/PP1PPRP1/K1Brk3", "KxN", "PxN=R");
    /* Hans Gruber, Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/8/kPPP1P2/bRK1b3", "KxN", "P-=B");
    /* Bernd Schwarzkopf, Werner Keym */
    testProblem(["2bk1bNK/1pppp1pR/5p1p/8/8/8/8/8", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "KxN", "PxB=N");
    /* Werner Keym */
    xtestProblem("4bb2/2pppkpP/6Rb/6rQ/5KRp/4PbB1/1P2PrPN/5B2", "KxP", "KxP");
    /* Thierry LE GLEUHER */
    testProblem("8/8/8/8/1P6/kPPP4/qRbrP3/1QKB4", "Q-", "Q-");
    /* Thierry LE GLEUHER */
    testProblem("8/8/8/8/1P6/kPPP4/rRbrP3/1QKB4", "Q-", "R-");
    /* Thierry LE GLEUHER */
    testProblem("8/8/8/8/1P6/kPPP4/brrRP3/K1QB4", "Q-", "B-");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/3PPkPP/2PPpBbb/4K1Qn", "Q-", "BxN");
    /* Thierry LE GLEUHER */
    testProblem("8/8/8/8/1P6/kPPP4/nRbrP3/KQ1B4", "Q-", "N-");
    /* Werner Keym */
    testProblem("8/6p1/7p/8/8/4PPPk/3PPprb/5KQ1", "Q-", "P-");
    /* Mario Richter */
    testProblem("4bKQq/3prB2/4pRPk/5ppp/8/8/8/8", "Q-", "P-=Q");
    /* Werner Keym */
    testProblem("8/8/8/8/8/4PPPk/2P1PprP/3b1K1Q", "Q-", "P-=B");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/8/8/8/5PP1/1PPPkrqB/bPPR1rPN/2KR1QB1", "Q-", "O-O-O");
    /* Werner Keym, Bernd Schwarzkopf */
    xtestProblem("8/5ppp/8/8/4PPP1/2PPkrqp/1PrR1RPr/2BQ1RK1", "Q-", "O-O");
    /* Jorge Lois & Roberto Osorio */
    xtestProblem("n1b5/1ppp4/1p6/8/8/3P2PP/1PPkPPRr/bQ3QKn", "QxQ", "P-=B");
    /* Werner Keym */
    xtestProblem("8/8/8/8/8/3PPPP1/1PPrBKPk/2Br1Q1N", "QxR", "RxN");
    /* Werner Keym */
    testProblem("8/8/8/8/8/2P1PPPP/PPRbPK1p/1BRr1QNk", "QxB", "R-");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/6P1/PPPP1PRP/q1QK1k2", "QxN", "QxN");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/6P1/PPPP1PRP/r1QK1k2", "QxN", "RxN");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/3P1P2/PP1PPRP1/KQBrk3", "QxN", "PxN=R");
    /* Werner Keym */
    xtestProblem("6nK/3ppp1Q/5Pqr/5prB/5Pbn/4PrrR/3PRQRq/4B2k", "QxP", "QxP");
    /* Thierry LE GLEUHER */
    testProblem("8/8/8/8/1P6/kPPP4/rRbrP3/1RKB4", "R-", "R-");
    /* Werner Keym */
    testProblem("2bq2rr/1pppRK1P/4pRPk/5ppp/8/8/6PP/8", "R-", "RxR");
    /* Thierry LE GLEUHER */
    testProblem("8/8/8/8/1P6/kPPP4/brrRP3/K1RB4", "R-", "B-");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/7P/4PPkr/3PP1bR/4bRKn", "R-", "N-");
    /* Mario Richter  */
    testProblem("8/1p6/p7/8/8/kPP5/b1PP4/KRb5", "R-", "P-");
    /* Mario Richter */
    testProblem("rQn5/2PPpp2/kPKpp3/p1p5/8/8/8/8", "R-", "P-=Q");
    /* Mario Richter  */
    testProblem("8/8/8/8/8/kPP5/b1PP1P2/KRb1b3", "R-", "P-=B");
    /* Werner Keym */
    testProblem("8/p7/8/8/8/1PPPkPP1/bPPR1rPB/2KR1nQN", "R-", "O-O-O");
    /* Werner Keym */
    xtestProblem("8/5p1p/6p1/8/5PP1/2PPkrPp/1PRr1RPr/2BQ1RK1", "R-", "O-O");
    /* Roberto Osorio, Jorge Lois, Andrew Buchanan, Mario Richter */
    testProblem("8/4p1p1/8/8/8/1P1P1P2/bPP1PRPP/bkr1RKB1", "RxQ", "RxQ");
    /* Roberto Osorio & Jorge Lois */
    testProblem("8/5p1p/8/8/8/P3P1P1/rPPPRP1P/Qqk1KR1r", "RxB", "RxB");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/P7/KPkPP3/R1rb4", "RxN", "RxN");
    /* Günter Eder, Günter Büsing, Hans Peter Rehm, Hemmo Axt */
    testProblem("8/8/8/8/1P6/kPP5/bRrP4/K1B5", "RxN", "B-");
    /* Werner Keym */
    xtestProblem("5bbr/2ppppnB/5p1K/5P1R/5Pqr/4PrQR/3PRQ1r/4B2k", "RxP", "RxP");
    /* Thierry LeGleuher */
    testProblem("8/8/8/8/PP6/pkPP4/b1prP3/B1K5", "B-", "B-");
    /* W. Dittmann, Hans Gruber, Günter Büsing, B. Schwarzkopf */
    testProblem("3BbKBk/2ppr1rb/4pppp/8/8/8/8/8", "B-", "BxN");
    /* Bernd Schwarzkopf */
    testProblem("3Bb1kN/2ppK1pp/3p2p1/8/8/8/8/8", "B-", "N-");
    /* Mario Richter */
    testProblem(["8/6p1/7p/8/8/P2P4/P1kPP3/K1Bb4",
     "8/8/8/8/8/3P4/PPkPP3/K1Bb4", "8/8/8/8/8/P2P4/P1kPP3/K1nb4", "8/8/8/8/8/P2P4/P1kPP3/K1bb4"],
        "B-", "P-");
    /* Mario Richter */
    testProblem("bRr1B3/k1pKpp2/ppp5/8/8/P7/1P6/8", "B-", "P-=R");
    /* Werner Keym */
    testProblem(["8/8/8/8/8/P2P4/P1kPP1P1/K1Bb1b2", "8/8/8/8/8/3P4/PPkPP3/K1Bb4", "8/8/8/8/8/P2P4/P1kPP3/K1bb4",
        "8/8/8/8/8/P2P4/P1kPP3/K1nb4"], "B-", "P-=B");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/p7/8/8/5P2/1PPPkrb1/bPPR1RPN/2KR1QB1", "B-", "O-O-O");
    /* Werner Keym */ // so close... white O-O is okay but need to rule out Black's BxQ? due to a cage involving uncapturing on e2
    xtestProblem("8/8/8/8/6P1/2PPkPPB/1PrR1RPr/2Bb1RK1", "B-", "O-O");
    /* Roberto Osorio, Jorge Lois, Werner Keym */
    xtestProblem("8/1p2p2p/8/8/7P/P1PP1PPR/P1PkpKpp/B1brnRnr", "BxQ", "BxQ");
    /* Mario Richter */
    testProblem("4BB1b/3pRK1k/4pppp/8/8/8/8/8", "BxR", "BxR");
    /* Mario Richter */
    testProblem("5k1K/3pRP1b/4pRqN/5prb/6p1/8/8/8", "BxR", "N-");
    /* Mario Richter */
    testProblem("4BQ1b/3ppK1k/5ppp/8/8/8/8/8", "BxR", "PxN=Q");
    /* Roberto Osorio & Jorge Lois */
    xtestProblem("7n/ppp1pp1p/2p3p1/8/8/2PPPP2/1PRQqrP1/kBRNnrbK", "BxB", "BxB");
    /* Mario Richter */
    testProblem(["4BbnB/3ppK1k/4pp1p/8/8/8/8/8", "4Bb1B/3ppKpk/4p2p/8/8/8/8/8"], "BxN", "BxN");
    /* Mario Richter */
    testProblem("8/8/8/8/8/PP1P4/1PkrP3/KbNb4", "BxN", "N-");
    /* Mario Richter */
    testProblem("4B1rb/1p1pRKBk/p3pppp/8/8/8/8/8", "BxN", "P-");
    /* Mario Richter */
    testProblem("8/8/8/8/8/5P1P/3PPk1K/4bqnB", "BxN", "PxN=Q");
    /* Mario Richter */
    testProblem("8/8/8/8/8/5P1P/3PPk1K/4brnB", "BxN", "PxN=R");
    /* Mario Richter */
    testProblem("8/8/8/8/8/3P1P1P/2PrPP1k/4KRbB", "BxN", "P-=B");
    /* Mario Richter */
    testProblem(["4BbNr/3ppK1k/4pp1p/8/8/8/8/8", "4BbNr/3ppKpk/4p2p/8/8/8/8/8"], "BxN", "P-=N");
    /* Werner Keym */
    testProblem("8/1p6/8/8/5PP1/1PPPkrrB/brPR1RPN/2KR1QB1", "BxN", "O-O-O");
    /* Werner Keym */
    xtestProblem("5bnK/3ppp2/5PqB/5pBr/5PbR/4PrQb/2PPRQ2/4bB1k", "BxP", "BxP");
    /* Andrew Buchanan */
    testProblem("8/8/8/8/8/P2P4/KPkPP3/nnNb4", "N-", "N-");
    /* Werner Keym */
    testProblem(["8/1p6/p7/8/8/3P4/PPkPP3/K1Nb4", "8/8/8/8/8/8/PPkPP3/K1bb4", "8/8/8/8/8/3P4/PPkPP3/K1nb4"],
        "N-", "P-");
    /* Werner Keym */
    testProblem("8/8/8/8/8/P2P4/pPkPP3/K1Nb4", "N-", "PxN");
    /* Werner Keym */
    testProblem("8/8/8/8/8/4P1P1/2P1PkPP/3brN1K", "N-", "PxN=R");
    /* Werner Keym */
    testProblem(["8/8/8/8/8/3P4/PPkPP1P1/K1Nb1b2", "8/8/8/8/8/8/PPkPP3/K1bb4", "8/8/8/8/8/3P4/PPkPP3/K1nb4"],
        "N-", "P-=B");
    /* Bernd Schwarzkopf  */
    testProblem("6bN/1P3p1k/BrPPPP2/1ppppppK/7p/8/1PP5/8", "N-", "P--");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/pp6/8/8/8/1PPPkPP1/bPPR1rPn/2KR1QB1", "N-", "O-O-O");
    /* Werner Keym, Bernd Schwarzkopf */
    xtestProblem("7n/1p3ppp/8/8/6PN/2PPkPPp/1PrR1RPr/2bQ1RK1", "N-", "O-O");
    /* Roberto Osorio & Jorge Lois */
    testProblem("8/3p4/8/8/8/2P1P3/PPRPrPPP/k1KRrn1N", "NxQ", "NxQ");
    /* Mario Richter */
    testProblem("2brn1Nb/1ppRKpkB/3pp1pp/8/8/8/8/8", "NxR", "NxR");
    /* Werner Keym */
    testProblem(["8/8/8/8/8/6PP/1P1PP1PK/2BRrk1N", "8/8/8/8/8/7P/1P1PPPP1/2BRrk2"], "NxR", "PxN=R");
    /* Mario Richter */
    testProblem("8/8/8/8/8/1PPP4/nPKP1P2/k1NRb3", "NxR", "P-=B");
    /* Roberto Osorio & Jorge Lois */
    testProblem("8/5p2/8/8/8/PP2P3/pP1PrPPP/KNBnrkqQ", "NxB", "NxB");
    /* Roberto Osorio, Jorge Lois, Andrew Buchanan */
    testProblem("8/8/8/8/8/P1P5/RPrPPPPk/KBnbNQR1", "NxN", "NxN");
    /* Bernd Schwarzkopf  */
    testProblem("qbbB1KN1/pprkrBp1/2ppp1p1/7p/8/1P2P3/P1PP1PPP/8", "NxN", "P--");
    /* Werner Keym */
    xtestProblem("8/1p2pppp/p3p2B/6n1/6P1/4kPPB/1PPR1RPr/2BQ1RK1", "NxN", "O-O");
    /* Werner Keym */
    xtestProblem("6nK/1p1ppp1N/5Pqr/5prb/5PrR/4PRQn/3PRQ2/4B2k", "NxP", "NxP");
    /* Werner Keym */
    xtestProblem("5k1K/3pRP2/p3prqN/5prr/6pr/7b/6P1/8", "NxP", "P-");
    /* Wolfgang Dittmann */
    testProblem("8/8/8/8/8/4P1P1/3Prp1P/5K1k", "P-", "P-");
    /* B.Schwarzkopf, W.Keym & A.Buchanan */
    testProblem("8/8/8/8/1P6/b1P5/pPrPP3/K1kB4", "P-", "PxB");
    /* Werner Keym */
    testProblem("8/8/8/8/8/P1P1P3/pP1PrP2/bk1K4", "P-", "PxN");
    /* Werner Keym */
    testProblem("8/8/8/8/P7/1PPP4/b1KRPPPP/q1N1kB2", "P-", "PxQ=Q");
    /* Werner Keym */
    xtestProblem("8/8/8/8/1P6/4PPPP/1PPPrk1K/2BRrq1Q", "P-", "PxR=Q");
    /* Werner Keym */
    testProblem(["8/8/8/8/7P/5PPR/3PPk1K/4bq1n", "8/8/8/8/7P/6PR/3PPkPK/4bq1n"], "P-", "PxN=Q");
    /* Mario Richter */
    // This one needs extraDepth of 4
    testProblem("bRr1B3/k1pKpp1p/ppp3p1/8/8/8/8/8", "P-", "P-=R", {'extraDepth': 4});
    /* Werner Keym */
    testProblem(["8/8/8/8/7P/5PPR/3PPk1K/4brnn", "8/8/8/8/7P/6PR/3PPkPK/4brnn"], "P-", "PxN=R");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/6P1/2P1PP1P/3bRK1k", "P-", "P-=B");
    /* Bernd Schwarzkopf */
    testProblem("8/8/8/8/8/5P1P/1PP1PRP1/nRK1k3", "P-", "P-=N");
    /* Werner Keym */
    testProblem(["8/8/8/8/8/P4P1P/1PPPPRP1/2Bk1Kn1", "8/8/8/8/8/5P2/1PPPP1PP/3k4", "8/8/8/8/8/5P1P/1PPPPRP1/2Bk1KN1"],
        "P-", "PxQ=N");
    /* Werner Keym */
    testProblem("8/8/8/8/8/5P2/P1PPP1P1/k1KRnB2", "P-", "PxN=N");
    /* Bernd Schwarzkopf */
    testProblem("8/3ppp1p/7P/6pK/8/5PPk/4P1pp/8", "P-", "P--");
    /* Werner Keym */
    xtestProblem("8/P2pp3/1pp3p1/8/PP6/pkPP4/pB1P2P1/2KR4", "P-", "O-O-O");
    /* Werner Keym */
    xtestProblem("8/2p1p2P/5pp1/7P/6Pp/P3PPkp/1P2PR2/5RK1", "P-", "O-O");
    /* Bernd Schwarzkopf */
    xtestProblem("4BKBn/3ppRBP/5p1p/6p1/1P6/P1P5/pbrPP3/Nbkb4", "PxQ", "PxQ");
    /* Roberto Osorio & Jorge Lois */
    // this one needs extraDepth of 5
    testProblem("8/p2pppp1/8/5p2/6P1/2PPkPPB/1PrR1RPr/2bn1RK1", "PxQ", "O-O", {'extraDepth': 5});
    /* Andrew Buchanan */
    xtestProblem("kB3b2/ppP1p1p1/2pp4/8/8/2PP2P1/PPp1P1P1/Kb3B2", "PxR", "PxR");
    /* Andrew Buchanan */
    xtestProblem("8/Pp2p3/kpp5/p7/P7/KPP3P1/pP2P2P/8", "PxB", "PxB");
    /* Werner Keym */
    xtestProblem("8/P1pp3p/1p6/Bp6/PP6/pkPP4/qB1P2P1/2KR4", "PxB", "O-O-O");
    /* Werner Keym */
    xtestProblem("8/4pp1P/6p1/6pb/5PPR/4PPkp/1P2PR2/5RK1", "PxB", "O-O");
    /* Jorge Lois & Roberto Osorio */
    testProblem("6BK/1p1p1ppP/7p/8/8/P7/pPP1P1P1/kb6", "PxN", "PxN");
    /* Werner Keym */
    testProblem("8/7p/7p/8/8/1PPPkPP1/bPPR1rPb/2KR1nQb", "PxN", "O-O-O");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/8/8/8/6P1/2PPkPPB/1PpR1RPr/2BQ1RK1", "PxN", "O-O");
    /* Werner Keym */
    xtestProblem("8/ppp3P1/2pp4/8/4P3/7P/p1PPPkPK/4bq2", "PxP", "PxP");
    /* Werner Keym */
    xtestProblem("N7/P1pp1p1p/pp5p/8/P7/PkPP4/pB1P2P1/2KR4", "PxP", "O-O-O");
    /* Werner Keym */
    xtestProblem("8/p3pp1P/p5p1/7P/5PPp/4PRpk/1P2PB1N/5RK1", "PxP", "O-O");
    /* Andrew Buchanan */
    testProblem("5bnQ/4prB1/5pkP/6p1/6P1/5PKp/4PRb1/5BNq", "P-=Q", "P-=Q");
    /* Andrew Buchanan */
    testProblem("1Qrb4/1Prpp3/krp5/pp6/6PP/5PRK/3PPRp1/4BRq1", "PxQ=Q", "PxQ=Q");
    /* Roberto Osorio & Jorge Lois */
    xtestProblem("4nQrQ/2pp1ppK/2pp4/8/8/PP6/b1PPkPP1/nN1brqqN", "PxB=Q", "PxB=Q");
    /* Roberto Osorio & Jorge Lois */
    xtestProblem("4nQQB/2pp1ppK/3p4/8/8/5P2/PPPPkrP1/3bbqqN", "PxN=Q", "PxN=Q");
    /* Andrew Buchanan */
    testProblem(["Rnb5/1kpp4/brp5/1p6/6P1/5PRB/4PPK1/5BNr",
        "1nb5/kPpp4/brp5/1p6/8/8/8/8", "8/8/8/8/6P1/5PRB/4PPpK/5BN1"], "P-=R", "P-=R");
    /* Mario Richter */
    // This one needs extraDepth of 4
    testProblem("bRr1B3/k1pKpp2/ppp5/8/8/8/6P1/7b", "P-=R", "P-=B", {'extraDepth': 4});
    /* Osorio/Lois/Buchanan */
    xtestProblem("nRr1n3/1ppKp1p1/1p1pp3/8/8/3PP3/1P1PkPP1/3N1RrN", "PxQ=R", "PxQ=R");
    /* Roberto Osorio/Jorge Lois/Werner Keym/Andrew Buchanan */
    xtestProblem("5bRq/3pp1pk/6pp/8/8/1P4PP/2PPP1PK/5BrN", "PxR=R", "PxR=R");
    /* Werner Keym */
    testProblem(["5bRK/4p1pR/5p1p/8/8/5P1P/4P1Pr/5Brk",
        "8/8/8/8/8/5P1P/4P1Pr/5BNk", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "PxB=R", "PxB=R");
    /* Andrew Buchanan */
    testProblem(["KRb5/Rp1p4/p1p5/8/8/6P1/4P1Pk/5Brb",
        "8/8/8/8/8/6P1/4P1Pk/5BRb", "Knb5/Rp1p4/p1p5/8/8/8/8/8"], "PxB=R", "PxN=R");
    /* Werner Keym */
    testProblem(["5bRK/4p1pR/5p1p/8/8/5P1P/4P1Pr/5Bnk",
        "8/8/8/8/8/5P1P/4P1Pr/5BNk", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "PxB=R", "PxB=N");
    /* Andrew Buchanan */
    testProblem(["BRb5/Kp1p4/1p6/8/8/6P1/4P1Pk/5Brb",
        "8/8/8/8/8/6P1/4P1Pk/5BRb", "Brb5/Kp1p4/1p6/8/8/8/8/8"], "PxN=R", "PxN=R");
    /* Andrew Buchanan */
    testProblem(["KNb5/Rp1p4/p1p5/8/8/6P1/4P1Pk/5Brb",
        "8/8/8/8/8/6P1/4P1Pk/5BRb", "Knb5/Rp1p4/p1p5/8/8/8/8/8"], "PxN=R", "PxB=N");
    /* Andrew Buchanan */
    testProblem("K1krB3/p1pp1p2/8/8/8/8/6P1/7b", "P-=B", "P-=B");
    /* Mario Richter  */
    testProblem("Nrk1K3/1pp1prp1/5p2/8/8/8/1P6/b7", "P-=B", "P-=N");
    /* Werner Keym */
    xtestProblem("8/4pp1p/6p1/8/8/1PPPkPP1/brPR1RP1/2KR1Qrb", "P-=B", "O-O-O");
    /* Werner Keym, Bernd Schwarzkopf */
    testProblem("8/8/8/8/6P1/2PPkPPB/1PrR1RPr/b1bQ1RK1", "P-=B", "O-O");
    /* Roberto Osorio, Jorge Lois & Werner Keym */
    xtestProblem("2brkBRB/1p1p1ppK/8/8/8/1P4PN/1P1PNPrr/3bRBbR", "PxQ=B", "PxQ=B");
    /* Lois & Osorio */
    xtestProblem("NrbbNQBk/1PppBKp1/1p1p1pp1/8/8/8/1PP1P1PP/1b6", "PxR=B", "PxR=B");
    /* Roberto Osorio & Jorge Lois */
    xtestProblem("2brkBRB/pp1p1ppK/8/8/8/1P6/1P1PNPPN/2BbRQRq", "PxB=B", "PxB=B");
    /* Roberto Osorio & Jorge Lois */
    xtestProblem("2brrkBQ/1p1pp1pp/6p1/8/8/1P6/PP1PP1P1/qbKRRB2", "PxN=B", "PxN=B");
    /* Andrew Buchanan */
    testProblem("Nrk5/1ppRp3/3p4/8/8/4P3/3PrPP1/5KRn", "P-=N", "P-=N");
    /* Werner Keym */
    xtestProblem("8/8/8/8/3PPPP1/1PPrkprB/bPPR1Np1/2KR1Qnn", "P-=N", "O-O-O");
    /* Roberto Osorio & Jorge Lois */
    xtestProblem("kNb2b2/rp1pppp1/p1p5/8/8/5P1P/1PPPP1PR/2B2BnK", "PxQ=N", "PxQ=N");
    /* Werner Keym */
    testProblem(["8/6p1/7p/8/6P1/2PPkPPB/1PrR1RPr/2Bn1RK1",
        "8/8/8/8/8/8/5PP1/4KR1R frozen=e1,h1", "8/8/8/8/6P1/2PPkPPB/1PrRpRPr/2BQK2R frozen=e1,h1"],
        "PxQ=N", "O-O");
    /* Buchanan, Osorio/Lois, Keym */
    xtestProblem("1NQQB3/1pRKppp1/p1p5/8/8/4P1P1/1PPkrP1P/2bbqn2", "PxR=N", "PxR=N");
    /* Werner Keym */
    testProblem(["5bNK/4p1pR/5p1p/8/8/5P1P/4P1Pr/5Bnk",
        "8/8/8/8/8/5P1P/4P1Pr/5BNk", "5bnK/4p1pR/5p1p/8/8/8/8/8"], "PxB=N", "PxB=N");
    /* R.Osorio, J.Lois & A.Buchanan */
    xtestProblem("1Nqkrb2/1pppp1p1/p7/8/8/7P/1P1PPPP1/2BRKQn1", "PxN=N", "PxN=N");
    /* Bernd Schwarzkopf, Werner Keym */
    xtestProblem("8/2pp4/2p2PP1/4pKRP/4ppPk/7p/3PPP2/8", "P--", "P--");
});

function matchMoveTypeWithMove(move, moveType) {
    // determines whether the "move type" (a string like PxR=N) describes the actual move (of class RetractionMove)
    if (typeof(moveType) == "string" && move instanceof Move) {
        if (moveType == "O-O-O") {
            return (move.fromUnit == "K" && move.from.mFile == 2 && move.to.mFile == 4);
        }

        if (moveType == "O-O") {
            return (move.fromUnit == "K" && move.from.mFile == 6 && move.to.mFile == 4);
        }

        if (moveType == "ep") {
            return move.uncapturedUnit == "ep";
        }

        // make sure unit moved agrees
        const moveTypeFromUnit = moveType.charAt(0);
        let expectedMoveFromUnit = moveTypeFromUnit;

        if (moveTypeFromUnit == "P" && moveType.indexOf("=") != -1) {
            if (!move.unpromote) return false;
            expectedMoveFromUnit = moveType.charAt(moveType.length - 1); // promoted piece
        }
        if (move.fromUnit != expectedMoveFromUnit) return false;

        // make sure captured piece agrees
        if (moveType.charAt(1) == "-" && move.uncapturedUnit != "") return false;
        if (moveType.charAt(1) == "x" && move.uncapturedUnit != moveType.charAt(2)) return false;

        if (moveType == "P-") { // make sure single step
          if (Math.abs(move.from.mRank - move.to.mRank) != 1) return false;
        }

        if (moveType == "P--") { // make sure double step
          if (Math.abs(move.from.mRank - move.to.mRank) != 2) return false;
        }

        return true;
    }

    return undefined;
}