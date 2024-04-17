class CageVerificationResult {
    constructor(isCageVerified, retractionSequence) {
        this.isCageVerified = isCageVerified;
        this.retractionSequence = retractionSequence;
    }
}

class RequestedCage {
    constructor(board, depth) {
        this.board = board;
        this.depth = depth;
    }
}

const DEFAULT_DEPTH = 30;

let knownCages = [];
let serializedRequestedCages = [];

function clearCages() {
    knownCages = [];
    serializedRequestedCages = [];
}

function cageToString(requestedCage) {
    const forsythe = getForsythe(requestedCage.board);
    const frozenSquareList = [];
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            if (requestedCage.board[file][rank].frozen && requestedCage.board[file][rank].unit != 'P') {
                frozenSquareList.push(getCoordsAlgNotation(file, rank));
            }
        }
    }
    const resultElements = [];
    resultElements.push(forsythe);
    if (frozenSquareList.length > 0) {
        resultElements.push("frozen=" + frozenSquareList.join());
    }
    resultElements.push("depth=" + requestedCage.depth.toString());

    return resultElements.join(" ");
}

const SERIALIZED_CAGE_DUPLICATE = 1;
const SERIALIZED_CAGE_INVALID = 2;

function parseSerializedCage(line) {
    const globalState = saveGlobalState();

    const chunks = line.trim().split(/\s+/);
    const forsythe = chunks[0];
    let result;
    initializeBoard();
    if (!setForsythe(forsythe)) {
        result = null;
    } else {
        let depth = DEFAULT_DEPTH;
        let invalid = false;
        for (const chunk of chunks) {
            const keyValue = chunk.split("=", 2);
            switch (keyValue[0].toLowerCase()) {
                case 'depth':
                    if (keyValue[1].match(/^[0-9]+$/g)) {
                        depth = parseInt(keyValue[1]);
                    } else {
                        invalid = true;
                    }
                    break;

                case 'frozen':
                    const frozenSquareStrings = keyValue[1].split(",");
                    for (const squareString of frozenSquareStrings) {
                        if (squareString.length == 2) {
                            let file, rank;
                            const fileString = squareString[0].toLowerCase();
                            file = "abcdefgh".indexOf(fileString);
                            if (file == -1) {
                                invalid = true;
                                break;
                            }
                            const rankString = squareString[1];
                            rank = "12345678".indexOf(rankString);
                            if (rank == -1) {
                                invalid = true;
                                break;
                            }

                            // make sure the frozen square is occupied by the unit that started there
                            if (originalSquares[board[file][rank].color + board[file][rank].unit].includes(fileString + rankString)) {
                                setFrozenFlag(file, rank, true);
                            } else {
                                invalid = true;
                                break;
                            }
                        } else {
                            invalid = true;
                            break;
                        }
                    }
                    break;
            }
            if (invalid) {
                break;
            }
        }
        if (invalid) {
            result = null;
        } else {
            result = new RequestedCage(copyBoard(), depth);
        }
    }

    restoreGlobalState(globalState);

    if (result == null) {
        return SERIALIZED_CAGE_INVALID;
    }

    const serializedCage = cageToString(result);
    if (serializedRequestedCages.includes(serializedCage)) {
        return SERIALIZED_CAGE_DUPLICATE;
    }
    return result;
}

function importCages(serializedCages) {
    /* If any imported cage has invalid Forsythe notation, then no cages are imported
       and the function returns a list [n] of size 1 where n is the first line number in the imported file
       with invalid Forsythe notation.

       Otherwise, all verifiable cage are imported, and the function returns a list of length 3:
       [badLineNumbers, successfulImportCount, duplicates], indicating:
          badLineNumbers - line numbers where cages could not be verified, or one of the other fields besides Forsythe
                           was invalid
          successfulImportCount - the number of cages verified and imported
          duplicates - the number of cages that were duplicates of cages already in serializedRequestedCages
                       (either previously imported, or manually entered and verified in the current session)
     */
    const lines = serializedCages.split("\n");
    const requestedCagesWithLineNumbers = [];
    let lineNumber = 0;
    let duplicates = 0;
    for (const line of lines) {
        lineNumber++;
        if (line.trim().length == 0) {
            continue;
        }
        const requestedCage = parseSerializedCage(line);
        if (requestedCage == SERIALIZED_CAGE_INVALID) {
            return [lineNumber];
        }
        if (requestedCage == SERIALIZED_CAGE_DUPLICATE) {
            duplicates++;
        } else {
            requestedCagesWithLineNumbers.push([requestedCage, lineNumber]);
        }
    }

    const badLineNumbers = [];
    let successfulImportCount = 0;
    for (const [cage, lineNumber] of requestedCagesWithLineNumbers) {
        const result = verifyCage(cage.board, null, true, cage.depth);
        if (result.isCageVerified) {
            successfulImportCount++;
        } else {
            badLineNumbers.push(lineNumber);
        }
    }
    return [badLineNumbers, successfulImportCount, duplicates];
}

