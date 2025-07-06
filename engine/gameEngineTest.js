import {
    initBoardPos,
    showBoard,
    algebraicToIndex,
    indexToAlgebraic,
    movePiece,
    isPawnMoveLegal,
    isRookMoveLegal,
    isBishopMoveLegal,
    isQueenMoveLegal,
    isKnightMoveLegal,
    isKingMoveLegal,
    isMoveLegal,
    createNewGameState,
    getCurrentPlayer,
    getMoveLog,
    getLastMove,
    makeGameMove,
    findKing,
    canOpponentCapture,
    isKingInCheck,
    leaveKingInCheck,
    getAllPossibleMoves,
    isCheckmate,
    createCastlingRights,
    updateCastlingRights,
    isCastlingMove,
    canCastle,
    executeCastling,
    isEnPassantPossible,
    executeEnPassant,
    isPawnPromotion,
    executePawnPromotion,
    isValidPromotionPiece,
    getBoardString,
    isFiftyMoveRule,
    hasInsufficientMaterial,
    findPiecePosition,
    isThreefoldRepetition,
    isDraw,
} from './gameEngine.js';

// ============================================================================
// TEST TRACKING
// ============================================================================
let testResults = { passed: 0, failed: 0, total: 0 };

const testCase = (testName, condition) => {
    testResults.total++;
    if (condition) {
        testResults.passed++;
        console.log(`${testName}: pass`);
    } else {
        testResults.failed++;
        console.log(`${testName}: fail`);
    }
};

// ============================================================================
// INITIAL SETUP & BASIC FUNCTIONALITY TESTS
// ============================================================================

let board = initBoardPos();
showBoard(board);

console.log(algebraicToIndex('e2'));
console.log(indexToAlgebraic(6, 4));

// ============================================================================
// BASIC PIECE MOVEMENT TEST
// ============================================================================

console.log('\nmoving piece from d2 to d4');
movePiece(board, 'd2', 'd3');
showBoard(board);

// ============================================================================
// PAWN TESTS CASE
// ============================================================================
board = initBoardPos();
console.log('\ntesting pawn moves');
showBoard(board);

testCase('pawn case 1', isPawnMoveLegal(board, 'd2', 'd3') === true); // move forward one step
testCase('pawn case 2', isPawnMoveLegal(board, 'e2', 'e4') === true); // move forward two steps
testCase('pawn case 3', isPawnMoveLegal(board, 'f2', 'f5') === false); // illegal move
movePiece(board, 'f7', 'f3');
testCase('pawn case 4', isPawnMoveLegal(board, 'e2', 'f3') === true); // capture move
testCase('pawn case 5', isPawnMoveLegal(board, 'e2', 'd3') === false); // invalid capture

// ============================================================================
// ROOK TESTS CASE
// ============================================================================

console.log('\ntesting rook moves');
board = initBoardPos();
showBoard(board);

movePiece(board, 'h2', 'h4');
movePiece(board, 'h4', 'h5');
showBoard(board);

testCase('rook case 1', isRookMoveLegal(board, 'h1', 'h3') === true); // moves up
testCase('rook case 2', isRookMoveLegal(board, 'h1', 'f1') === false); // blocked by own piece
testCase('rook case 3', isRookMoveLegal(board, 'h1', 'g2') === false); // illegal diagonal move
movePiece(board, 'h1', 'h3');
movePiece(board, 'g8', 'h6');
movePiece(board, 'h5', 'g3');
showBoard(board);
testCase('rook case 4', isRookMoveLegal(board, 'h3', 'h6') === true); // capture test
movePiece(board, 'f1', 'h7');
showBoard(board);
testCase('rook case 5', isRookMoveLegal(board, 'h3', 'h7') === false); // invalid capture test

// ============================================================================
// BISHOP TESTS CASE
// ============================================================================

console.log('\ntesting bishop moves');
board = initBoardPos();
movePiece(board, 'e2', 'e4');
showBoard(board);

