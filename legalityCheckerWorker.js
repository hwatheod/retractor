importScripts('board.js', 'cages.js', 'constants.js', 'error.js', 'legalityChecker.js', 'pawnCaptures.js',
		'piece.js', 'pseudoLegalityChecker.js', 'undo.js');

onmessage = function(e) {
    board = e.data[0];
    positionData = new PositionData();
	positionData.set(e.data[1]);
    currentRetract = e.data[2];
	getPawnCaptureCache().set(e.data[3]);
	knownCages = e.data[4];
	if (!tempUndoStack) {
	    tempUndoStack = new UndoStack();
    }
    tempUndoStack.reset();
	flipRetract();
    const result = isPositionLegal();
	flipRetract();

    postMessage([result, tempUndoStack, getPawnCaptureCache(), errorSquares]);
}