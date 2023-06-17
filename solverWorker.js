importScripts('board.js', 'cages.js', 'constants.js', 'error.js', 'legalityChecker.js', 'pawnCaptures.js',
    'piece.js', 'pseudoLegalityChecker.js', 'solver.js', 'undo.js');
let undoStack = new UndoStack();

onmessage = function(e) {
    const solveParameters = e.data[0];
    board = e.data[1];
    currentRetract = e.data[2];
    positionData = new PositionData();
    positionData.initializeDataFromBoard(false); // solver assumes position is legal
    positionData.ep = e.data[3];
    getPawnCaptureCache().set(e.data[4]);
    knownCages = e.data[5];
    getPawnCaptureConfig().set(e.data[6]);
	undoStack.reset();

    const result = solve(solveParameters);
    const maybeTruncated = result.length == solveParameters.maxSolutions;
    postMessage([result, getPawnCaptureCache(), maybeTruncated]);
}