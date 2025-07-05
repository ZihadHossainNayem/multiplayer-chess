export const initBoardPosition = () => {
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
    console.log('\ncurrent board:');
    for (let row of board) {
        console.log(row.join(' | '));
    }
};

export const algebraicToIndex = (position) => {
    if (!position || position.length !== 2) {
        throw new Error('invalid position format');
    }

    const colChar = position[0];
    const rowChar = position[1];

    if (colChar < 'a' || colChar > 'h' || rowChar < '1' || rowChar > '8') {
        throw new Error('position out of bound');
    }

    const col = colChar.charCodeAt(0) - 'a'.charCodeAt(0); // 'a'-'h' to 0-7
    const row = 8 - parseInt(rowChar); // '1'-'8' to 7-0

    return [row, col];
};

export const indexToAlgebraic = (row, col) => {
    if (row < 0 || row > 7 || col < 0 || col > 7) {
        throw new Error('index out of bound');
    }

    const colChar = String.fromCharCode('a'.charCodeAt(0) + col); // 0-7 to 'a'-'h'
    const rowChar = 8 - row; // 7-0 to '1'-'8'

    return colChar + rowChar;
};

export const movePiece = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);

    // piece at the starting position
    const piece = board[fromRow][fromCol];
    if (piece === '   ') {
        throw new Error('no piece at starting position');
    }

    // piece to new position
    board[toRow][toCol] = piece;

    // clear its previous position
    board[fromRow][fromCol] = '   ';

    return board;
};

export const isPawnMoveLegal = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);

    const piece = board[fromRow][fromCol];
    if (piece === '   ' || piece.substring(1) !== 'PN') {
        return false;
    }
    const color = piece[0]; // 'w' or 'b'

    const direction = color === 'w' ? -1 : 1; // white move up -1, black moves down +1
    const startRow = color === 'w' ? 6 : 1;

    const diffRow = toRow - fromRow;
    const diffCol = toCol - fromCol;

    // pawn normal move: 1 step forward, (to) must be empty
    if (diffCol === 0 && diffRow === direction && board[toRow][toCol] === '   ') {
        return true;
    }

    // first pawn move: 2 steps forward
    if (
        diffCol === 0 &&
        diffRow === 2 * direction &&
        fromRow === startRow &&
        board[fromRow + direction][fromCol] === '   ' &&
        board[toRow][toCol] === '   '
    ) {
        return true;
    }

    // capture move: diagonal 1 step, opponent piece present
    if (
        Math.abs(diffCol) === 1 && // diagonal to left or right
        diffRow === direction &&
        board[toRow][toCol] !== '   ' &&
        board[toRow][toCol][0] !== color // opponents piece
    ) {
        return true;
    }

    return false;
};

export const isRookMoveLegal = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);

    const piece = board[fromRow][fromCol];
    if (piece === '   ' || piece.substring(1) !== 'RK') {
        return false;
    }
    const color = piece[0];

    // rook have to move in straight line
    const isVerticalMove = fromCol === toCol && fromRow !== toRow;
    const isHorizontalMove = fromRow === toRow && fromCol !== toCol;

    if (!isVerticalMove && !isHorizontalMove) return false;

    // direction of movement
    const stepRow = Math.sign(toRow - fromRow);
    const stepCol = Math.sign(toCol - fromCol);

    // path blockage check, rook can't jump over piece
    let row = fromRow + stepRow;
    let col = fromCol + stepCol;

    while (row !== toRow || col !== toCol) {
        if (board[row][col] !== '   ') {
            return false; // blocked
        }
        row += stepRow;
        col += stepCol;
    }

    const targetPiece = board[toRow][toCol];

    // move
    if (targetPiece === '   ') return true;

    // capture
    if (targetPiece[0] !== color) return true;

    return false;
};
