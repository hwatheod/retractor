let tempUndoStack;
let tempPawnCaptureCounts = {};
let tempTotalCaptureCounts = {};
let tempPromotedCounts = {};

class PositionData {
	constructor() {
		this.kingPosition = {'w': null, 'b': null};
		this.detailedUnitCount = {};
		this.ep = -1; // if the previous retraction was an e.p. capture, the column of the captured pawn, otherwise -1.
		this.pawnCaptureCounts = {"w": 0, "b": 0, "t": 0}; // white, black, and total captures
		this.totalCaptureCounts = {"w": 0, "b": 0};
		this.promotedCounts = {}; // number of promoted pieces of each detailed unit type
		this.isInitialPositionFinalized = false; // see setCaptureCounts below for the purpose of this flag
	}

	set(otherPositionData) {
		this.kingPosition = otherPositionData.kingPosition;
		this.detailedUnitCount = otherPositionData.detailedUnitCount;
		this.ep = otherPositionData.ep;
		this.pawnCaptureCounts = otherPositionData.pawnCaptureCounts;
		this.totalCaptureCounts = otherPositionData.totalCaptureCounts;
		this.promotedCounts = otherPositionData.promotedCounts;
		this.isInitialPositionFinalized = otherPositionData.isInitialPositionFinalized;
	}

	update(tempUndoStack) {
		assert(undoStack.undoPointer == undoStack.maxUndoPointer,
			"in setCaptureCounts, undoPointer at " + undoStack.undoPointer + " maxUndoPointer at " + undoStack.maxUndoPointer
			);
		tempUndoStack.replay(); // this will replay all the events on the tempUndoStack into the current positionData
/*
	If we are at the bottom of the stack and doing the initial legality check,
    we simply update the result in positionData without pushing it onto the
    stack. We don't want to have a "positionData only" move on the stack --
    this would cause the undo to go one move too far.  We add a flag isInitialPositionFinalized
    to positionData that tracks whether the initial position had its positionData
    successfully computed or not.
*/
		if (undoStack.atBottomOfStack()) {
			this.isInitialPositionFinalized = true;
			return;
		}

		// otherwise, we copy the tempUndoStack onto the real undoStack.
		// if the previous move is not finalized, then we combine it with the previous move
		tempUndoStack.putMarkersAtEnds();
		if (!undoStack.isCurrentItemFinalized()) {
			undoStack.removeEndMoveFlagOnLastItem();
			tempUndoStack.removeStartMoveFlagOnFirstItem();
		}
		undoStack.copyStack(tempUndoStack);
		undoStack.finalizeLastItem();
	}

	reset() {
		this.kingPosition["w"] = null;
		this.kingPosition["b"] = null;

		DETAILED_UNIT_TYPES.forEach(
			detailedUnitType => {
				this.detailedUnitCount["w" + detailedUnitType] = 0;
				this.detailedUnitCount["b" + detailedUnitType] = 0;
				if (detailedUnitType != "K" && detailedUnitType != "P") {
					this.promotedCounts["w" + detailedUnitType] = 0;
					this.promotedCounts["b" + detailedUnitType] = 0;
					tempPromotedCounts["w" + detailedUnitType] = 0;
					tempPromotedCounts["b" + detailedUnitType] = 0;
				}
			}
		)

		this.ep = -1;

		this.pawnCaptureCounts["w"] = 0;
		this.pawnCaptureCounts["b"] = 0;
		this.pawnCaptureCounts["t"] = 0;

		tempPawnCaptureCounts["w"] = 0;
		tempPawnCaptureCounts["b"] = 0;
		tempPawnCaptureCounts["t"] = 0;

		this.totalCaptureCounts["w"] = 0;
		this.totalCaptureCounts["b"] = 0;

		tempTotalCaptureCounts["w"] = 0;
		tempTotalCaptureCounts["b"] = 0;

		this.isInitialPositionFinalized = false;
	}

	initializeDataFromBoard(checkLegal) {
		this.reset();

		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				if (board[file][rank].unit == 'K' && board[file][rank].color == 'w') {
					if (this.kingPosition["w"] != null) { // 2 white kings
						return error_tooManyWhiteKings;
					} else this.kingPosition["w"] = new Square(file, rank);
				}
				else if (board[file][rank].unit == 'K' && board[file][rank].color == 'b') {
					if (this.kingPosition["b"] != null) { // 2 black kings
						return error_tooManyBlackKings;
					} else this.kingPosition["b"] = new Square(file, rank);
				}
				setDefaultPieceParameters(file, rank, board[file][rank]);
				if (board[file][rank].unit != "") {
					const detailedUnitType = getDetailedUnitType(file, rank, board[file][rank].unit);
					this.detailedUnitCount[board[file][rank].color + detailedUnitType]++;
				}
			}
		}
		if (this.kingPosition["w"] == null) {
			return error_noWhiteKing;
		}
		if (this.kingPosition["b"] == null) {
			return error_noBlackKing;
		}

		this.ep = -1;
		tempUndoStack = new UndoStack();

		let error;
		flipRetract();
		if (checkLegal) {
			error = isPositionLegal(); // this also updates the capture counts
		}
		flipRetract();
		if (checkLegal) {
			return error;
		}
	}
}

function doRetraction(from, to, uncapturedUnit, unpromote, checkPseudoLegal, checkLegal) {
	let error;
	if (checkPseudoLegal) {
		error = isPseudoLegal(from, to, uncapturedUnit, unpromote);
		if (error != error_ok) return error;
	}

	tempUndoStack.reset();
	tempUndoStack.recordMove(from, to, uncapturedUnit, unpromote);
	makeRetraction(from, to, uncapturedUnit, unpromote);
	if (checkLegal)  {
		error = isPositionLegal();
	}

	tempUndoStack.putMarkersAtEnds();
	undoStack.copyStack(tempUndoStack);
	flipRetract();

	if (checkLegal) {
		undoStack.finalizeLastItem(); // if full legality check is done, then results are final
	}

	if (checkLegal || checkPseudoLegal) {
		return error;
	}
}