testCase('bishop case 1', isBishopMoveLegal(board, 'f1', 'b5') === true); // valid diagonal move
testCase('bishop case 2', isBishopMoveLegal(board, 'f1', 'd1') === false); // invalid horizontal move
movePiece(board, 'b7', 'b5');
showBoard(board);
testCase('bishop case 3', isBishopMoveLegal(board, 'f1', 'b5') === true); // capture test setup
movePiece(board, 'e4', 'e2');
showBoard(board);
testCase('bishop case 4', isBishopMoveLegal(board, 'f1', 'e2') === false); // invalid capture test

// ============================================================================
// QUEEN TESTS CASE
// ============================================================================

console.log('\ntesting queen moves');
board = initBoardPos();
movePiece(board, 'd2', 'd4');
movePiece(board, 'e2', 'e5');
movePiece(board, 'd1', 'd3');
showBoard(board);

testCase('queen case 1', isQueenMoveLegal(board, 'd3', 'h3') === true); // valid horizontal move
testCase('queen case 2', isQueenMoveLegal(board, 'd3', 'd1') === true); // valid vertical move
testCase('queen case 3', isQueenMoveLegal(board, 'd3', 'b5') === true); // valid diagonal move
testCase('queen case 4', isQueenMoveLegal(board, 'd3', 'f4') === false); // invalid move
testCase('queen case 5', isQueenMoveLegal(board, 'd3', 'd6') === false); // blocked path
movePiece(board, 'g7', 'g6');
showBoard(board);
testCase('queen case 6', isQueenMoveLegal(board, 'd3', 'g6') === true); // valid capture
testCase('queen case 7', isQueenMoveLegal(board, 'd3', 'e5') === false); // invalid capture

// ============================================================================
// KNIGHT TESTS CASE
// ============================================================================

console.log('\ntesting knight moves');
board = initBoardPos();
movePiece(board, 'b1', 'c3');
showBoard(board);

testCase('knight case 1', isKnightMoveLegal(board, 'c3', 'e4') === true); // valid L-shape move
testCase('knight case 2', isKnightMoveLegal(board, 'c3', 'a4') === true); // valid L-shape move
testCase('knight case 3', isKnightMoveLegal(board, 'c3', 'd5') === true); // valid L-shape move
testCase('knight case 4', isKnightMoveLegal(board, 'c3', 'c5') === false); // invalid straight move
testCase('knight case 5', isKnightMoveLegal(board, 'c3', 'd4') === false); // invalid diagonal move
movePiece(board, 'e7', 'e4');
showBoard(board);
testCase('knight case 6', isKnightMoveLegal(board, 'c3', 'e4') === true); // valid capture
testCase('knight case 7', isKnightMoveLegal(board, 'c3', 'e2') === false); // invalid capture

// ============================================================================
// KING TESTS CASE
// ============================================================================

console.log('\ntesting king moves');
board = initBoardPos();
movePiece(board, 'e2', 'e4');
movePiece(board, 'e1', 'e2');
showBoard(board);

testCase('king case 1', isKingMoveLegal(board, 'e2', 'e3') === true); // valid one block forward
testCase('king case 2', isKingMoveLegal(board, 'e2', 'd3') === true); // valid one block diagonal
testCase('king case 4', isKingMoveLegal(board, 'e2', 'e4') === false); // invalid two block forward
testCase('king case 5', isKingMoveLegal(board, 'e2', 'c4') === false); // invalid knight-like move
movePiece(board, 'd7', 'd3');
showBoard(board);
testCase('king case 6', isKingMoveLegal(board, 'e2', 'd3') === true); // valid capture
testCase('king case 7', isKingMoveLegal(board, 'e2', 'd1') === false); // invalid capture

// ============================================================================
// GLOBAL MOVE VALIDATION TESTS
// ============================================================================

console.log('\ntesting global move validation');
board = initBoardPos();
showBoard(board);