function getZoneSquares() {
    // all squares that are either occupied or a king's move from an occupied square
    const zoneSquares = [];
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            if (board[file][rank].unit != "") {
                for (let deltaFile = -1; deltaFile <= 1; deltaFile++) {
                    for (let deltaRank = -1; deltaRank <= 1; deltaRank++) {
                        const newFile = file + deltaFile;
                        const newRank = rank + deltaRank;
                        if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
                            const newSquare = new Square(newFile, newRank);
                            if (!zoneSquares.some(oldSquare => squareEquals(oldSquare, newSquare))) {
                                zoneSquares.push(new Square(newFile, newRank));
                            }
                        }
                    }
                }
            }
        }
    }
    return zoneSquares;
}

const originalSquares = {
    'wR': ['a1', 'h1'],
    'wN': ['b1', 'g1'],
    'wB': ['c1', 'f1'],
    'wQ': ['d1'],
    'wK': ['e1'],
    'wP': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(c => c + "2"),
    'bR': ['a8', 'h8'],
    'bN': ['b8', 'g8'],
    'bB': ['c8', 'f8'],
    'bQ': ['d8'],
    'bK': ['e8'],
    'bP': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(c => c + "7")
}

function inHomeSquares(zoneSquares) {
    return zoneSquares.every(square =>
        board[square.mFile][square.mRank].unit == "" ||
        originalSquares[board[square.mFile][square.mRank].color + board[square.mFile][square.mRank].unit].includes(
            getSquareAlgNotation(square)));
}

const DEBUG_CAGE_VERIFY = false;

