IMPOSSIBLE = 999;

const DEBUG_PAWN_CAPTURES0 = false;
function debugLog0(str) {
    if (DEBUG_PAWN_CAPTURES0) {
        console.log(str);
    }
}

const DEBUG_PAWN_CAPTURES = false;
function debugLog(str) {
    if (DEBUG_PAWN_CAPTURES) {
        console.log(str);
    }
}

let DEBUG_POSITIONS = [];
let DEBUG_PAWN_CAPTURES2 = false;
function debugLog2(str) {
    if (DEBUG_PAWN_CAPTURES2) {
        console.log(str);
    }
}

let DEBUG_DEPTH = 0;
let DEBUG_PAWN_CAPTURES3 = false;
function debugLog3(str, depth) {
    if (DEBUG_PAWN_CAPTURES3 && depth <= DEBUG_DEPTH) {
        console.log(str);
    }
}

class PawnCaptureSearchState {
    constructor(position, assignments, estimatedDistance) {
        this.position = position;
        this.assignments = assignments;
        this.estimatedDistance = estimatedDistance;
    }
}

class PawnCaptureConfig {
    constructor(promotionSearchThreshold, enableSeparateCaptureTracking) {
        this.promotionSearchThreshold = promotionSearchThreshold;
        this.enableSeparateCaptureTracking = enableSeparateCaptureTracking;
    }

    set(pawnCaptureConfig) {
        this.promotionSearchThreshold = pawnCaptureConfig.promotionSearchThreshold;
        this.enableSeparateCaptureTracking = pawnCaptureConfig.enableSeparateCaptureTracking;
    }
}

const pawnCaptureConfig = new PawnCaptureConfig(1000, false);

function getPawnCaptureConfig() {
    return pawnCaptureConfig;
}

function getPromotionSearchThreshold() {
    return pawnCaptureConfig.promotionSearchThreshold;
}

function setPromotionSearchThreshold(threshold) {
    pawnCaptureConfig.promotionSearchThreshold = threshold;
}

function getEnableSeparateCaptureTracking() {
    return pawnCaptureConfig.enableSeparateCaptureTracking;
}

