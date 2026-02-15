let pieceDragged;
let squareDragged;

function setSquare(square, piece) {
    piece.frozen = false;
    placePieceAt(square.mFile, square.mRank, piece);
    document.getElementById(square.mFile + ":" + square.mRank).src =
        getImgFilename(square.mFile, square.mRank, piece);
    updateEditModeData();
}

function clearSquare(square) {
    emptyPieceAt(square.mFile, square.mRank);
    document.getElementById(square.mFile + ":" + square.mRank).src =
        getImgFilename(square.mFile, square.mRank, new Piece("", ""));
    updateEditModeData();
}

function initializeBoardGui() {
    initializeBoard();

    const boardElement = document.getElementById("board");
    boardElement.onclick = clickSquare;
    boardElement.oncontextmenu = clickSquare;
    boardElement.onselectstart = function () {
        return false;
    }

    const squareWidth = 45;
    const squareHeight = 45;

    for (let rank = 7; rank >= 0; rank--) {
        for (let file = 0; file <= 7; file++) {
            const img = document.createElement("img");
            img.id = file + ":" + rank;
            img.className = "cell";
            img.style.width = String(squareWidth) + "px";
            img.style.height = String(squareHeight) + "px";
            img.style.top = String(squareHeight * (7 - rank)) + "px";
            img.style.left = String(squareWidth * file) + "px";
            img.mFile = file;
            img.mRank = rank;
            img.mStatus = 0;
            img.ondragstart = dragSquare;
            img.ondragend = dragEnd;
            img.ondragover = dragOverSquare;
            img.ondragenter = dragEnterSquare;
            img.ondragleave = dragLeaveSquare;
            img.ondrop = dragOntoSquare;
            boardElement.appendChild(img);
        }
    }

    pieceDragged = new Piece("", "");
}

function clearBoardGui() {
    if (currentMode == MODE_EDIT) {
        clearBoard();
        placePieceAt(4, 0, new Piece("w", "K"));
        placePieceAt(4, 7, new Piece("b", "K"));
        updateVisualBoard();
    }
}

function setInitialPositionGui() {
    if (currentMode == MODE_EDIT) {
        setForsythe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        updateVisualBoard();
    }
}

function getImgFilename(file, rank, piece) {
    let square_color, piece_color;

    if ((file + rank) % 2 == 1) {
        square_color = "l";
    } else square_color = "d";

    if (piece.color == "" || piece.unit == "") {
        return "images/Chess_" + square_color + "45.png";
    }

    if (piece.color == "w") {
        piece_color = "l";
    } else if (piece.color == "b") {
        piece_color = "d";
    }

    return "images/Chess_" + piece.unit.toLowerCase() + piece_color + square_color + "44.png";
}

function trySetFrozen(file, rank, piece) {
    const originalFile = {
        'R': [0, 7],
        'N': [1, 6],
        'B': [2, 5],
        'Q': [3],
        'K': [4]
    };
    const firstRank = piece.color == "w" ? 0 : 7;
    if (rank != firstRank) return false;
    if (piece.unit in originalFile && originalFile[piece.unit].indexOf(file) != -1) {
        piece.frozen = true;
        return true;
    }
    return false;
}

function trySetPromoted(file, rank, piece) {
    if (["Q", "R", "B", "N"].indexOf(piece.unit) != -1) {
        piece.promoted = true;
        return true;
    }
    return false;
}