testCase('global case 1', isMoveLegal(board, 'e2', 'e4') === true); // pawn move
testCase('global case 2', isMoveLegal(board, 'b1', 'c3') === true); // knight move
testCase('global case 3', isMoveLegal(board, 'a1', 'a3') === false); // blocked rook
testCase('global case 4', isMoveLegal(board, 'f1', 'a6') === false); // blocked bishop
testCase('global case 5', isMoveLegal(board, 'e1', 'e2') === false); // blocked king
testCase('global case 6', isMoveLegal(board, 'h3', 'h4') === false); // no piece at position

// ============================================================================
// GAME STATE TESTS
// ============================================================================

console.log('\ntesting game state');
const game = createNewGameState();
console.log('Current player:', getCurrentPlayer(game));

makeGameMove(game, 'e2', 'e4'); // white moves
console.log('After white move:', getCurrentPlayer(game));

makeGameMove(game, 'e7', 'e5'); // black moves
console.log('After black move:', getCurrentPlayer(game));

console.log('last move', getLastMove(game));
console.log('Move log:', getMoveLog(game));

// ============================================================================
// CHECK DETECTION TESTS
// ============================================================================

board = initBoardPos();
console.log('\ntesting findKing function');
testCase('find white king', findKing(board, 'w') !== null); // find king
testCase('find black king', findKing(board, 'b') !== null); // find king

console.log('\ntesting canOpponentCapture function');
board = initBoardPos();
movePiece(board, 'e2', 'e4');
movePiece(board, 'd1', 'd3');
showBoard(board);

testCase('queen can attack d7', canOpponentCapture(board, 1, 3, 'w') === true); // d7 block
testCase('queen cannot attack a8', canOpponentCapture(board, 0, 0, 'w') === false); // a8 block
testCase('no attack on empty middle', canOpponentCapture(board, 4, 4, 'w') === false); // e4 block

console.log('testing isKingInCheck function');
board = initBoardPos();
movePiece(board, 'd1', 'h5');
movePiece(board, 'f7', 'f6');
showBoard(board);

testCase('black king  in check ', isKingInCheck(board, 'b') === true); // black king is in check
movePiece(board, 'f6', 'f7');
showBoard(board);
testCase('black king is not in check', isKingInCheck(board, 'b') === false); // black king is not in check

console.log('\nTesting leaveKingInCheck function');
board = initBoardPos();
movePiece(board, 'e2', 'e4');
movePiece(board, 'd1', 'h5');
showBoard(board);

testCase('moving pawn would expose king', leaveKingInCheck(board, 'f7', 'f6', 'b') === true);

// ============================================================================
// CHECKMATE TESTS
// ============================================================================

console.log('testing checkmate');
board = initBoardPos();

// fool's mate
movePiece(board, 'f2', 'f3');
movePiece(board, 'e7', 'e5');
movePiece(board, 'g2', 'g4');
movePiece(board, 'd8', 'h4');
console.log('\nfools mate position');
showBoard(board);
testCase('white king in checkmate', isCheckmate(board, 'w') === true); // white king in checkmate
testCase('black king not in checkmate', isCheckmate(board, 'b') === false); // black king is not in checkmate
testCase('White possible moves', getAllPossibleMoves(board, 'w').length === 0); // check white's possible moves

// ============================================================================
// CASTLING TESTS
// ============================================================================

console.log('\ntesting castling functionality');

let castlingRights = createCastlingRights();
testCase('castling rights created', castlingRights.whiteKingMoved === false); // initial castling rights

castlingRights = updateCastlingRights(castlingRights, 'e1', null, 'wKG');
testCase('king moved updates rights', castlingRights.whiteKingMoved === true); // rights updated when king moves

board = initBoardPos();
testCase('detect kingSide castling', isCastlingMove(board, 'e1', 'g1') === true); // kingSide castling detected
testCase('detect queenSide castling', isCastlingMove(board, 'e8', 'c8') === true); // queenSide castling detected
testCase('not castling move', isCastlingMove(board, 'e1', 'f1') === false); // regular king move
testCase('castling blocked by pieces', canCastle(board, 'w', 'kingSide', castlingRights) === false); // path blocked

