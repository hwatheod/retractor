class Move {
    constructor(from, to, uncapturedUnit, unpromote, fromUnit, check) {
        this.from = from;
        this.to = to;
        this.uncapturedUnit = uncapturedUnit;
        this.unpromote = unpromote;
        this.fromUnit = fromUnit;
        this.check = check;
    }
}

function moveToString(move) {
    let result = "";
    if (move.fromUnit == "K" && Math.abs(move.from.mFile - move.to.mFile) == 2){
        if (move.from.mFile == 2) {
            result = "O-O-O";
        } else if (move.from.mFile == 6) {
            result = "O-O";
        } else {
            assert(false, "Illegal castling move");
            return "";
        }
    } else {
        if (move.fromUnit != "P" && !(move.unpromote)) {
            result += pieceLetters.charAt("KQRBNP".indexOf(move.fromUnit)).toUpperCase();
        }

        result += getSquareAlgNotation(move.to);
        if (move.uncapturedUnit == "") {
            result += "-";
        } else {
            result += "x";
            if (move.uncapturedUnit != "ep") {
                result += pieceLetters.charAt("KQRBNP".indexOf(move.uncapturedUnit)).toUpperCase();
            }
        }

        result += getSquareAlgNotation(move.from);
        if (move.uncapturedUnit == "ep") {
            result += "ep";
        }
        if (move.unpromote) {
            result += "=" + pieceLetters.charAt("KQRBNP".indexOf(move.fromUnit)).toUpperCase();
        }
    }

    if (move.check) {
        result += "+";
    }
    return result;
}