function clickSquare(event) {
    const square = event.target;
    if (square.className != "cell") { // off the board
        return false;
    }

    if (currentMode == MODE_EDIT) {
        if (event.button == 2) { // right button
            if (board[square.mFile][square.mRank].unit != 'K') {
                clearSquare(square);
            }
            return false;
        }

        if (event.button == 0 || event.button == 1) { // left button, 1 on IE and 0 everywhere else
            if (event.shiftKey) {
                const piece = board[square.mFile][square.mRank];
                if (piece.unit == "" || piece.unit == "P") return false;
                /* frozen -> promoted -> none */
                if (piece.frozen) {
                    piece.frozen = false;
                    trySetPromoted(square.mFile, square.mRank, piece);
                    updateFlags();
                } else if (piece.promoted) {
                    piece.promoted = false;
                    updateFlags();
                } else {
                    if (trySetFrozen(square.mFile, square.mRank, piece)) {
                        updateFlags();
                    } else if (trySetPromoted(square.mFile, square.mRank, piece)) {
                        updateFlags();
                    }
                }
            } else {
                if (currentUncapturedUnit == "") {
                    if (board[square.mFile][square.mRank].unit != 'K') {
                        clearSquare(square);
                    }
                    return false;
                }
                if ((currentUncapturedUnit == "P" || currentUncapturedUnit == "p") && (square.mRank == 0 || square.mRank == 7)) {
                    return false;
                }
                // can't replace a king
                if (board[square.mFile][square.mRank].unit == 'K') {
                    return false;
                }
                setSquare(square, new Piece(currentUncapturedUnit.toUpperCase() == currentUncapturedUnit ? "w" : "b", currentUncapturedUnit));
            }
        }
    }

    if (currentMode == MODE_PLAY && verifyCageSelectionMode) {
        if (isEmpty(board[square.mFile][square.mRank])) {
            return false;
        }
        const boardSquare = new Square(square.mFile, square.mRank);
        let squareIndex = -1;
        verifyCageSelectedSquares.forEach((selectedSquare, i) => {
            if (selectedSquare.mFile == boardSquare.mFile && selectedSquare.mRank == boardSquare.mRank) {
                squareIndex = i;
            }
        });
        if (squareIndex == -1) { // new square, add it
            square.style.opacity = 0.5;
            verifyCageSelectedSquares.push(boardSquare);
        } else { // existing square, remove it
            square.style.opacity = 1.0;
            verifyCageSelectedSquares.splice(squareIndex, 1);
        }
    }

    return false;
}

dragSquare = function (event) {
    if (verifyCageSelectionMode) {
        return false;
    }
    const square = event.target;
    if (square.className != "cell") { // off the board
        return false;
    }
    const piece = board[square.mFile][square.mRank];
    if (isEmpty(piece)) {
        return false;
    }
    if (currentMode == MODE_PLAY) {
        if (currentRetract != piece.color) {
            if (currentRetract == "w") {
                showError(errorText[error_whitesTurn]);
            } else {
                showError(errorText[error_blacksTurn]);
            }
            return false;
        }
        if (piece.frozen) {
            showError(errorText[error_unitFrozen]);
            return false;
        }
        if (getUnpromote()) {
            if (currentRetract == 'w' && square.mRank != 7) {
                showError(errorText[error_whiteUnpromoteEighthRank]);
                return false;
            }
            if (currentRetract == 'b' && square.mRank != 0) {
                showError(errorText[error_blackUnpromoteFirstRank]);
                return false;
            }
            if (piece.unit == 'K') {
                showError(errorText[error_cannotUnpromoteKing]);
                return false;
            }
            if (piece.original) {
                showError(errorText[error_cannotUnpromoteOriginal]);
                return false;
            }
        }
        if (currentUncapturedUnit == "ep") {
            if (piece.unit != 'P') {
                showError(errorText[error_enPassantPawnOnly]);
                return false;
            }
            if ((currentRetract == 'w' && square.mRank != 5) || (currentRetract == 'b' && square.mRank != 2)) {
                showError(errorText[error_enPassantWrongRank]);
                return false;
            }
        } else if (currentUncapturedUnit == "P" && (square.mRank == 0 || square.mRank == 7)) {
            showError(errorText[error_cannotUncapturePawnOnTopBottom]);
            return false;
        }
    }
    copyPiece(pieceDragged, board[square.mFile][square.mRank]);
    squareDragged = square;
    square.style.opacity = 0.5;
}

dragEnterSquare = function (event) {
    if (verifyCageSelectionMode) {
        return false;
    }
    if (!(isEmpty(pieceDragged))) {
        const square = event.target;
        if (square.className != "cell") { // off the board
            return false;
        }
        if (square == squareDragged)
            return false;
        if (currentMode == MODE_PLAY) {
            if (isPseudoLegal(squareDragged, square, currentUncapturedUnit, getUnpromote()) != error_ok)
                return false;
        } else {
            if (pieceDragged.unit == 'P' && (square.mRank == 0 || square.mRank == 7)) {
                return false;
            }
        }
        square.style.opacity = 0.5;
        return false;
    }
    return false;
}

dragEnd = function (event) {
    if (verifyCageSelectionMode) {
        return false;
    }
    if (isEmpty(pieceDragged)) {
        return false;
    }
    squareDragged.style.opacity = 1.0;
    return false;
}