movePiece(board, 'f1', 'f3');
movePiece(board, 'g1', 'g3');
showBoard(board);
castlingRights = createCastlingRights();
testCase('castling with clear path', canCastle(board, 'w', 'kingSide', castlingRights) === true); // clear path allows castling

board = initBoardPos();
movePiece(board, 'f1', 'f3');
movePiece(board, 'g1', 'g3');
showBoard(board);
executeCastling(board, 'w', 'kingSide');
testCase('king moved to g1', board[7][6] === 'wKG'); // king position after castling
testCase('rook moved to f1', board[7][5] === 'wRK'); // rook position after castling

// ============================================================================
// EN PASSANT TESTS
// ============================================================================

console.log('\ntesting en passant functionality');

// basic en passant detection - white captures black
let testGameState = createNewGameState();
// manually set up the board position
testGameState.board[3][4] = 'wPN'; // white pawn on e5
testGameState.board[3][3] = 'bPN'; // black pawn on d5
testGameState.board[6][3] = '   '; // remove original d2 pawn
testGameState.currentPlayer = 'w';
// simulate that black pawn just moved d7-d5
testGameState.moveLog.push({
    moveNumber: 1,
    from: 'd7',
    to: 'd5',
    piece: 'bPN',
    player: 'b',
});
console.log('\nsetup for white en passant test:');
showBoard(testGameState.board);

testCase('white en passant detection', isEnPassantPossible(testGameState, 'e5', 'd6') === true);

// basic en passant detection - black captures white
testGameState = createNewGameState();
testGameState.board[4][4] = 'bPN'; // black pawn on e4
testGameState.board[4][3] = 'wPN'; // white pawn on d4
testGameState.board[1][3] = '   '; // remove original d7 pawn
testGameState.currentPlayer = 'b';
// simulate that white pawn just moved d2-d4
testGameState.moveLog.push({
    moveNumber: 1,
    from: 'd2',
    to: 'd4',
    piece: 'wPN',
    player: 'w',
});
console.log('\nsetup for black en passant test:');
showBoard(testGameState.board);

testCase('black en passant detection', isEnPassantPossible(testGameState, 'e4', 'd3') === true);

// en passant not possible - no last move
testGameState = createNewGameState();
testGameState.board[3][4] = 'wPN'; // white pawn on e5
testGameState.board[3][3] = 'bPN'; // black pawn on d5
testGameState.moveLog = []; // no previous moves

testCase('en passant not possible - no last move', isEnPassantPossible(testGameState, 'e5', 'd6') === false);

// en passant execution
testGameState = createNewGameState();
testGameState.board[3][4] = 'wPN'; // white pawn on e5
testGameState.board[3][3] = 'bPN'; // black pawn on d5
let testBoard = testGameState.board.map((row) => [...row]); // copy board
executeEnPassant(testBoard, 'e5', 'd6');

testCase('en passant execution - pawn moved', testBoard[2][3] === 'wPN'); // d6 has white pawn
testCase('en passant execution - captured pawn removed', testBoard[3][3] === '   '); // d5 is empty

// en passant through pawn move validation
testGameState = createNewGameState();
testGameState.board[3][4] = 'wPN'; // white pawn on e5
testGameState.board[3][3] = 'bPN'; // black pawn on d5
testGameState.board[2][3] = '   '; // d6 is empty
testGameState.currentPlayer = 'w';
testGameState.moveLog.push({
    moveNumber: 1,
    from: 'd7',
    to: 'd5',
    piece: 'bPN',
    player: 'b',
});

testCase(
    'en passant through pawn validation',
    isPawnMoveLegal(testGameState.board, 'e5', 'd6', testGameState) === true
);

// ============================================================================
// PAWN PROMOTION TESTS
// ============================================================================

console.log('\ntesting pawn promotion functionality');

// wite pawn promotion detection
testCase('white pawn e7-e8 promotes', isPawnPromotion('e7', 'e8', 'wPN') === true);
testCase('white pawn e6-e7 does not promote', isPawnPromotion('e6', 'e7', 'wPN') === false);

