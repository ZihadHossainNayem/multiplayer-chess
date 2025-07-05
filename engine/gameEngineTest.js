import {
    initBoardPosition,
    showBoard,
    algebraicToIndex,
    indexToAlgebraic,
    movePiece,
    isPawnMoveLegal,
    isRookMoveLegal,
} from './gameEngine.js';

let board = initBoardPosition();
showBoard(board);

console.log(algebraicToIndex('e2'));
console.log(indexToAlgebraic(6, 4));

// piece moving
console.log('\nmoving piece from d2 to d4');
movePiece(board, 'd2', 'd3');
showBoard(board);

board = initBoardPosition();
showBoard(board);

console.log('\ntesting pawn moves');

// pawn move forward one step
console.log(isPawnMoveLegal(board, 'd2', 'd3') === true ? 'pawn case 1: pass' : 'pawn case 1: fail');

// pawn move forward two steps
console.log(isPawnMoveLegal(board, 'e2', 'e4') === true ? 'pawn case 2: pass' : 'pawn case 2: fail');

// illegal pawn move
console.log(isPawnMoveLegal(board, 'f2', 'f5') === false ? 'pawn case 3: pass' : 'pawn case 3: fail');

// pawn capture move
movePiece(board, 'f7', 'f3');
console.log(isPawnMoveLegal(board, 'e2', 'f3') === true ? 'pawn case 4: pass' : 'pawn case 4: fail');

// invalid capture
console.log(isPawnMoveLegal(board, 'e2', 'd3') === false ? 'pawn case 5: pass' : 'pawn case 5: fail');

console.log('\ntesting rook moves');
board = initBoardPosition();
showBoard(board);

movePiece(board, 'h2', 'h4');
movePiece(board, 'h4', 'h5');
showBoard(board);

// rook moves up
console.log(isRookMoveLegal(board, 'h1', 'h3') === true ? 'rook case 1: pass' : 'rook case 1: fail');

// rook block by own piece
console.log(isRookMoveLegal(board, 'h1', 'f1') === false ? 'rook case 2: pass' : 'rook case 2: fail');

// illegal diagonal move
console.log(isRookMoveLegal(board, 'h1', 'g2') === false ? 'rook case 3: pass' : 'rook case 3:fail');

// capture test
movePiece(board, 'h1', 'h3');
movePiece(board, 'g8', 'h6');
movePiece(board, 'h5', 'g3');
showBoard(board);
console.log(isRookMoveLegal(board, 'h3', 'h6') === true ? 'rook case 4: pass' : 'rook case 4: fail');

// invalid capture test
movePiece(board, 'f1', 'h7');
showBoard(board);
console.log(isRookMoveLegal(board, 'h3', 'h7') === false ? 'rook case 5: pass' : 'rook case 5: fail');
