describe("Test verifyCage", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("Illegal bishop cage Bd1-Pc2-Pe2 (with excess pieces)", function () {
        setForsythe("8/1ppp4/5Qn1/4q3/3k4/5RK1/2P1PN1r/3B4");
        setRetract("w");
        startPlay(false);
        expect(verifyCage(null, [D1, C2, E2], false).isCageVerified).toBe(true);
    });

    it("Legal bishop cage Bf1-Pe2-Pg2 (with excess pieces)", function () {
        setForsythe("8/1ppp4/4Q1n1/2b4r/1q1k4/5RK1/1PP1P1P1/5B2");
        setRetract("w");
        startPlay(false);
        expect(verifyCage(null, [F1, E2, G2], false).isCageVerified).toBe(false);
    });
});

describe("Test verifyCageInternal - positive cases", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    /*
      The author(s) credited for each test case below indicate that particular cage arises in a
      problem composed by that author with a very similar position. The position of the
      original problem is indicated after the name(s) of the author(s).

      The problems come from: https://www.janko.at/Retros/Records/LastMove/index.htm
     */
    it("8/8/8/8/8/8/PPkPP3/KR1b4", function () { // Brandis, 8/8/8/8/8/1P6/1PkPP3/KR1b4
        setForsythe("8/8/8/8/8/8/PPkPP3/KR1b4");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("7K/pppp1ppp/4p3/8/8/8/8/8", function () { // Ceriani, 3bkN1K/pppprp1p/4p1p1/8/8/8/8/8
        setForsythe("7K/pppp1ppp/4p3/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("4B1rk/3ppKpp/8/8/8/8/8/8", function () { // Bartolovic, Gajdos, Maslar, 4BQrk/3ppK1p/4p1p1/8/8/8/8/8
        setForsythe("4B1rk/3ppKpp/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("4Bnrk/3ppK1p/4p1p1/8/8/8/8/8", function () { // Bartolovic, Gajdos, Maslar, 4BQrk/3ppK1p/4p1p1/8/8/8/8/8
        setForsythe("4Bnrk/3ppK1p/4p1p1/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("2K2b2/1p1pppp1/1pp5/8/8/8/8/8", function () { // Gajdos, 1RK1kb2/1pRpppp1/b1p5/1p6/8/8/8/8
        setForsythe("2K2b2/1p1pppp1/1pp5/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("8/8/8/8/8/8/PPkPP3/K1Bb4", function () { // Fabel, 8/8/8/8/8/P2P4/P1kPP3/K1Bb4
        setForsythe("8/8/8/8/8/8/PPkPP3/K1Bb4");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("6b1/5pp1/6p1/8/8/8/8/8", function () { // Willcocks, 5kb1/2pRRp2/3ppKpp/8/8/8/8/8
        setForsythe("6b1/5pp1/6p1/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("6b1/5p1p/8/8/8/8/8/8", function () { // Willcocks, 5kb1/2pRRp2/3ppKpp/8/8/8/8/8
        setForsythe("6b1/5p1p/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("8/8/8/8/8/1PP5/B1PP4/8", function () {
        setForsythe("8/8/8/8/8/2P5/1PPP4/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(true).isCageVerified).toBe(true);

        setForsythe("8/8/8/8/8/8/P1P5/1B6");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(true).isCageVerified).toBe(true);

        setForsythe("8/8/8/8/8/1PP5/B1PP4/8"); // Hoeg, 8/8/8/8/1P6/kP6/2PP4/KBb5
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("8/8/8/8/1P6/kP6/BrPP4/K7", function () { // Hoeg, 8/8/8/8/1P6/kP6/2PP4/KBb5
        setForsythe("8/8/8/8/1P6/kP6/BrPP4/K7");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("4BN1k/3ppK1p/4p3/8/8/8/8/8", function () { // Willcocks, 4BNNk/3ppKR1/4ppp1/8/8/8/8/8
        setForsythe("4BN1k/3ppK1p/4p3/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("8/8/8/8/8/3P4/P1kPP3/K1nb4", function () { // Fabel, 8/8/8/8/8/1P1P4/1PkPP3/K1nb4
        setForsythe("8/8/8/8/8/3P4/P1kPP3/K1nb4");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("1K6/1p1pppp1/1pp5/8/8/8/8/8", function () { // Keym, k1KB4/PpRpp1p1/b1p2p2/1p6/8/8/8/8
        setForsythe("1K6/1p1pppp1/1pp5/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("5k1K/3pRpp1/4p3/8/8/8/8/8", function () { // Willcocks, 5kbK/3pRp1P/4pp1P/6p1/8/8/8/8
        setForsythe("5k1K/3pRpp1/4p3/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("5kbK/3pRp2/4p1p1/8/8/8/8/8", function () { // Willcocks, 5kbK/3pRp1P/4pp1P/6p1/8/8/8/8
        setForsythe("5kbK/3pRp2/4p1p1/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("4Bnrr/1ppppK1k/4p1pp/8/8/8/8/8", function () {
        setForsythe("8/1ppppKp1/6p1/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(true).isCageVerified).toBe(true);

        setForsythe("4B1rr/3ppKpk/7p/8/8/8/8/8"); // Willcocks, 4BQrr/pp1ppK1k/2p1p1pp/8/8/8/8/8
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);

        setForsythe("4Bnrr/1ppppK1k/4p1pp/8/8/8/8/8"); // Willcocks, 4BQrr/pp1ppK1k/2p1p1pp/8/8/8/8/8
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("4BQ1q/3ppKpk/7p/8/8/8/8/8", function () { // Willcocks, 4BQ1q/3ppK1k/4pp1p/8/8/8/8/8
        setForsythe("4BQ1q/3ppKpk/7p/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("3Qrb2/ppppp1p1/8/8/8/8/8/8", function () { // Mortensen, k1KQRb2/ppppp1p1/5p2/7p/8/8/8/8
        setForsythe("3Qrb2/ppppp1p1/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("nK1k4/r1ppRpp1/pp2p3/8/8/8/8/8", function () {
        setForsythe("1K6/1ppp1pp1/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(true).isCageVerified).toBe(true);

        setForsythe("1K1k4/rpppRp2/p3p3/8/8/8/8/8"); // Keym, RK1k4/r1ppRpp1/pp2p2p/8/8/8/8/8
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);

        setForsythe("nK1k4/r1ppRpp1/pp2p3/8/8/8/8/8"); // Keym, RK1k4/r1ppRpp1/pp2p2p/8/8/8/8/8
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("1nRB4/1pKpp3/1pp5/8/8/8/8/8", function () { // Willcocks, kBRB4/1pKpp1p1/1pp5/7p/8/8/8/8
        setForsythe("1nRB4/1pKpp3/1pp5/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("3BN1qk/2pRKppp/3p1p2/8/8/8/8/8", function () { // Willcocks, 3BN1qk/2pRK1pp/3ppp2/8/8/8/8/8
        setForsythe("3BN1qk/2pRKppp/3p1p2/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("3B1rqk/2pRKppp/3pp3/8/8/8/8/8", function () { // Willcocks, 3BN1qk/2pRK1pp/3ppp2/8/8/8/8/8
        setForsythe("3B1rqk/2pRKppp/3pp3/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("2bk1K1n/1ppp1p1q/6pp/8/8/8/8/8", function () {
        setForsythe("5K2/1ppp1pp1/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(true).isCageVerified).toBe(true);
        stopPlay();

        setForsythe("2bk1K1n/1ppp1p1q/6pp/8/8/8/8/8"); // Ceriani, 2bk1K1N/1ppp1p1q/p5pp/8/8/8/8/8
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("frozen white piece test - 8/8/8/8/8/8/6PP/6Nr", function () {
        setForsythe("8/8/8/8/8/8/6PP/6Nr");
        setFrozenFlag(6, 0, true); // g1 knight is frozen
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
    it("frozen black piece test - 5bQ1/5ppp/8/8/8/8/8/8", function () {
        setForsythe("5bQ1/5ppp/8/8/8/8/8/8");
        setFrozenFlag(5, 7, true); // f8 bishop is frozen
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(true);
    });
});

describe("Test verifyCageInternal - negative cases", function () {
    beforeAll(function () {
        initializeBoard();
    });

    beforeEach(function () {
        clearBoard();
    });

    it("8/8/8/8/8/8/PPPPPPPP/2B2RK1", function () {
        setForsythe("8/8/8/8/8/8/PPPPPPPP/2B2RK1");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("8/8/8/8/8/8/PPPPPPPP/2B1RK2", function () {
        setForsythe("8/8/8/8/8/8/PPPPPPPP/2B1RK2");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("8/8/8/8/8/8/PPPPPPPP/KR3B2", function () {
        setForsythe("8/8/8/8/8/8/PPPPPPPP/KR3B2");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("2brk3/pppppppp/8/8/8/8/8/8", function () {
        setForsythe("2brk3/pppppppp/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("k1r2b2/pppppppp/8/8/8/8/8/8", function () {
        setForsythe("k1r2b2/pppppppp/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("8/8/8/8/8/5P2/4PrPP/7K", function () {
        setForsythe("8/8/8/8/8/5P2/4PrPP/7K");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("8/8/8/8/8/8/6PP/6Nr", function () {
        setForsythe("8/8/8/8/8/8/6PP/6Nr");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("5bQ1/5ppp/8/8/8/8/8/8", function () {
        setForsythe("5bQ1/5ppp/8/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
    it("4nb1k/2pppKpB/5pp1/8/8/8/8/8 - unpromotion with capture", function () {
        setForsythe("4nb1k/2pppKpB/5pp1/8/8/8/8/8");
        setRetract("w");
        startPlay(false);
        expect(verifyCageInternal(false).isCageVerified).toBe(false);
    });
});