// black pawn promotion detection
testCase('black pawn d2-d1 promotes', isPawnPromotion('d2', 'd1', 'bPN') === true);
testCase('black pawn d3-d2 does not promote', isPawnPromotion('d3', 'd2', 'bPN') === false);

// non-pawn pieces don't promote
testCase('king does not promote', isPawnPromotion('e1', 'e8', 'wKG') === false);
testCase('rook does not promote', isPawnPromotion('a1', 'a8', 'wRK') === false);

// pawn promotion execution - Queen
let testPromotionBoard = initBoardPos();
testPromotionBoard[0][4] = 'wPN'; // place white pawn on e8
executePawnPromotion(testPromotionBoard, 'e8', 'QN');
testCase('white pawn promoted to queen', testPromotionBoard[0][4] === 'wQN');

// pawn promotion execution - Rook
testPromotionBoard = initBoardPos();
testPromotionBoard[7][3] = 'bPN'; // place black pawn on d1
executePawnPromotion(testPromotionBoard, 'd1', 'RK');
testCase('black pawn promoted to rook', testPromotionBoard[7][3] === 'bRK');

// pawn promotion execution - Bishop (
testPromotionBoard = initBoardPos();
testPromotionBoard[0][5] = 'wPN'; // place white pawn on f8
executePawnPromotion(testPromotionBoard, 'f8', 'BS');
testCase('white pawn promoted to bishop', testPromotionBoard[0][5] === 'wBS');

// pawn promotion execution - Knight
testPromotionBoard = initBoardPos();
testPromotionBoard[7][6] = 'bPN'; // place black pawn on g1
executePawnPromotion(testPromotionBoard, 'g1', 'KN');
testCase('black pawn promoted to knight', testPromotionBoard[7][6] === 'bKN');

// invalid promotion defaults to Queen
testPromotionBoard = initBoardPos();
testPromotionBoard[0][2] = 'wPN'; // place white pawn on c8
executePawnPromotion(testPromotionBoard, 'c8', 'XX'); // invalid piece
testCase('invalid promotion defaults to queen', testPromotionBoard[0][2] === 'wQN');

// valid promotion piece check
testCase('QN is valid promotion', isValidPromotionPiece('QN') === true);
testCase('RK is valid promotion', isValidPromotionPiece('RK') === true);
testCase('BS is valid promotion', isValidPromotionPiece('BS') === true);
testCase('KN is valid promotion', isValidPromotionPiece('KN') === true);
testCase('KG is not valid promotion', isValidPromotionPiece('KG') === false);
testCase('PN is not valid promotion', isValidPromotionPiece('PN') === false);

// ============================================================================
// DRAW DETECTION TESTS - SIMPLE & CLEAR
// ============================================================================

console.log('\ntesting draw detection functionality');