function setEnableSeparateCaptureTracking(flag) {
    pawnCaptureConfig.enableSeparateCaptureTracking = flag;
}

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

    const DEBUG_HUNGARIAN = false;
    function log(str) {
        if (DEBUG_HUNGARIAN) { console.log(str); }
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

function blockedPromotedPawn(pawns, side, file, rank) {
    /*
      If there is a blocked promoted pawn on this file for this side, then return the unblocked file that
      the pawn could retract to.

      If not, return -1.
     */

    const lastRank = side == 0 ? 7 : 0;
    const secondLastRank = side == 0 ? 6 : 1;

    if (rank == lastRank && pawns[1 - side][file].includes(secondLastRank)) {
        if ((file == 0 || pawns[1 - side][file - 1].includes(secondLastRank))) {
            return file + 1;
        } else if ((file == 7 || pawns[1 - side][file + 1].includes(secondLastRank))) {
            return file - 1;
        }
    }

    return -1;
}

function existsDirectPath(pawns, side, sourceSquare, targetSquare) {
    if (sourceSquare[0] == targetSquare[0] && sourceSquare[1] == targetSquare[1]) return true;

    const file = sourceSquare[0];
    const rank = sourceSquare[1];
    const pawnDir = side == 0 ? -1 : 1;
    if (Math.sign(targetSquare[1] - rank) != pawnDir) return false;
    if (Math.abs(targetSquare[1] - rank) < Math.abs(targetSquare[0] - file)) return false;

    const newRank = rank + pawnDir;
    const unblockedFile = blockedPromotedPawn(pawns, side, file, rank);

    let searchOrder;
    if (unblockedFile != -1) {
        searchOrder = [unblockedFile];
    } else if (targetSquare[0] < sourceSquare[0]) {
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

function previousEven(n) {
    return n - (n % 2);
}

function nextEven(n) {
    return n + (n % 2);
}

function evaluateHelper(pawns, bestPreviousLevel, whiteCapturesLeft, blackCapturesLeft, invertedAssignments, which,
                        specialConfigurationSide, cache, depth) {
    if (whiteCapturesLeft < 0 || blackCapturesLeft < 0) {
        return IMPOSSIBLE;
    }
    const sortedKeys = Object.keys(invertedAssignments).sort();
    const sortedAssignments = {};
    sortedKeys.forEach(key => {
        sortedAssignments[key] = invertedAssignments[key];
    });
    const cacheKey = JSON.stringify([sortedAssignments, whiteCapturesLeft, blackCapturesLeft]);
    const cacheLookup = cache[cacheKey];
    if (cacheLookup && (cacheLookup.isExact || cacheLookup.result >= bestPreviousLevel)) {
        return cacheLookup.result;
    }

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

                // in a "special configuration" don't simplify the pawn that is on the promotion rank
                if (specialConfigurationSide == side && rank == (side == 0 ? 7 : 0)) {
                    continue;
                }
                // we can't simplify on this file, if the target file or its adjacent files has an opposing pawn on the
                // back rank from a promotion
                const opponentBackRank = side == 0 ? 0 : 7;
                const targetFile = targetSquare[0];
                if (newPawns[1 - side][targetFile].includes(opponentBackRank) ||
                    (targetFile != 0 && newPawns[1 - side][targetFile - 1].includes(opponentBackRank)) ||
                    (targetFile != 7 && newPawns[1 - side][targetFile + 1].includes(opponentBackRank))) {
                    continue;
                }

                if (existsDirectPath(newPawns, side, [file, rank], targetSquare)) {
                    debugLog3("Simplifying pawn at " + file + " " + rank + " to " + targetFile, depth);
                    simplified = true;
                    removed[sourceSquare] = newInvertedAssignments[sourceSquare];
                    delete newInvertedAssignments[sourceSquare];
                    const index = newPawns[side][file].indexOf(rank);
                    assert(index != -1, rank + " was not found in " + newPawns[side][file] + " on side = "
                        + side + " file = " + file);
                    newPawns[side][file].splice(index, 1);
                    let distance = 0;
                    distance += Math.abs(targetFile - file);
                    const unblockedFile = blockedPromotedPawn(newPawns, side, file, rank);
                    if (unblockedFile != -1 &&
                        (targetFile == file || Math.sign(targetFile - file) != Math.sign(unblockedFile - file))) {
                        distance += 2;
                    }
                    if (which == side || which == 2) {
                        simplifiedValue += distance;
                    }
                    if (getEnableSeparateCaptureTracking()) {
                        if (side == 0) {
                            whiteCapturesLeft -= distance;
                        } else {
                            blackCapturesLeft -= distance;
                        }
                        if (whiteCapturesLeft < 0 || blackCapturesLeft < 0) {
                            restore(invertedAssignments, removed);
                            cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                            return IMPOSSIBLE;
                        }
                    }
                }
            }
        }
    }

    let lowerBound = 0;
    let best = bestPreviousLevel;
    let keyFound = false;
    let whiteZeroDistanceSquares = [], blackZeroDistanceSquares = [];
    let whiteTotalDistance = 0, blackTotalDistance = 0;
    for (const sourceSquare in newInvertedAssignments) {
        if (newInvertedAssignments.hasOwnProperty(sourceSquare)) {
            keyFound = true;
            const side = (newInvertedAssignments[sourceSquare][1] == 1) ? 0 : 1;
            const file = parseInt(sourceSquare.charAt(0));
            const rank = parseInt(sourceSquare.charAt(2));
            const pawnDir = side == 0 ? -1 : 1;
            const targetFile = newInvertedAssignments[sourceSquare][0];
            const targetRank = newInvertedAssignments[sourceSquare][1];
            if (targetFile == file && targetRank == rank) {
                if (side == 0) {
                    whiteZeroDistanceSquares.push([file, rank]);
                } else {
                    blackZeroDistanceSquares.push([file, rank]);
                }
                continue;
            }
            if (Math.sign(targetRank - rank) != pawnDir) {
                restore(invertedAssignments, removed);
                cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                return IMPOSSIBLE;
            }
            if (Math.abs(targetRank - rank) < Math.abs(targetFile - file)) {
                restore(invertedAssignments, removed);
                cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                return IMPOSSIBLE;
            }
            const lastRank = side == 0 ? 7 : 0;
            const secondLastRank = side == 0 ? 6 : 1;
            if (rank == lastRank && newPawns[1 - side][file].includes(secondLastRank) &&
                (file == 0 || newPawns[1 - side][file - 1].includes(secondLastRank)) &&
                (file == 7 || newPawns[1 - side][file + 1].includes(secondLastRank))) {
                restore(invertedAssignments, removed);
                cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                return IMPOSSIBLE;
            }
            if (specialConfigurationSide == side && rank == (side == 0 ? 7 : 0)) {
                continue;
            }
            let distance = 0;
            distance += Math.abs(targetFile - file);
            const unblockedFile = blockedPromotedPawn(newPawns, side, file, rank);
            if (unblockedFile != -1 &&
                (Math.sign(targetFile - file) == -Math.sign(unblockedFile - file))) {
                distance += 2;
            } else if (rank == lastRank) {
                const thirdLastRank = secondLastRank + pawnDir;
                for (const adjacentFile of [file - 1, file + 1]) {
                    if (adjacentFile >= 0 && adjacentFile <= 7 && targetFile == adjacentFile &&
                        newPawns[1 - side][file].includes(secondLastRank) &&
                        newPawns[1 - side][adjacentFile].includes(thirdLastRank) &&
                        newInvertedAssignments[[adjacentFile, thirdLastRank, 0]][0] == adjacentFile
                    ) {
                        distance += 2;
                        break;
                    }
                }
            }
            if (which == side || which == 2) {
                lowerBound += distance;
            }
            if (side == 0) {
                whiteTotalDistance += distance;
            } else {
                blackTotalDistance += distance;
            }
            if (whiteTotalDistance > whiteCapturesLeft || blackTotalDistance > blackCapturesLeft) {
                restore(invertedAssignments, removed);
                cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                return IMPOSSIBLE;
            }
            if (targetFile == file) {
                if (side == 0) {
                    whiteZeroDistanceSquares.push([file, rank]);
                } else {
                    blackZeroDistanceSquares.push([file, rank]);
                }
            }
        }
    }

    let whiteLowerBound = 0, blackLowerBound = 0, eitherLowerBound = 0;
    for (const [whiteFile, whiteRank] of whiteZeroDistanceSquares) {
        for (const [blackFile, blackRank] of blackZeroDistanceSquares) {
            if (whiteFile == blackFile && whiteRank > blackRank) {
                if ([5, 6].includes(blackRank)) {
                    whiteLowerBound += 2;
                } else if ([1, 2].includes(whiteRank)) {
                    blackLowerBound += 2;
                } else {
                    eitherLowerBound += 2;
                }
            }
        }
    }
    if (!getEnableSeparateCaptureTracking()) {
        if (which == 0) {
            lowerBound += whiteLowerBound;
        } else if (which == 1) {
            lowerBound += blackLowerBound;
        } else {
            lowerBound += whiteLowerBound + blackLowerBound + eitherLowerBound;
        }
    } else {
        if (whiteTotalDistance + whiteLowerBound > whiteCapturesLeft ||
            blackTotalDistance + blackLowerBound > blackCapturesLeft ||
            whiteLowerBound + blackLowerBound + eitherLowerBound >
              previousEven(whiteCapturesLeft - whiteTotalDistance) + previousEven(blackCapturesLeft - blackTotalDistance)) {
            restore(invertedAssignments, removed);
            cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
            return IMPOSSIBLE;
        }

        if (which == 0) {
            if (blackTotalDistance + blackLowerBound + eitherLowerBound > blackCapturesLeft) {
                const excessBound = blackTotalDistance + blackLowerBound + eitherLowerBound - blackCapturesLeft;
                whiteLowerBound += nextEven(excessBound);
            }
            if (whiteTotalDistance + whiteLowerBound > whiteCapturesLeft) {
                restore(invertedAssignments, removed);
                cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                return IMPOSSIBLE;
            }
            lowerBound += whiteLowerBound;
        } else if (which == 1) {
            if (whiteTotalDistance + whiteLowerBound + eitherLowerBound > whiteCapturesLeft) {
                const excessBound = whiteTotalDistance + whiteLowerBound + eitherLowerBound - whiteCapturesLeft;
                blackLowerBound += nextEven(excessBound);
            }
            if (blackTotalDistance + blackLowerBound > blackCapturesLeft) {
                restore(invertedAssignments, removed);
                cache[cacheKey] = new PawnCapturesCacheResult(IMPOSSIBLE, true);
                return IMPOSSIBLE;
            }
            lowerBound += blackLowerBound;
        } else {
            lowerBound += whiteLowerBound + blackLowerBound + eitherLowerBound;
        }
    }

    debugLog3("Lower bound after simplification is " + (simplifiedValue + lowerBound), depth);
    if (simplifiedValue + lowerBound >= bestPreviousLevel) {
        restore(invertedAssignments, removed);
        cache[cacheKey] = new PawnCapturesCacheResult(simplifiedValue + lowerBound, false);
        debugLog3("Early cutoff, lower bound >= bestPreviousLevel " + bestPreviousLevel, depth);
        return simplifiedValue + lowerBound;
    }

    if (!keyFound) {
        restore(invertedAssignments, removed);
        cache[cacheKey] = new PawnCapturesCacheResult(simplifiedValue, true);
        debugLog3("Board is empty, returning value " + simplifiedValue, depth);
        return simplifiedValue;
    }

    const keys = [];
    for (const sourceSquare in newInvertedAssignments) {
        if (newInvertedAssignments.hasOwnProperty(sourceSquare)) {
            keys.push(sourceSquare);
        }
    }

    for (const sourceSquare of keys) {
        const side = (newInvertedAssignments[sourceSquare][1] == 1) ? 0 : 1;
        const file = parseInt(sourceSquare.charAt(0));
        const rank = parseInt(sourceSquare.charAt(2));
        const keyIndex = parseInt(sourceSquare.charAt(4));
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
            for (const newFile of searchOrder) {
                let weight;
                if (specialConfigurationSide == side && rank == (side == 0 ? 7 : 0)) {
                    weight = 0;
                } else {
                    weight = (newFile != file && (which == 2 || which == side)) ? 1 : 0;
                }
                if (newFile >= 0 && newFile <= 7 && simplifiedValue + weight < best &&
                    newPawns[side][newFile].indexOf(newRank) == -1 &&
                    newPawns[1 - side][newFile].indexOf(newRank) == -1) {
                    const index = newPawns[side][file].indexOf(rank);
                    newPawns[side][file].splice(index, 1);
                    newPawns[side][newFile].push(newRank);
                    let newKeyIndex = 0;
                    while ([newFile, newRank, newKeyIndex] in newInvertedAssignments) {
                        newKeyIndex++;
                    }
                    newInvertedAssignments[[newFile, newRank, newKeyIndex]] = newInvertedAssignments[[file, rank, keyIndex]];
                    const originalAssignment = newInvertedAssignments[[file, rank, keyIndex]];
                    delete newInvertedAssignments[[file, rank, keyIndex]];
                    debugLog3("Moving pawn from " + file + " " + rank + " to " + newFile + " " + newRank, depth);

                    const recursiveValue = evaluateHelper(
                        newPawns, best - simplifiedValue - weight,
                        getEnableSeparateCaptureTracking() ? whiteCapturesLeft - ((side == 0 && newFile != file) ? 1 : 0) : whiteCapturesLeft,
                        getEnableSeparateCaptureTracking() ? blackCapturesLeft - ((side == 1 && newFile != file) ? 1 : 0) : blackCapturesLeft,
                        newInvertedAssignments, which,
                        specialConfigurationSide, cache, depth+1);
                    const recursiveBest = simplifiedValue + weight + recursiveValue;
                    debugLog3("Evaluation is " + recursiveBest, depth);
                    if (recursiveBest < best) best = recursiveBest;
                    debugLog3("Unmoving pawn from " + newFile + " " + newRank + " to " + file + " " + rank, depth);

                    newPawns[side][newFile].splice(newPawns[side][newFile].length - 1, 1);
                    newPawns[side][file].push(rank);
                    newInvertedAssignments[[file, rank, keyIndex]] = originalAssignment;
                    delete newInvertedAssignments[[newFile, newRank, newKeyIndex]];

                    if (best == simplifiedValue + lowerBound) {
                        restore(invertedAssignments, removed);
                        cache[cacheKey] = new PawnCapturesCacheResult(best, true);
                        debugLog3("Reached lower bound, returning " + best, depth);
                        return best;
                    }
                }
            }
        }
    }

    restore(invertedAssignments, removed);
    cache[cacheKey] = new PawnCapturesCacheResult(best, true);
    debugLog3("Tried all moves, returning " + best, depth);
    return best;
}