function makeRetraction(from, to, uncapturedUnit, unpromote) {
    // assumed pseudo-legal

	let targetRookFile;
	let rookFile;
	const fromRank = from.mRank;
	const fromFile = from.mFile;
	const toRank = to.mRank;
	const toFile = to.mFile;
	const fromColor = board[fromFile][fromRank].color;
	const fromPiece = board[fromFile][fromRank];

	if (fromPiece.unit == 'K' && Math.abs(fromFile - toFile) > 1) { // uncastling
		if (fromFile == 2) { // queenside
			rookFile = 3;
			targetRookFile = 0;
		}
		else { // kingside
			rookFile = 5;
			targetRookFile = 7;
		}
		
		// move the king
		tempUndoStack.boardSetPieceFromPiece(toFile, toRank, fromPiece);
		tempUndoStack.boardClearPiece(fromFile, fromRank);
		tempUndoStack.changeFrozenFlag(toFile, toRank, true);  // king is frozen after uncastling
		
		// move the rook
		tempUndoStack.boardSetPieceFromPiece(targetRookFile, toRank, board[rookFile][fromRank]);
		tempUndoStack.boardClearPiece(rookFile, fromRank);
		tempUndoStack.changeFrozenFlag(targetRookFile, toRank, true);  // rook is frozen after uncastling
		return;
	}
	if (uncapturedUnit == "ep") {
		tempUndoStack.boardSetPieceFromPiece(toFile, toRank, fromPiece);
		tempUndoStack.boardClearPiece(fromFile, fromRank);
		tempUndoStack.boardSetPiece(fromFile, toRank, opposite(fromColor), "P", false, false, false);
		tempUndoStack.setEpSquare(fromFile);
		return;
	}
	
	if (!unpromote) {
		tempUndoStack.boardSetPieceFromPiece(toFile, toRank, fromPiece);
	}
	else tempUndoStack.boardSetPiece(toFile, toRank, fromColor, "P", false, false, false);

	tempUndoStack.boardSetPiece(fromFile, fromRank, opposite(fromColor), uncapturedUnit, false, false, false);
	if (positionData.ep != -1) { // double step following an e.p. uncapture
		tempUndoStack.clearEpSquare(positionData.ep);
	}
}

function updateRealCounts() {
	for (const color in tempPawnCaptureCounts) {
		if (tempPawnCaptureCounts.hasOwnProperty(color)) {
			tempUndoStack.changePawnCaptureCount(color, tempPawnCaptureCounts[color]);
		}
	}

	for (const color in tempTotalCaptureCounts) {
		if (tempTotalCaptureCounts.hasOwnProperty(color)) {
			tempUndoStack.changeTotalCaptureCount(color, tempTotalCaptureCounts[color]);
		}
	}

	for (const detailedUnit in tempPromotedCounts) {
		if (tempPromotedCounts.hasOwnProperty(detailedUnit)) {
			tempUndoStack.changePromotedCount(detailedUnit[0], detailedUnit.slice(1), tempPromotedCounts[detailedUnit]);
		}
	}
}

function clearTempCounts() {
	for (const color in tempPawnCaptureCounts) {
		if (tempPawnCaptureCounts.hasOwnProperty(color)) {
			tempPawnCaptureCounts[color] = 0;
		}
	}

	for (const color in tempTotalCaptureCounts) {
		if (tempTotalCaptureCounts.hasOwnProperty(color)) {
			tempTotalCaptureCounts[color] = 0;
		}
	}

	for (const detailedUnit in tempPromotedCounts) {
		if (tempPromotedCounts.hasOwnProperty(detailedUnit)) {
			tempPromotedCounts[detailedUnit] = 0;
		}
	}
}

function updatePromotedCount(detailedUnit, newValue) {
	/*
	  Tries to update the promoted count for detailedUnit to the newValue.  If this results in too many promoted pieces,
	  return the appropriate error, else perform the update and return error_ok.
	 */
	tempPromotedCounts[detailedUnit] = newValue;
	if (newValue + positionData.detailedUnitCount[detailedUnit[0] + "P"] > 8) {
		switch (detailedUnit) {
			case "wQ":
				return error_tooManyPromotedWhiteQueens;
			case "wR":
				return error_tooManyPromotedWhiteRooks;
			case "wBL":
				return error_tooManyPromotedWhiteLightSquareBishops;
			case "wBD":
				return error_tooManyPromotedWhiteDarkSquareBishops;
			case "wN":
				return error_tooManyPromotedWhiteKnights;
			case "bQ":
				return error_tooManyPromotedBlackQueens;
			case "bR":
				return error_tooManyPromotedBlackRooks;
			case "bBL":
				return error_tooManyPromotedBlackLightSquareBishops;
			case "bBD":
				return error_tooManyPromotedBlackDarkSquareBishops;
			case "bN":
				return error_tooManyPromotedBlackKnights;
			default:
				assert(false, "Unrecognized detailedUnit " + detailedUnit);
		}
	}

	let totalPromotedCount = 0;
	for (const detailedUnitLoop in tempPromotedCounts) {
		if (tempPromotedCounts.hasOwnProperty(detailedUnitLoop) && detailedUnitLoop[0] == detailedUnit[0]) {
			totalPromotedCount += tempPromotedCounts[detailedUnitLoop];
		}
	}
	if (totalPromotedCount + positionData.detailedUnitCount[detailedUnit[0] + "P"] > 8) {
		if (detailedUnit[0] == "w") {
			return error_tooManyPromotedWhitePieces;
		} else {
			return error_tooManyPromotedBlackPieces;
		}
	}

	return error_ok;
}

function updatePromotedCountWithMax(detailedUnit, newValue) {
	return updatePromotedCount(detailedUnit,
		Math.max(tempPromotedCounts[detailedUnit], newValue));
}

