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

export const isPawnMoveLegal = (board, from, to, gameState = null) => {
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

    // en passant capture : diagonal 1 step to empty square, but only if gameState is provided
    if (gameState && Math.abs(colDiff) === 1 && rowDiff === direction && targetBlock === '   ')
        return isEnPassantPossible(gameState, from, to);

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

export const isMoveLegal = (board, from, to, gameState = null) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const piece = board[fromRow][fromCol];

    if (piece === '   ') return false;

    const pieceType = piece.substring(1); // get piece info PN RK QN

    switch (pieceType) {
        case 'PN':
            return isPawnMoveLegal(board, from, to, gameState);
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

// ============================================================================
// KING DETECTION AND SAFETY
// ============================================================================

export const findKing = (board, color) => {
    // look through every block on the board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece === color + 'KG') return [row, col]; // king position
        }
    }
    return null;
};

export const canOpponentCapture = (board, row, col, byColor) => {
    const targetBlock = indexToAlgebraic(row, col);

    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board[fromRow][fromCol];

            if (piece === '   ' || piece[0] !== byColor) continue; // skip empty or wrong color pieces

            const fromBlock = indexToAlgebraic(fromRow, fromCol);

            if (isMoveLegal(board, fromBlock, targetBlock)) return true; // can this piece attack the target square
        }
    }
    return false;
};

export const isKingInCheck = (board, color) => {
    const kingPosition = findKing(board, color);
    if (!kingPosition) return false;

    const [kingRow, kingCol] = kingPosition;
    const opponentColor = color === 'w' ? 'b' : 'w';

    return canOpponentCapture(board, kingRow, kingCol, opponentColor); // is king under attack
};

// illegal move that expose king
export const leaveKingInCheck = (board, from, to, playerColor, gameState = null) => {
    const tempBoard = board.map((row) => [...row]); // temporary copy of board

    // check if this is an en passant move
    if (gameState && isEnPassantPossible(gameState, from, to)) {
        executeEnPassant(tempBoard, from, to);
    } else {
        movePiece(tempBoard, from, to); // make move on temporary board
    }

    return isKingInCheck(tempBoard, playerColor);
};

export const isMoveLegalAndSafe = (board, from, to, castlingRights = null, gameState = null) => {
    // check if its a castling move
    if (isCastlingMove(board, from, to)) {
        if (!castlingRights) return false;

        const { color, side } = getCastlingDetails(from, to);
        return canCastle(board, color, side, castlingRights);
    }

    if (!isMoveLegal(board, from, to, gameState)) return false; // illegal move check

    // king expose check
    const [fromRow, fromCol] = algebraicToIndex(from);
    const piece = board[fromRow][fromCol];
    const playerColor = piece[0];

    if (leaveKingInCheck(board, from, to, playerColor, gameState)) return false;

    return true; // move legal and safe
};

// ============================================================================
// CHECKMATE DETECTION
// ============================================================================

export const getAllPossibleMoves = (board, color, castlingRights = null, gameState = null) => {
    const moves = [];

    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board[fromRow][fromCol];

            if (piece === '   ' || piece[0] !== color) continue;

            const from = indexToAlgebraic(fromRow, fromCol);

            // try all possible destination blocks
            for (let toRow = 0; toRow < 8; toRow++) {
                for (let toCol = 0; toCol < 8; toCol++) {
                    const to = indexToAlgebraic(toRow, toCol);

                    // add it to the list if move is legal
                    if (isMoveLegalAndSafe(board, from, to, castlingRights, gameState)) {
                        moves.push({ from, to, piece });
                    }
                }
            }
        }
    }

    return moves;
};

export const isCheckmate = (board, color, castlingRights = null, gameState = null) => {
    if (!isKingInCheck(board, color)) return false; // is the king in check
    const possibleMoves = getAllPossibleMoves(board, color, castlingRights, gameState); // check for legal move to escape
    return possibleMoves.length === 0; // no legal move exits, checkmate
};

