// ============================================================================
// BOARD INITIALIZATION & DISPLAY
// ============================================================================

export const initBoardPos = () => {
    return [
        ['bRK', 'bKN', 'bBS', 'bQN', 'bKG', 'bBS', 'bKN', 'bRK'], // black piece
        ['bPN', 'bPN', 'bPN', 'bPN', 'bPN', 'bPN', 'bPN', 'bPN'], // black piece
        ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
        ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
        ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
        ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
        ['wPN', 'wPN', 'wPN', 'wPN', 'wPN', 'wPN', 'wPN', 'wPN'], // white piece
        ['wRK', 'wKN', 'wBS', 'wQN', 'wKG', 'wBS', 'wKN', 'wRK'], // white piece
    ];
};

export const showBoard = (board) => {
    console.log('\n    current board:');

    console.log('       0     1     2     3     4     5     6     7');
    console.log('    +-----+-----+-----+-----+-----+-----+-----+-----+');

    for (let i = 0; i < board.length; i++) {
        const rowNumber = 8 - i; // chess notation (8-1)
        const rowIndex = i; // array index (0-7)

        console.log(`  ${rowNumber} | ${board[i].join(' | ')} | ${rowIndex}`);

        if (i < board.length - 1) {
            console.log('    +-----+-----+-----+-----+-----+-----+-----+-----+');
        }
    }
    console.log('    +-----+-----+-----+-----+-----+-----+-----+-----+');
    console.log('      a      b     c     d     e     f     g     h  ');
};

// ============================================================================
// COORDINATE CONVERSION
// ============================================================================

export const algebraicToIndex = (position) => {
    if (!position || position.length !== 2) throw new Error('invalid position format');

    const colChar = position[0];
    const rowChar = position[1];

    if (colChar < 'a' || colChar > 'h' || rowChar < '1' || rowChar > '8') throw new Error('position out of bound');

    const col = colChar.charCodeAt(0) - 'a'.charCodeAt(0); // 'a'-'h' to 0-7
    const row = 8 - parseInt(rowChar); // '1'-'8' to 7-0

    return [row, col];
};

export const indexToAlgebraic = (row, col) => {
    if (row < 0 || row > 7 || col < 0 || col > 7) throw new Error('index out of bound');

    const colChar = String.fromCharCode('a'.charCodeAt(0) + col); // 0-7 to 'a'-'h'
    const rowChar = 8 - row; // 7-0 to '1'-'8'

    return colChar + rowChar;
};

// ============================================================================
// BASIC PIECE MOVEMENT
// ============================================================================

export const movePiece = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);

    const piece = board[fromRow][fromCol]; // piece at the starting position
    if (piece === '   ') throw new Error('no piece at starting position');

    board[toRow][toCol] = piece; // piece to new position

    board[fromRow][fromCol] = '   '; // clear its previous position

    return board;
};

// ============================================================================
// MOVE VALIDATIONS
// ============================================================================

const validatePieceMove = (board, from, to, pieceType) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);

    const piece = board[fromRow][fromCol];
    if (piece === '   ' || piece.substring(1) !== pieceType) return null; // invalid piece

    const color = piece[0];
    const targetBlock = board[toRow][toCol];

    return {
        fromRow,
        fromCol,
        toRow,
        toCol,
        piece,
        color,
        targetBlock,
    };
};

const canCaptureOrMove = (targetBlock, color) => {
    if (targetBlock === '   ') return true; // can move to empty square
    if (targetBlock[0] !== color) return true; /// can capture opponent's piece

    return false; // can't capture own piece
};

const isPathClear = (board, fromRow, fromCol, toRow, toCol) => {
    // move direction -1,0,1
    const stepRow = Math.sign(toRow - fromRow);
    const stepCol = Math.sign(toCol - fromCol);

    // checking from first block after the starting position
    let currentRow = fromRow + stepRow;
    let currentCol = fromCol + stepCol;

    // check each block along the path until target destination
    while (currentRow !== toRow || currentCol !== toCol) {
        if (board[currentRow][currentCol] !== '   ') return false; // blocked if path is not empty

        currentRow += stepRow;
        currentCol += stepCol;
    }

    return true;
};

// ============================================================================
// MOVEMENT PATTERN
// ============================================================================

const isStraightLineMove = (fromRow, fromCol, toRow, toCol) => {
    const isVertical = fromCol === toCol && fromRow !== toRow; // same col, diff row
    const isHorizontal = fromRow === toRow && fromCol !== toCol; // same row, diff col
    return isVertical || isHorizontal;
};

const isDiagonalLineMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(toRow - fromRow); // vertical distance
    const colDiff = Math.abs(toCol - fromCol); // horizontal distance
    return rowDiff === colDiff && rowDiff > 0; // needs equal distances for diagonal move
};

// ============================================================================
// PIECE-SPECIFIC MOVE VALIDATION
// ============================================================================

export const isPawnMoveLegal = (board, from, to) => {
    const pawnMoveData = validatePieceMove(board, from, to, 'PN');
    if (!pawnMoveData) return false;
    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = pawnMoveData;

    const direction = color === 'w' ? -1 : 1; // white move up -1, black moves down +1
    const startingRow = color === 'w' ? 6 : 1;

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // pawn normal move: 1 step forward
    if (colDiff === 0 && rowDiff === direction && targetBlock === '   ') return true;

    // first pawn move: 2 steps forward
    if (
        colDiff === 0 &&
        rowDiff === 2 * direction &&
        fromRow === startingRow &&
        board[fromRow + direction][fromCol] === '   ' &&
        targetBlock === '   '
    )
        return true;

    // capture move: diagonal 1 step, opponent piece present
    if (Math.abs(colDiff) === 1 && rowDiff === direction && targetBlock !== '   ' && targetBlock[0] !== color)
        return true;

    return false;
};

export const isRookMoveLegal = (board, from, to) => {
    const rookMoveData = validatePieceMove(board, from, to, 'RK');
    if (!rookMoveData) return false;
    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = rookMoveData;

    if (!isStraightLineMove(fromRow, fromCol, toRow, toCol)) return false;
    if (!isPathClear(board, fromRow, fromCol, toRow, toCol)) return false;

    return canCaptureOrMove(targetBlock, color);
};

export const isBishopMoveLegal = (board, from, to) => {
    const bishopMoveData = validatePieceMove(board, from, to, 'BS');
    if (!bishopMoveData) return false;
    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = bishopMoveData;

    if (!isDiagonalLineMove(fromRow, fromCol, toRow, toCol)) return false;
    if (!isPathClear(board, fromRow, fromCol, toRow, toCol)) return false;

    return canCaptureOrMove(targetBlock, color);
};

export const isQueenMoveLegal = (board, from, to) => {
    const queenMoveData = validatePieceMove(board, from, to, 'QN');
    if (!queenMoveData) return false;
    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = queenMoveData;

    const canMoveStraight = isStraightLineMove(fromRow, fromCol, toRow, toCol);
    const canMoveDiagonal = isDiagonalLineMove(fromRow, fromCol, toRow, toCol);

    if (!canMoveStraight && !canMoveDiagonal) return false;
    if (!isPathClear(board, fromRow, fromCol, toRow, toCol)) return false;

    return canCaptureOrMove(targetBlock, color);
};

export const isKnightMoveLegal = (board, from, to) => {
    const knightMoveData = validatePieceMove(board, from, to, 'KN');
    if (!knightMoveData) return false;
    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = knightMoveData;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    const isLShapeMove = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2); // l shape knight move
    if (!isLShapeMove) return false;

    return canCaptureOrMove(targetBlock, color);
};

export const isKingMoveLegal = (board, from, to) => {
    const kingMoveData = validatePieceMove(board, from, to, 'KG');
    if (!kingMoveData) return false;
    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = kingMoveData;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    const isOneBlockMove = rowDiff <= 1 && colDiff <= 1 && (rowDiff > 0 || colDiff > 0); // move one block any direction
    if (!isOneBlockMove) return false;

    return canCaptureOrMove(targetBlock, color);
};

// ============================================================================
// GLOBAL MOVE : SINGLE VALIDATION ENTRY POINT
// ============================================================================

export const isMoveLegal = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const piece = board[fromRow][fromCol];

    if (piece === '   ') return false;

    const pieceType = piece.substring(1); // get piece info PN RK QN

    switch (pieceType) {
        case 'PN':
            return isPawnMoveLegal(board, from, to);
        case 'RK':
            return isRookMoveLegal(board, from, to);
        case 'BS':
            return isBishopMoveLegal(board, from, to);
        case 'QN':
            return isQueenMoveLegal(board, from, to);
        case 'KN':
            return isKnightMoveLegal(board, from, to);
        case 'KG':
            return isKingMoveLegal(board, from, to);
        default:
            return false;
    }
};

export const makeMove = (board, from, to) => {
    if (!isMoveLegal(board, from, to)) throw new Error(`illegal move: ${from} to ${to}`);
    return movePiece(board, from, to);
};
