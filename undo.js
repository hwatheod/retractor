/*
change piece
 - location
 - old piece, new piece
change original flag
 - location
 - old value, new value
change promoted flag
 - location
 - old value, new value
change frozen flag
 - location
 - old value, new value
change capture count
 - color: w,b,both
 - old value, new value
set ep flag
 - new value
clear ep flag
 - old value
*/

CHANGE_PIECE = 1;
CHANGE_ORIGINAL_FLAG = 2;
CHANGE_PROMOTED_FLAG = 3;
CHANGE_FROZEN_FLAG = 4;
SET_EP_SQUARE = 5;
CLEAR_EP_SQUARE = 6;
CHANGE_PAWN_CAPTURE_COUNT = 7;
CHANGE_TOTAL_CAPTURE_COUNT = 8;
CHANGE_PROMOTED_COUNT = 9;
RECORD_MOVE = 10;

/* simple clone function, taken from http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone */
function clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;

    const temp = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = clone(obj[key]);
        }
    }

    return temp;
}

/* http://aymanh.com/9-javascript-tips-you-may-not-know#assertion */
class AssertException {
    constructor(message) {
        this.message = message;
    }

    toString() {
        return 'AssertException: ' + this.message;
    }
}

function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}

class UndoItem {
    constructor() {
        this.operation = 0; // nothing
        this.file = -1;
        this.rank = -1;
        this.oldValue = null;
        this.newValue = null;
        this.startMove = false;
        this.endMove = false;
        this.finalizedMove = false;
    }
}

class UndoStack {
    constructor() {
        this.undoStack = [];
        this.undoPointer = -1;
        this.maxUndoPointer = -1;
        this.moveCount = 0;

        // maxUndoPointer is the index of the latest action recorded in the undo stack.
        // undoPointer is the index of the latest action shown (i.e. not undone) in the undo stack.
    }

    set(otherUndoStack) {
        this.undoStack = otherUndoStack.undoStack;
        this.undoPointer = otherUndoStack.undoPointer;
        this.maxUndoPointer = otherUndoStack.maxUndoPointer;
        this.moveCount = otherUndoStack.moveCount;
    }

    reset() {
        // Resets the pointers *without* actually undoing any actions!
        this.undoPointer = -1;
        this.maxUndoPointer = -1;
        this.undoStack.splice(0, this.undoStack.length); // delete all
        this.moveCount = 0;
    }

    replay() {
        // replay all items on top of the current positionData
        this.undoPointer = -1;
        this.moveCount = 0;
        this.redoAll();
    }

    atBottomOfStack() { // no more moves to undo
        return this.undoPointer == -1;
    }

    boardSetPieceFromPiece(file, rank, piece) {
        this.boardSetPiece(file, rank, piece.color, piece.unit, piece.original, piece.promoted, piece.frozen);
    }

    boardClearPiece(file, rank) {
        this.boardSetPieceFromPiece(file, rank, new Piece("", ""));
    }

    boardSetPiece(file, rank, color, unit, original, promoted, frozen) {
        // Changes the position of board position (file,rank) to the indicated characteristics, pushing the change onto this stack.
        assert(file >= 0 && file <= 7 && rank >= 0 && rank <= 7, 'Tried to call boardSetPiece on file=' + file + ' rank=' + rank);

        const newPiece = new Piece(color, unit);
        newPiece.original = original;
        newPiece.promoted = promoted;
        newPiece.frozen = frozen;
        setDefaultPieceParameters(file, rank, newPiece);
        this.pushUndoStack(CHANGE_PIECE, file, rank, board[file][rank], newPiece, false, false);
        placePieceAt(file, rank, newPiece);
    }

    setEpSquare(fromCol) {
        this.pushUndoStack(SET_EP_SQUARE, fromCol);
        positionData.ep = fromCol;
    }

    clearEpSquare(origFromCol) {
        this.pushUndoStack(CLEAR_EP_SQUARE, origFromCol);
        positionData.ep = -1;
    }

    changeFrozenFlag(file, rank, newValue) {
        const oldValue = board[file][rank].frozen;
        this.pushUndoStack(CHANGE_FROZEN_FLAG, file, rank, oldValue, newValue);
        setFrozenFlag(file, rank, newValue);
    }

    changePromotedFlag(file, rank, newValue) {
        const oldValue = board[file][rank].promoted;
        this.pushUndoStack(CHANGE_PROMOTED_FLAG, file, rank, oldValue, newValue);
        board[file][rank].promoted = newValue;
        setPromotedFlag(file, rank, newValue);
    }