function evaluate(assignments, which, specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft) {
    const startTime = Date.now();
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
                let index = 0;
                while ([assignments[side][file][0], assignments[side][file][1], index] in invertedAssignments) {
                    index++;
                }
                invertedAssignments[[assignments[side][file][0], assignments[side][file][1], index]] = [
                    file, side == 0 ? 1 : 6
                ];
            }
        }
    }
    const cache = (specialConfigurationSide != -1 ? {} : (which == 0 ? evaluateHelperCache.whitePawnCapturesCache :
        (which == 1 ? evaluateHelperCache.blackPawnCapturesCache : evaluateHelperCache.totalPawnCapturesCache)));
    const result = evaluateHelper(pawns, bestResult, whiteCapturesLeft, blackCapturesLeft, invertedAssignments, which,
        specialConfigurationSide, cache, 0);
    const stopTime = Date.now();
    const timeTaken = (stopTime - startTime) / 1000.0;
    if (timeTaken > 0.01) {
        debugLog2(assignmentsToString(assignments));
        debugLog2("evaluate(assignments, " +
            [which, specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft].join(",")
            + ")", 0);
        debugLog2(timeTaken + " seconds");
    }
    return result;
}

function findPawnToAssign(pawns, which) {
    /*
     If which == 2 (counting total captures), then search in order:
       white's 2nd rank, black's 2nd rank, white's 3rd rank, black's 3rd rank, ...

     Otherwise we are counting only one side's captures. Start with the side whose
       captures are not being counted, and search their 2nd, 3rd, ... ranks; then do
       the same for the side whose captures are being counted.
     */

    if (which == 2) {
        for (let relativeRank = 1; relativeRank <= 7; relativeRank++) {
            for (let side = 0; side <= 1; side++) {
                const rank = side == 0 ? relativeRank : 7 - relativeRank;
                for (let file = 0; file < 8; file++) {
                    const index = pawns[side][file].indexOf(rank);
                    if (index != -1) {
                        return [side, file, index];
                    }
                }
            }
        }
    } else {
        for (let side in [1 - which, which])  {
           for (let relativeRank = 1; relativeRank <= 7; relativeRank++) {
                const rank = side == 0 ? relativeRank : 7 - relativeRank;
                for (let file = 0; file < 8; file++) {
                    const index = pawns[side][file].indexOf(rank);
                    if (index != -1) {
                        return [side, file, index];
                    }
                }
           }
        }
    }

    assert(false, "Empty board, shouldn't have gotten here.");
}