dragOverSquare = function () {
    return false;
}

dragLeaveSquare = function (event) {
    if (verifyCageSelectionMode) {
        return false;
    }
    if (!(isEmpty(pieceDragged))) {
        const square = event.target;
        if (square.className != "cell") { // off the board
            return false;
        }
        if (square != squareDragged) {
            square.style.opacity = 1.0;
        }
    }
    return false;
}

dragOntoSquare = function (event) {
    if (verifyCageSelectionMode) {
        return false;
    }
    if (isEmpty(pieceDragged)) {
        return false;
    }
    const square = event.target;
    if (square.className != "cell") { // off the board
        return false;
    }
    if (currentMode == MODE_EDIT) {
        squareDragged.style.opacity = 1.0;
        square.style.opacity = 1.0;

        if (squareDragged.mFile == square.mFile && squareDragged.mRank == square.mRank) {
            return false;
        }

        if (pieceDragged.unit == "P" && (square.mRank == 0 || square.mRank == 7)) {
            clearPiece(pieceDragged);
            return false;
        }

        // cannot replace a king
        if (board[square.mFile][square.mRank].unit == "K") {
            clearPiece(pieceDragged);
            return false;
        }

        clearSquare(squareDragged);
        setSquare(square, pieceDragged);
        clearPiece(pieceDragged);
        return false;
    }

    if (currentMode == MODE_PLAY) {
        squareDragged.style.opacity = 1.0;
        square.style.opacity = 1.0;

        if (!(isEmpty(board[square.mFile][square.mRank]))) {
            return false;
        }
        const pseudoLegalError = isPseudoLegal(squareDragged, square, currentUncapturedUnit, getUnpromote());
        if (pseudoLegalError != error_ok) {
            showError(errorText[pseudoLegalError]);
            return false;
        }
        resetLegalityCheckerWorker();
        disableSolutionButtons();
        doRetraction(squareDragged, square, currentUncapturedUnit, getUnpromote(), false, false);
        updateVisualBoard();
        finalizeRetraction();
        asyncLegalityCheck();
        return false;
    }
}

let legalityCheckerWorker = null;
let legalityCheckingActive = false;

function resetLegalityCheckerWorker() {
    if (legalityCheckerWorker && legalityCheckingActive) {
        legalityCheckerWorker.terminate();
        legalityCheckerWorker = null;
    }
    legalityCheckingActive = false;
    showError("");
}

function asyncLegalityCheck() {
    if (!legalityCheckerWorker) {
        legalityCheckerWorker = new Worker("legalityCheckerWorker.js");
        legalityCheckerWorker.onmessage = function (e) {
            legalityCheckingActive = false;
            resetLegalityCheckerWorker();
            const error = e.data[0];
            const tempUndoStack = new UndoStack();
            tempUndoStack.set(e.data[1]);
            positionData.update(tempUndoStack);
            getPawnCaptureCache().set(e.data[2]);
            const errorSquares = e.data[3];
            updateVisualBoard();
            if (error != error_ok) {
                document.getElementById("illegalPositionErrorMessage").innerHTML = errorText[error];
                showModal("illegalPositionModal");
                errorSquares.forEach(square => {
                    document.getElementById(square.mFile + ":" + square.mRank).style.opacity = 0.5;
                });
            } else {
                showError("");
            }
        }
    }

    legalityCheckingActive = true;
    legalityCheckerWorker.postMessage([board, positionData, currentRetract, getPawnCaptureCache(), knownCages,
        getPawnCaptureConfig()]);
    setTimeout(function () {
        if (legalityCheckingActive) showError("Checking legality...");
    }, 500);
}


function finalizeRetraction() {
    resetUncapturedPiece();
    resetUnpromote();
    showError("");
}

function updateRetractGui() {
    const color = currentRetract;
    if (currentMode == MODE_PLAY) {
        document.getElementById("retractColor").innerHTML =
            (color == "w" ? "White" : "Black");
    } else {
        document.getElementById("retractWhite").checked = (color == "w");
        document.getElementById("retractBlack").checked = (color == "b");
    }
}