function getUnitCounts() {
	let whiteUnitCount = 0;
	let blackUnitCount = 0;
	for (const detailedUnit in positionData.detailedUnitCount) {
		if (positionData.detailedUnitCount.hasOwnProperty(detailedUnit)) {
			// count the units of each color
			if (detailedUnit[0] == "w") {
				whiteUnitCount += positionData.detailedUnitCount[detailedUnit];
			} else if (detailedUnit[0] == "b") {
				blackUnitCount += positionData.detailedUnitCount[detailedUnit];
			}
		}
	}
	return [whiteUnitCount, blackUnitCount];
}

function checkTooManyCaptures() {
	const [whiteUnitCount, blackUnitCount] = getUnitCounts();

	if (blackUnitCount + tempTotalCaptureCounts["w"] > 16) {
		return error_tooManyWhiteCaptures;
	}
	if (whiteUnitCount + tempTotalCaptureCounts["b"] > 16) {
		return error_tooManyBlackCaptures;
	}
	if (whiteUnitCount + blackUnitCount +
		tempPawnCaptureCounts["t"] +
		(tempTotalCaptureCounts["w"] - tempPawnCaptureCounts["w"]) +
		(tempTotalCaptureCounts["b"] - tempPawnCaptureCounts["b"]) > 32) {
		return error_tooManyCaptures;
	}

	return error_ok;
}

function incrementTotalCaptureCount(color, amount) {
	tempTotalCaptureCounts[color] += amount;
	return checkTooManyCaptures();
}

// if we detect that a piece must be original, we call this function to ensure it is not marked promoted.
function cannotBePromoted(file, rank) {
	if (!board[file][rank].promoted) {
		return error_ok;
	}

	if (board[file][rank].color == "w") {
		switch(board[file][rank].unit) {
			case 'Q': return error_impossiblePromotedWhiteQueen;
			case 'R': return error_impossiblePromotedWhiteRook;
			case 'B': return error_impossiblePromotedWhiteBishop;
			case 'N': return error_impossiblePromotedWhiteKinght;
			default: assert(false, 'Unexpected promoted white piece ' + board[file][rank].unit + ' file ' +
				file + ' rank ' + rank);
		}
	} else if (board[file][rank].color == "b") {
		switch(board[file][rank].unit) {
			case 'Q': return error_impossiblePromotedBlackQueen;
			case 'R': return error_impossiblePromotedBlackRook;
			case 'B': return error_impossiblePromotedBlackBishop;
			case 'N': return error_impossiblePromotedBlackKinght;
			default: assert(false, 'Unexpected promoted black piece ' + board[file][rank].unit + ' file ' +
				file + ' rank ' + rank);
		}
	} else {
		assert(false, 'Unexpected color ' + board[file][rank].color);
	}
}

function checkIllegalBishops() {
	/*
	    check for 2 pawns on their second rank and a bishop on the first rank in between

	    Case 1:
	    P . P
	      B         ok if B is on c or f file

        Case 2:
          P
        P R P       illegal regardless of the color of the bishop or rook
          B

	    Case 3:
	    P P P
	      b         illegal

        Case 4:
	    P . P
	      b         ok if b can be promoted. If there is a friendly pawn
	                on the third rank above the bishop, count an enemy capture.

	 */

	const originalBishopFiles = [2, 5];
	for (let side = 0; side < 2; side++) {
		const color = side == 0 ? "w" : "b";
		const firstRank = side == 0 ? 0 : 7;
		const secondRank = side == 0 ? 1 : 6;
		const thirdRank = side == 0 ? 2 : 5;

		for (let bishopFile = 0; bishopFile < 8; bishopFile++) {
			if ((bishopFile == 0 || (board[bishopFile - 1][secondRank].color == color &&
				board[bishopFile - 1][secondRank].unit == "P")) &&
				(bishopFile == 7 || (board[bishopFile + 1][secondRank].color == color &&
				board[bishopFile + 1][secondRank].unit == "P"))
			) { // found two unmoved pawns two files apart
				if (originalBishopFiles.indexOf(bishopFile) != -1) {
					if (!(board[bishopFile][firstRank].color == color && board[bishopFile][firstRank].unit == "B")) {
						// a bishop was captured on its original square. Increase the enemy capture count.
						const error = incrementTotalCaptureCount(opposite(color), 1);
						if (error != error_ok) return error;
					}

					// mark all other friendly bishops on the same color square as promoted
					const bishopSquareColor = (bishopFile + firstRank) % 2;
					for (let file = 0; file < 8; file++) {
						for (let rank = 0; rank < 8; rank++) {
							if (file == bishopFile && rank == firstRank) continue;
							if ((file + rank) % 2 != bishopSquareColor) continue;
							if (board[file][rank].color == color && board[file][rank].unit == "B") {
								tempUndoStack.changePromotedFlag(file, rank, true);
							}
						}
					}
				}

				if (board[bishopFile][firstRank].unit != "B") continue;

				// we have a bishop on this file
				if (board[bishopFile][firstRank].color == color) { // friendly bishop
					if (originalBishopFiles.indexOf(bishopFile) == -1) { // Case 1
						return side == 0 ? error_illegallyPlacedWhiteBishop : error_illegallyPlacedBlackBishop;
					} else {
						const error = cannotBePromoted(bishopFile, firstRank);
						if (error != error_ok) return error;
						tempUndoStack.changeFrozenFlag(bishopFile, firstRank, true);
					}

					// Case 2
					if (board[bishopFile][thirdRank].color == color &&
						board[bishopFile][thirdRank].unit == "P" &&
						board[bishopFile][secondRank].unit == "R") {
						return board[bishopFile][secondRank].color == "w" ? error_illegallyPlacedWhiteRook :
							error_illegallyPlacedBlackRook;
					}
				} else { // enemy bishop
					// Case 2 again - but we return a different error since when it's an enemy bishop,
					// no unit individually is responsible for the illegal configuration
					if (board[bishopFile][thirdRank].color == color &&
						board[bishopFile][thirdRank].unit == "P" &&
						board[bishopFile][secondRank].unit == "R") {
						return error_illegalBishopRookPawnConfiguration;
					}

					// Case 3
					if (board[bishopFile][secondRank].color == color &&
						board[bishopFile][secondRank].unit == "P") {
						// it's an enemy bishop
						return side == 1 ? error_illegallyPlacedWhiteBishop : error_illegallyPlacedBlackBishop;
					}

					// Case 4
					const detailedUnit = opposite(color) + getDetailedUnitType(bishopFile, firstRank, "B");
					tempUndoStack.changePromotedFlag(bishopFile, firstRank, true);
					if (board[bishopFile][thirdRank].color == color &&
					    board[bishopFile][thirdRank].unit == "P") {
						const error = incrementTotalCaptureCount(opposite(color), 1);
						if (error != error_ok) return error;
					}
				}
			}
		}
	}

	return error_ok;
}