function assignmentsToString(assignments) {
    let result = "assignments = [";
    for (let side = 0; side < 2; side++) {
        if (side == 0) {
            result += "[";
        } else {
            result += "],[";
        }
        for (let file = 0; file < 8; file++) {
            result += "[" + assignments[side][file] + "]";
            if (file < 7) {
                result += ","
            }
        }
    }
    result += "]];"
    return result;
}

function search(searchState, which, specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft, heap) {
    debugLog2("Searching: ");
    debugLog2("which = " + which);
    debugLog2("Estimated distance: " + searchState.estimatedDistance);
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
        let leftmostFile = Math.max(file - maxDistance, 0);
        let rightmostFile = Math.min(file + maxDistance, 7);
        const lastRank = side == 0 ? 7 : 0;
        const secondLastRank = (side == 0) ? 1 : 6;
        const thirdLastRank = (side == 0) ? 2 : 5;
        if (file == 0 && rank == lastRank && newPawns[1 - side][1].includes(secondLastRank)) {
            rightmostFile = 5;
        } else if (file == 7  && rank == lastRank && newPawns[1 - side][6].includes(secondLastRank)) {
            leftmostFile = 2;
        } else if (file == 1 && rank == lastRank) {
            if (newPawns[1 - side][2].includes(secondLastRank)) {
                rightmostFile--;
                if (newPawns[1 - side][1].includes(secondLastRank)) {
                    rightmostFile--;
                    if (newPawns[1 - side][1].includes(thirdLastRank)) {
                        rightmostFile--;
                    }
                }
            }
        } else if (file == 6 && rank == lastRank) {
            if (newPawns[1 - side][5].includes(secondLastRank)) {
                leftmostFile++;
                if (newPawns[1 - side][6].includes(secondLastRank)) {
                    leftmostFile++;
                    if (newPawns[1 - side][6].includes(thirdLastRank)) {
                        leftmostFile++;
                    }
                }
            }
        }
        for (let newFile = leftmostFile; newFile <= rightmostFile; newFile++) {
            if (assignments[side][newFile][0] != -1) continue;
            debugLog2("Assigning pawn at: " + file + " " + rank + " to: " + newFile);

            const newAssignments = copyAssignments(assignments);
            newAssignments[side][newFile][0] = file;
            newAssignments[side][newFile][1] = rank;
            const heuristicEstimate = getTwoColorHeuristic(newPawns, which, newAssignments);
            if (heuristicEstimate != IMPOSSIBLE) {
                const value = evaluate(newAssignments, which, specialConfigurationSide, bestResult - heuristicEstimate,
                    whiteCapturesLeft, blackCapturesLeft);
                if (value != IMPOSSIBLE) {
                    const newState = new PawnCaptureSearchState(newPawns, newAssignments, value + heuristicEstimate);
                    insertIntoHeap(newState, heap);
                    debugLog2("New estimated distance: " + (value + heuristicEstimate));
                } else {
                    debugLog2("Evaluation is impossible");
                }
            } else {
                debugLog2("Heuristic estimate is impossible");
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

class PawnCapturesCacheResult {
    constructor(result, isExact) {
        this.result = result;
        this.isExact = isExact; // if false, then the result is only a lower bound
    }
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
let evaluateHelperCache = new PawnCapturesCache();

function getPawnCaptureCache() {
    return pawnCapturesCache;
}

function getPawnCaptures(pawns, which, specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft) {
    const startTime = Date.now();
    // which = 0: min captures for white.
    // which = 1: min captures for black.
    // which = 2: min total captures.

    const heap = [];
    let iterations = 1;
    let result = search(new PawnCaptureSearchState(pawns, blankAssignments(), 0), which,
        specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft, heap);
    while (result == null && heap.length > 0) {
        const nextState = getNextState(heap);
        if (nextState.estimatedDistance >= bestResult) {
            debugLog2("Early cutoff " + nextState.estimatedDistance + " >= " + bestResult);
            debugLog2("TIme: " + (Date.now() - startTime) / 1000.0 + " seconds");
            return nextState.estimatedDistance;
        }
        result = search(nextState, which, specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft, heap);
        iterations++;
    }

    if (result != null) {
        debugLog2("TIme: " + (Date.now() - startTime) / 1000.0 + " seconds");
        return result;
    }
    debugLog2("TIme: " + (Date.now() - startTime) / 1000.0 + " seconds");
    return IMPOSSIBLE;
}

function getPawnCapturesWithPromotionSearch(board, promotionFiles, missingFriendlyRookData, which, cache) {
    const startTime = Date.now();
    let whiteUnitCount = 0, blackUnitCount = 0;
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            if (board[file][rank].color == "w") {
                whiteUnitCount++;
            } else if (board[file][rank].color == "b") {
                blackUnitCount++;
            }
        }
    }
    const whiteCapturesLeft = getEnableSeparateCaptureTracking() ? 16 - blackUnitCount : IMPOSSIBLE;
    const blackCapturesLeft = getEnableSeparateCaptureTracking() ? 16 - whiteUnitCount : IMPOSSIBLE;
    let bestResult = which == 0 ? 17 - blackUnitCount : (which == 1 ? 17 - whiteUnitCount :
        33 - (blackUnitCount + whiteUnitCount));

    const pawnsOriginal = getPawns(board);
    const cacheKey = JSON.stringify([pawnsOriginal, promotionFiles, missingFriendlyRookData, whiteCapturesLeft, blackCapturesLeft]);
    const cacheLookup = cache[cacheKey];
    if (cacheLookup && (cacheLookup.isExact || cacheLookup.result >= bestResult)) {
        return cacheLookup.result;
    }
    debugLog0(getForsythe(board) + " which = " + which);

    // capture will be made by the OPPOSITE side of the rook's side
    const potentialMissingFriendlyRookCaptureCount =
            missingFriendlyRookData.reduce((acc, rookData) => acc + ((which == 2 || which != rookData[0]) ? rookData[1] : 0), 0);

    let allPromotionFiles = [];
    const whitePromotionIndices = [];
    let count = 0;
    let productSize = 1;
    let whitePromotedPieces = 0, blackPromotedPieces = 0;
    for (const key in promotionFiles) {
        if (promotionFiles.hasOwnProperty(key)) {
            if (promotionFiles[key].length > 0) {
                for (const item of promotionFiles[key]) {
                    productSize *= item.length;
                }
                allPromotionFiles = allPromotionFiles.concat(promotionFiles[key]);
                assert(key[0] == "w" || key[0] == "b", "Unexpected promotion files key: " + key);
                if (key[0] == "w") {
                    whitePromotedPieces += promotionFiles[key].length;
                    for (let i = 0; i < promotionFiles[key].length; i++) {
                        whitePromotionIndices.push(count + i);
                    }
                } else {
                    blackPromotedPieces += promotionFiles[key].length;
                }
                count += promotionFiles[key].length;
            }
        }
    }
    debugLog("productSize: " + productSize);
    debugLog("which = " + which);
    let debugCount = 0;
    if (productSize <= getPromotionSearchThreshold() && allPromotionFiles.length > 0) {
        let done = false;
        const position = Array(allPromotionFiles.length).fill(0);
        let isExact = false;
        while (!done) {
            debugCount++;
            debugLog("debugCount: " + debugCount);
            if (DEBUG_POSITIONS.some(([a,b]) => a == which && b == debugCount)) {
                DEBUG_PAWN_CAPTURES2 = true;
                debugLog2("which = " + which + ", debugCount = " + debugCount);
            } else {
                DEBUG_PAWN_CAPTURES2 = false;
            }
            // start with the original board and put the pawns on the proper promotion squares
            // One square may have more than one pawn!
            const pawns = copyPawns(pawnsOriginal);
            const missingFriendlyRookCounts =
                missingFriendlyRookData.map(rookData => ((which == 2 || which != rookData[0]) ? rookData[1] : 0));
            let missingFriendlyRookCaptureCount = potentialMissingFriendlyRookCaptureCount;
            let specialConfigurationSide = -1;
            for (let i = 0; i < allPromotionFiles.length; i++) {
                const file = allPromotionFiles[i][position[i]];
                let side;
                if (whitePromotionIndices.includes(i)) {
                    side = 0;
                    pawns[0][file].push(7);
                    debugLog("Adding white promoted pawn on file " + file);
                } else {
                    side = 1;
                    pawns[1][allPromotionFiles[i][position[i]]].push(0);
                    debugLog("Adding black promoted pawn on file " + file);
                }

                for (let j = 0; j < missingFriendlyRookData.length; j++) {
                    // if there is a promoted piece assigned to this cage, then don't include it in the additional
                    // friendly rook count, because it will be included in the pawn capture count.
                    const [rookSide, count, left, right] = missingFriendlyRookData[j];
                    if (side != rookSide && (which == 2 || which == side) && left <= file && file <= right &&
                        missingFriendlyRookCounts[j] > 0) {

                        missingFriendlyRookCounts[j]--;
                        missingFriendlyRookCaptureCount--;

                        // "Special Configuration" if one side has 2 missing rooks in one cage and other side has exactly
                        // 1 promoted piece.
                        if (count == 2) {
                            const sidePromotedPieces = side == 0 ? whitePromotedPieces : blackPromotedPieces;
                            specialConfigurationSide = sidePromotedPieces == 1 ? side : -1;
                        }
                    }
                }
            }

            // Solve this configuration
            const startInnerTime = Date.now();
            const result = getPawnCaptures(pawns, which, specialConfigurationSide, bestResult, whiteCapturesLeft, blackCapturesLeft)
                + missingFriendlyRookCaptureCount;
            const stopInnerTime = Date.now();
            debugLog("Result: " + result);
            debugLog((stopInnerTime - startInnerTime) / 1000.0 + " seconds");
            if (result == 0) {
                cache[cacheKey] = new PawnCapturesCacheResult(0, 0 < bestResult);
                const stopTime = Date.now();
                debugLog0("Time for this position: " + (stopTime - startTime)/1000.0 + " seconds");
                return 0;
            }
            if (result < bestResult) {
                bestResult = result;
                isExact = true;
            }

            // Find the next configuration
            let positionIndex = 0;
            while (positionIndex < allPromotionFiles.length &&
                position[positionIndex] == allPromotionFiles[positionIndex].length - 1) {
                position[positionIndex] = 0;
                positionIndex++;
            }
            if (positionIndex < allPromotionFiles.length) {
                position[positionIndex]++;
            } else {
                done = true;
            }
        }
        cache[cacheKey] = new PawnCapturesCacheResult(bestResult, isExact);
        const stopTime = Date.now();
        debugLog0("Time for this position: " + (stopTime - startTime)/1000.0 + " seconds");
        return bestResult;
    } else {
        const result = getPawnCaptures(pawnsOriginal, which, -1, bestResult, whiteCapturesLeft, blackCapturesLeft)
            + potentialMissingFriendlyRookCaptureCount;
        cache[cacheKey] = new PawnCapturesCacheResult(result, result < bestResult);
        const stopTime = Date.now();
        debugLog0("Time for this position: " + (stopTime - startTime)/1000.0 + " seconds");
        return result;
    }
}

function getWhitePawnCaptures(board, promotionFiles, missingFriendlyRookData) {
    if (promotionFiles == null) {
        promotionFiles = {};
    }
    if (missingFriendlyRookData == null) {
        missingFriendlyRookData = [];
    }
    return getPawnCapturesWithPromotionSearch(board, promotionFiles, missingFriendlyRookData, 0,
        pawnCapturesCache.whitePawnCapturesCache);
}

function getBlackPawnCaptures(board, promotionFiles, missingFriendlyRookData) {
    if (promotionFiles == null) {
        promotionFiles = {};
    }
    if (missingFriendlyRookData == null) {
        missingFriendlyRookData = [];
    }
    return getPawnCapturesWithPromotionSearch(board, promotionFiles, missingFriendlyRookData, 1,
        pawnCapturesCache.blackPawnCapturesCache);
}

function getTotalPawnCaptures(board, promotionFiles, missingFriendlyRookData) {
    if (promotionFiles == null) {
        promotionFiles = {};
    }
    if (missingFriendlyRookData == null) {
        missingFriendlyRookData = [];
    }
    return getPawnCapturesWithPromotionSearch(board, promotionFiles, missingFriendlyRookData, 2,
        pawnCapturesCache.totalPawnCapturesCache);
}