export const isStalemate = (board, color, castlingRights = null, gameState = null) => {
    if (isKingInCheck(board, color)) return false; // king not in check, but no legal moves
    const possibleMoves = getAllPossibleMoves(board, color, castlingRights, gameState);
    return possibleMoves.length === 0;
};

// ============================================================================
// CASTLING VALIDATION & EXECUTION
// ============================================================================

const isCastlingPathClear = (board, color, side) => {
    const row = color === 'w' ? 7 : 0;

    if (side === 'kingSide') {
        return board[row][5] === '   ' && board[row][6] === '   '; // check f1/f8 and g1/g8 empty
    } else {
        return board[row][3] === '   ' && board[row][2] === '   ' && board[row][1] === '   '; // check d1/d8 , c1/c8 and b1/b8 empty
    }
};

const isCastlingPathSafe = (board, color, side) => {
    const row = color === 'w' ? 7 : 0;
    const opponentColor = color === 'w' ? 'b' : 'w';

    if (side === 'kingSide') {
        // king move from e1 to f1 to g1, check f1 and g1 are safe
        return !canOpponentCapture(board, row, 5, opponentColor) && !canOpponentCapture(board, row, 6, opponentColor);
    } else {
        // king moves from e1 to d1 to c1 , check d1 and c1 are safe
        return !canOpponentCapture(board, row, 3, opponentColor) && !canOpponentCapture(board, row, 2, opponentColor);
    }
};

export const canCastle = (board, color, side, castlingRights) => {
    // check if the king or rook moved
    if (color === 'w') {
        if (castlingRights.whiteKingMoved) return false;
        if (side === 'kingSide' && castlingRights.whiteKingSideRookMoved) return false;
        if (side === 'queenSide' && castlingRights.whiteQueenSideRookMoved) return false;
    } else {
        if (castlingRights.blackKingMoved) return false;
        if (side === 'kingSide' && castlingRights.blackKingSideRookMoved) return false;
        if (side === 'queenSide' && castlingRights.blackQueenSideRookMoved) return false;
    }

    if (isKingInCheck(board, color)) return false; // check if king in status:check
    if (!isCastlingPathClear(board, color, side)) return false; // check if block between king and root empty
    if (!isCastlingPathSafe(board, color, side)) return false; // check if king falls in check

    return true;
};

export const isCastlingMove = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);
    const piece = board[fromRow][fromCol];

    if (!piece.endsWith('KG')) return false; // must be a king move
    if (fromRow !== toRow || Math.abs(toCol - fromCol) !== 2) return false; // must be 2 block horizontally

    const expectedRow = piece[0] === 'w' ? 7 : 0;
    if (fromRow !== expectedRow || fromCol !== 4) return false; // must be from starting position

    return true;
};

export const getCastlingDetails = (from, to) => {
    const [, fromCol] = algebraicToIndex(from);
    const [, toCol] = algebraicToIndex(to);

    const side = toCol > fromCol ? 'kingSide' : 'queenSide';
    const color = from[1] === '1' ? 'w' : 'b';

    return { color, side };
};

export const executeCastling = (board, color, side) => {
    if (side === 'kingSide') {
        if (color === 'w') {
            // white kingSide : king e1 to g1, rook h1 to f1
            movePiece(board, 'e1', 'g1');
            movePiece(board, 'h1', 'f1');
        } else {
            // black kingSide : king e8 to g8, rook h8 to f8
            movePiece(board, 'e8', 'g8');
            movePiece(board, 'h8', 'f8');
        }
    } else {
        if (color === 'w') {
            // white queenSide: king e1 to c1, rook a1 to d1
            movePiece(board, 'e1', 'c1');
            movePiece(board, 'a1', 'd1');
        } else {
            // black queenSide: king e8 to c8, rook a8 to d8
            movePiece(board, 'e8', 'c8');
            movePiece(board, 'a8', 'd8');
        }
    }
    return board;
};

