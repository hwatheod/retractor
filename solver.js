class SolveParameters {
    constructor(solveDepth, extraDepth, maxSolutions) {
        this.solveDepth = solveDepth;
        this.extraDepth = extraDepth;
        this.maxSolutions = maxSolutions;
    }
}


/*
 We have to define these as functions so that each time, we get a new instance of the move, because
 these are not immutable after creation; the check indicator can be modified.

 The "clone" function doesn't work because it does not preserve the underlying class, but changes
 everything to Object.  So Square(2, 0) becomes Object(2, 0), etc.
*/
const whiteQueensideUncastling = function() {
    return new Move(new Square(2, 0), new Square(4, 0), "", false, "K", false);
}

const whiteKingsideUncastling = function() {
    return new Move(new Square(6, 0), new Square(4, 0), "", false, "K", false);
}

const blackQueensideUncastling = function() {
    return new Move(new Square(2, 7), new Square(4, 7), "", false, "K", false);
}
const blackKingsideUncastling = function() {
    return new Move(new Square(6, 7), new Square(4, 7), "", false, "K", false)
}

function addUncaptures(move, moveList) {
    const uncapturedUnits = ["Q", "R", "B", "N", "P"];
    uncapturedUnits.forEach(uncapturedUnit => {
        if (!(uncapturedUnit == "P" && (move.from.mRank == 0 || move.from.mRank == 7))) {
            const newMove = new Move(move.from, move.to, uncapturedUnit, move.unpromote, move.fromUnit, move.check);
            moveList.push(newMove);
        }
    });
}

function addMove(move, moveList, includeNoUncapture, includeUncaptures) {
    if (includeNoUncapture) {
        moveList.push(move);
    }

    if (includeUncaptures) {
        addUncaptures(move, moveList);
    }
}

function getPseudoLegalMovesVector(file, rank, color, moveList, vector, once, includeNoUncapture, includeUncaptures, unpromote, fromUnit) {
    const [deltaFile, deltaRank] = vector;
    let newFile = file;
    let newRank = rank;

    newFile += deltaFile;
    newRank += deltaRank;
    while (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
        if (!isEmpty(board[newFile][newRank])) return;
        const move = new Move(
            new Square(file, rank),
            new Square(newFile, newRank),
            "",
            unpromote,
            fromUnit,
            false
        );
        addMove(move, moveList, includeNoUncapture, includeUncaptures);
        if (once) break;
        newFile += deltaFile;
        newRank += deltaRank;
    }
}

function getPseudoLegalMovesOrthogonal(file, rank, color, moveList, once, includeNoUncapture, includeUncaptures, fromUnit) {
    getPseudoLegalMovesVector(file, rank, color, moveList, [-1, 0], once, includeNoUncapture, includeUncaptures, false, fromUnit);
    getPseudoLegalMovesVector(file, rank, color, moveList, [1, 0], once, includeNoUncapture, includeUncaptures, false, fromUnit);
    getPseudoLegalMovesVector(file, rank, color, moveList, [0, -1], once, includeNoUncapture, includeUncaptures, false, fromUnit);
    getPseudoLegalMovesVector(file, rank, color, moveList, [0, 1], once, includeNoUncapture, includeUncaptures, false, fromUnit);
}

function getPseudoLegalMovesDiagonal(file, rank, color, moveList, once, includeNoUncapture, includeUncaptures, fromUnit) {
    getPseudoLegalMovesVector(file, rank, color, moveList, [-1, -1], once, includeNoUncapture, includeUncaptures, false, fromUnit);
    getPseudoLegalMovesVector(file, rank, color, moveList, [1, -1], once, includeNoUncapture, includeUncaptures, false, fromUnit);
    getPseudoLegalMovesVector(file, rank, color, moveList, [-1, 1], once, includeNoUncapture, includeUncaptures, false, fromUnit);
    getPseudoLegalMovesVector(file, rank, color, moveList, [1, 1], once, includeNoUncapture, includeUncaptures, false, fromUnit);
}

function getPseudoLegalMovesUnpromotion(file, rank, color, moveList, includeNoUncapture, includeUncaptures, fromUnit) {
    const pawnDir = color == "w" ? -1 : 1;

    if (includeNoUncapture) {
        getPseudoLegalMovesVector(file, rank, color, moveList, [0, pawnDir], true, true, false, true, fromUnit);
    }

    if (includeUncaptures) {
        getPseudoLegalMovesVector(file, rank, color, moveList, [-1, pawnDir], true, false, true, true, fromUnit);
        getPseudoLegalMovesVector(file, rank, color, moveList, [1, pawnDir], true, false, true, true, fromUnit);
    }
}