    changeOriginalFlag(file, rank, newValue) {
        const oldValue = board[file][rank].original;
        this.pushUndoStack(CHANGE_ORIGINAL_FLAG, file, rank, oldValue, newValue);
        setOriginalFlag(file, rank, newValue);
    }

    changePawnCaptureCount(color, newValue) {
        const oldValue = [color, positionData.pawnCaptureCounts[color]];
        this.pushUndoStack(CHANGE_PAWN_CAPTURE_COUNT, null, null, oldValue, [color, newValue]);
        positionData.pawnCaptureCounts[color] = newValue;
    }

    changeTotalCaptureCount(color, newValue) {
        const oldValue = [color, positionData.totalCaptureCounts[color]];
        this.pushUndoStack(CHANGE_TOTAL_CAPTURE_COUNT, null, null, oldValue, [color, newValue]);
        positionData.totalCaptureCounts[color] = newValue;
    }

    changePromotedCount(color, detailedUnitType, newValue) {
        const oldValue = [color, detailedUnitType, positionData.promotedCounts[color + detailedUnitType]];
        this.pushUndoStack(CHANGE_PROMOTED_COUNT, null, null, oldValue, [color, detailedUnitType, newValue]);
        positionData.promotedCounts[color + detailedUnitType] = newValue;
    }

    recordMove(from, to, uncapturedUnit, unpromote) {
        this.pushUndoStack(RECORD_MOVE, null, null, null,
            new Move(from, to, uncapturedUnit, unpromote, board[from.mFile][from.mRank].unit, isInCheck(opposite(currentRetract))));
    }

    undoLastMove() {
        if (this.undoPointer == -1)
            return false;
        this.undoOneItem(this.undoStack[this.undoPointer]);
        while (!(this.undoStack[this.undoPointer].startMove)) {
            this.undoPointer--;
            this.undoOneItem(this.undoStack[this.undoPointer]);
        }
        this.undoPointer--;
        return true;
    }

    redoLastMove() {
        if (this.undoPointer == this.maxUndoPointer)
            return false;
        this.undoPointer++;
        this.redoOneItem(this.undoStack[this.undoPointer]);
        while (this.undoPointer < this.maxUndoPointer && !(this.undoStack[this.undoPointer].endMove)) {
            this.undoPointer++;
            this.redoOneItem(this.undoStack[this.undoPointer]);
        }
        return true;
    }

    undoAll() {
        if (this.undoPointer == -1) return false;
        this.undoOneItem(this.undoStack[this.undoPointer]);
        while (this.undoPointer != 0) {
            this.undoPointer--;
            this.undoOneItem(this.undoStack[this.undoPointer]);
        }
        return true;
    }

    redoAll() {
        if (this.undoPointer == this.maxUndoPointer)
            return false;
        this.undoPointer++;
        this.redoOneItem(this.undoStack[this.undoPointer]);
        while (this.undoPointer != this.maxUndoPointer) {
            this.undoPointer++;
            this.redoOneItem(this.undoStack[this.undoPointer]);
        }
        return true;
    }

    getMoveRecordToHere() {
        const moveRecord = [];
        for (let i = 0; i <= this.undoPointer; i++) {
            if (this.undoStack[i].operation == RECORD_MOVE) {
                moveRecord.push(this.undoStack[i].newValue);
            }
        }
        return moveRecord;
    }

    pushUndoStack(operation, file, rank, oldValue, newValue, startMove, endMove, finalizedMove) {
        if (oldValue != null && newValue != null) {
            if (typeof (oldValue) == "object") {
                let equal = true;
                for (const key in oldValue) {
                    if (oldValue.hasOwnProperty(key)) {
                        if (oldValue[key] != newValue[key]) {
                            equal = false;
                            break;
                        }
                    }
                }
                if (equal) return;
            } else {
                if (oldValue == newValue) return;
            }
        }

        this.undoPointer++;

        this.undoStack[this.undoPointer] = new UndoItem();
        this.undoStack[this.undoPointer].operation = operation;
        this.undoStack[this.undoPointer].file = file;
        this.undoStack[this.undoPointer].rank = rank;
        this.undoStack[this.undoPointer].oldValue = clone(oldValue);
        this.undoStack[this.undoPointer].newValue = clone(newValue);
        this.undoStack[this.undoPointer].startMove = startMove == null ? false : startMove;
        this.undoStack[this.undoPointer].endMove = endMove == null ? false : endMove;
        this.undoStack[this.undoPointer].finalizedMove = finalizedMove == null ? false : finalizedMove;
        if (operation == RECORD_MOVE) {
            this.moveCount++;
        }

        this.maxUndoPointer = this.undoPointer;
    }

