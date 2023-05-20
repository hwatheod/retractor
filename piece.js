class Piece {
	constructor(color, unit) {
		this.unit = unit.toUpperCase();
		this.color = color;
		this.frozen = false;
		this.promoted = false;
		this.original = false;
	}
}

function isEmpty(piece) {
	return piece.color == "";
}

function clearPiece(piece) {
	piece.color = "";
	piece.unit = "";
	piece.frozen=false;
	piece.promoted=false;
	piece.original=false;
}

function copyPiece(dst, src) {
	dst.unit = src.unit;
	dst.color = src.color;
	dst.frozen = src.frozen;
	dst.promoted = src.promoted;
	dst.original = src.original;
}

function getDetailedUnitType(file, rank, unit) {
	// returns unit unless it's a bishop, when we append L or D for light or dark bishop.
	if (unit == 'B') {
		if ((file + rank) % 2 == 1) return "BL"; else return "BD";
	} else return unit;
}
	
function placePieceAt(file, rank, piece) {
	if (board[file][rank].unit != "") {
		const detailedUnitType = getDetailedUnitType(file, rank, board[file][rank].unit);
		positionData.detailedUnitCount[board[file][rank].color + detailedUnitType]--;
	}

	// during cage verification, it is possible for one or both kings to be missing.
	if (positionData.detailedUnitCount[board[file][rank].color + 'K'] == 0) {
		positionData.kingPosition[board[file][rank].color] = null;
	}

	if (piece.unit != "") {
		const detailedUnitType = getDetailedUnitType(file, rank, piece.unit);
		positionData.detailedUnitCount[piece.color + detailedUnitType]++;
	}

	if (piece.unit == 'K') {
		positionData.kingPosition[piece.color] = new Square(file, rank);
	}
	copyPiece(board[file][rank], piece);
}

function emptyPieceAt(file, rank) {
	placePieceAt(file, rank, new Piece("",""));
}

function setDefaultPieceParameters(file, rank, piece) {
	// set default original and frozen values sensibly

	if (piece.color == "" || piece.unit == "") {
		piece.unit = "";
		piece.color = "";
	}	
	if (piece.unit == 'P') {
		assert(rank > 0 && rank < 7, 'Tried to add a pawn on rank ' + rank);
		piece.original = true;
		if (piece.color == "w") {
			piece.frozen = (rank == 1);
		}
		if (piece.color == "b") {
			piece.frozen = (rank == 6);
		}
	}
	if (piece.unit == 'K') {
		piece.original = true;
	}
	if (piece.frozen) {
		piece.original = true;
	}
}