function isWeakCage(leftBoundary, rightBoundary, side) {
	const color = side == 0 ? "w" : "b";
	const secondRank = side == 0 ? 1 : 6;
	const thirdRank = side == 0 ? 2 : 5;

	if (rightBoundary - leftBoundary <= 1) {
		return false;
	}

	// check that among [LB, LB+1] at least one of them is a pawn on the second rank, and
	// among [RB-1, RB] at least one of them is a pawn on the second rank.  Otherwise there is no cage.
	if (!(leftBoundary == -1 ||
		 (board[leftBoundary][secondRank].color == color && board[leftBoundary][secondRank].unit == "P") ||
 		(board[leftBoundary + 1][secondRank].color == color && board[leftBoundary + 1][secondRank].unit == "P")) ||
		!(rightBoundary == 8 ||
			(board[rightBoundary][secondRank].color == color && board[rightBoundary][secondRank].unit == "P") ||
			(board[rightBoundary - 1][secondRank].color == color && board[rightBoundary - 1][secondRank].unit == "P"))) {
		return false;
	}

	let enemyUnitCount = 0;
	for (const detailedUnit in positionData.detailedUnitCount) {
		if (positionData.detailedUnitCount.hasOwnProperty(detailedUnit)) {
			if (detailedUnit[0] != color) {
				enemyUnitCount += positionData.detailedUnitCount[detailedUnit];
			}
		}
	}

	const consecutiveThirdRankAllowed = tempTotalCaptureCounts[color] + enemyUnitCount >= 15;
	let prevThirdRank = false;
	for (let file = leftBoundary + 1; file <= rightBoundary - 1; file++) {
		const secondRankPawn = board[file][secondRank].color == color && board[file][secondRank].unit == "P";
		const thirdRankPawn = board[file][thirdRank].color == color && board[file][thirdRank].unit == "P";
		if (!secondRankPawn && !thirdRankPawn) {
			return false;
		}
		if (prevThirdRank && !secondRankPawn && thirdRankPawn && !consecutiveThirdRankAllowed) {
			return false;
		}
		prevThirdRank = !secondRankPawn && thirdRankPawn;
	}

	return true;
}

function getWeakCageRegion(leftBoundary, rightBoundary, side) {
	// returns the interior squares of the weak cage region: those squares whose files are strictly between the
	// boundaries and ranks are below the first pawn on that file

	if (!isWeakCage(leftBoundary, rightBoundary, side)) {
		return null;
	}

	const region = [];
	const color = side == 0 ? "w" : "b";
	const firstRank = side == 0 ? 0 : 7;
	const secondRank = side == 0 ? 1 : 6;

	for (let file = leftBoundary + 1; file <= rightBoundary - 1; file++) {
		region.push([file, firstRank]);
		if (!(board[file][secondRank].color == color && board[file][secondRank].unit == "P")) {
			region.push([file, secondRank]);
		}
	}

	return region;
}

// see documentation in checkIllegalCage function
function validateWeakCage(leftBoundary, rightBoundary, side, region) {
	const color = side == 0 ? "w" : "b";
	const oppositeColor = side == 0 ? "b" : "w";
	const firstRank = side == 0 ? 0 : 7;
	const secondRank = side == 0 ? 1 : 6;
	const thirdRank = side == 0 ? 2 : 5;

	let friendlyRookCount = 0;
	let enemyRookCount = 0;
	let enemyPawnCount = 0;
	let promotedEnemyBishopWithCaptureCount = 0;

	for (let i = 0; i < region.length; i++) {
		const square = region[i];
		const file = square[0];
		const rank = square[1];
		if (board[file][rank].color == color && board[file][rank].unit == "R") {
			const error = cannotBePromoted(file, rank);
			if (error != error_ok) return error;
			friendlyRookCount++;
		} else if (board[file][rank].color != color && board[file][rank].unit == "R") {
			tempUndoStack.changePromotedFlag(file, rank, true);
			enemyRookCount++;
		} else if (board[file][rank].color != color && board[file][rank].unit == "P") {
			enemyPawnCount++;
		} else if (rank == firstRank && board[file][rank].color != color && board[file][rank].unit == "B" &&
			(file == 0 || (board[file - 1][secondRank].color == color && board[file - 1][secondRank].unit == "P")) &&
			(board[file][thirdRank].color == color && board[file][thirdRank].unit == "P") &&
			(file == 7 || (board[file + 1][secondRank].color == color && board[file + 1][secondRank].unit == "P"))) {
			promotedEnemyBishopWithCaptureCount++;
		}
	}

	let expectedFriendlyRookCount = 0;
	if (leftBoundary < 0 && 0 < rightBoundary) {
		expectedFriendlyRookCount++;
	}
	if (leftBoundary < 7 && 7 < rightBoundary) {
		expectedFriendlyRookCount++;
	}

	const missingFriendlyRookCount = expectedFriendlyRookCount - friendlyRookCount;
	if (missingFriendlyRookCount < 0) {
		return side == 0 ? error_illegallyPlacedWhiteRook : error_illegallyPlacedBlackRook;
	}

	let error = incrementTotalCaptureCount(oppositeColor,
		Math.max(enemyRookCount + promotedEnemyBishopWithCaptureCount,
				missingFriendlyRookCount - enemyPawnCount
		 ) - promotedEnemyBishopWithCaptureCount);
	if (error != error_ok) return error;

	return error_ok;
}

