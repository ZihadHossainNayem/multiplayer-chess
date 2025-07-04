import {
  initBoardPosition,
  showBoard,
  algebraicToIndex,
  indexToAlgebraic,
  movePiece,
  isPawnMoveLegal,
} from "./gameEngine.js";

let board = initBoardPosition();
showBoard(board);

console.log(algebraicToIndex("e2"));
console.log(indexToAlgebraic(6, 4));

console.log("\nmoving piece from d2 to d4");
movePiece(board, "d2", "d3");
showBoard(board);

board = initBoardPosition();
showBoard(board);

console.log("\ntesting pawn moves");

// pawn move forward one step
console.log(
  isPawnMoveLegal(board, "d2", "d3") === true ? "case 1: pass" : "case 1: fail"
);

// pawn move forward two steps
console.log(
  isPawnMoveLegal(board, "e2", "e4") === true ? "case 2: pass" : "case 2: fail"
);

// illegal pawn move
console.log(
  isPawnMoveLegal(board, "f2", "f5") == true ? "case 3: pass" : "case 4: fail"
);

// pawn capture move
const [row, col] = algebraicToIndex("f3");
board[row][col] = "bBP";
console.log(
  isPawnMoveLegal(board, "e2", "f3") === true ? "case 4: pass" : "case 4: fail"
);

// invalid capture
console.log(
  isPawnMoveLegal(board, "e2", "d3") === true ? "case 5: pass" : "case 5: fail"
);
