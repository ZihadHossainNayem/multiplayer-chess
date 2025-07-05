import {
    initBoardPosition,
    showBoard,
    algebraicToIndex,
    indexToAlgebraic,
    movePiece,
    isPawnMoveLegal,
    isRookMoveLegal,
    isBishopMoveLegal,
} from './gameEngine.js';

// ============================================================================
// INITIAL SETUP & BASIC FUNCTIONALITY TESTS
// ============================================================================

let board = initBoardPosition();
showBoard(board);

console.log(algebraicToIndex('e2'));
console.log(indexToAlgebraic(6, 4));

const testCase = (testName, condition) => {
    console.log(`${testName}: ${condition ? 'pass' : 'fail'}`);
};

// ============================================================================
// BASIC PIECE MOVEMENT TEST
// ============================================================================

console.log('\nmoving piece from d2 to d4');
movePiece(board, 'd2', 'd3');
showBoard(board);

// ============================================================================
// PAWN TESTS CASE
// ============================================================================

board = initBoardPosition();
showBoard(board);

console.log('\ntesting pawn moves');

// move forward one step
testCase('pawn case 1', isPawnMoveLegal(board, 'd2', 'd3') === true);

// move forward two steps
testCase('pawn case 2', isPawnMoveLegal(board, 'e2', 'e4') === true);

// illegal move
testCase('pawn case 3', isPawnMoveLegal(board, 'f2', 'f5') === false);

// capture move
movePiece(board, 'f7', 'f3');
testCase('pawn case 4', isPawnMoveLegal(board, 'e2', 'f3') === true);

// invalid capture
testCase('pawn case 5', isPawnMoveLegal(board, 'e2', 'd3') === false);

// ============================================================================
// ROOK TESTS CASE
// ============================================================================

console.log('\ntesting rook moves');
board = initBoardPosition();
showBoard(board);

movePiece(board, 'h2', 'h4');
movePiece(board, 'h4', 'h5');
showBoard(board);

// moves up
testCase('rook case 1', isRookMoveLegal(board, 'h1', 'h3') === true);

// blocked by own piece
testCase('rook case 2', isRookMoveLegal(board, 'h1', 'f1') === false);

// illegal diagonal move
testCase('rook case 3', isRookMoveLegal(board, 'h1', 'g2') === false);

// capture test
movePiece(board, 'h1', 'h3');
movePiece(board, 'g8', 'h6');
movePiece(board, 'h5', 'g3');
showBoard(board);
testCase('rook case 4', isRookMoveLegal(board, 'h3', 'h6') === true);

// invalid capture test
movePiece(board, 'f1', 'h7');
showBoard(board);
testCase('rook case 5', isRookMoveLegal(board, 'h3', 'h7') === false);

// ============================================================================
// BISHOP TESTS CASE
// ============================================================================

console.log('\ntesting bishop moves');
board = initBoardPosition();
showBoard(board);

// setup: clear path for bishop
movePiece(board, 'e2', 'e4');
showBoard(board);

// valid diagonal move
testCase('bishop case 1', isBishopMoveLegal(board, 'f1', 'b5') === true);

// invalid horizontal move
testCase('bishop case 2', isBishopMoveLegal(board, 'f1', 'd1') === false);

// capture test setup
movePiece(board, 'b7', 'b5');
showBoard(board);
testCase('bishop case 3', isBishopMoveLegal(board, 'f1', 'b5') === true);

// invalid capture test (own piece)
movePiece(board, 'e4', 'e2');
showBoard(board);
testCase('bishop case 4', isBishopMoveLegal(board, 'f1', 'e2') === false);

console.log('\ntests completed!');