function isStrongCage(leftBoundary, rightBoundary, side) {
	const color = side == 0 ? "w" : "b";
	const secondRank = side == 0 ? 1 : 6;
	for (let file = leftBoundary; file <= rightBoundary; file++) {
		if (file >= 0 && file <= 7 && !(board[file][secondRank].color == color && board[file][secondRank].unit == "P")) {
			return false;
		}
	}
	return true;
}

function getStrongCageRegion(leftBoundary, rightBoundary,side) {
	// returns the interior squares of the strong cage region: those squares whose files are strictly between the
	// boundaries and on the first rank.

	if (!isStrongCage(leftBoundary, rightBoundary, side)) {
		return null;
	}

	const region = [];
	const firstRank = side == 0 ? 0 : 7;
	for (let file = leftBoundary + 1; file <= rightBoundary - 1; file++) {
		region.push([file, firstRank]);
	}
	return region;
}

// see documentation in checkIllegalCage function
function validateStrongCage(leftBoundary, rightBoundary, side) {
	const color = side == 0 ? "w" : "b";
	const firstRank = side == 0 ? 0 : 7;

	// if e-file in the strong cage, the king must be there.
	if (leftBoundary < 4 && 4 < rightBoundary &&
		!(positionData.kingPosition[color].mRank == firstRank &&
		  leftBoundary < positionData.kingPosition[color].mFile &&
		  positionData.kingPosition[color].mFile < rightBoundary)) {
		return side == 0 ? error_illegallyPlacedWhiteKing : error_illegallyPlacedBlackKing;
	}

	const friendlyUnitPositions = {"K": [], "Q": [], "R": [], "B": []};
	const initialRank = ["R", "N", "B", "Q", "K", "B", "N", "R"];
	const cageInitialRank = initialRank.slice(leftBoundary + 1, rightBoundary);
	const cageInitialRankUnitCount = {"K": 0, "Q": 0, "R": 0, "B": 0};
	cageInitialRank.forEach(
		unit => {
			if (unit in cageInitialRankUnitCount) {
				cageInitialRankUnitCount[unit]++;
			}
		});

	for (let file = leftBoundary + 1; file <= rightBoundary - 1; file++) {
		const piece = board[file][firstRank];
		if (piece.unit == "") continue;
		if (piece.color == color) {
			// friendly piece
			if (piece.unit in friendlyUnitPositions) {
				const error = cannotBePromoted(file, firstRank);
				if (error != error_ok) return error;
				friendlyUnitPositions[piece.unit].push(file);
			}
		} else {
			// enemy piece, only knights allowed
			switch(piece.unit) {
				case "K": return side == 1 ? error_illegallyPlacedWhiteKing : error_illegallyPlacedBlackKing;
				case "Q": return side == 1 ? error_illegallyPlacedWhiteQueen : error_illegallyPlacedBlackQueen;
				case "R": return side == 1 ? error_illegallyPlacedWhiteRook : error_illegallyPlacedBlackRook;
				case "B": return side == 1 ? error_illegallyPlacedWhiteBishop : error_illegallyPlacedBlackBishop;
				case "N": break;
				case "P": assert(false, "Unexpected pawn on end rank " + file + " " + firstRank); break;
				default: assert(false, "Unexpected unit " + piece.unit + " on " + file + " " + firstRank); break;
			}
		}
	}

	// make sure there aren't too many friendly units
	for (const unit in friendlyUnitPositions) {
		if (friendlyUnitPositions.hasOwnProperty(unit) && friendlyUnitPositions[unit].length > cageInitialRankUnitCount[unit]) {
			switch(unit) {
				case "K": return side == 0 ? error_illegallyPlacedWhiteKing : error_illegallyPlacedBlackKing;
				case "Q": return side == 0 ? error_illegallyPlacedWhiteQueen : error_illegallyPlacedBlackQueen;
				case "R": return side == 0 ? error_illegallyPlacedWhiteRook : error_illegallyPlacedBlackRook;
				case "B": return side == 0 ? error_illegallyPlacedWhiteBishop : error_illegallyPlacedBlackBishop;
				default: assert(false, "Unexpected unit " + unit + " in friendlyUnitCount");
			}
		}

		// any expected queen or rook not present increase the capture count
		// bishops already counted in checkIllegalBishops
		if ((unit == "Q" || unit == "R") && friendlyUnitPositions[unit].length < cageInitialRankUnitCount[unit]) {
			const error = incrementTotalCaptureCount(opposite(color), cageInitialRankUnitCount[unit] - friendlyUnitPositions[unit].length);
			if (error != error_ok) return error;
		}
	}

	// check ordering of certain units
	if (friendlyUnitPositions["Q"].length > 0 && friendlyUnitPositions["K"].length > 0) {
		// check queen < king
		if 	(!(friendlyUnitPositions["Q"][0] < friendlyUnitPositions["K"][0])) {
			return side == 0 ? error_illegallySwitchedWhiteQueenKing : error_illegallySwitchedBlackQueenKing;
		}
		// from here we assume queen < king
		if (friendlyUnitPositions["R"].length > 0) {
			if (leftBoundary == -1 && rightBoundary <= 7) { // cage includes a-file but not h-file
				assert(friendlyUnitPositions["R"].length == 1,
					"There are rooks at " + friendlyUnitPositions["R"].toString + " in strong cage " +
					 leftBoundary + " " + rightBoundary + " side=" + side + " which is too many."
				);
				if (!(friendlyUnitPositions["R"][0] < friendlyUnitPositions["Q"][0])) {
					return side == 0 ? error_illegalOrderWhiteRookQueenKing : error_illegalOrderBlackRookQueenKing;
				}
			} else if (leftBoundary >= 0 && rightBoundary == 8) { // cage insludes h-file but not a-file
				assert(friendlyUnitPositions["R"].length == 1,
					"There are rooks at " + friendlyUnitPositions["R"].toString + " in strong cage " +
					 leftBoundary + " " + rightBoundary + " side=" + side + " which is too many."
				);
				if (friendlyUnitPositions["R"][0] < friendlyUnitPositions["Q"][0]) {
					return side == 0 ? error_illegalOrderWhiteRookQueenKing : error_illegalOrderBlackRookQueenKing;
				}
			} else {
				assert(leftBoundary == -1 && rightBoundary == 8, "Expected strong cage to be whole first rank");
				assert(friendlyUnitPositions["R"].length <= 2,
					"There are rooks at " + friendlyUnitPositions["R"].toString + " in strong cage " +
					 leftBoundary + " " + rightBoundary + " side=" + side + " which is too many."
				);

				if (friendlyUnitPositions["R"].length == 2) {
					// check rook1 < queen < rook2
					if (!(friendlyUnitPositions["R"][0] < friendlyUnitPositions["Q"][0] &&
							friendlyUnitPositions["Q"][0] < friendlyUnitPositions["R"][1])) {
						return side == 0 ? error_illegalOrderWhiteRookQueenKing : error_illegalOrderBlackRookQueenKing;
					}
				}
			}
		}
	}

	// if the strong cage includes the d-file, then all outside queens are promoted
	if (leftBoundary <= 3 && 3 <= rightBoundary) {
		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				if (rank == firstRank && leftBoundary <= file && file <= rightBoundary) continue;
				if (board[file][rank].color == color && board[file][rank].unit == "Q") {
					tempUndoStack.changePromotedFlag(file, rank, true);
				}
			}
		}
	}

	return error_ok;
}

