// Functions to update the internal state based on clicks on various HTML elements

function setUncapturedPiece(event) {
	currentUncapturedUnit = event.target.value;
}

function resetUncapturedPiece() {
	document.getElementById("pieceSelection_none").checked = true;
	currentUncapturedUnit = "";
}

function resetUnpromote() {
	document.getElementById("unpromoteSelection").checked = false;
	document.getElementById("pieceSelection_ep").style.visibility = "visible";
}

function getUnpromote() {
	return document.getElementById("unpromoteSelection").checked;
}

function toggleUnpromote() {
	if (getUnpromote())
		document.getElementById("pieceSelection_ep").style.visibility = "hidden";
	else document.getElementById("pieceSelection_ep").style.visibility = "visible";
}

function undoGui(permanent) {
	// permanent means don't allow redo on this move. It is used in the case when we pop up a warning
	// for an illegal position, and the user decides to undo it. We don't want to allow redo back
	// to the illegal position.
	if (permanent == null) {
		permanent = false;
	}
	if (undo(permanent)) {
		resetLegalityCheckerWorker();
		updateVisualBoard();
		finalizeRetraction();
		if (navigatedMoveIndex != null) {
			navigatedMoveIndex--;
		}
		return true;
	} else {
		showError("No more moves to go back.");
		return false;
	}
}

function undoAllGui() {
	while (undo()) {
		if (navigatedMoveIndex != null) {
			navigatedMoveIndex--;
		}
	}
	resetLegalityCheckerWorker();
	updateVisualBoard();
	finalizeRetraction();
}

function redoGui() {
	if (redo()) {
		updateVisualBoard();
		finalizeRetraction();
		if (navigatedMoveIndex != null) {
			navigatedMoveIndex++;
		}
	} else {
		showError("No more moves to go forward.");
	}
}

function redoAllGui() {
	while (redo()) {
		if (navigatedMoveIndex != null) {
			navigatedMoveIndex++;
		}
	}
	updateVisualBoard();
	finalizeRetraction();
}

function copyGameGui() {
	const moveRecord = undoStack.getMoveRecordToHere();
	const textMoveRecord = moveRecord.map(moveToString).join(" ");
	navigator.clipboard.writeText(textMoveRecord)
		.then(() => showError("Game copied to clipboard."),
		      () => showError("Failed to copy game to clipboard."));
}

function replayGame(moveText) {
	const moveTextSplit = moveText.trim().split(/\s+/);
	let numMoves = 0;
	let illegalMove = null;
	for (let i = 0; i < moveTextSplit.length; i++) {
		const moveSingleText = moveTextSplit[i];
		const move = stringToMove(moveSingleText, currentRetract);
		if (move != null) {
			const isPseudoLegal =
				doRetraction(move.from, move.to, move.uncapturedUnit, move.unpromote, true, false) == error_ok;
			if (isPseudoLegal) {
				numMoves++;
			} else {
				illegalMove = moveSingleText;
				break;
			}
		}
	}
	for (let i = 0; i < numMoves; i++) {
		assert(undo(), "Could not undo moves just replayed");
	}

	return [numMoves, illegalMove];
}

function processMoveText(moveText) {
	const [numMoves, illegalMove] = replayGame(moveText);
	let message;
	if (numMoves > 0) {
		message = numMoves.toString() + " move" + ((numMoves > 1) ? "s" : "") + " replayed. Use 'forward' button to view.";
		if (illegalMove != null) {
			message += "  Stopped at illegal move " + illegalMove;
		}
	} else {
		message = "No moves found on clipboard.";
	}
	showError(message);
}

function resetSolver() {
	if (solverWorker && !solverDone) {
		solverWorker.terminate();
		solverWorker = null;
	}
	solverDone = true;
	clearSolveModal();
	document.getElementById("startSolve").value = "Solve";
	document.getElementById("solveErrorMessage").innerHTML = "";
}

