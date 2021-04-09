class Square {
	constructor(file, rank) {
		this.mFile = file;
		this.mRank = rank;
	}
}

function getCoordsAlgNotation(file, rank) {
	return "abcdefgh".charAt(file) + ((rank + 1) + '');
}

function getSquareAlgNotation(square) {
	return getCoordsAlgNotation(square.mFile, square.mRank);
}

function initializeBoard() {
	board = new Array(8);
    for (let i = 0; i < 8; i++) {
        board[i] = new Array(8);
    }

    for (let rank = 7; rank >= 0; rank--) {
		for (let file = 0; file <= 7; file++) {
			board[file][rank] = new Piece("", "");
		}
	}

    positionData = new PositionData(); // data about the position, computed during legality testing after each retraction
	pieceLetters = "kqrbnp";

    undoStack = new UndoStack();
}

function clearBoard() {
	for (let file = 0; file < 8; file++) {
		for (let rank = 0; rank < 8; rank++) {
			emptyPieceAt(file, rank);
		}
	}
	getPawnCaptureCache().clear();
}

function validateForsythe(forsythe) {
    const rowArray = forsythe.split(/\//);
    if (rowArray.length != 8)
		return "not exactly 8 rows";
    const kingLetter = pieceLetters[0];
    let whiteKingFound = false;
    let blackKingFound = false;
	for (let i = 0; i < 8; i++) {
        const forsytheLegalRegexp = new RegExp("^[" + pieceLetters + pieceLetters.toUpperCase() + "12345678]+$");
        if (!(rowArray[i].match(forsytheLegalRegexp)))
			return "invalid character in " + rowArray[i];
        let pos = 0;
        for (let j = 0; j < rowArray[i].length; j++) {
            const piece = rowArray[i].charAt(j);
            if (piece.match(/[12345678]/)) {
                const empties = parseInt(rowArray[i].charAt(j));
                pos += empties;
			}
			else {
				if (piece == kingLetter.toUpperCase()) {
					if (whiteKingFound) {
						return "More than one white king";
					} else {
						whiteKingFound = true;
					}
				}
				else if (piece == kingLetter.toLowerCase()) {
					if (blackKingFound) {
						return "More than one black king";
					} else {
						blackKingFound = true;
					}
				}
				pos++;
			}
			if (pos >= 8)
				break;
		}
		if (pos != 8) {
			return "not exactly 8 columns in " + rowArray[i];
		}
	}
	if (!whiteKingFound) {
		return "No white king";
	}
	if (!blackKingFound) {
		return "No black king";
	}
	return "ok";
}

function setForsythe(forsythe) {
    const rowArray = forsythe.split(/\//);
    if (rowArray.length != 8)
		return false;
	for (let i = 0; i < 8; i++) {
		const rank = 7 - i;
        const forsytheLegalRegexp = new RegExp("^[" + pieceLetters + pieceLetters.toUpperCase() + "12345678]+$");
        if (!(rowArray[i].match(forsytheLegalRegexp))) {
        	assert(false, "Invalid forsythe passed to setForsythe " + forsythe);
        	return false;
		}
        let file = 0;
        for (let j = 0; j < rowArray[i].length; j++) {
            const piece = rowArray[i].charAt(j);
            if (piece.match(/[12345678]/)) {
                const empties = parseInt(rowArray[i].charAt(j));
                for (let k = 0; k < empties; k++) {
					emptyPieceAt(file, rank);
					file++;
				}
			}
			else {
				const index = pieceLetters.indexOf(piece.toLowerCase());
				if (index != -1) {
					placePieceAt(file, rank, new Piece(piece.toUpperCase() == piece ? "w" : "b",
						"KQRBNP".charAt(index)));
					file++;
				} else {
					assert(false, "Invalid piece letter " + piece + " in forsythe " + forsythe +
						" - piece letters are " + pieceLetters);
				}
			}
			if (file >= 8) break;
		}
		if (file != 8) {
			assert(false, "Incomplete forsythe row " + rowArray[i] + ' ' + " ending at file=" + file);
			return false;
		}
	}
	return true;
}

function getForsythe() {
	let forsythe = "";
	for (let rank = 7; rank >= 0; rank--) {
		let forsytheRow = "";
		let empties = 0;
		for (let file = 0; file < 8; file++) {
			if (board[file][rank].unit == "") {
				empties++;
				continue;
			}
			if (empties > 0) {
				forsytheRow += empties.toString();
				empties = 0;
			}
			const pieceLetter = pieceLetters["KQRBNP".indexOf(board[file][rank].unit.toUpperCase())];
			if (board[file][rank].color == "w") {
				forsytheRow += pieceLetter.toUpperCase();
			} else {
				forsytheRow += pieceLetter.toLowerCase();
			}
		}
		if (empties > 0) {
			forsytheRow += empties.toString();
		}
		forsythe += forsytheRow;
		if (rank > 0) {
			forsythe += "/";
		}
	}
	return forsythe;
}

function startPlay(checkLegal) {
	if (checkLegal == null) {
		checkLegal = true;
	}
	const error = positionData.initializeDataFromBoard(checkLegal);
	undoStack.reset();
	if (checkLegal) {
		return error;
	}
}

function stopPlay(clearFlags) {
	if (clearFlags == null) {
		clearFlags = true;
	}

	if (clearFlags) {
		// reset flags on pieces
		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				board[file][rank].frozen = false;
				board[file][rank].promoted = false;
				board[file][rank].original = false;
				setDefaultPieceParameters(file, rank, board[file][rank]);
			}
		}
	}
}

function setRetract(color) {
	assert(color == "w" || color == "b", "Invalid color passed to setRetract");
	currentRetract = color;
}

function flipRetract() {
	if (currentRetract == "w") {
		setRetract("b");
	}
	else setRetract("w");
}

function undo(permanent) {
	// permanent means don't allow redo on this move. It is used in the case when we pop up a warning
	// for an illegal position, and the user decides to undo it. We don't want to allow redo back
	// to the illegal position.
	if (permanent == null) {
		permanent = false;
	}
	if (undoStack.undoLastMove()) {
		if (permanent) {
			undoStack.deleteRemainingItems();
		}
		flipRetract();
		return true;
	}
	return false;
}

function redo() {
	if (undoStack.redoLastMove()) {
		flipRetract();
		return true;
	}
	return false;
}