function stringToMove(string, color) {
    // we will simply return null if we don't recognize the move

    const normalizedString = string.replaceAll(/[-.\s]/g, "").replaceAll(/0/g, "O").trim();
    if (!normalizedString) return null;
    if (normalizedString == "OO") {
        if (color == "w") {
            return whiteKingsideUncastling();
        } else if (color == "b") {
            return blackKingsideUncastling();
        } else {
            assert(false, "Invalid color " + color);
        }
    }

    if (normalizedString == "OOO") {
        if (color == "w") {
            return whiteQueensideUncastling();
        } else if (color == "b") {
            return blackQueensideUncastling();
        } else {
            assert(false, "Invalid color " + color);
        }
    }

    let fromUnit;
    let destFileIndex;
    const firstChar = normalizedString.charAt(0);
    if (!firstChar) return null;
    if (firstChar == firstChar.toUpperCase()) {
        const pieceIndex = pieceLetters.indexOf(firstChar.toLowerCase());
        if (pieceIndex == -1) return null;
        fromUnit = "KQRBNP".charAt(pieceIndex);
        destFileIndex = 1;
    } else {
        fromUnit = "P";
        destFileIndex = 0;
    }

    let to = new Square(-1, -1);
    const destFileChar = normalizedString.charAt(destFileIndex);
    if (!destFileChar) return null;
    to.mFile = "abcdefgh".indexOf(destFileChar);
    if (to.mFile == -1) return null;
    const destRankChar = normalizedString.charAt(destFileIndex + 1);
    if (!destRankChar) return null;
    to.mRank = "12345678".indexOf(destRankChar);
    if (to.mRank == -1) return null;

    const captureSymbol = normalizedString.charAt(destFileIndex + 2);
    if (!captureSymbol) return null;
    const isCapture = captureSymbol == "x";
    let sourceFileIndex;
    let sourceRankIndex;
    let uncapturedUnit;
    if (isCapture) {
        const uncapturedUnitChar = normalizedString.charAt(destFileIndex + 3);
        if (!uncapturedUnitChar) return null;
        const uncapturedUnitIndex = pieceLetters.indexOf(uncapturedUnitChar.toLowerCase());
        if (uncapturedUnitChar == uncapturedUnitChar.toUpperCase() && uncapturedUnitIndex != -1) {
        	uncapturedUnit = "KQRBNP".charAt(uncapturedUnitIndex);
            sourceFileIndex = destFileIndex + 4;
            sourceRankIndex = destFileIndex + 5;
        } else {
            if (fromUnit == "P") {
                sourceFileIndex = destFileIndex + 3;
                sourceRankIndex = destFileIndex + 4;
                if (normalizedString.slice(sourceRankIndex + 1, sourceRankIndex + 3).toLowerCase() == "ep") {
                    uncapturedUnit = "ep";
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    } else {
        uncapturedUnit = "";
        sourceFileIndex = destFileIndex + 2;
        sourceRankIndex = destFileIndex + 3;
    }

    let from = new Square(-1, -1);
    const sourceFileChar = normalizedString.charAt(sourceFileIndex);
    if (!sourceFileChar) return null;
    from.mFile = "abcdefgh".indexOf(sourceFileChar);
    if (from.mFile == -1) return null;
    const sourceRankChar = normalizedString.charAt(sourceRankIndex);
    if (!sourceRankChar) return null;
    from.mRank = "12345678".indexOf(sourceRankChar);
    if (from.mRank == -1) return null;

    let unpromote = false;
    if (normalizedString.charAt(sourceRankIndex + 1) == "=") {
        if (fromUnit != "P") return null;
        const promotedPieceChar = normalizedString.charAt(sourceRankIndex + 2);
        if (!promotedPieceChar) return null;
        const promotedPieceIndex = pieceLetters.indexOf(promotedPieceChar.toLowerCase());
        if (promotedPieceIndex == -1) return null;
        fromUnit = "KQRBNP".charAt(promotedPieceIndex);
        if (fromUnit == "K" || fromUnit == "P") return null;
        unpromote = true;
    }

    const check = normalizedString.endsWith("+");

    return new Move(from, to, uncapturedUnit, unpromote, fromUnit, check);
}

function opposite(color) {
	if (color == "w") return "b";
	if (color == "b") return "w";
}

function isPseudoLegal(from, to, uncapturedUnit, unpromote) {
	let error;
	let requiredToRank;
	let requiredFromRank;
	let originalPawnRank;
	let epToRank;
	let epFromRank;
	const fromRank = from.mRank;
	const fromFile = from.mFile;
	const toRank = to.mRank;
	const toFile = to.mFile;
	const fromColor = board[fromFile][fromRank].color;
	const fromPiece = board[fromFile][fromRank];
	const toPiece = board[toFile][toRank];

	// basic sanity check: from must be occupied and to must be empty
	if (isEmpty(fromPiece) || !(isEmpty(toPiece)))
		return error_fromSquareOccupiedToSquareEmpty;

	const unit = fromPiece.unit;

	if (positionData.ep != -1) { // must be a pawn double step retraction following an e.p. uncapture
		if (unit != 'P' || fromFile != positionData.ep)
			return error_doubleStepFollowingEpRequired;
		if (fromColor == "w") {
			epFromRank = 3;
			epToRank = 1;
		} else {
			epFromRank = 4;
			epToRank = 6;
		}
		if (fromRank != epFromRank || toRank != epToRank || toFile != fromFile) {
			return error_doubleStepFollowingEpRequired;
		}
	}

	if (unpromote) {
		if (fromColor == "w" && fromRank != 7) {
			return error_whiteUnpromoteEighthRank;
		}
		if (fromColor == "b" && fromRank != 0) {
			return error_blackUnpromoteFirstRank;
		}
	}
	// pseudo-legality check
	if (uncapturedUnit == "K") return error_cannotUncaptureKing;
	if (unpromote && unit == "K") return error_cannotUnpromoteKing;
	if (uncapturedUnit == "ep") { // en passant
		if (unit != 'P') return error_enPassantPawnOnly;
		if (fromColor == 'w') {
			originalPawnRank = 6;
			requiredFromRank = 5;
			requiredToRank = 4;
		} else {
			originalPawnRank = 1;
			requiredFromRank = 2;
			requiredToRank = 3;
		}
		if (fromRank != requiredFromRank || toRank != requiredToRank || Math.abs(fromFile-toFile) != 1)
			return error_illegalEnPassant;
		if (!(isEmpty(board[fromFile][toRank])))  // square where the uncaptured pawn goes must be empty
			return error_illegalEnPassant;
		if (!(isEmpty(board[fromFile][originalPawnRank]))) // square of the follow-up double step must be empty
			return error_illegalEnPassant;
		return error_ok;
	}

	if (unit == 'K') {
		// check for uncastling
		let backRow;
		if (fromColor == 'w') backRow = 0; else backRow = 7;

		if (fromRank == backRow && fromRank == toRank && (fromFile == 2 || fromFile == 6) && toFile == 4) {
			if (uncapturedUnit != "") {
				return error_uncastlingCannotUncapture;
			}
			return checkUncastling(fromFile, fromRank, toFile, toRank, fromColor);
		}

		error = checkNonPawn(fromFile, fromRank, toFile, toRank, unit);
		if (error != error_ok) {
			return error;
		}
	} else if (!unpromote && unit != "P") {
		error = checkNonPawn(fromFile, fromRank, toFile, toRank, unit);
		if (error != error_ok) {
			return error;
		}
	} else if (unit == 'P' || unpromote) {
		const pawnDir = fromColor == "w" ? -1 : 1;
		if (!unpromote && toRank - fromRank == 2*pawnDir && toFile == fromFile && ((fromColor == "w" && toRank == 1) || (fromColor == "b" && toRank == 6))) {
			// 2 square pawn move
			if (uncapturedUnit != "") {
				return error_pawnVerticalCannotUncapture;
			}
			if (!(isEmpty(board[fromFile][fromRank + pawnDir]))) {
				return error_blocked;
			}
		} else {
			if (toRank - fromRank != pawnDir || toRank == 0 || toRank == 7) return error_badDirection;
			if (fromFile == toFile) {
				if (uncapturedUnit != "") return error_pawnVerticalCannotUncapture;
			} else if (Math.abs(fromFile-toFile) == 1) {
				if (uncapturedUnit == "") return error_pawnDiagonalMustUncapture;
			} else return error_badDirection;
		}
	}

	if ((uncapturedUnit == "P" || uncapturedUnit == "p") && (fromRank == 0 || fromRank == 7)) {
		return error_cannotUncapturePawnOnTopBottom;
	}

	return error_ok;
}

function checkUncastling(fromFile, fromRank, toFile, toRank, fromColor) {
		// Assumes we have checked that the king move looks right:
		// (fromRank == backRow && fromRank == toRow && (fromFile == 2 || fromFile == 6) && toFile == 4) { // looks like an uncastling
	const backRank = fromRank;

	let rookFile;
	if (fromFile == 2) {
		rookFile = 3;
	}
	else {
		rookFile = 5;
	}

	// make sure rook is there
	if (!(board[rookFile][backRank].color == fromColor && board[rookFile][backRank].unit == 'R'))
		return error_uncastlingRookNotInPosition;

	// make sure all relevant squares are unoccupied
	if (fromFile == 2) { // queenside uncastling
		if (!(isEmpty(board[0][backRank]) && isEmpty(board[1][backRank]) && isEmpty(board[4][backRank]))) {
			return error_uncastlingSquareOccupied;
		}
	} else { // kingside uncastling
		if (!(isEmpty(board[4][backRank]) && isEmpty(board[7][backRank]))) {
			return error_uncastlingSquareOccupied;
		}
	}

	// make sure neither the original king's square, nor the rook's current square, is attacked
	// ("cannot castle through or out of check")
	if (isSquareAttackedBy(rookFile, backRank, opposite(fromColor)) || isSquareAttackedBy(4, backRank, opposite(fromColor))) {
		return error_uncastlingCannotUncastleThroughOrIntoCheck;
	}
	return error_ok;
}

function checkNonPawn(fromFile, fromRank, toFile, toRank, unit) {
	// the checkOrthogonal and checkDiagonal functions do not care if the 'to' square itself is occupied.
	// so this can be used both for pseudo-legality checking and for determining if king is in check

	let error;
	if (unit == 'K') {
		if (Math.abs(fromRank - toRank) > 1 || Math.abs(fromFile - toFile) > 1) return error_badDirection;
	} else if (unit == 'Q') {
		error = checkOrthogonal(fromFile, fromRank, toFile, toRank);
		if (error != error_ok) {
			if (error == error_blocked) return error;
			error = checkDiagonal(fromFile, fromRank, toFile, toRank);

			if (error != error_ok) return error;
		}
	} else if (unit == 'R') {
		error = checkOrthogonal(fromFile, fromRank, toFile, toRank);
		if (error != error_ok) return error;
	} else if (unit == 'B') {
		error = checkDiagonal(fromFile, fromRank, toFile, toRank);
		if (error != error_ok) return error;
	} else if (unit == 'N') {
		const rowDiff = Math.abs(fromRank - toRank);
		const colDiff = Math.abs(fromFile - toFile);
		if (!((rowDiff == 1 && colDiff == 2) || (rowDiff == 2 && colDiff == 1))) {
			return error_badDirection;
		}
	}
	return error_ok;
}

function unitAttacks(fromFile, fromRank, toFile, toRank, unit, attackingColor) {
	if (unit != "P") {
		return checkNonPawn(fromFile, fromRank, toFile, toRank, unit) == error_ok;
	}
	const attackingPawnDirection = attackingColor == "w" ? 1 : -1;
	return Math.abs(toFile - fromFile) == 1 && toRank - fromRank == attackingPawnDirection;
}

function unitAttacksOrMoves(fromFile, fromRank, toFile, toRank, unit, attackingColor) {
	if (unitAttacks(fromFile, fromRank, toFile, toRank, unit, attackingColor)) {
		return true;
	}

	// check for vertical pawn moves
	const attackingPawnDirection = attackingColor == "w" ? 1 : -1;
	return unit == "P" && toFile == fromFile && toRank - fromRank == attackingPawnDirection;
}

function checkOrthogonal(fromFile, fromRank, toFile, toRank) {
	// returns error_badDirection if 'from' to 'to is not horizontal or vertical
	// returns error_blocked if horizontal or vertical path is blocked (up to but not including 'to' square)
	// otherwise returns error_ok

	if (fromRank != toRank && fromFile != toFile) {
		return error_badDirection;
	}
	if (fromRank == toRank) { // vertical move
		// check for pieces in-between
		let dir;
		if (fromFile < toFile) dir = 1; else dir = -1;
		for (let file = fromFile + dir; file != toFile; file += dir) {
			if (!(isEmpty(board[file][fromRank]))) {
				return error_blocked;
			}
		}
		return error_ok;
	} else if (fromFile == toFile) { // horizontal move
		let dir;
		if (fromRank < toRank) dir = 1; else dir = -1;
		for (let rank = fromRank + dir; rank != toRank; rank += dir) {
			if (!(isEmpty(board[fromFile][rank]))) {
				return error_blocked;
			}
		}
		return error_ok;
	}
	return error_badDirection;
}

function checkDiagonal(fromFile, fromRank, toFile, toRank) {
	// returns error_badDirection if 'from' to 'to is not diagonal
	// returns error_blocked if diagonal path is blocked (up to but not including 'to' square)
	// otherwise returns error_ok

	if (Math.abs(fromRank - toRank) == Math.abs(fromFile - toFile)) { // diagonal move
		let rowDir, colDir;
		if (fromRank < toRank) rowDir = 1; else rowDir = -1;
		if (fromFile < toFile) colDir = 1; else colDir = -1;
		let rank = fromRank + rowDir;
		let file = fromFile + colDir;
		while (rank != toRank) {
			if (!(isEmpty(board[file][rank]))) return error_blocked;
			rank += rowDir;
			file += colDir;
		}
		return error_ok;
	}
	else return error_badDirection;
}

function isSquareAttackingSquare(fromFile, fromRank, toFile, toRank) {
	// Is the unit on square 'from' attacking square 'to' ?
	const unit = board[fromFile][fromRank].unit;
	if (unit != 'P') {
		const error = checkNonPawn(fromFile, fromRank, toFile, toRank, unit);
		return error == error_ok;
	} else {
		const color = board[fromFile][fromRank].color;

		const pawnForwardDir = color == "w" ? 1 : -1;
		return Math.abs(fromFile - toFile) == 1 && toRank - fromRank == pawnForwardDir;
	}
}

function isSquareAttackedBy(targetFile, targetRank, color) { // the color is the color of the attacker
	for (let file = 0; file < 8; file++) {
		for (let rank = 0; rank < 8; rank++) {
			if (board[file][rank].color == color && isSquareAttackingSquare(file, rank, targetFile, targetRank)) {
				return true;
			}
		}
	}
	return false;
}

function getCheckingUnits(colorInCheck) {
	const checkers = [];
	let count = 0;
	const kingRank = positionData.kingPosition[colorInCheck].mRank;
	const kingFile = positionData.kingPosition[colorInCheck].mFile;
	const oppositeColor = opposite(colorInCheck);
	for (let file = 0; file < 8; file++)
		for (let rank = 0; rank < 8; rank++) {
			if (board[file][rank].color == oppositeColor && isSquareAttackingSquare(file, rank, kingFile, kingRank)) {
				checkers[count] = new Square(file, rank);
				count++;
			}
		}
	return checkers;
}

function isInCheck(color) {
	return isSquareAttackedBy(positionData.kingPosition[color].mFile, positionData.kingPosition[color].mRank, opposite(color));
}