function checkIllegalCage() {
	/*
	   1. Find all frozen pieces on first rank. This divides the first rank into "regions".  Each region
	      starts or ends on a frozen piece, or "off the board".
	   2. For each region determine whether there is a cage, and of which type:
	      Strong: There are pawns on the second rank over the entire region, including the endpoints.
	      Weak: There are pawns on the second and third rank over the entire region, except that at
	            an endpoint no such pawn need be present if the adjacent pawn is on the second rank.
	            Also:
	            (a) there are no two consecutive third rank pawns; or
	            (b) all but at most 1 capture by that color is accounted for.
	      Otherwise there is no cage.
	   3. If there is a strong cage:
	      (a) No enemy pieces except knights are allowed.
	      (b) The friendly pieces present, except knights, must all be pieces that started in that region.
	      (c) Any missing friendly piece was captured in that region, and should be counted in total captures.
	      (d) If the region contains the e-file, the king must be present.
	      (e) If queen and king are present, then queen < king.
	      (f) If rook, queen, and king are present, and the cage includes a-file but not h-file, then
	          rook < queen < king (since queenside castling could not have happened).
	      (g) If rook, queen, and king are present, and the cage includes h-file but not a-file, then
	          we cannot have rook < queen < king, but other permutations are possible due to kingside
	          castling.
	      (h) If 2 rooks, queen, king are present, then necessarily the cage is the entire first rank.
	          The possible permutations are:
	              rook < queen < king < rook
	              rook < queen < rook < king
	   4. If there is a weak cage:
	      (a) Any enemy rook is promoted. A capture is required for this promotion.
	      (b) An enemy bishop on e.g. e1 with pawns on d2, f2, e3 also requires a capture
	          for the promotion. These have already been counted in checkIllegalBishops()
	          but we need to track them here so we don't count captures in the cage twice.
	          See the formula at the end.
	      (c) A friendly rook is allowed only if it started in that region.
	      (d) A missing friendly rook was captured in that region.

	      The number of enemy captures should be incremented by:
	         max( captures in (a) plus captures in (b),
	              captures in (d) minus enemy pawns in the region) - captures in (b)
	 */

	const boundaries = [[-1], [-1]];
	for (let side = 0; side < 2; side++) {
		const color = side == 0 ? "w" : "b";
		const firstRank = side == 0 ? 0 : 7;
		const rookCageRegion = [];
		let rookCageCount = 0;

		for (let file = 0; file < 8; file++) {
			if (board[file][firstRank].color == color && board[file][firstRank].frozen) {
				boundaries[side].push(file);
			}
		}
		boundaries[side].push(8);

		for (let i = 0; i < boundaries[side].length - 1; i++) {
			const leftBoundary = boundaries[side][i];
			const rightBoundary = boundaries[side][i+1];
			const strongCageRegion = getStrongCageRegion(leftBoundary, rightBoundary, side);
			if (strongCageRegion != null) {
				const error = validateStrongCage(leftBoundary, rightBoundary, side);
				if (error != error_ok) return error;
				if ((leftBoundary <= 0 && 0 < rightBoundary) || (leftBoundary < 7 && 7 <= rightBoundary)) {
					strongCageRegion.forEach(square => rookCageRegion.push(square));
					rookCageRegion.push([leftBoundary, firstRank]);
					rookCageRegion.push([rightBoundary, firstRank]);
					rookCageCount++;
				}
			}
			else {
				const weakCageRegion = getWeakCageRegion(leftBoundary, rightBoundary, side);
				if (weakCageRegion != null) {
					const error = validateWeakCage(leftBoundary, rightBoundary, side, weakCageRegion);
					if (error != error_ok) return error;
					if ((leftBoundary <= 0 && 0 < rightBoundary) || (leftBoundary < 7 && 7 <= rightBoundary)) {
						weakCageRegion.forEach(square => rookCageRegion.push(square));
						rookCageRegion.push([leftBoundary, firstRank]);
						rookCageRegion.push([rightBoundary, firstRank]);
						rookCageCount++;
					}
				}
			}
		}
		assert(rookCageCount <= 2, 'There cannot be more than 2 rook cage regions for one side');
		if (rookCageCount >= 1) {
			let outsideRooks = 0;
			for (let file = 0; file < 8; file++) {
				for (let rank = 0; rank < 8; rank++) {
					if (board[file][rank].color == color && board[file][rank].unit == "R" &&
						!rookCageRegion.some(square => square[0] == file && square[1] == rank)) {
						outsideRooks++;
					}
				}
			}
			const extraRookCount = outsideRooks - (2 - rookCageCount);
			if (extraRookCount > 0) {
				const error = updatePromotedCountWithMax(color + "R", extraRookCount);
				if (error != error_ok) return error;
			}
		}
	}
	return error_ok;
}

