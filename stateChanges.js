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
    document.getElementById("copyGameText").innerHTML = textMoveRecord;
    showModal("copyGameModal");
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
                board[move.from.mFile][move.from.mRank].color == currentRetract
                && board[move.from.mFile][move.from.mRank].unit == move.fromUnit
                && doRetraction(move.from, move.to, move.uncapturedUnit, move.unpromote, true, false) == error_ok;
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
    message = numMoves.toString() + " move" + ((numMoves != 1) ? "s" : "") + " replayed.";
    if (numMoves > 0) {
        message += "  Use 'forward' button to view.";
        disableSolutionButtons();
    }
    if (illegalMove != null) {
        message += "  Stopped at illegal move " + illegalMove;
    }

    showError(message);
}

function resetSolver() {
    if (solverWorker && solverActive) {
        solverWorker.terminate();
        solverWorker = null;
    }
    solverActive = false;
    clearModal("solveModal");
    document.getElementById("startSolve").value = "Solve";
    document.getElementById("solveErrorMessage").innerHTML = "";
}

let solverWorker = null;
let solverActive = false;
let solutions;

function solveGui() {
    if (!solverWorker) {
        solverWorker = new Worker("solverWorker.js");
        solverWorker.onmessage = function (e) {
            solverActive = false;
            solutions = e.data[0];
            getPawnCaptureCache().set(e.data[1]);
            const maybeTruncated = e.data[2];
            const timeInSeconds = e.data[3];
            resetSolver();
            if (solutions.length == 0) {
                showError("No solutions found; position is impossible. Time: " + timeInSeconds + " seconds.");
            } else {
                showError("Solve finished in " + timeInSeconds + " seconds.");
            }
            showSolutions(maybeTruncated);
            updateVisualBoard();
        }
    }
    if (!solverActive) {
        const solveDepth = parseInt(document.getElementById("solveDepth").value, 10);
        const extraDepth = parseInt(document.getElementById("extraDepth").value, 10);
        const maxSolutions = parseInt(document.getElementById("maxSolutions").value, 10);
        const noWhiteUncaptures = document.getElementById("noWhiteUncaptures").checked;
        const noBlackUncaptures = document.getElementById("noBlackUncaptures").checked;
        if (isNaN(solveDepth) || isNaN(extraDepth) || isNaN(maxSolutions)) {
            document.getElementById("solveErrorMessage").innerHTML = "Invalid parameters";
            return;
        }
        document.getElementById("startSolve").value = "Cancel Solve";
        document.getElementById("solveErrorMessage").innerHTML = "Solving, please wait...";
        resetLegalityCheckerWorker();
        solverActive = true;
        solverWorker.postMessage([new SolveParameters(solveDepth, extraDepth, maxSolutions, noWhiteUncaptures, noBlackUncaptures), board,
            currentRetract, positionData.ep, getPawnCaptureCache(), knownCages, getPawnCaptureConfig()]);
    } else { // cancel
        resetSolver();
    }
}

function setRetractGui(event) {
    if (currentMode == MODE_EDIT) {
        setRetract(event.target.value);
    }
}

function verifyCageGui() {
    verifyCageSelectionMode = true;
    document.getElementById("verifyCageSelectAll").style.visibility = "visible";
    document.getElementById("verifyCageUnselectAll").style.visibility = "visible";
    document.getElementById("verifyCageMessage").innerHTML = "Click the squares forming the cage to be verified.";
    document.getElementById("verifyCageVerify").value = "Verify";
    document.getElementById("verifyCageTryAnother").style.visibility = "hidden";
    document.getElementById("verifyCageImport").style.visibility = "visible";
    document.getElementById("verifyCageExport").style.visibility = "visible";
    if (serializedRequestedCages.length > 0) {
        document.getElementById("verifyCageExport").removeAttribute("disabled");
    } else {
        document.getElementById("verifyCageExport").setAttribute("disabled", "");
    }

    // We set the board's zIndex higher than the modal's so that we can click on the board squares.
    document.getElementById("board").style.zIndex = 3;
    showModal('verifyCageModal');
}

function showError(error) {
    document.getElementById("errorMessage").innerHTML = error;
}

function setMode(event) {
    const newMode = event.target.value == "edit" ? MODE_EDIT : MODE_PLAY;
    if (newMode == MODE_EDIT) {
        switchToEditMode(true);
    } else { // play mode
        switchToPlayMode();
    }
    return true;
}

function switchToPlayMode() {
    currentMode = MODE_PLAY;
    startPlay(false);

    document.getElementById("modePlay").checked = true;
    document.getElementById("modeEdit").checked = false;
    document.getElementById("ep_and_unpromote").style.visibility = "visible";
    document.getElementById("black_pieces").style.visibility = "hidden";
    document.getElementById("retractRadioButtons").style.display = "none";
    document.getElementById("retractColor").innerHTML = (currentRetract == "w" ? "White" : "Black");
    document.getElementById("clearBoardGroup").style.display = "none";
    document.getElementById("controlGroup").style.display = "block";
    document.getElementById("setPositionButton").style.visibility = "hidden";
    document.getElementById("pawnCapturesTable").hidden = false;
    document.getElementById("promoteeTable").hidden = false;
    document.getElementById("config").hidden = true;
    document.getElementById("forsytheText").setAttribute("readonly", "");
    document.getElementById("moves").style.display = "block";

    solutions = null;
    navigatedMoveIndex = null;
    finalizeRetraction();
    updateVisualBoard();
    asyncLegalityCheck();
}

function switchToEditMode(clearFlags) {
    currentMode = MODE_EDIT;
    stopPlay(clearFlags);
    resetSolver();
    resetLegalityCheckerWorker();
    solutions = null;

    document.getElementById("modePlay").checked = false;
    document.getElementById("modeEdit").checked = true;
    document.getElementById("ep_and_unpromote").style.visibility = "hidden";
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
    document.getElementById("exportSolutionsSpan").style.visibility = "hidden";
    document.getElementById("solutionDisplay").innerHTML = "";
    document.getElementById("moves").style.display = "none";
    document.getElementById("pawnCapturesTable").hidden = true;
    document.getElementById("promoteeTable").hidden = true;
    document.getElementById("config").hidden = false;
    resetUncapturedPiece();
    showError("");
    updateEditModeData();
}

function setPosition() {
    if (currentMode == MODE_EDIT) {
        const forsythe = document.getElementById("forsytheText").value.trim();
        const err = validateForsythe(forsythe);
        if (err == "ok") {
            setForsythe(forsythe);
            updateVisualBoard();
            showError("");
        } else showError("Invalid Forsythe notation: " + err);
    }
}

function download(data, filename) {
    const url = window.URL.createObjectURL(data);
    fakeDownload.href = url;
    fakeDownload.download = filename;
    document.body.appendChild(fakeDownload);
    fakeDownload.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(fakeDownload);
}