let navigatedSolutionIndex = 0;
let navigatedMoveIndex = 0;
const solutionIdPrefix = 'solution';
const copySolutionIdPrefix = 'copy';

function navigateToOriginalSolvePosition() {
    if (navigatedMoveIndex >= 0) {
        for (let i = 0; i < navigatedMoveIndex; i++) {
            assert(undo(), 'Could not undo move in navigateToMove, navigatedMoveIndex = ' + navigatedMoveIndex);
        }
    } else {
        for (let i = 0; i < -navigatedMoveIndex; i++) {
            assert(redo(), 'Could not redo move in navigateToMove, navigatedMoveIndex = ' + navigatedMoveIndex);
        }
    }
    navigatedMoveIndex = 0;
}

function navigateToSolutionPosition(solutionIndex, moveIndex) {
    navigateToOriginalSolvePosition();
    for (let i = 0; i < moveIndex; i++) {
        const move = solutions[solutionIndex][i];
        // we only check for pseudo-legality here because a new cage might change a legal move to an illegal move
        assert(doRetraction(move.from, move.to, move.uncapturedUnit, move.unpromote, true, false) == error_ok,
            "Non-pseudolegal move " + moveToString(move) + " found in solution");
    }
    navigatedSolutionIndex = solutionIndex;
    navigatedMoveIndex = moveIndex;
}

function navigateToMove(event) {
    const clickedButtonId = event.target.id;
    const idSplit = clickedButtonId.split("_");
    const solutionIndex = parseInt(idSplit[1]);
    const moveIndex = parseInt(idSplit[2]);
    navigateToSolutionPosition(solutionIndex, moveIndex);
    updateVisualBoard();
    finalizeRetraction();
}

function restoreOriginalPosition(originalNavigatedSolutionIndex, originalNavigatedMoveIndex) {
    if (originalNavigatedMoveIndex >= 0) {
        navigateToSolutionPosition(originalNavigatedSolutionIndex, originalNavigatedMoveIndex);
    } else {
        navigateToOriginalSolvePosition();
        navigatedSolutionIndex = originalNavigatedSolutionIndex;
        navigatedMoveIndex = originalNavigatedMoveIndex;
        for (let i = 0; i < -navigatedMoveIndex; i++) {
            assert(undo(), 'Could not undo move in exportSolutions, navigatedMoveIndex = ' + navigatedMoveIndex);
        }
    }
}

function copySolution(event) {
    const clickedButtonId = event.target.id;
    const idSplit = clickedButtonId.split("_");
    const solutionIndex = parseInt(idSplit[1]);
    const solution = solutions[solutionIndex];

    let result = "";
    solution.forEach(move => {
        result += moveToString(move) + " ";
    });
    result = result.trim();

    const originalNavigatedSolutionIndex = navigatedSolutionIndex;
    const originalNavigatedMoveIndex = navigatedMoveIndex;
    navigateToSolutionPosition(solutionIndex, solution.length);
    const pgn = generatePGN(solution, board);
    restoreOriginalPosition(originalNavigatedSolutionIndex, originalNavigatedMoveIndex);

    populateAndShowCopyModal(result, pgn);
}

function disableSolutionButtons() {
    const solutionButtons = document.getElementsByName("solution");
    solutionButtons.forEach(solutionButton => {
        solutionButton.disabled = true;
    });
    document.getElementById("exportSolutionsSpan").style.visibility = "hidden";
    navigatedMoveIndex = null;
}

function createSolutionButton(solutionCount, moveCount, value) {
    const startInput = document.createElement("input");
    startInput.name = "solution";
    startInput.id = solutionIdPrefix + "_" + solutionCount + "_" + moveCount;
    startInput.type = "button";
    startInput.value = value;
    startInput.onclick = navigateToMove;
    return startInput;
}

function showSolutions(maybeTruncated) {
    navigatedMoveIndex = null;
    const solutionDisplay = document.getElementById("solutionDisplay");
    document.getElementById("exportSolutionsSpan").style.visibility = "visible";
    solutionDisplay.innerHTML = "";
    if (maybeTruncated) {
        solutionDisplay.innerHTML = "<b>Maximum solution limit reached; not all solutions may have been found.</b><br>";
    }
    if (solutions != null && solutions.length > 0) {
        const table = document.createElement("table");
        let solutionCount = 0;
        solutions.forEach(solution => {
            const tr = document.createElement("tr");
            let moveCount = 0;
            const startTd = document.createElement("td");
            const startInput = createSolutionButton(solutionCount, moveCount, "Start");
            startTd.appendChild(startInput);
            tr.appendChild(startTd);
            moveCount++;
            solution.forEach(move => {
                const moveString = moveToString(move);
                const moveTd = document.createElement("td");
                const moveInput = createSolutionButton(solutionCount, moveCount, moveString);
                moveTd.appendChild(moveInput);
                tr.appendChild(moveTd);
                moveCount++;
            });
            const copyTd = document.createElement("td");
            const copyInput = document.createElement("input");
            copyInput.name = "copy";
            copyInput.id = copySolutionIdPrefix + "_" + solutionCount;
            copyInput.type = "button";
            copyInput.value = "Copy";
            copyInput.onclick = copySolution;
            copyTd.appendChild(copyInput);
            tr.appendChild(copyTd);
            table.appendChild(tr);
            solutionCount++;
        });
        solutionDisplay.appendChild(table);
        navigatedMoveIndex = 0;
    }
}

function exportSolutions() {
    if (solutions == null || solutions.length == 0) {
        return null;
    }
    const originalNavigatedSolutionIndex = navigatedSolutionIndex;
    const originalNavigatedMoveIndex = navigatedMoveIndex;
    const exportedSolutions = [];
    for (let i = 0; i < solutions.length; i++) {
        const solution = solutions[i];
        navigateToSolutionPosition(i, solution.length);
        exportedSolutions.push(getForsythe(board));
    }

    restoreOriginalPosition(originalNavigatedSolutionIndex, originalNavigatedMoveIndex);

    return exportedSolutions;
}

function exportSolutionsPGN() {
    // Export all solutions in one PGN file
    if (solutions == null || solutions.length == 0) {
        return null;
    }

    const originalNavigatedSolutionIndex = navigatedSolutionIndex;
    const originalNavigatedMoveIndex = navigatedMoveIndex;

    const pgnArray = [];
    for (let i = 0; i < solutions.length; i++) {
        const solution = solutions[i];
        navigateToSolutionPosition(i, solution.length);  // now board has the ending position
        const pgn = generatePGN(solution, board);

        if (pgn != null) {
            pgnArray.push(pgn);
        }
    }

    restoreOriginalPosition(originalNavigatedSolutionIndex, originalNavigatedMoveIndex);

    return pgnArray;
}