export const createCastlingRights = () => {
    return {
        whiteKingMoved: false,
        whiteKingSideRookMoved: false,
        whiteQueenSideRookMoved: false,
        blackKingMoved: false,
        blackKingSideRookMoved: false,
        blackQueenSideRookMoved: false,
    };
};

export const updateCastlingRights = (castlingRights, from, to = null, piece) => {
    const newRights = { ...castlingRights };

    // update when piece move
    if (piece === 'wKG') newRights.whiteKingMoved = true;
    if (piece === 'bKG') newRights.blackKingMoved = true;
    if (from === 'a1' && piece === 'wRK') newRights.whiteQueenSideRookMoved = true;
    if (from === 'h1' && piece === 'wRK') newRights.whiteKingSideRookMoved = true;
    if (from === 'a8' && piece === 'bRK') newRights.blackQueenSideRookMoved = true;
    if (from === 'h8' && piece === 'bRK') newRights.blackKingSideRookMoved = true;

    // update when rooks get captured
    if (to === 'a1') newRights.whiteQueenSideRookMoved = true;
    if (to === 'h1') newRights.whiteKingSideRookMoved = true;
    if (to === 'a8') newRights.blackQueenSideRookMoved = true;
    if (to === 'h8') newRights.blackKingSideRookMoved = true;

    return newRights;
};

// ============================================================================
// EN PASSANT VALIDATION & EXECUTION
// ============================================================================

export const isEnPassantPossible = (gameState, from, to) => {
    const lastMove = getLastMove(gameState);
    if (!lastMove) return false;

    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);
    const piece = gameState.board[fromRow][fromCol];

    if (!piece.endsWith('PN')) return false; // must be a pawn move

    const color = piece[0];
    const direction = color === 'w' ? -1 : 1;
    const expectedRank = color === 'w' ? 3 : 4; // 5th rank for white, 4th rank for black

    if (fromRow !== expectedRank) return false; // pawn must be on the correct rank

    // must be diagonal move to empty block
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    if (rowDiff !== direction || Math.abs(colDiff) !== 1) return false;

    // check if last move was 2 block pawn move
    const lastMoveFromPos = algebraicToIndex(lastMove.from);
    const lastMoveToPos = algebraicToIndex(lastMove.to);
    const [lastFromRow, lastFromCol] = lastMoveFromPos;
    const [lastToRow, lastToCol] = lastMoveToPos;

    if (!lastMove.piece.endsWith('PN')) return false; // last move must be a pawn

    // last move must be 2 block forward
    const lastMoveDirection = lastMove.piece[0] === 'w' ? -1 : 1;
    if (Math.abs(lastToRow - lastFromRow) !== 2) return false;
    if (lastToRow - lastFromRow !== 2 * lastMoveDirection) return false;

    if (lastToRow !== fromRow || lastToCol !== toCol) return false; // capturing pawn must be adjacent and ont he same rank

    const capturedPawn = gameState.board[lastToRow][lastToCol];
    if (capturedPawn[0] === color) return false; // captured pawn must be opposite color

    return true;
};

export const executeEnPassant = (board, from, to) => {
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);
    const piece = board[fromRow][fromCol];

    // move pawn to the destination
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '   ';

    board[fromRow][toCol] = '   '; // remove the captured pawn

    return board;
};

// ============================================================================
// GAME STATE MANAGEMENT
// ============================================================================

export const createNewGameState = () => {
    return {
        board: initBoardPos(),
        currentPlayer: 'w',
        moveLog: [],
        gameStatus: 'active',
        moveCount: 0,
        castlingRights: createCastlingRights(),
        winner: null,
    };
};

export const getCurrentPlayer = (gameState) => {
    return gameState.currentPlayer; // return 'w' or 'b'
};

export const switchTurn = (gameState) => {
    if (gameState.currentPlayer === 'w') {
        gameState.currentPlayer = 'b';
    } else {
        gameState.currentPlayer = 'w';
    }
    return gameState;
};

