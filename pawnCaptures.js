IMPOSSIBLE = 999;

function getPawns(board) {
    const whitePawns = [];
    const blackPawns = [];
    for(let file = 0; file < 8; file++) {
        whitePawns[file] = [];
        blackPawns[file] = [];

        for(let rank = 0; rank < 8; rank++) {
            if (board[file][rank].unit == "P") {
                if (board[file][rank].color == "w") {
                    whitePawns[file].push(rank);
                } else {
                    blackPawns[file].push(rank);
                }
            }
        }
    }
    return [whitePawns, blackPawns];
}

function copyPawns(pawns) {
    let newPawns = [];

    for (let side = 0; side < 2; side++) {
        newPawns[side] = [];
        for (let file = 0; file < 8; file++) {
            newPawns[side][file] = pawns[side][file].slice();
        }
    }

    return newPawns;
}

function blankAssignments() {
    return [[[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
        [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]];
}

function copyAssignments(assignments) {
    const copy = blankAssignments();
    for (let side = 0; side < 2; side++) {
        for (let file = 0; file < 8; file ++) {
            for (let j = 0; j < 2; j++) {
                copy[side][file][j] = assignments[side][file][j];
            }
        }
    }
    return copy;
}

class PawnCaptureSearchState {
    constructor(position, assignments, estimatedDistance) {
        this.position = position;
        this.assignments = assignments;
        this.estimatedDistance = estimatedDistance;
    }
}

function insertIntoHeap(state, heap) {
    heap.push(state);
    let index = heap.length - 1;
    let parent = Math.floor((index - 1)/2);
    while (index > 0 && heap[index].estimatedDistance < heap[parent].estimatedDistance) { // sift up
        const temp = heap[index];
        heap[index] = heap[parent];
        heap[parent] = temp;
        index = parent;
        parent = Math.floor((index - 1)/2);
    }
}


function solveSingleColorHungarian(pawnCounts, used) {

    function assignWorkerToJob(workerIndex, jobIndex) {
        workerToJobAssignments[workerIndex] = jobIndex;
        jobToWorkerAssignments[jobIndex] = workerIndex;

        const tightWorkerToJobEdgesIndex = tightWorkerToJobEdges[workerIndex].indexOf(jobIndex);
        assert(tightWorkerToJobEdgesIndex != -1, "Did not find job " + jobIndex + " in " +
          "tightWorkerToJobEdges[" + workerIndex + "] = " + tightWorkerToJobEdges[workerIndex].toString());
        tightWorkerToJobEdges[workerIndex].splice(tightWorkerToJobEdgesIndex, 1);
        log("Assigned worker " + workerIndex + " to job " + jobIndex + " " + "abcdefgh".charAt(jobFiles[jobIndex]));
    }

    function unassignWorkerToJob(workerIndex, jobIndex) {
        assert(workerToJobAssignments[workerIndex] == jobIndex && jobToWorkerAssignments[jobIndex] == workerIndex,
            "Attempt to unassign worker " + workerIndex + " job " + jobIndex + " not currently assigned");
        jobToWorkerAssignments[jobIndex] = -1;
        workerToJobAssignments[workerIndex] = -1;

        assert(tightWorkerToJobEdges[workerIndex].indexOf(jobIndex) == -1,
            "Incorrect found jobIndex " + jobIndex + " in tightWorkerToJobEdges[" + workerIndex + "] = " +
            tightWorkerToJobEdges[workerIndex].toString());
        tightWorkerToJobEdges[workerIndex].push(jobIndex);
        log("Unassigned worker " + workerIndex + " from job " + jobIndex + " " + "abcdefgh".charAt(jobFiles[jobIndex]));
    }

    function last(arr) {
        return arr[arr.length - 1];
    }

    const DEBUG = false;
    function log(str) {
        if (DEBUG) { console.log(str); }
    }

    log("Solving: " + pawnCounts.toString() + " used: " + used.toString());
    const workerFiles = [];
    const jobFiles = [];
    for (let file = 0; file < 8; file ++) {
        if (used[file] == 0) {
            workerFiles.push(file);
        }
        for (let i = 0; i < pawnCounts[file]; i++) {
            jobFiles.push(file);
        }
    }
    if (workerFiles.length < jobFiles.length) {
        return IMPOSSIBLE;
    }
    const workerPotential = workerFiles.map(() => 0);
    const jobPotential = jobFiles.map(() => 0);
    const workerToJobAssignments = workerFiles.map(() => -1);
    const jobToWorkerAssignments = jobFiles.map(() => -1);
    const tightWorkerToJobEdges = workerFiles.map(() => []);

    // initialize tight edges
    // there is a tight edge from each pawn to its current file (if the file is available)
    let jobIndex = 0;
    jobFiles.forEach(jobFile => {
        const workerIndex = workerFiles.indexOf(jobFile);
        if (workerIndex != -1) {
            tightWorkerToJobEdges[workerIndex].push(jobIndex);
        }
        jobIndex++;
    });

    while(jobToWorkerAssignments.indexOf(-1) != -1) {
        // initialize alternating paths to start at unassigned workers
        const reachableWorkers = [];
        const reachableJobs = [];
        const alternatingPathsQueue = [];
        for (let workerIndex = 0; workerIndex < workerFiles.length; workerIndex++) {
            if (workerToJobAssignments[workerIndex] == -1) {
                alternatingPathsQueue.push([workerIndex]);
                reachableWorkers.push(workerIndex);
            }
        }

        // try to find an augmenting path
        let augmentingPathFound = false;
        for (let alternatingPathsQueueIndex = 0;
             !augmentingPathFound && alternatingPathsQueueIndex < alternatingPathsQueue.length;
             alternatingPathsQueueIndex++) {
            const alternatingPath = alternatingPathsQueue[alternatingPathsQueueIndex];
            const workerIndex = last(alternatingPath);
            log("expanding alternating path " + alternatingPath.toString());
            tightWorkerToJobEdges[workerIndex].forEach(jobIndex => {
                if (!augmentingPathFound && reachableJobs.indexOf(jobIndex) == -1) {
                    const extendedAlternatingPath = alternatingPath.concat([jobIndex]);
                    reachableJobs.push(jobIndex);
                    const assignedWorkerIndex = jobToWorkerAssignments[jobIndex];
                    if (assignedWorkerIndex == -1) { // this job is unmatched, found augmenting path
                        augmentingPathFound = true;
                        log("Augmenting path found " + extendedAlternatingPath.toString());
                        assert(extendedAlternatingPath.length % 2 == 0,
                            "Unexpected odd number of nodes in  path " + extendedAlternatingPath.toString());
                        // reverse all edges of augmenting path
                        for (let i = 0; i < extendedAlternatingPath.length; i += 2) {
                            const newJobIndex = extendedAlternatingPath[i+1];
                            const newWorkerIndex = extendedAlternatingPath[i];
                            if (i < extendedAlternatingPath.length - 2) {
                                const oldWorkerIndex = extendedAlternatingPath[i + 2];
                                unassignWorkerToJob(oldWorkerIndex, newJobIndex);
                            }
                            assignWorkerToJob(newWorkerIndex, newJobIndex);
                        }
                    } else { // if worker has not already been marked reachable, extend alternating path to the matching worker
                        if (reachableWorkers.indexOf(assignedWorkerIndex) == -1) {
                            reachableWorkers.push(assignedWorkerIndex);
                            extendedAlternatingPath.push(assignedWorkerIndex);
                            alternatingPathsQueue.push(extendedAlternatingPath);
                            log("Adding alternating path " + extendedAlternatingPath.toString());
                        }
                    }
                }
            });
        }

        if (!augmentingPathFound) {
            // find minimum adjusting potential between reachable workers and unreachable jobs
            log("No augmenting path found.");
            let minDelta = 999;
            reachableWorkers.forEach(workerIndex => {
                for (let jobIndex = 0; jobIndex < jobFiles.length; jobIndex++) {
                    if (reachableJobs.indexOf(jobIndex) == -1) {
                        const cost = Math.abs(workerFiles[workerIndex] - jobFiles[jobIndex]);
                        minDelta = Math.min(minDelta, cost - workerPotential[workerIndex] - jobPotential[jobIndex]);
                        assert(minDelta > 0,
                            "minDelta has reached <= 0 value " + minDelta + " at workerIndex = " + workerIndex + " jobIndex = " + jobIndex);
                    }
                }
            });

            // increase potentials for reachable workers, decrease for reachable jobs
            reachableWorkers.forEach(workerIndex => {
                workerPotential[workerIndex] += minDelta;
                log("potential for worker " + workerIndex + " is now " + workerPotential[workerIndex]);
            });

            reachableJobs.forEach(jobIndex => {
                jobPotential[jobIndex] -= minDelta;
                log("potential for job " + jobIndex + " is now " + jobPotential[jobIndex]);
            });

            // find new tight edges
            reachableWorkers.forEach(workerIndex => {
                for (let jobIndex = 0; jobIndex < jobFiles.length; jobIndex++) {
                    if (workerPotential[workerIndex] + jobPotential[jobIndex] ==
                        Math.abs(workerFiles[workerIndex] - jobFiles[jobIndex])) {
                        if (tightWorkerToJobEdges[workerIndex].indexOf(jobIndex) == -1 &&
                            jobToWorkerAssignments[jobIndex] != workerIndex) {
                            log("New tight edge: worker " + workerIndex + " job " + jobIndex);
                            tightWorkerToJobEdges[workerIndex].push(jobIndex);
                        }
                    }
                }
            });

            // find edges that are no longer tight (job end in reachable jobs, worker end not in reachable workers)
            reachableJobs.forEach(jobIndex => {
                for (let workerIndex = 0; workerIndex < workerFiles.length; workerIndex++) {
                    if (reachableWorkers.indexOf(workerIndex) == -1) {
                        const tightWorkerToJobEdgesIndex = tightWorkerToJobEdges[workerIndex].indexOf(jobIndex);
                        if (tightWorkerToJobEdgesIndex != -1) {
                            tightWorkerToJobEdges[workerIndex].splice(tightWorkerToJobEdgesIndex, 1);
                            log("Edge is no longer tight: worker " + workerIndex + " job " + jobIndex);
                        }
                    }
                }
            });

            // consistency check 1 - verify that potential inequalities still hold
            for (let workerIndex = 0; workerIndex < workerFiles.length; workerIndex++) {
                for (let jobIndex = 0; jobIndex < jobFiles.length; jobIndex++) {
                    const cost = Math.abs(workerFiles[workerIndex] - jobFiles[jobIndex]);
                    assert(workerPotential[workerIndex] + jobPotential[jobIndex] <= cost,
                            "Potential inequality violated at workerIndex " + workerIndex +
                            " job Index " + jobIndex + " " + workerPotential[workerIndex] + " " +
                            jobPotential[jobIndex] + " " + cost);
                }
            }

            // consistency check 2 - make sure all edges in tightWorkerToJobEdges are really tight
            for (let workerIndex = 0; workerIndex < workerFiles.length; workerIndex++) {
                tightWorkerToJobEdges[workerIndex].forEach(jobIndex =>
                    assert(
                        workerPotential[workerIndex] + jobPotential[jobIndex] ==
                        Math.abs(workerFiles[workerIndex] - jobFiles[jobIndex]),
                        "Edge from worker " + workerIndex + " to job " + jobIndex + " is not actually tight " +
                         "worker potential " + workerPotential[workerIndex] + "job potential " +
                         jobPotential[jobIndex] + " cost " + Math.abs(workerFiles[workerIndex] - jobFiles[jobIndex])));
            }
        }
        log("-------");
    }

    let totalCost = 0;
    let totalPotential = 0;
    for (let jobIndex = 0; jobIndex < jobToWorkerAssignments.length; jobIndex++) {
        const workerIndex = jobToWorkerAssignments[jobIndex];
        totalCost += Math.abs(jobFiles[jobIndex] - workerFiles[workerIndex]);
        totalPotential += jobPotential[jobIndex] + workerPotential[workerIndex];
    }

    assert(totalCost == totalPotential,
        "totalCost " + totalCost + " and totalPotential " + totalPotential + " disagree at end of algorithm" +
       " worker potentials " + workerPotential.toString() + " job potentials " + jobPotential.toString());
    return totalCost;
}

function solveSingleColor(pawns, side, used) {
    /* Solve a single color position, assuming that the board is vertically infinite.
      This is either the correct answer on the actual board, or the position is impossible,
      but the impossibilities will be detected separately.
     */
    const pawnCounts = [];
    for (let file = 0; file < 8; file++) {
        pawnCounts.push(pawns[side][file].length);
    }

    return solveSingleColorHungarian(pawnCounts, used);
}

function getTwoColorHeuristic(pawns, which, assignments) {
    let whiteDistance = 0;
    let blackDistance = 0;

    if (which == 0 || which == 2) {
        const used = [];
        for (let file = 0; file < 8; file++) {
            if (assignments[0][file][0] != -1) {
                used.push(1);
            } else {
                used.push(0);
            }
        }
        whiteDistance = solveSingleColor(pawns, 0, used);
    }

    if (which == 1 || which == 2) {
        const used = [];
        for (let file = 0; file < 8; file++) {
            if (assignments[1][file][0] != -1) {
                used.push(1);
            } else {
                used.push(0);
            }
        }
        blackDistance = solveSingleColor(pawns, 1, used);
    }

    if (whiteDistance == IMPOSSIBLE || blackDistance == IMPOSSIBLE) {
        return IMPOSSIBLE;
    }

    return whiteDistance + blackDistance;
}

function existsDirectPath(pawns, side, sourceSquare, targetSquare) {
    if (sourceSquare[0] == targetSquare[0] && sourceSquare[1] == targetSquare[1]) return true;

    const file = sourceSquare[0];
    const rank = sourceSquare[1];
    const pawnDir = side == 0 ? -1 : 1;
    if (Math.sign(targetSquare[1] - rank) != pawnDir) return false;
    if (Math.abs(targetSquare[1] - rank) < Math.abs(targetSquare[0] - file)) return false;

    const newRank = rank + pawnDir;

    let searchOrder;
    if (targetSquare[0] < sourceSquare[0]) {
        searchOrder = [file - 1, file];
    } else if (targetSquare[0] == sourceSquare[0]) {
        searchOrder = [file];
    } else {
        searchOrder = [file + 1, file];
    }

    return searchOrder.some(newFile =>
       newFile >= 0 && newFile <= 7 && pawns[side][newFile].indexOf(newRank) == -1 &&
            pawns[1 - side][newFile].indexOf(newRank) == -1 &&
            existsDirectPath(pawns, side, [newFile, newRank], targetSquare)
    );
}

function restore(object, removed) {
    for (const key in removed) {
        if (removed.hasOwnProperty(key)) {
            object[key] = removed[key];
        }
    }
}

function evaluateHelper(pawns, bestPreviousLevel, invertedAssignments, which) {
    // first, try to simplify
    let simplifiedValue = 0;

    const newPawns = copyPawns(pawns);
    const newInvertedAssignments = invertedAssignments;
    const removed = {};
    let simplified = true;
    while (simplified) {
        simplified = false;
        for (const sourceSquare in newInvertedAssignments) {
            if (newInvertedAssignments.hasOwnProperty(sourceSquare)) {
                const side = (newInvertedAssignments[sourceSquare][1] == 1) ? 0 : 1;
                const targetSquare = newInvertedAssignments[sourceSquare];
                const file = parseInt(sourceSquare.charAt(0));
                const rank = parseInt(sourceSquare.charAt(2));

                if (existsDirectPath(newPawns, side, [file, rank], targetSquare)) {
                    simplified = true;
                    removed[sourceSquare] = newInvertedAssignments[sourceSquare];
                    delete newInvertedAssignments[sourceSquare];
                    const index = newPawns[side][file].indexOf(rank);
                    assert(index != -1, rank + " was not found in " + newPawns[side][file] + " on side = "
                        + side + " file = " + file);
                    newPawns[side][file].splice(index, 1);
                    if (which == side || which == 2) {
                        simplifiedValue += Math.abs(targetSquare[0] - file);
                    }
                }
            }
        }
    }

    let best = IMPOSSIBLE;
    let keyFound = false;
    for (const sourceSquare in newInvertedAssignments) {
        if (newInvertedAssignments.hasOwnProperty(sourceSquare)) {
            keyFound = true;
            const side = (newInvertedAssignments[sourceSquare][1] == 1) ? 0 : 1;
            const file = parseInt(sourceSquare.charAt(0));
            const rank = parseInt(sourceSquare.charAt(2));
            const pawnDir = side == 0 ? -1 : 1;
            const targetFile = newInvertedAssignments[sourceSquare][0];
            const targetRank = newInvertedAssignments[sourceSquare][1];
            if (Math.sign(targetRank - rank) != pawnDir) {
                restore(invertedAssignments, removed);
                return IMPOSSIBLE;
            }
            if (Math.abs(targetRank - rank) < Math.abs(targetFile - file)) {
                restore(invertedAssignments, removed);
                return IMPOSSIBLE;
            }
        }
    }

    if (!keyFound) {
        restore(invertedAssignments, removed);
        return simplifiedValue;
    }

    const keys = [];
    for (const sourceSquare in newInvertedAssignments) {
        if (newInvertedAssignments.hasOwnProperty(sourceSquare)) {
            keys.push(sourceSquare);
        }
    }

    keys.forEach(sourceSquare => {
        const side = (newInvertedAssignments[sourceSquare][1] == 1) ? 0 : 1;
        const file = parseInt(sourceSquare.charAt(0));
        const rank = parseInt(sourceSquare.charAt(2));
        const pawnDir = side == 0 ? -1 : 1;
        const targetFile = newInvertedAssignments[sourceSquare][0];
        const originalRank = side == 0 ? 1 : 6;

        let searchOrder;
        if (targetFile < file) {
            searchOrder = [file - 1, file, file + 1];
        } else if (targetFile == file) {
            searchOrder = [file, file - 1, file + 1];
        } else {
            searchOrder = [file + 1, file, file - 1];
        }

        if (rank != originalRank) {
            const newRank = rank + pawnDir;
            searchOrder.forEach(newFile => {
                if (newFile >= 0 && newFile <= 7 && newPawns[side][newFile].indexOf(newRank) == -1 &&
                    newPawns[1 - side][newFile].indexOf(newRank) == -1) {
                    const index = newPawns[side][file].indexOf(rank);
                    newPawns[side][file].splice(index, 1);
                    newPawns[side][newFile].push(newRank);
                    newInvertedAssignments[[newFile, newRank]] = newInvertedAssignments[[file, rank]];
                    const originalAssignment = newInvertedAssignments[[file, rank]];
                    delete newInvertedAssignments[[file, rank]];

                    const weight = (newFile != file && (which == 2 || which == side)) ? 1 : 0;
                    if (simplifiedValue + weight < bestPreviousLevel) {
                        const recursiveValue = evaluateHelper(newPawns, best, newInvertedAssignments, which);
                        const recursiveBest = simplifiedValue + weight + recursiveValue;
                        if (recursiveBest < best) best = recursiveBest;
                    }

                    newPawns[side][newFile].splice(newPawns[side][newFile].length - 1, 1);
                    newPawns[side][file].push(rank);
                    newInvertedAssignments[[file, rank]] = originalAssignment;
                    delete newInvertedAssignments[[newFile, newRank]];
                }
            });
        }
    });

    restore(invertedAssignments, removed);
    return best;
}

function evaluate(assignments, which) {
    const pawns = [[], []];
    const invertedAssignments = {};

    for(let file = 0; file < 8; file++) {
        pawns[0].push([]);
        pawns[1].push([]);
    }

    for (let side = 0; side < 2; side++) {
        for (let file = 0; file < 8; file++) {
            if (assignments[side][file][0] != -1) {
                pawns[side][assignments[side][file][0]].push(assignments[side][file][1]);
                invertedAssignments[assignments[side][file].slice()] = [
                    file, side == 0 ? 1 : 6
                ];
            }
        }
    }

    const result = evaluateHelper(pawns, IMPOSSIBLE, invertedAssignments, which);
    return result;
}

function findPawnToAssign(pawns, which) {
    let side = -1;
    let file = -1;
    let index = -1;
    // search each pawn and see if it has a direct path to the same file or an adjacent file
    let done = false;
    if (which == 2) { // for now, this extra work seems to only benefit the which == 2 case
        for (let distance = 0; distance <= 1; distance++) {
            for (let searchSide = 0; searchSide < 2; searchSide++) {
                const originalRank = searchSide == 0 ? 1 : 6;
                for (let searchFile = 0; searchFile < 8; searchFile++) {
                    for (let searchIndex = 0; searchIndex < pawns[searchSide][searchFile].length; searchIndex++) {
                        const searchRank = pawns[searchSide][searchFile][searchIndex];
                        if (0 <= searchFile - distance && existsDirectPath(pawns, searchSide,
                            [searchFile, searchRank], [searchFile - distance, originalRank])) {
                            side = searchSide;
                            file = searchFile;
                            index = searchIndex;
                            done = true;
                            break;
                        }
                        if (distance > 0 && searchFile + distance <= 7 && existsDirectPath(pawns, searchSide,
                            [searchFile, searchRank], [searchFile + distance, originalRank])) {
                            side = searchSide;
                            file = searchFile;
                            index = searchIndex;
                            done = true;
                            break;
                        }
                        if (done) break;
                    }
                    if (done) break;
                }
                if (done) break;
            }
            if (done) break;
        }
    }

    if (file == -1) { // Take the first nonempty column if which != 2 or no suitable pawn found above
        file = 0;
        while (file < 8 && pawns[0][file].length == 0 && pawns[1][file].length == 0) {
            file++;
        }
        if (file == 8) {
            assert(false, "Empty board, shouldn't have gotten here.");
        }
        if (pawns[0][file].length > 0) {
            side = 0;
            index = 0;
        } else {
            side = 1;
            index = pawns[1][file].length - 1;
        }
    }

    assert(pawns[side][file].length > index, "Chose non-existent pawn at side = " + side + " file = " + file +
       " index = " + index + " pawns[side][file] is " + pawns[side][file]);

    return [side, file, index];
}

function assignmentsToString(assignments) {
    let result = "";
    for (let side = 0; side < 2; side++) {
        if (side == 0) {
            result += "W: | ";
        } else {
            result += "\nB: | ";
        }
        for (let file = 0; file < 8; file++) {
            if (assignments[side][file][0] != -1) {
                result += file + ": " + assignments[side][file] + " | ";
            }
        }
    }
    return result;
}

function search(searchState, which, heap) {
    const pawns = searchState.position;
    const assignments = searchState.assignments;

    // first, check for empty board
    let emptyBoard = true;
    for (let searchFile = 0; searchFile < 8; searchFile++) {
        if (pawns[0][searchFile].length > 0 || pawns[1][searchFile].length > 0) {
            emptyBoard = false;
            break;
        }
    }
    if (emptyBoard) {
        return searchState.estimatedDistance;
    }

    const [side, file, index] = findPawnToAssign(pawns, which);

    const oneSidePawns = pawns[side];
    if (oneSidePawns[file].length > 0) {
        const newPawns = copyPawns(pawns);
        const rank = oneSidePawns[file][index];
        newPawns[side][file].splice(index, 1);
        const maxDistance = (side == 0) ? rank - 1 : 6 - rank;
        for (let distance = -maxDistance; distance <= maxDistance; distance++) {
            const newFile = file + distance;
            if (newFile < 0 || newFile > 7) continue;
            if (assignments[side][newFile][0] != -1) continue;
            const newAssignments = copyAssignments(assignments);
            newAssignments[side][newFile][0] = file;
            newAssignments[side][newFile][1] = rank;
            const heuristicEstimate = getTwoColorHeuristic(newPawns, which, newAssignments);
            if (heuristicEstimate != IMPOSSIBLE) {
                const value = evaluate(newAssignments, which);
                if (value != IMPOSSIBLE) {
                    const newState = new PawnCaptureSearchState(newPawns, newAssignments, value + heuristicEstimate);
                    insertIntoHeap(newState, heap);
                }
            }
        }
    }
}

function getNextState(heap) {
    const nextState = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.splice(heap.length - 1, 1); // delete last element
    let index = 0;
    while (
        (2 * index + 1 < heap.length &&
            heap[2 * index + 1].estimatedDistance < heap[index].estimatedDistance) ||
        (2 * index + 2 < heap.length &&
            heap[2 * index + 2].estimatedDistance < heap[index].estimatedDistance)) { // sift down

        let newIndex = 2 * index + 1;
        if (2 * index + 2 < heap.length &&
            heap[2 * index + 2].estimatedDistance < heap[2 * index + 1].estimatedDistance) {
            newIndex = 2 * index + 2;
        }
        const temp = heap[index];
        heap[index] = heap[newIndex];
        heap[newIndex] = temp;
        index = newIndex;
    }
    return nextState;
}

class PawnCapturesCache {
    constructor() {
        this.whitePawnCapturesCache = {};
        this.blackPawnCapturesCache = {};
        this.totalPawnCapturesCache = {};
    }

    set(otherPawnCapturesCache) {
        this.whitePawnCapturesCache =
            otherPawnCapturesCache.whitePawnCapturesCache == null ? {} : otherPawnCapturesCache.whitePawnCapturesCache;
        this.blackPawnCapturesCache =
            otherPawnCapturesCache.blackPawnCapturesCache == null ? {} : otherPawnCapturesCache.blackPawnCapturesCache;
        this.totalPawnCapturesCache =
            otherPawnCapturesCache.totalPawnCapturesCache == null ? {} : otherPawnCapturesCache.totalPawnCapturesCache;
    }

    clear() {
        this.whitePawnCapturesCache = {};
        this.blackPawnCapturesCache = {};
        this.totalPawnCapturesCache = {};
    }
}

let pawnCapturesCache = new PawnCapturesCache();

function getPawnCaptureCache() {
    return pawnCapturesCache;
}

function getPawnCaptures(pawns, which, cache) {
    // which = 0: min captures for white.
    // which = 1: min captures for black.
    // which = 2: min total captures.

    const pawnsJson = JSON.stringify(pawns);
    if (pawnsJson in cache) {
        return cache[pawnsJson];
    }

    const heap = [];
    let iterations = 1;
    let result = search(new PawnCaptureSearchState(pawns, blankAssignments(), 0), which, heap);
    while (result == null && heap.length > 0) {
        const nextState = getNextState(heap);
        result = search(nextState, which, heap);
        iterations++;
    }

    if (result != null) {
        cache[pawnsJson] = result;
        return result;
    }
    cache[pawnsJson] = IMPOSSIBLE;
    return IMPOSSIBLE;
}

function getWhitePawnCaptures(board) {
    return getPawnCaptures(getPawns(board), 0, pawnCapturesCache.whitePawnCapturesCache);
}

function getBlackPawnCaptures(board) {
    return getPawnCaptures(getPawns(board), 1, pawnCapturesCache.blackPawnCapturesCache);
}

function getTotalPawnCaptures(board) {
    return getPawnCaptures(getPawns(board), 2, pawnCapturesCache.totalPawnCapturesCache);
}