let drawBoard = [
    ['   ', '   ', '   ', '   ', 'bKG', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', 'wKG', '   ', '   ', '   '],
];
testCase('king vs king is draw', hasInsufficientMaterial(drawBoard) === true);

drawBoard = [
    ['   ', '   ', '   ', '   ', 'bKG', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', 'wBS', '   ', 'wKG', '   ', '   ', '   '],
];
testCase('king + bishop vs king is draw', hasInsufficientMaterial(drawBoard) === true);

drawBoard = [
    ['   ', '   ', '   ', '   ', 'bKG', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', 'wKN', '   ', 'wKG', '   ', '   ', '   '],
];
testCase('king + knight vs king is draw', hasInsufficientMaterial(drawBoard) === true);

drawBoard = [
    ['   ', '   ', '   ', '   ', 'bKG', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', 'wQN', '   ', 'wKG', '   ', '   ', '   '],
];
testCase('king + queen vs king is NOT draw', hasInsufficientMaterial(drawBoard) === false);

drawBoard = [
    ['   ', '   ', '   ', '   ', 'bKG', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', 'wPN', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', 'wKG', '   ', '   ', '   '],
];
testCase('king + pawn vs king is NOT draw', hasInsufficientMaterial(drawBoard) === false);

// find piece position
testCase('find white king', findPiecePosition(drawBoard, 'wKG') !== null);
testCase('find black king', findPiecePosition(drawBoard, 'bKG') !== null);
testCase('find non-existent queen', findPiecePosition(drawBoard, 'wQN') === null);

// board to string conversion
const boardString = getBoardString(drawBoard);
testCase('board string created', boardString.length > 0);
testCase('board string correct length', boardString.length === 192); // 8x8x3 chars per square

// fifty move rule - not triggered (too few moves)
let testGame = createNewGameState();
// add only 50 moves (not enough for 50-move rule)
for (let i = 0; i < 50; i++) {
    testGame.moveLog.push({
        piece: 'wKN',
        capturedPiece: null,
    });
}
testCase('fifty move rule not triggered with few moves', isFiftyMoveRule(testGame) === false);

// fifty move rule - not triggered (pawn move)
testGame = createNewGameState();
// add 100 moves but include a pawn move
for (let i = 0; i < 99; i++) {
    testGame.moveLog.push({
        piece: 'wKN',
        capturedPiece: null,
    });
}
// add one pawn move
testGame.moveLog.push({
    piece: 'wPN',
    capturedPiece: null,
});
testCase('fifty move rule not triggered with pawn move', isFiftyMoveRule(testGame) === false);

// fifty move rule - not triggered (capture)
testGame = createNewGameState();
// Add 100 moves but include a capture
for (let i = 0; i < 99; i++) {
    testGame.moveLog.push({
        piece: 'wKN',
        capturedPiece: null,
    });
}
// add one capture
testGame.moveLog.push({
    piece: 'wKN',
    capturedPiece: 'bPN',
});
testCase('fifty move rule not triggered with capture', isFiftyMoveRule(testGame) === false);

// fifty move rule - triggered
testGame = createNewGameState();
// add exactly 100 moves with no pawn moves or captures
for (let i = 0; i < 100; i++) {
    testGame.moveLog.push({
        piece: 'wKN',
        capturedPiece: null,
    });
}
testCase('fifty move rule triggered', isFiftyMoveRule(testGame) === true);

// threefold repetition - NOT triggered (too few positions)
testGame = createNewGameState();
testGame.positionHistory = ['pos1', 'pos2', 'pos1']; // only 3 positions total
testCase('threefold repetition not triggered with few positions', isThreefoldRepetition(testGame) === false);

// threefold repetition - not triggered (no repetition)
testGame = createNewGameState();
testGame.positionHistory = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6']; // 6 different positions
testCase('threefold repetition not triggered with different positions', isThreefoldRepetition(testGame) === false);

// threefold repetition - triggered
testGame = createNewGameState();
const samePos = getBoardString(testGame.board);
testGame.positionHistory = [samePos, 'pos2', samePos, 'pos3', samePos, 'pos4']; // same position 3 times
testCase('threefold repetition triggered', isThreefoldRepetition(testGame) === true);

// overall draw detection - insufficient material
testGame = createNewGameState();
testGame.board = [
    ['   ', '   ', '   ', '   ', 'bKG', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', '   ', '   ', '   ', '   '],
    ['   ', '   ', '   ', '   ', 'wKG', '   ', '   ', '   '],
];
testGame.positionHistory = ['pos1', 'pos2']; // not enough for repetition
const drawResult = isDraw(testGame);
testCase('draw detected for insufficient material', drawResult.isDraw === true);
testCase('draw reason is insufficient material', drawResult.reason === 'insufficient material');

// overall draw detection - no draw
testGame = createNewGameState(); // normal starting position
testGame.positionHistory = ['pos1', 'pos2']; // not enough for repetition
const noDrawResult = isDraw(testGame);
testCase('no draw detected for normal game', noDrawResult.isDraw === false);
testCase('no draw reason is null', noDrawResult.reason === null);

// ============================================================================
// TEST RESULTS
// ============================================================================

console.log('\n\nTest Results:');
console.log(`Total: ${testResults.total} | Passed: ${testResults.passed} | Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%\n\n`);