export const logMove = (gameState, from, to, piece, capturedPiece = null, specialNotation = null) => {
    gameState.moveLog.push({
        moveNumber: gameState.moveCount + 1, // move serial number
        from: from, // starting position
        to: to, // ending position
        piece: piece, // which piece moved
        capturedPiece: capturedPiece, // which piece was captured
        player: gameState.currentPlayer, // who made the move
        notation: specialNotation || `${piece} ${from}-${to}`, // special notation for castling
    });

    gameState.moveCount++;
    return gameState;
};

// main function to make a move in game
// main function to make a move in game
export const makeGameMove = (gameState, from, to) => {
    // get position and pieces
    const [fromRow, fromCol] = algebraicToIndex(from);
    const [toRow, toCol] = algebraicToIndex(to);
    const piece = gameState.board[fromRow][fromCol];
    const capturedPiece = gameState.board[toRow][toCol];

    // check if there is a piece to move
    if (piece === '   ') throw new Error('no piece at the starting position');

    //  check player turn check
    if (piece[0] !== gameState.currentPlayer) {
        const player = gameState.currentPlayer === 'w' ? 'white' : 'black';
        throw new Error(`not ${player}'s turn`);
    }

    // check if it's castling
    if (isCastlingMove(gameState.board, from, to)) {
        const { color, side } = getCastlingDetails(from, to);

        // validate castling
        if (!canCastle(gameState.board, color, side, gameState.castlingRights))
            throw new Error(`illegal castling move: ${from} to ${to}`);

        executeCastling(gameState.board, color, side);

        const castlingNotation = side === 'kingSide' ? '0-0' : '0-0-0'; // log castling move with special notation
        logMove(gameState, from, to, piece, null, castlingNotation);
    }

    // check if it's en passant
    else if (isEnPassantPossible(gameState, from, to)) {
        // validate en passant move
        if (!isMoveLegalAndSafe(gameState.board, from, to, gameState.castlingRights, gameState))
            throw new Error(`illegal en passant move: ${from} to ${to}`);

        // get the captured pawn before executing the move
        const capturedPawnRow = fromRow;
        const capturedPawnCol = toCol;
        const capturedPawn = gameState.board[capturedPawnRow][capturedPawnCol];

        executeEnPassant(gameState.board, from, to);

        logMove(gameState, from, to, piece, capturedPawn, `${piece} ${from}x${to} e.p.`);
    } else {
        // regular move validation
        if (!isMoveLegalAndSafe(gameState.board, from, to, gameState.castlingRights, gameState))
            throw new Error(`illegal move ${from} to ${to}`);

        movePiece(gameState.board, from, to);

        const captured = capturedPiece !== '   ' ? capturedPiece : null;
        logMove(gameState, from, to, piece, captured);
    }

    gameState.castlingRights = updateCastlingRights(gameState.castlingRights, from, to, piece); // update castling right

    switchTurn(gameState); // switch player's turn

    const currentColor = gameState.currentPlayer; // update game status based on check, checkmate, stalemate

    if (isCheckmate(gameState.board, currentColor, gameState.castlingRights, gameState)) {
        gameState.gameStatus = 'checkmate';
        gameState.winner = currentColor === 'w' ? 'b' : 'w'; // previous player wins
    } else if (isStalemate(gameState.board, currentColor, gameState.castlingRights, gameState)) {
        gameState.gameStatus = 'stalemate';
        gameState.winner = 'draw';
    } else if (isKingInCheck(gameState.board, currentColor)) {
        gameState.gameStatus = 'check';
    } else {
        gameState.gameStatus = 'active';
    }

    return gameState;
};

// get the latest move
export const getLastMove = (gameState) => {
    if (gameState.moveLog.length > 0) {
        return gameState.moveLog[gameState.moveLog.length - 1];
    } else {
        return null;
    }
};

// get the full log
export const getMoveLog = (gameState) => {
    return gameState.moveLog;
};
