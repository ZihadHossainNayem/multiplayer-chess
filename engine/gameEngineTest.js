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