function verifyCageSearch(zoneSquares, previousRetractor, currentPath, retractionSequence, depth, cache) {
    // A detailed description of this algorithm can be found at:
    // https://github.com/hwatheod/retractor-python/blob/main/doc/cages.pdf

    // check cache
    if (containsBoard(cache, board)) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Illegal because already in cache");
        }
        return true;
    }

    // check for loop to an existing position on the current path
    if (containsBoard(currentPath, board)) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Illegal because of a loop");
        }
        return true;
    }

    // no double (or higher) unblockable checks and both kings cannot be in unblockable check
    const whiteKingCheckers = (positionData.kingPosition['w'] != null ? getCheckingUnits('w', true) : []);
    const blackKingCheckers = (positionData.kingPosition['b'] != null ? getCheckingUnits('b', true) : []);
    if (whiteKingCheckers.length + blackKingCheckers.length > 1) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Illegal because of an illegal check");
        }
        return true;
    }

    // previous retractor cannot leave the opposing king in check
    if ((previousRetractor == 'w' && blackKingCheckers.length > 0) ||
        (previousRetractor == 'b' && whiteKingCheckers.length > 0)) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Illegal because previous retraction left opposing king in check");
        }
        return true;
    }

    // check if position contains an already known illegal cage
    if (knownCages.some(cage => boardContainsCage(board, cage))) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Illegal because it contains a previously known cage:");
        }
        return true;
    }

    // check if maximum depth reached
    if (depth == 0) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Failure because maximum depth reached");
            printBoard(board);
        }
        return false;
    }

    // check if all units are back in their home squares
    if (inHomeSquares(zoneSquares)) {
        if (DEBUG_CAGE_VERIFY) {
            console.log("Failure because all units are back on their home squares");
            printBoard(board);
        }
        return false;
    }

    // if someone is in check, then only the side not in check can retract, and only from the square with the checking
    // unit. Otherwise, both sides can retract from any square.
    let retractions;
    if (whiteKingCheckers.length > 0) {
        retractions = [];
        getPseudoLegalMovesSquare(whiteKingCheckers[0].mFile, whiteKingCheckers[0].mRank, 'b', retractions, false, true);
    } else if (blackKingCheckers.length > 0) {
        retractions = [];
        getPseudoLegalMovesSquare(blackKingCheckers[0].mFile, blackKingCheckers[0].mRank, 'w', retractions, false, true);
    } else {
        const whiteRetractions = getPseudoLegalMoves('w', false, true);
        const blackRetractions = getPseudoLegalMoves('b', false, true);
        retractions = whiteRetractions.concat(blackRetractions);
    }

    // Remove any units that can be retracted outside of the zone
    const removedUnits = [];
    retractions.forEach(retraction => {
        const uncastle = board[retraction.from.mFile][retraction.from.mRank].unit == 'K' &&
            Math.abs(retraction.from.mFile - retraction.to.mFile) > 1;
        if (!uncastle && !zoneSquares.some(zoneSquare => squareEquals(zoneSquare, retraction.to))) {
            const removedUnit = new Piece("", "");
            copyPiece(removedUnit, board[retraction.from.mFile][retraction.from.mRank]);
            if (!isEmpty(removedUnit)) { // empty means we removed this unit already from another retraction with the same unit
                retractionSequence.push(retraction);
                removedUnits.push([retraction.from, removedUnit]);
                if (DEBUG_CAGE_VERIFY) {
                    console.log("Removing " + removedUnit.color + removedUnit.unit + " from " + getSquareAlgNotation(retraction.from) +
                        " because it can retract to " + getSquareAlgNotation(retraction.to));
                }
                emptyPieceAt(retraction.from.mFile, retraction.from.mRank);
            }
        }
    });

    if (removedUnits.length > 0) {
        // If we removed any units, then recurse with the position after removing those units.
        if (!verifyCageSearch(zoneSquares, previousRetractor, currentPath, retractionSequence, depth - 1, cache)) {
            return false;
        }
        removedUnits.forEach(removedUnit => {
            retractionSequence.splice(-1, 1); // delete last element
            placePieceAt(removedUnit[0].mFile, removedUnit[0].mRank, removedUnit[1]);
            if (DEBUG_CAGE_VERIFY) {
                console.log("Restoring " + removedUnit[1].color + removedUnit[1].unit + " at " +
                    getSquareAlgNotation(removedUnit[0]));
                printBoard(board);
            }
        });
    } else {
        // Otherwise, recurse with each possible retraction.
        currentPath.push(copyBoard());
        for (let i = 0; i < retractions.length; i++) {
            const retraction = retractions[i];
            if (DEBUG_CAGE_VERIFY) {
                console.log("Depth = " + depth + " Retracting: " + moveToString(retraction));
            }
            retractionSequence.push(retraction);
            const retractor = board[retraction.from.mFile][retraction.from.mRank].color;
            doRetraction(retraction.from, retraction.to, retraction.uncapturedUnit, retraction.unpromote, false, false);
            if (!verifyCageSearch(zoneSquares, retractor, currentPath, retractionSequence, depth - 1, cache)) {
                return false;
            }
            retractionSequence.splice(-1, 1); // delete last element
            if (DEBUG_CAGE_VERIFY) {
                console.log("Depth = " + depth + " Undoing: " + moveToString(retraction));
            }
            undo();
        }
        currentPath.splice(-1, 1); // delete last element
    }
    if (DEBUG_CAGE_VERIFY) {
        console.log("Illegal because all retractions from this position were illegal");
    }
    cache.push(copyBoard());
    return true;
}

function verifyCageInternal(saveResults, depth) {
    const zoneSquares = getZoneSquares();
    const cache = [];
    const retractionSequence = [];
    if (depth == null) {
        depth = DEFAULT_DEPTH;
    }
    const isCageVerified = verifyCageSearch(zoneSquares, null, [], retractionSequence, depth, cache);

    if (isCageVerified && saveResults) {
        cache.forEach(cage => knownCages.push(cage));
    }
    return new CageVerificationResult(isCageVerified, retractionSequence);
}

function verifyCage(importedBoard, selectedSquares, saveResults, depth) {
    // Only one of importedBoard or selectedSquares should be specified; the other should be null.

    // saveResults == false is only for unit tests. In normal usage, if the cage is verified, we always save
    // it to be used for future verifications.

    const globalState = saveGlobalState();

    initializeBoard();
    if (importedBoard != null) {
        restoreBoard(importedBoard);
    } else {
        selectedSquares.forEach(square => {
            placePieceAt(square.mFile, square.mRank, globalState.board[square.mFile][square.mRank]);
        });
    }
    const selectedSquaresBoard = copyBoard();
    startPlay(false);

    if (depth == null) {
        depth = DEFAULT_DEPTH;
    }
    const result = verifyCageInternal(saveResults, depth);
    if (saveResults && result.isCageVerified) {
        serializedRequestedCages.push(cageToString(new RequestedCage(selectedSquaresBoard, DEFAULT_DEPTH)));
    }

    restoreGlobalState(globalState);

    return result;
}