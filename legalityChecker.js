let tempUndoStack;
let tempPawnCaptureCounts = {};
let tempTotalCaptureCounts = {};
let tempPromotedCounts = {};
let tempPossiblePromotionFiles = {};
let tempExcludedPromotionFiles = {};
let tempMissingFriendlyRookData = [];

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
				}
			}
		)

		this.ep = -1;

		this.pawnCaptureCounts["w"] = 0;
		this.pawnCaptureCounts["b"] = 0;
		this.pawnCaptureCounts["t"] = 0;

		this.totalCaptureCounts["w"] = 0;
		this.totalCaptureCounts["b"] = 0;

		clearTempCounts();
		this.isInitialPositionFinalized = false;
	}

	initializeDataFromBoard(checkLegal) {
		// checkLegal == true is only used in unit tests to immediately check if a position is legal.
		// In normal usage, the legality check is done asynchronously via asyncLegalityCheck().
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
		if (checkLegal && this.kingPosition["w"] == null) {
			return error_noWhiteKing;
		}
		if (checkLegal && this.kingPosition["b"] == null) {
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
	DETAILED_UNIT_TYPES.forEach(
		detailedUnitType => {
			if (detailedUnitType != "K" && detailedUnitType != "P") {
				tempPromotedCounts["w" + detailedUnitType] = 0;
				tempPromotedCounts["b" + detailedUnitType] = 0;
				tempPossiblePromotionFiles["w" + detailedUnitType] = [];
				tempPossiblePromotionFiles["b" + detailedUnitType] = [];
				tempExcludedPromotionFiles["w" + detailedUnitType] = [];
				tempExcludedPromotionFiles["b" + detailedUnitType] = [];
			}
		}
	);

	tempPawnCaptureCounts["w"] = 0;
	tempPawnCaptureCounts["b"] = 0;
	tempPawnCaptureCounts["t"] = 0;

	tempTotalCaptureCounts["w"] = 0;
	tempTotalCaptureCounts["b"] = 0;

	tempMissingFriendlyRookData = [];
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

function addPossiblePromotionFiles(color, detailedUnit, range) {
	const files = [];
	for (let file = range[0]; file <= range[1]; file++) {
		files.push(file);
	}
	tempPossiblePromotionFiles[color + detailedUnit].push(files);
}

function addExcludedPromotionFiles(color, detailedUnit, range) {
	for (let file = range[0]; file <= range[1]; file++) {
		tempExcludedPromotionFiles[color + detailedUnit].push(file);
	}
}

function getNoPromotionSquaresError(color, detailedUnitType) {
	assert(color == "w" || color == "b", "Unexpected color: " + color);
	switch(detailedUnitType) {
		case 'Q': return color == "w" ? error_noWhitePromotionSquaresForQueen : error_noBlackPromotionSquaresForQueen;
		case 'R': return color == "w" ? error_noWhitePromotionSquaresForRook : error_noBlackPromotionSquaresForRook;
		case 'BL':
		case 'BD': return color == "w" ? error_noWhitePromotionSquaresForBishop : error_noBlackPromotionSquaresForBishop;
		case 'N': return color == "w" ? error_noWhitePromotionSquaresForKnight : error_noBlackPromotionSquaresForKnight;
		default: assert(false, "Unexpected detailed unit type " + detailedUnitType);
	}
}

function finalizePossiblePromotionFiles() {
	const allFiles = [0, 1, 2, 3, 4, 5, 6, 7];
	const darkSquareFilesFirstRank = [0, 2, 4, 6];
	const lightSquareFilesFirstRank = [1, 3, 5, 7];

	let impossiblePromotionFiles = {};
	["w", "b"].forEach(color => {
		impossiblePromotionFiles[color] = [];
		const lastRank = color == "w" ? 7 : 0;
		const secondLastRank = color == "w" ? 6 : 1;
		for (let file = 0; file < 8; file++) {
			// no promotion is possible on square with a frozen piece
			if (board[file][lastRank].frozen) {
				impossiblePromotionFiles[color].push(file);
			}

			// no promotion is possible if all the escape squares are occupied by enemy pawns
			if (board[file][secondLastRank].color == opposite(color) &&
				board[file][secondLastRank].unit == "P" &&
				(file == 0 ||
					(board[file - 1][secondLastRank].color == opposite(color) &&
					 board[file - 1][secondLastRank].unit == "P")) &&
				(file == 7 ||
					(board[file + 1][secondLastRank].color == opposite(color) &&
					 board[file + 1][secondLastRank].unit == "P"))) {
				impossiblePromotionFiles[color].push(file);
			}
		}
	});

	for (const color of ["w", "b"]) {
		for (const detailedUnitType of DETAILED_UNIT_TYPES) {
			if (detailedUnitType != "K" && detailedUnitType != "P") {
				const key = color + detailedUnitType;

				// add promotion files for any "outside" promoted pieces already assigned from a cage
				const unassignedPromotedCount = tempPromotedCounts[key] - tempPossiblePromotionFiles[key].length;
				assert(unassignedPromotedCount >= 0,
					"tempPromotedCounts for " + key + " is " + tempPromotedCounts[key] + " which is less than "
					+ " number of assigned promotion files " + tempPossiblePromotionFiles[key].length);
				if (unassignedPromotedCount > 0) {
					let unexcludedPromotionFiles;
					if (detailedUnitType == "BL") {
						if (color == "b") {
							unexcludedPromotionFiles = lightSquareFilesFirstRank;
						} else {
							unexcludedPromotionFiles = darkSquareFilesFirstRank;
						}
					}
					else if (detailedUnitType == "BD") {
						if (color == "b") {
							unexcludedPromotionFiles = darkSquareFilesFirstRank;
						} else {
							unexcludedPromotionFiles = lightSquareFilesFirstRank;
						}
					} else {
						unexcludedPromotionFiles = allFiles;
					}
					unexcludedPromotionFiles = unexcludedPromotionFiles.filter(
						file => !tempExcludedPromotionFiles[key].includes(file));
					if (unexcludedPromotionFiles.length == 0) {
						return getNoPromotionSquaresError(color, detailedUnitType);
					}
					for (let i = 0; i < unassignedPromotedCount; i++) {
						tempPossiblePromotionFiles[key].push(unexcludedPromotionFiles);
					}
				}

				// remove impossible files from all the promotion files
				for (let i = 0; i < tempPossiblePromotionFiles[key].length; i++) {
					tempPossiblePromotionFiles[key][i] = tempPossiblePromotionFiles[key][i].filter(
						file => !impossiblePromotionFiles[color].includes(file));
					if (tempPossiblePromotionFiles[key][i].length == 0) {
						return getNoPromotionSquaresError(color, detailedUnitType);
					}
				}
			}
		}
	}

	return error_ok;
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
			case 'N': return error_impossiblePromotedWhiteKnight;
			default: assert(false, 'Unexpected promoted white piece ' + board[file][rank].unit + ' file ' +
				file + ' rank ' + rank);
		}
	} else if (board[file][rank].color == "b") {
		switch(board[file][rank].unit) {
			case 'Q': return error_impossiblePromotedBlackQueen;
			case 'R': return error_impossiblePromotedBlackRook;
			case 'B': return error_impossiblePromotedBlackBishop;
			case 'N': return error_impossiblePromotedBlackKnight;
			default: assert(false, 'Unexpected promoted black piece ' + board[file][rank].unit + ' file ' +
				file + ' rank ' + rank);
		}
	} else {
		assert(false, 'Unexpected color ' + board[file][rank].color);
	}
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
	const currentCheckers = getCheckingUnits(currentRetract, false);
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

	let error;
	error = checkIllegalBishops();
	if (error != error_ok) return error;

	error = checkIllegalCage();
	if (error != error_ok) return error;

	error = checkKingInEnemyPawnCage();
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

	for (let i = 0; i < knownCages.length; i++) {
		const cage = knownCages[i];
		if (boardContainsCage(board, cage)) {
			for (let file = 0; file < 8; file++) {
				for (let rank = 0; rank < 8; rank++) {
					if (!isEmpty(cage[file][rank])) {
						errorSquares.push(new Square(file, rank));
					}
				}
			}
			return error_impossibleKnownCage;
		}
	}

	error = finalizePossiblePromotionFiles();
	if (error != error_ok) return error;

	const [whiteCaptures, blackCaptures, totalCaptures] =
		getAllPawnCaptures(board, tempPossiblePromotionFiles, tempMissingFriendlyRookData, tempTotalCaptureCounts);
	tempPawnCaptureCounts["w"] = whiteCaptures;
	if (tempPawnCaptureCounts["w"] == IMPOSSIBLE) {
		return error_impossiblePawnStructure;
	}
	tempPawnCaptureCounts["b"] = blackCaptures;
	tempPawnCaptureCounts["t"] = totalCaptures;
	tempTotalCaptureCounts["w"] += tempPawnCaptureCounts["w"];
	tempTotalCaptureCounts["b"] += tempPawnCaptureCounts["b"];

	error = checkTooManyCaptures();
	if (error != error_ok) return error;

	return error_ok;
}

function isPositionLegal() {
	errorSquares = [];
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