function canDiscoverCheck(linePiece, otherPiece, colorInCheck) {
	// returns whether the other piece can unmask the check from the line piece
	const enemyPromotionRank = colorInCheck == "w" ? 0 : 7;

	const kingFile = positionData.kingPosition[colorInCheck].mFile;
	const kingRank = positionData.kingPosition[colorInCheck].mRank;
	const fileDirToKing = Math.sign(kingFile - linePiece.mFile);
	const rankDirToKing = Math.sign(kingRank - linePiece.mRank);

	let curFile = linePiece.mFile + fileDirToKing;
	let curRank = linePiece.mRank + rankDirToKing;

	while (!(curFile == kingFile && curRank == kingRank)) {
		// see if we can discover a check at (curFile, curRank) along the line piece, and make sure king would not be in
		// check from the other piece at the new square
		if (!unitAttacks(curFile, curRank, kingFile, kingRank, board[otherPiece.mFile][otherPiece.mRank].unit,
			opposite(colorInCheck)) &&
			unitAttacksOrMoves(curFile, curRank, otherPiece.mFile, otherPiece.mRank, board[otherPiece.mFile][otherPiece.mRank].unit,
				opposite(colorInCheck))) {
			return true;
		}

		// check for promotions
		if (otherPiece.mRank == enemyPromotionRank &&
			!unitAttacks(curFile, curRank, kingFile, kingRank, "P", opposite(colorInCheck)) &&
			unitAttacksOrMoves(curFile, curRank, otherPiece.mFile, otherPiece.mRank, "P", opposite(colorInCheck))) {
			return true;
		}

		curFile += fileDirToKing;
		curRank += rankDirToKing;
	}

	return false;
}

/*
  We want to detect a double check configuration like this

       .
     . P k    [black's 3rd rank]
     . . .
     B . R

  where we can retract an en passant capture by the pawn, covering
  both checks (double discovered check).
 */
function canDiscoverEnPassantCheck(checkers, colorInCheck) {
	const kingSecondRank = colorInCheck == "w" ? 1 : 6;
	const kingThirdRank = colorInCheck == "w" ? 2 : 5;
	const kingFifthRank = colorInCheck == "w" ? 4 : 3;

	const attackerForwardDirection = colorInCheck == "w" ? -1 : 1;
	let verticalChecker = -1;
	let diagonalChecker = -1;
	const kingFile = positionData.kingPosition[colorInCheck].mFile;
	const kingRank = positionData.kingPosition[colorInCheck].mRank;

	// king must be on its third or fifth rank
	if (positionData.kingPosition[colorInCheck].mRank == kingThirdRank) {
		// there must be a vertical and diagonal checker attacking in the forward direction toward the king.
		// Both checking pieces must be at least 2 steps away.
		for (let i = 0; i < 2; i++) {
			if (checkers[i].mFile == kingFile && Math.sign(kingRank - checkers[i].mRank) == attackerForwardDirection &&
				Math.abs(kingRank - checkers[i].mRank) > 1) {
				verticalChecker = i;
				continue;
			}
			if (Math.abs(checkers[i].mFile - kingFile) == Math.abs(checkers[i].mRank - kingRank) &&
				Math.abs(checkers[i].mFile - kingFile) > 1 &&
				Math.sign(kingRank - checkers[i].mRank) == attackerForwardDirection) {
				diagonalChecker = i;
			}
		}

		if (verticalChecker == -1 || diagonalChecker == -1) {
			return false;
		}
	}
	else if (positionData.kingPosition[colorInCheck].mRank == kingFifthRank) {
		// there must be a vertical and diagonal checker attacking in the backward direction toward the king.
		// Both checking pieces must be at least 2 steps away.
		for (let i = 0; i < 2; i++) {
			if (checkers[i].mFile == kingFile && Math.sign(kingRank - checkers[i].mRank) == -attackerForwardDirection &&
				Math.abs(kingRank - checkers[i].mRank) > 1) {
				verticalChecker = i;
				continue;
			}
			if (Math.abs(checkers[i].mFile - kingFile) == Math.abs(checkers[i].mRank - kingRank) &&
				Math.abs(checkers[i].mFile - kingFile) > 1 &&
				Math.sign(kingRank - checkers[i].mRank) == -attackerForwardDirection) {
				diagonalChecker = i;
			}
		}

		if (verticalChecker == -1 || diagonalChecker == -1) {
			return false;
		}
	}
	else {
		return false;
	}

	// there must be an attacker pawn ahead of the square nearest to the king along the diagonal checker line
	// and the square ahead of that one must be empty
	const enPassantTargetFile = kingFile - Math.sign(kingFile - checkers[diagonalChecker].mFile);
	return board[enPassantTargetFile][kingThirdRank].color == opposite(colorInCheck) &&
		   board[enPassantTargetFile][kingThirdRank].unit == "P" &&
		   board[enPassantTargetFile][kingSecondRank].unit == "";
}

