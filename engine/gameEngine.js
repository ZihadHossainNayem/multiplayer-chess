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
// PIECE MOVEMENT
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

export const validatePieceMove = (board, from, to, pieceType) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);

    const piece = board[fromRow][fromCol];
    if (piece === '   ' || piece.substring(1) !== pieceType) return null; // invalid piece

    const color = piece[0];
    return {
        fromRow,
        fromCol,
        toRow,
        toCol,
        piece,
        color,
        targetBlock: board[toRow][toCol],
    };
};

export const canCaptureOrMove = (targetBlock, color) => {
    if (targetBlock === '   ') return true; // can move to empty square
    if (targetBlock[0] !== color) return true; /// can capture opponent's piece

    return false; // can't capture own piece
};

export const isPathClear = (board, fromRow, fromCol, toRow, toCol) => {
    // move direction -1,0,1
    const stepRow = Math.sign(toRow - fromRow);
    const stepCol = Math.sign(toCol - fromCol);

    // checking from first block after the starting position
    let row = fromRow + stepRow;
    let col = fromCol + stepCol;

    // check each block along the path until target destination
    while (row !== toRow || col !== toCol) {
        if (board[row][col] !== '   ') return false; // blocked if path is not empty

        row += stepRow;
        col += stepCol;
    }

    return true;
};

// ============================================================================
// PIECE-SPECIFIC MOVE VALIDATION
// ============================================================================

export const isPawnMoveLegal = (board, from, to) => {
    const pawnMoveData = validatePieceMove(board, from, to, 'PN');
    if (!pawnMoveData) return false;

    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = pawnMoveData;

    const direction = color === 'w' ? -1 : 1; // white move up -1, black moves down +1
    const startRow = color === 'w' ? 6 : 1;

    const diffRow = toRow - fromRow;
    const diffCol = toCol - fromCol;

    // pawn normal move: 1 step forward
    if (diffCol === 0 && diffRow === direction && targetBlock === '   ') return true;

    // first pawn move: 2 steps forward
    if (
        diffCol === 0 &&
        diffRow === 2 * direction &&
        fromRow === startRow &&
        board[fromRow + direction][fromCol] === '   ' &&
        targetBlock === '   '
    )
        return true;

    // capture move: diagonal 1 step, opponent piece present
    if (Math.abs(diffCol) === 1 && diffRow === direction && targetBlock !== '   ' && targetBlock[0] !== color)
        return true;

    return false;
};

export const isRookMoveLegal = (board, from, to) => {
    const rookMoveData = validatePieceMove(board, from, to, 'RK');
    if (!rookMoveData) return false;

    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = rookMoveData;

    // rook have to move in straight line
    const isVerticalMove = fromCol === toCol && fromRow !== toRow;
    const isHorizontalMove = fromRow === toRow && fromCol !== toCol;

    if (!isVerticalMove && !isHorizontalMove) return false;

    if (!isPathClear(board, fromRow, fromCol, toRow, toCol)) return false;

    return canCaptureOrMove(targetBlock, color);
};

export const isBishopMoveLegal = (board, from, to) => {
    const bishopMoveData = validatePieceMove(board, from, to, 'BS');
    if (!bishopMoveData) return false;

    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = bishopMoveData;

    // using math.abs because bishop can move in any diagonal direction
    const diffRow = Math.abs(toRow - fromRow);
    const diffCol = Math.abs(toCol - fromCol);

    const isDiagonalMove = diffRow === diffCol && diffRow > 0;

    if (!isDiagonalMove) return false;

    if (!isPathClear(board, fromRow, fromCol, toRow, toCol)) return false;

    return canCaptureOrMove(targetBlock, color);
};

export const isQueenMoveLegal = (board, from, to) => {
    const queenMoveData = validatePieceMove(board, from, to, 'QN');
    if (!queenMoveData) return false;

    const { fromRow, fromCol, toRow, toCol, color, targetBlock } = queenMoveData;

    // rook style move
    const isVerticalMove = fromCol === toCol && fromRow !== toRow;
    const isHorizontalMove = fromRow === toRow && fromCol !== toCol;
    const isRookMove = isVerticalMove || isHorizontalMove;

    // bishop style move
    const diffRow = Math.abs(toRow - fromRow);
    const diffCol = Math.abs(toCol - fromCol);
    const isBishopMove = diffRow === diffCol && diffRow > 0;

    if (!isRookMove && !isBishopMove) return false;

    if (!isPathClear(board, fromRow, fromCol, toRow, toCol)) return false;

    return canCaptureOrMove(targetBlock, color);
};
