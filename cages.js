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
          b         ok if b can be promoted.

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
                // exclude outside enemy bishop promotions
                const detailedUnitType = getDetailedUnitType(bishopFile, firstRank, "B");
                addExcludedPromotionFiles(opposite(color), detailedUnitType, [bishopFile, bishopFile]);

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
                    tempUndoStack.changePromotedFlag(bishopFile, firstRank, true);
                    const detailedUnitType = getDetailedUnitType(bishopFile, firstRank, "B");
                    addPossiblePromotionFiles(opposite(color), detailedUnitType, [bishopFile, bishopFile]);
                }
            }
        }
    }

    /*
        Check for white promoted bishops on b1/a2, g1/h2 or black promoted bishops on b8/a7, g8/h7, trapped
        behind pawns like this:

          P
        . P P
          b
     */
    for (let knightFile of [1, 6]) {
        for (let color of ["w", "b"]) {
            const firstRank = color == "w" ? 0 : 7;
            const secondRank = color == "w" ? 1 : 6;
            const thirdRank = color == "w" ? 2 : 5;
            const rookFile = knightFile == 1 ? 0 : 7;
            const bishopFile = knightFile == 1 ? 2 : 5;
            const oppositeColor = opposite(color);
            let bishopFound = false;
            if (board[knightFile][secondRank].color == color && board[knightFile][secondRank].unit == "P" &&
                board[knightFile][thirdRank].color == color && board[knightFile][thirdRank].unit == "P" &&
                board[bishopFile][secondRank].color == color && board[bishopFile][secondRank].unit == "P") {
                if (board[knightFile][firstRank].color == oppositeColor && board[knightFile][firstRank].unit == "B" &&
                    board[rookFile][secondRank].color == oppositeColor && board[rookFile][secondRank].unit == "B") {
                    return error_illegalBishopAndPawnInCorner;
                }
                if (board[knightFile][firstRank].color == oppositeColor && board[knightFile][firstRank].unit == "B") {
                    tempUndoStack.changePromotedFlag(knightFile, firstRank, true);
                    bishopFound = true;
                } else if (board[rookFile][secondRank].color == oppositeColor && board[rookFile][secondRank].unit == "B") {
                    tempUndoStack.changePromotedFlag(rookFile, secondRank, true);
                    bishopFound = true;
                }
                if (bishopFound) {
                    const detailedUnitType = getDetailedUnitType(knightFile, firstRank, "B");
                    addPossiblePromotionFiles(opposite(color), detailedUnitType, [knightFile, knightFile]);
                    addExcludedPromotionFiles(opposite(color), detailedUnitType, [knightFile, knightFile]);
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

    let friendlyRookCount = 0;
    let enemyPawnCount = 0;

    // exclude outside enemy rook promotions
    addExcludedPromotionFiles(oppositeColor, "R", [leftBoundary + 1, rightBoundary - 1]);

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
            addPossiblePromotionFiles(oppositeColor, "R", [leftBoundary + 1, rightBoundary - 1]);
        } else if (board[file][rank].color != color && board[file][rank].unit == "P") {
            enemyPawnCount++;
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

    const promotionCapturesForMissingFriendlyRooks = missingFriendlyRookCount - enemyPawnCount;
    if (promotionCapturesForMissingFriendlyRooks > 0) {
        assert(promotionCapturesForMissingFriendlyRooks <= 2, "There can be at most 2 missing friendly rooks");
        tempMissingFriendlyRookData.push([side, promotionCapturesForMissingFriendlyRooks, leftBoundary + 1, rightBoundary - 1]);
    }

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

function getStrongCageRegion(leftBoundary, rightBoundary, side) {
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

    // exclude outside enemy promotions
    DETAILED_UNIT_TYPES.forEach(detailedUnitType => {
        if (detailedUnitType != "K" && detailedUnitType != "P") {
            addExcludedPromotionFiles(opposite(color), detailedUnitType, [leftBoundary + 1, rightBoundary - 1]);
        }
    });

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
            switch (piece.unit) {
                case "K":
                    return side == 1 ? error_illegallyPlacedWhiteKing : error_illegallyPlacedBlackKing;
                case "Q":
                    return side == 1 ? error_illegallyPlacedWhiteQueen : error_illegallyPlacedBlackQueen;
                case "R":
                    return side == 1 ? error_illegallyPlacedWhiteRook : error_illegallyPlacedBlackRook;
                case "B":
                    return side == 1 ? error_illegallyPlacedWhiteBishop : error_illegallyPlacedBlackBishop;
                case "N":
                    break;
                case "P":
                    assert(false, "Unexpected pawn on end rank " + file + " " + firstRank);
                    break;
                default:
                    assert(false, "Unexpected unit " + piece.unit + " on " + file + " " + firstRank);
                    break;
            }
        }
    }

    // make sure there aren't too many friendly units
    for (const unit in friendlyUnitPositions) {
        if (friendlyUnitPositions.hasOwnProperty(unit) && friendlyUnitPositions[unit].length > cageInitialRankUnitCount[unit]) {
            switch (unit) {
                case "K":
                    return side == 0 ? error_illegallyPlacedWhiteKing : error_illegallyPlacedBlackKing;
                case "Q":
                    return side == 0 ? error_illegallyPlacedWhiteQueen : error_illegallyPlacedBlackQueen;
                case "R":
                    return side == 0 ? error_illegallyPlacedWhiteRook : error_illegallyPlacedBlackRook;
                case "B":
                    return side == 0 ? error_illegallyPlacedWhiteBishop : error_illegallyPlacedBlackBishop;
                default:
                    assert(false, "Unexpected unit " + unit + " in friendlyUnitCount");
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
        if (!(friendlyUnitPositions["Q"][0] < friendlyUnitPositions["K"][0])) {
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
          (a) A friendly rook is allowed only if it started in that region.
          (b) A missing friendly rook was captured in that region.
          (c) Any enemy rook is promoted, and the promotion square must be in the region.

          In this case, we must be careful not to double count captures in (b) with pawn captures. For that
          reason, we don't count any pawn captures here, but simply pass in the relevant data to the pawn
          capture module for further analysis. For each weak cage, we add an array of this form to
          tempMissingFriendlyRookData: [side, count, left, right], where

          side: the side that the cage belongs to
          count: missing friendly rooks in the cage, minus enemy pawns in the cage
          left: the leftmost interior file of the cage (leftBoundary + 1)
          right: the rightmost interior file of the cage (rightBoundary - 1)
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
            const rightBoundary = boundaries[side][i + 1];
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
                // if the region takes up the whole back rank, then the single region is 2 rook cages.
                if ((leftBoundary <= 0 && 0 < rightBoundary) && (leftBoundary < 7 && 7 <= rightBoundary)) {
                    rookCageCount++;
                }
            } else {
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
                    // if the region takes up the whole back rank, then the single region is 2 rook cages.
                    if ((leftBoundary <= 0 && 0 < rightBoundary) && (leftBoundary < 7 && 7 <= rightBoundary)) {
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

function getKingInaccessibleSquares(side) {
    const color = side == 0 ? "w" : "b";
    const enemyFirstRank = side == 0 ? 7 : 0;
    const enemySecondRank = side == 0 ? 6 : 1;
    const enemyThirdRank = side == 0 ? 5 : 2;

    const kingInaccessibleSquares = [];

    // Any enemy pawns on their second rank: the square itself and the two attacked squares are inaccessible by the king
    // If a file has enemy pawns on the second and third rank of the same file, then the third rank square
    // is also inaccessible by the king.
    for (let file = 0; file < 8; file++) {
        if (board[file][enemySecondRank].color == opposite(color) && board[file][enemySecondRank].unit == "P") {
            kingInaccessibleSquares.push([file, enemySecondRank]);
            [file - 1, file + 1].forEach(adjacentFile => {
                if (adjacentFile >= 0 && adjacentFile <= 7) {
                    kingInaccessibleSquares.push([adjacentFile, enemyThirdRank]);
                }
            });

            if (board[file][enemyThirdRank].color == opposite(color) && board[file][enemyThirdRank].unit == "P") {
                kingInaccessibleSquares.push([file, enemyThirdRank]);
            }
        }
    }

    // any frozen pieces on the first rank: the square itself and any unblockable attacked squares are inaccessible
    // (for line pieces, this means only adjacent squares since any further squares could be blocked)

    const pieceVectorsLookup = {
        'K': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]],
        'Q': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]],
        'R': [[0, 1], [0, -1], [1, 0], [-1, 0]],
        'B': [[1, 1], [-1, -1], [1, -1], [-1, 1]],
        'N': [[-1, -2], [1, 2], [1, -2], [-1, 2], [2, -1], [-2, 1], [2, 1], [-2, -1]]
    }

    for (let file = 0; file < 8; file++) {
        if (board[file][enemyFirstRank].color == opposite(color) && board[file][enemyFirstRank].frozen) {
            assert(board[file][enemyFirstRank].unit != 'P',
                'There was a pawn on file ' + file + ' rank ' + enemyFirstRank);
            kingInaccessibleSquares.push([file, enemyFirstRank]);
            const pieceVectors = pieceVectorsLookup[board[file][enemyFirstRank].unit];
            pieceVectors.forEach(pieceVector => {
                const newFile = file + pieceVector[0];
                const newRank = enemyFirstRank + pieceVector[1];
                if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
                    kingInaccessibleSquares.push([newFile, newRank]);
                }
            });
        }
    }

    return kingInaccessibleSquares;
}

function checkKingInEnemyPawnCage() {
    const kingVectors = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];

    for (let side = 0; side < 2; side++) {
        const color = side == 0 ? "w" : "b";
        const firstRank = side == 0 ? 0 : 7;
        const kingInaccessibleSquares = getKingInaccessibleSquares(side);
        if (kingInaccessibleSquares.length == 0) continue;

        // Check if there is a path from the king's current position to its original square that does
        // not pass through any inaccessible squares.
        const queue = [[positionData.kingPosition[color].mFile, positionData.kingPosition[color].mRank]];
        if (queue[0][0] == 4 && queue[0][1] == firstRank) continue; // king on original square
        let queuePosition = 0;
        let kingOriginalSquareReachable = false;
        while (queuePosition < queue.length && !kingOriginalSquareReachable) {
            const file = queue[queuePosition][0];
            const rank = queue[queuePosition][1];
            for (let i = 0; i < kingVectors.length; i++) {
                const kingVector = kingVectors[i];
                const newFile = file + kingVector[0];
                const newRank = rank + kingVector[1];
                if (newFile == 4 && newRank == firstRank) { // king got to its original square
                    kingOriginalSquareReachable = true;
                    break;
                } else {
                    if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7 &&
                        !kingInaccessibleSquares.some(square => square[0] == newFile && square[1] == newRank) &&
                        !queue.some(square => square[0] == newFile && square[1] == newRank)) {
                        queue.push([newFile, newRank]);
                    }
                }
            }
            queuePosition++;
        }

        if (!kingOriginalSquareReachable) {
            return side == 0 ? error_illegallyPlacedWhiteKing : error_illegallyPlacedBlackKing;
        }
    }

    return error_ok;
}
