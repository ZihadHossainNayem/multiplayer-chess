import {
  initBoardPosition,
  showBoard,
  algebraicToIndex,
  indexToAlgebraic,
  movePiece,
} from "./gameEngine.js";

const board = initBoardPosition();
showBoard(board);

console.log(algebraicToIndex("e2"));
console.log(indexToAlgebraic(6, 4));

console.log("moving piece from d2 to d4");
movePiece(board, "d2", "d3");
showBoard(board);