let solverWorker = null;
let solverDone = true;
let solutions;
function solveGui() {
	if (!solverWorker) {
		solverWorker = new Worker("solverWorker.js");
		solverWorker.onmessage = function(e) {
			solverDone = true;
			solutions = e.data[0];
			getPawnCaptureCache().set(e.data[1]);
			resetSolver();
			if (solutions.length == 0) {
				showError("No solutions found; position is impossible.");
			}
			showSolutions();
			updateVisualBoard();
		}
	}
	if (solverDone) {
		const solveDepth = parseInt(document.getElementById("solveDepth").value, 10);
		const extraDepth = parseInt(document.getElementById("extraDepth").value, 10);
		const maxSolutions = parseInt(document.getElementById("maxSolutions").value, 10);
		if (isNaN(solveDepth) || isNaN(extraDepth) || isNaN(maxSolutions)) {
			document.getElementById("solveErrorMessage").innerHTML = "Invalid parameters";
			return;
		}
		document.getElementById("startSolve").value = "Cancel Solve";
		document.getElementById("solveErrorMessage").innerHTML = "Solving, please wait...";
		resetLegalityCheckerWorker();
		solverDone = false;
		solverWorker.postMessage([new SolveParameters(solveDepth, extraDepth, maxSolutions), board,
			currentRetract, positionData.ep, getPawnCaptureCache()]);
	} else { // cancel
		resetSolver();
	}
}

function setRetractGui(event) {
	if (currentMode == MODE_EDIT) {
		setRetract(event.target.value);
	}
}

function showError(error) {
	document.getElementById("errorMessage").innerHTML = error;
}

function setMode(event) {
	const newMode = event.target.value == "edit" ? MODE_EDIT : MODE_PLAY;
	currentMode = newMode;
	updateMode(newMode, true, true);
	return true;
}

function updateMode(mode, clearFlags, asyncMode) {
	if (mode == MODE_PLAY) {
		const result = startPlay(!asyncMode); // in asyncMode, we don't check legality here; we launch asyncLegalityCheck at the end
		document.getElementById("none_and_ep").style.visibility = "visible";
		document.getElementById("black_pieces").style.visibility = "hidden";
		document.getElementById("retractRadioButtons").style.display = "none";
		document.getElementById("retractColor").innerHTML = (currentRetract == "w" ? "White" : "Black");
		document.getElementById("clearBoardGroup").style.display = "none";
		document.getElementById("controlGroup").style.display = "block";
		document.getElementById("setPositionButton").style.visibility = "hidden";
		document.getElementById("pawnCapturesTable").hidden = false;
		document.getElementById("promoteeTable").hidden = false;
		document.getElementById("forsytheText").setAttribute("readonly", "");
		document.getElementById("moves").style.display = "block";

		solutions = null;
		navigatedMoveIndex = null;
		finalizeRetraction();
		updateVisualBoard(mode);
		if (asyncMode) {
			asyncLegalityCheck();
		}
		return result;
	} else { // edit mode
		stopPlay(clearFlags);
		resetSolver();
		resetLegalityCheckerWorker();
		solutions = null;

		document.getElementById("none_and_ep").style.visibility = "hidden";
		document.getElementById("pieceSelection_ep").style.visibility = "hidden";
		document.getElementById("black_pieces").style.visibility = "visible";
		document.getElementById("retractRadioButtons").style.display = "block";
		document.getElementById("retractColor").innerHTML = "";
		document.getElementById("retractWhite").checked = (currentRetract == "w");
		document.getElementById("retractBlack").checked = (currentRetract == "b");
		document.getElementById("clearBoardGroup").style.display = "block";
		document.getElementById("controlGroup").style.display = "none";
		document.getElementById("setPositionButton").style.visibility = "visible";
		document.getElementById("forsytheText").removeAttribute("readonly");
		document.getElementById("solutionDisplay").innerHTML = "";
		document.getElementById("moves").style.display = "none";
		document.getElementById("pawnCapturesTable").hidden = true;
		document.getElementById("promoteeTable").hidden = true;
		showError("");
		updateEditModeData();
	}
}

function setPosition() {
	if (currentMode == MODE_EDIT) {
		const forsythe = document.getElementById("forsytheText").value.trim();
		const err = validateForsythe(forsythe);
		if (err == "ok") {
			setForsythe(forsythe);
			updateVisualBoard();
			showError("");
		}
		else showError("Invalid Forsythe notation: " + err);
	}
}