    putMarkersAtEnds() {
        if (this.maxUndoPointer >= 0) {
            this.undoStack[0].startMove = true;
            this.undoStack[this.maxUndoPointer].endMove = true;
        }
    }

    finalizeLastItem() {
        if (this.maxUndoPointer >= 0) {
            this.undoStack[this.maxUndoPointer].endMove = true;
            this.undoStack[this.maxUndoPointer].finalizedMove = true;
        }
    }

    deleteRemainingItems() {
        this.maxUndoPointer = this.undoPointer;
    }

    undoOneItem(undoItem) {
        const file = undoItem.file;
        const rank = undoItem.rank;
        switch (undoItem.operation) {
            case CHANGE_PIECE:
                placePieceAt(file, rank, undoItem.oldValue);
                break;
            case CHANGE_ORIGINAL_FLAG:
                setOriginalFlag(file, rank, undoItem.oldValue);
                break;
            case CHANGE_PROMOTED_FLAG:
                setPromotedFlag(file, rank, undoItem.oldValue);
                break;
            case CHANGE_FROZEN_FLAG:
                setFrozenFlag(file, rank, undoItem.oldValue);
                break;
            case SET_EP_SQUARE:
                positionData.ep = -1;
                break;
            case CLEAR_EP_SQUARE:
                positionData.ep = file;
                break;
            case CHANGE_PAWN_CAPTURE_COUNT:
                positionData.pawnCaptureCounts[undoItem.oldValue[0]] = undoItem.oldValue[1];
                break;
            case CHANGE_TOTAL_CAPTURE_COUNT:
                positionData.totalCaptureCounts[undoItem.oldValue[0]] = undoItem.oldValue[1];
                break;
            case CHANGE_PROMOTED_COUNT:
                positionData.promotedCounts[undoItem.oldValue[0] + undoItem.oldValue[1]] = undoItem.oldValue[2];
                break;
            case RECORD_MOVE:
                this.moveCount--;
        }
    }

    redoOneItem(undoItem) {
        const file = undoItem.file;
        const rank = undoItem.rank;
        switch (undoItem.operation) {
            case CHANGE_PIECE:
                placePieceAt(file, rank, undoItem.newValue);
                break;
            case CHANGE_ORIGINAL_FLAG:
                setOriginalFlag(file, rank, undoItem.newValue);
                break;
            case CHANGE_PROMOTED_FLAG:
                setPromotedFlag(file, rank, undoItem.newValue);
                break;
            case CHANGE_FROZEN_FLAG:
                setFrozenFlag(file, rank, undoItem.newValue);
                break;
            case SET_EP_SQUARE:
                positionData.ep = file;
                break;
            case CLEAR_EP_SQUARE:
                positionData.ep = -1;
                break;
            case CHANGE_PAWN_CAPTURE_COUNT:
                positionData.pawnCaptureCounts[undoItem.newValue[0]] = undoItem.newValue[1];
                break;
            case CHANGE_TOTAL_CAPTURE_COUNT:
                positionData.totalCaptureCounts[undoItem.newValue[0]] = undoItem.newValue[1];
                break;
            case CHANGE_PROMOTED_COUNT:
                positionData.promotedCounts[undoItem.newValue[0] + undoItem.newValue[1]] = undoItem.newValue[2];
                break;
            case RECORD_MOVE:
                this.moveCount++;
        }
    }

    copyStack(src) {
        // Copy from stack src to this stack.
        for (let i = 0; i <= src.maxUndoPointer; i++) {
            this.pushUndoStack(src.undoStack[i].operation, src.undoStack[i].file, src.undoStack[i].rank, src.undoStack[i].oldValue, src.undoStack[i].newValue,
                src.undoStack[i].startMove, src.undoStack[i].endMove, src.undoStack[i].finalizedMove);
        }
    }

    isCurrentItemFinalized() {
        return this.undoPointer >= 0 && this.undoStack[this.undoPointer].finalizedMove;
    }

    removeEndMoveFlagOnLastItem() {
        // needed when the async legality checker needs to append the new capture/promotion counts
        if (this.maxUndoPointer >= 0) {
            this.undoStack[this.maxUndoPointer].endMove = false;
        }
    }

    removeStartMoveFlagOnFirstItem() {
        // needed when the async legality checker needs to append the new capture/promotion counts
        if (this.maxUndoPointer >= 0) {
            this.undoStack[0].startMove = false;
        }
    }
}