function getPseudoLegalMovesQueen(file, rank, color, moveList, includeNoUncapture, includeUncaptures) {
    getPseudoLegalMovesDiagonal(file, rank, color, moveList, false, includeNoUncapture, includeUncaptures, "Q");
    getPseudoLegalMovesOrthogonal(file, rank, color, moveList, false, includeNoUncapture, includeUncaptures, "Q");
    if ((color == "w" && rank == 7) || (color == "b" && rank == 0)) {
        getPseudoLegalMovesUnpromotion(file, rank, color, moveList, includeNoUncapture, includeUncaptures, "Q");
    }
}

function getPseudoLegalMovesRook(file, rank, color, moveList, includeNoUncapture, includeUncaptures) {
    getPseudoLegalMovesOrthogonal(file, rank, color, moveList, false, includeNoUncapture, includeUncaptures, "R");
    if ((color == "w" && rank == 7) || (color == "b" && rank == 0)) {
        getPseudoLegalMovesUnpromotion(file, rank, color, moveList, includeNoUncapture, includeUncaptures, "R");
    }
}

function getPseudoLegalMovesBishop(file, rank, color, moveList, includeNoUncapture, includeUncaptures) {
    getPseudoLegalMovesDiagonal(file, rank, color, moveList, false, includeNoUncapture, includeUncaptures, "B");
    if ((color == "w" && rank == 7) || (color == "b" && rank == 0)) {
        getPseudoLegalMovesUnpromotion(file, rank, color, moveList, includeNoUncapture, includeUncaptures, "B");
    }
}

function getPseudoLegalMovesKnight(file, rank, color, moveList, includeNoUncapture, includeUncaptures) {
    const knightVectors = [[-1, -2], [1, 2], [1, -2], [-1, 2], [2, -1], [-2, 1], [2, 1], [-2, -1]];
    knightVectors.forEach(knightVector => {
        getPseudoLegalMovesVector(file, rank, color, moveList, knightVector, true, includeNoUncapture, includeUncaptures, false, "N");
    });
    if ((color == "w" && rank == 7) || (color == "b" && rank == 0)) {
        getPseudoLegalMovesUnpromotion(file, rank, color, moveList, includeNoUncapture, includeUncaptures, "N");
    }
}

function getPseudoLegalMovesPawn(file, rank, color, moveList, includeNoUncapture, includeUncaptures) {
    const pawnDir = color == "w" ? -1 : 1;
    const originalRank = color == "w" ? 1 : 6;
    const doubleStepRank = color == "w" ? 3 : 4;

    if (rank == originalRank) return;

    if (includeNoUncapture) {
        getPseudoLegalMovesVector(file, rank, color, moveList, [0, pawnDir], true, true, false, false, "P");
        if (rank == doubleStepRank && isEmpty(board[file][rank + pawnDir])) {
            getPseudoLegalMovesVector(file, rank, color, moveList, [0, 2 * pawnDir], true, true, false, false, "P");
        }
    }

    if (includeUncaptures) {
        getPseudoLegalMovesVector(file, rank, color, moveList, [-1, pawnDir], true, false, true, false, "P");
        getPseudoLegalMovesVector(file, rank, color, moveList, [1, pawnDir], true, false, true, false, "P");

        // en passant
        const enPassantSourceRank = color == "w" ? 5 : 2;
        if (rank == enPassantSourceRank && isEmpty(board[file][rank - pawnDir]) && isEmpty(board[file][rank + pawnDir])) {
            const targetFiles = [file - 1, file + 1];
            targetFiles.forEach(targetFile => {
                if (targetFile >= 0 && targetFile <= 7 && isEmpty(board[targetFile][rank + pawnDir])) {
                    const move = new Move(
                        new Square(file, rank),
                        new Square(targetFile, rank + pawnDir),
                        "ep",
                        false,
                        "P",
                        false
                    );
                    addMove(move, moveList, true, false);
                }
            });
        }
    }
}

