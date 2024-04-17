describe("single color solver", function () {
    const blank = [0, 0, 0, 0, 0, 0, 0, 0];

    it("2 1", function () {
        expect(solveSingleColorHungarian([2, 1, 0, 0, 0, 0, 0, 0], blank)).toBe(2);
    });

    it("2", function () {
        expect(solveSingleColorHungarian([2, 0, 0, 0, 0, 0, 0, 0], blank)).toBe(1);
    });

    it("3", function () {
        expect(solveSingleColorHungarian([3, 0, 0, 0, 0, 0, 0, 0], blank)).toBe(3);
    });

    it("3 1", function () {
        expect(solveSingleColorHungarian([3, 1, 0, 0, 0, 0, 0, 0], blank)).toBe(5);
    });

    it("4", function () {
        expect(solveSingleColorHungarian([4, 0, 0, 0, 0, 0, 0, 0], blank)).toBe(6);
    });

    it("5", function () {
        expect(solveSingleColorHungarian([5, 0, 0, 0, 0, 0, 0, 0], blank)).toBe(10);
    });

    it("6", function () {
        expect(solveSingleColorHungarian([6, 0, 0, 0, 0, 0, 0, 0], blank)).toBe(15);
    });

    it("2 2", function () {
        expect(solveSingleColorHungarian([2, 2, 0, 0, 0, 0, 0, 0], blank)).toBe(4);
    });

    it("3 2", function () {
        expect(solveSingleColorHungarian([3, 2, 0, 0, 0, 0, 0, 0], blank)).toBe(8);
    });

    it("3 3", function () {
        expect(solveSingleColorHungarian([3, 3, 0, 0, 0, 0, 0, 0], blank)).toBe(12);
    });

    it("0 2 2", function () {
        expect(solveSingleColorHungarian([0, 2, 2, 0, 0, 0, 0, 0], blank)).toBe(2);
    })

    it("0 3 3", function () {
        expect(solveSingleColorHungarian([0, 3, 3, 0, 0, 0, 0, 0], blank)).toBe(8);
    })

    it("1 2 1", function () {
        expect(solveSingleColorHungarian([1, 2, 1, 0, 0, 0, 0, 0], blank)).toBe(2);
    })

    it("0 0 2 2", function () {
        expect(solveSingleColorHungarian([0, 0, 2, 2, 0, 0, 0, 0], blank)).toBe(2);
    })

    it("0 0 3 3", function () {
        expect(solveSingleColorHungarian([0, 0, 3, 3, 0, 0, 0, 0], blank)).toBe(6);
    });

    it("0 1 2 1", function () {
        expect(solveSingleColorHungarian([0, 1, 2, 1, 0, 0, 0, 0], blank)).toBe(2);
    })

});