function updatePieceCounts() {
    if (currentMode == MODE_EDIT) {
        let whiteUnitCount = 0;
        let blackUnitCount = 0;
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                if (board[file][rank].color == "w") {
                    whiteUnitCount++;
                } else if (board[file][rank].color == "b") {
                    blackUnitCount++;
                }
            }
        }

        document.getElementById("whitePieceCount").innerHTML = whiteUnitCount.toString();
        document.getElementById("blackPieceCount").innerHTML = blackUnitCount.toString();
    }
}

function updateEditModeData() {
    updatePieceCounts();
    document.getElementById("forsytheText").value = getForsythe(board);
    updateFlags();
}

function updateFlags() {
    const positionDataColor = (currentMode == MODE_EDIT || isPositionDataFinalized()) ? "#000000" : "#aaaaaa";
    document.getElementById("positionDataDisplay").style.color = positionDataColor;
    document.getElementById("positionDataDisplay").innerHTML = "";
    let displayData = "";
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            if (board[file][rank].unit == "P") continue;
            let flagsSet = "";
            //if (board[file][rank].original && board[file][rank].unit != "K") flagsSet += "O";
            if (board[file][rank].promoted) flagsSet += "P";
            if (board[file][rank].frozen) flagsSet += "F";
            if (flagsSet != "") {
                displayData += (board[file][rank].color + board[file][rank].unit + getCoordsAlgNotation(file, rank) + "(" + flagsSet + ") ");
            }
        }
    }
    if (displayData != "") {
        document.getElementById("positionDataDisplay").innerHTML = "Flags - " + displayData;
    }
}

function updateVisualBoard() {
    for (let file = 0; file < 8; file++) {
        for (let rank = 0; rank < 8; rank++) {
            const square = document.getElementById(file + ":" + rank);
            square.src = getImgFilename(file, rank, board[file][rank]);
            square.style.opacity = 1.0;
        }
    }

    if (currentMode == MODE_EDIT) {
        updateEditModeData();
    }

    if (currentMode == MODE_PLAY) {
        updateRetractGui();
        document.getElementById("forsytheText").value = getForsythe(board);

        const [whiteUnitCount, blackUnitCount] = getUnitCounts();
        const moveCount = getMoveCount();
        document.getElementById("whitePieceCount").innerHTML = whiteUnitCount.toString();
        document.getElementById("blackPieceCount").innerHTML = blackUnitCount.toString();
        document.getElementById("moveCount").innerHTML = moveCount.toString();

        document.getElementById("pawnCapturesWhite").innerHTML = positionData.pawnCaptureCounts["w"].toString();
        document.getElementById("pawnCapturesBlack").innerHTML = positionData.pawnCaptureCounts["b"].toString();
        document.getElementById("pawnCapturesTotal").innerHTML = positionData.pawnCaptureCounts["t"].toString();

        document.getElementById("totalCapturesWhite").innerHTML = positionData.totalCaptureCounts["w"].toString();
        document.getElementById("totalCapturesBlack").innerHTML = positionData.totalCaptureCounts["b"].toString();
        document.getElementById("totalCapturesTotal").innerHTML =
            (positionData.pawnCaptureCounts["t"] +
                (positionData.totalCaptureCounts["w"] - positionData.pawnCaptureCounts["w"]) +
                (positionData.totalCaptureCounts["b"] - positionData.pawnCaptureCounts["b"])).toString();

        DETAILED_UNIT_TYPES.forEach(detailedUnitType => {
            if (detailedUnitType != "K" && detailedUnitType != "P" && detailedUnitType.charAt(0) != "B") {
                document.getElementById("promoted_w" + detailedUnitType).innerHTML =
                    positionData.promotedCounts["w" + detailedUnitType];
                document.getElementById("promoted_b" + detailedUnitType).innerHTML =
                    positionData.promotedCounts["b" + detailedUnitType];
            }
        });
        document.getElementById("promoted_wB").innerHTML =
            positionData.promotedCounts["wBL"] + positionData.promotedCounts["wBD"];
        document.getElementById("promoted_bB").innerHTML =
            positionData.promotedCounts["bBL"] + positionData.promotedCounts["bBD"];

        const positionDataColor = isPositionDataFinalized() ? "#000000" : "#aaaaaa";
        const positionDataElements = document.getElementsByClassName("positionData");
        for (let i = 0; i < positionDataElements.length; i++) {
            positionDataElements[i].style.color = positionDataColor;
        }

        updateFlags();
    }
}