function getPseudoLegalMovesKing(file, rank, color, moveList, includeNoUncapture, includeUncaptures) {
    getPseudoLegalMovesOrthogonal(file, rank, color, moveList, true, includeNoUncapture, includeUncaptures, "K");
    getPseudoLegalMovesDiagonal(file, rank, color, moveList, true, includeNoUncapture, includeUncaptures, "K");

    if (includeNoUncapture) {
        // uncastling
        if (color == "w" && file == 2 && rank == 0 && board[3][0].color == "w" && board[3][0].unit == "R" &&
            isEmpty(board[4][0]) && checkUncastling(2, 0, 4, 0, color) == error_ok) {
            moveList.push(whiteQueensideUncastling());
        } else if (color == "w" && file == 6 && rank == 0 && board[5][0].color == "w" && board[5][0].unit == "R" &&
            isEmpty(board[4][0]) && checkUncastling(6, 0, 4, 0, color) == error_ok) {
            moveList.push(whiteKingsideUncastling());
        } else if (color == "b" && file == 2 && rank == 7 && board[3][7].color == "b" && board[3][7].unit == "R" &&
            isEmpty(board[4][7]) && checkUncastling(2, 7, 4, 7, color) == error_ok) {
            moveList.push(blackQueensideUncastling());
        } else if (color == "b" && file == 6 && rank == 7 && board[5][7].color == "b" && board[5][7].unit == "R" &&
            isEmpty(board[4][7]) && checkUncastling(6, 7, 4, 7, color) == error_ok) {
            moveList.push(blackKingsideUncastling());
        }
    }
}

function getPseudoLegalMovesSquare(file, rank, color, moveList) {
    switch(board[file][rank].unit) {
        case 'K': getPseudoLegalMovesKing(file, rank, color, moveList, true, true); break;
        case 'Q': getPseudoLegalMovesQueen(file, rank, color, moveList, true, true); break;
        case 'R': getPseudoLegalMovesRook(file, rank, color, moveList, true, true); break;
        case 'B': getPseudoLegalMovesBishop(file, rank, color, moveList, true, true); break;
        case 'N': getPseudoLegalMovesKnight(file, rank, color, moveList, true, true); break;
        case 'P': getPseudoLegalMovesPawn(file, rank, color, moveList, true, true); break;
    }
}

function getPseudoLegalMovesNotInCheck(color) {
    const moveList = [];
    if (positionData.ep != -1) {
        const enPassantDoubleStepSourceRank = color == "w" ? 3 : 4;
        const pawnDir = color == "w" ? -1 : 1;
        return [new Move(
            new Square(positionData.ep, enPassantDoubleStepSourceRank),
            new Square(positionData.ep, enPassantDoubleStepSourceRank + 2 * pawnDir),
            "",
            false,
            "P",
            false)];
    }

    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            if (board[file][rank].color == color) {
                if (board[file][rank].frozen) continue;
                getPseudoLegalMovesSquare(file, rank, color, moveList);
            }
        }
    }
    return moveList;
}

// could improve this later
function getPseudoLegalMovesInCheck(color, checkers) {
    const result = getPseudoLegalMovesNotInCheck(color);
    result.forEach(move => {
        move.check = true;
    });
    return result;
}

function getPseudoLegalMoves(color) {
    const checkers = getCheckingUnits(opposite(color));
    if (checkers.length == 0) {
        return getPseudoLegalMovesNotInCheck(color);
    } else {
        return getPseudoLegalMovesInCheck(color, checkers);
    }
}

function legalToDepth(maxDepth, depth) {
    if (depth == maxDepth) {
        return true;
    }
    const pseudoLegalMoves = getPseudoLegalMoves(currentRetract);
    return pseudoLegalMoves.some(pseudoLegalMove => {
        if (doRetraction(pseudoLegalMove.from, pseudoLegalMove.to, pseudoLegalMove.uncapturedUnit, pseudoLegalMove.unpromote, true, true) == error_ok) {
            const result = legalToDepth(maxDepth, depth + 1);
            undo();
            return result;
        } else {
            undo();
        }
        return false;
    });
}

function solveHelper(solveParameters, depth, currentPath, outputSolutions) {
    if (depth == solveParameters.solveDepth) {
        if (legalToDepth(solveParameters.extraDepth, 0)) {
            outputSolutions.push(currentPath.slice());
        }
        return;
    }
    const pseudoLegalMoves = getPseudoLegalMoves(currentRetract);
    for (let i = 0; i < pseudoLegalMoves.length; i++) {
        const pseudoLegalMove = pseudoLegalMoves[i];
        if (doRetraction(pseudoLegalMove.from, pseudoLegalMove.to, pseudoLegalMove.uncapturedUnit, pseudoLegalMove.unpromote, true, true) == error_ok) {
            currentPath.push(pseudoLegalMove);
            solveHelper(solveParameters, depth + 1, currentPath, outputSolutions);
            undo();
            currentPath.splice(currentPath.length - 1, 1);
            if (outputSolutions.length >= solveParameters.maxSolutions) return;
        } else {
            undo();
        }
    }
}

function solve(solveParameters) {
    const outputSolutions = [];
    solveHelper(solveParameters, 0, [], outputSolutions);
    return outputSolutions;
}

