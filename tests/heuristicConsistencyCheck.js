function generateTuples(tupleLength, maximumSum) {
    if (tupleLength == 0) {
        return [[]];
    }
    const result = [];
    for (let value = 0; value <= maximumSum; value++) {
        const shorterTuples = generateTuples(tupleLength - 1,  maximumSum - value);
        shorterTuples.forEach(tuple => {
            tuple.push(value);
            result.push(tuple);
        });
    }
    return result;
}

describe("consistency check", function() {
    const answers = {};
    const allTuples = generateTuples(8, 8);

    beforeAll(function() {
        allTuples.forEach(tuple => {
            answers[tuple] = solveSingleColorHungarian(tuple, [0, 0, 0, 0, 0, 0, 0, 0]);
        });
    });

    it("check tuples", function() {
        expect(allTuples.length).toBe(12870);
        expect(allTuples.every(tuple => tuple.length == 8)).toBe(true);
    });

    allTuples.forEach(tuple => {
        it(tuple.toString(), function() {
            if (tuple.every(entry => entry <= 1)) {
                expect(answers[tuple]).toBe(0);
            } else {
                let childMin = 999;
                for (let i = 0; i < 8; i++) {
                    if (tuple[i] > 1) {
                        if (i > 0) {
                            const newTuple = tuple.slice();
                            newTuple[i]--;
                            newTuple[i - 1]++;
                            childMin = Math.min(childMin, answers[newTuple]);
                        }
                        if (i < 7) {
                            const newTuple = tuple.slice();
                            newTuple[i]--;
                            newTuple[i + 1]++;
                            childMin = Math.min(childMin, answers[newTuple]);
                        }
                    }
                }
                expect(answers[tuple]).toBe(childMin + 1);
            }
        });
    });
});