function checkIllegalDoubleCheck(checkers, colorInCheck) {
	/*
	   If pieces A and B are checking the king:

	   1. If A is a line piece, check if B can retract from its current square to any square on the line of A,
	      and B would not check the king from that new square. If so, return error_ok.  (Note that for pawns,
	      both vertical and diagonal retractions must be considered.)
	   2. If A is a line piece and B is on its promotion square, check if any of the promotion squares
	      are on the line of A, and a pawn would not check the king from that new square. If so, return error_ok.
	   3. Same as 1 with A and B reversed.
	   4. Same as 2 with A and B reversed.
	   5. En passant double discovered check:
	      (a) A and B must both be line pieces.
	      (b) There must be two horizontally adjacent squares on the en passant initial rank of the checking side,
	          one of the them on the line of A, and the other on the line of B.
	      (c) There must be a pawn of the checking side directly ahead (from the checking side's perspective)
	          of one of these two adjacent squares from (b).
	      (d) The square ahead of the pawn from (c) must be empty.
	      If all of (a)-(d) are satisfied, return error_ok.
	   6. Otherwise, there is an illegal double check.
    */

	assert(checkers.length == 2, "checkIllegalDoubleCheck must be called with exactly 2 checkers");
	const linePieces = ["Q", "R", "B"];
	const firstCheckingPiece = board[checkers[0].mFile][checkers[0].mRank].unit;
	const secondCheckingPiece = board[checkers[1].mFile][checkers[1].mRank].unit;
	if (linePieces.indexOf(firstCheckingPiece) != -1 && canDiscoverCheck(checkers[0], checkers[1], colorInCheck)) {
		return error_ok;
	}
	if (linePieces.indexOf(secondCheckingPiece) != -1 && canDiscoverCheck(checkers[1], checkers[0], colorInCheck)) {
		return error_ok;
	}
	if (linePieces.indexOf(firstCheckingPiece) != -1 && linePieces.indexOf(secondCheckingPiece) != -1 &&
		canDiscoverEnPassantCheck(checkers, colorInCheck)) {
		return error_ok;
	}

	return error_illegalDoubleCheck;
}

function isPositionLegalInternal() {
	// Note: This also updates the pawnCaptureCounts, totalCaptureCounts, and promotedCounts fields in positionData.

	if (positionData.detailedUnitCount["wP"] > 8) {
		return error_tooManyWhitePawns;
	}
	if (positionData.detailedUnitCount["bP"] > 8) {
		return error_tooManyBlackPawns;
	}

	const [whiteUnitCount, blackUnitCount] = getUnitCounts();
	// too many units
	if (whiteUnitCount > 16) {
		return error_tooManyWhiteUnits;
	}
	if (blackUnitCount > 16) {
		return error_tooManyBlackUnits;
	}

	for (const detailedUnit in positionData.detailedUnitCount) {
		if (positionData.detailedUnitCount.hasOwnProperty(detailedUnit)) {
			// update promoted count
			if (detailedUnit[1] != "K" && detailedUnit[1] != "P") {
				const promotedCount =
					Math.max(0, positionData.detailedUnitCount[detailedUnit] - MAX_ORIGINAL_COUNTS[detailedUnit.slice(1)]);
				const error = updatePromotedCount(detailedUnit, promotedCount);
				if (error != error_ok) return error;
			}
		}
	}

	const oppositeRetract = opposite(currentRetract);
	
	// opposing side is in check
	if (isInCheck(oppositeRetract)) return error_oppositeSideInCheck;

	// check by more than > 2 units
	const currentCheckers = getCheckingUnits(currentRetract);
	if (currentCheckers.length > 2) return error_moreThanTwoCheckers;

	// check by pawn on original rank
	for (let i = 0; i < currentCheckers.length; i++) {
		const checkingPiece = board[currentCheckers[i].mFile][currentCheckers[i].mRank];
		if (checkingPiece.unit == 'P' && checkingPiece.frozen) return error_checkByPawnOnSecondRank;
	}

	if (currentCheckers.length == 2) {
		const error = checkIllegalDoubleCheck(currentCheckers, currentRetract);
		if (error != error_ok) return error;
	}

	tempPawnCaptureCounts["w"] = getWhitePawnCaptures(board);
	if (tempPawnCaptureCounts["w"] == IMPOSSIBLE) {
		return error_impossiblePawnStructure;
	}
	tempPawnCaptureCounts["b"] = getBlackPawnCaptures(board);
	tempPawnCaptureCounts["t"] = getTotalPawnCaptures(board);
	tempTotalCaptureCounts["w"] = tempPawnCaptureCounts["w"];
	tempTotalCaptureCounts["b"] = tempPawnCaptureCounts["b"];

	let error;
	error = checkTooManyCaptures();
	if (error != error_ok) return error;

	error = checkIllegalBishops();
	if (error != error_ok) return error;

	error = checkIllegalCage();
	if (error != error_ok) return error;

	const markedPromotions = {};
	for (let file = 0; file < 8; file++) {
		for (let rank = 0; rank < 8; rank++) {
			if (board[file][rank].promoted) {
				const detailedUnitType = board[file][rank].color + getDetailedUnitType(file, rank, board[file][rank].unit);
				if (!(detailedUnitType in markedPromotions)) {
					markedPromotions[detailedUnitType] = 0;
				}
				markedPromotions[detailedUnitType]++;
			}
		}
	}

	for (const detailedUnitType in markedPromotions) {
		if (markedPromotions.hasOwnProperty(detailedUnitType) && markedPromotions[detailedUnitType] > 0) {
			const error = updatePromotedCountWithMax(detailedUnitType, markedPromotions[detailedUnitType]);
			if (error != error_ok) return error;
		}
	}

	return error_ok;
}

function isPositionLegal() {
	const error = isPositionLegalInternal();
	updateRealCounts();
	clearTempCounts();
	return error;
}

function isPositionDataFinalized() {
	if (undoStack.atBottomOfStack()) {
		return positionData.isInitialPositionFinalized;
	}
	return undoStack.isCurrentItemFinalized();
}

function getMoveCount() {
	return undoStack.moveCount;
}