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
// TEST RESULTS
// ============================================================================
console.log('\n\nTest Results:');
console.log(`Total: ${testResults.total} | Passed: ${testResults.passed} | Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%\n\n`);
