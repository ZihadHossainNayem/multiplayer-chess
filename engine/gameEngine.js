export const initBoardPosition = () => {
  return [
    ["bRK", "bKN", "bBP", "bQN", "bKG", "bBP", "bKN", "bRK"], // black piece
    ["bPN", "bPN", "bPN", "bPN", "bPN", "bPN", "bPN", "bPN"], // black piece
    ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
    ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
    ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
    ["   ", "   ", "   ", "   ", "   ", "   ", "   ", "   "],
    ["wPN", "wPN", "wPN", "wPN", "wPN", "wPN", "wPN", "wPN"], // white piece
    ["wRK", "wKN", "wBP", "wQN", "wKG", "wBP", "wKN", "wRK"], // white piece
  ];
};

export const showBoard = (board) => {
  console.log("current board:\n");
  for (let row of board) {
    console.log(row.join(" | "));
  }
};

export const algebraicToIndex = (position) => {
  const colChar = position[0];
  const rowChar = position[1];

  const col = colChar.charCodeAt(0) - "a".charCodeAt(0); // 'a'-'h' to 0-7
  const row = 8 - parseInt(rowChar); // '1'-'8' to 7-0

  return [row, col];
};

export const indexToAlgebraic = (row, col) => {
  const colChar = String.fromCharCode("a".charCodeAt(0) + col); // 0-7 to 'a'-'h'
  const rowChar = 8 - row; // 7-0 to '1'-'8'

  return colChar + rowChar;
};

export const movePiece = (board, from, to) => {
  const [fromRow, fromCol] = algebraicToIndex(from);
  const [toRow, toCol] = algebraicToIndex(to);

  // piece at the starting position
  const piece = board[fromRow][fromCol];

  // piece to new position
  board[toRow][toCol] = piece;

  // clear its previous position
  board[fromRow][fromCol] = "   ";

  return board;
};

export const isPawnMoveLegal = (board, from, to) => {
  const [fromRow, fromCol] = algebraicToIndex(from);
  const [toRow, toCol] = algebraicToIndex(to);

  const piece = board[fromRow][fromCol];
  const color = piece[0]; // 'w' or 'b'

  const direction = color === "w" ? -1 : 1; // white move up -1, black moves down +1
  const startRow = color === "w" ? 6 : 1;

  const diffRow = toRow - fromRow;
  const diffCol = toCol - fromCol;

  // pawn normal move: 1 step forward, (to) must be empty
  if (diffCol === 0 && diffRow === direction && board[toRow][toCol] === "   ") {
    return true;
  }

  // first pawn move: 2 steps forward
  if (
    diffCol === 0 &&
    diffRow === 2 * direction &&
    fromRow === startRow &&
    board[fromRow + direction][fromCol] === "   " &&
    board[toRow][toCol] === "   "
  ) {
    return true;
  }

  // capture move: diagonal 1 step, opponent piece present
  if (
    Math.abs(diffCol) === 1 && // diagonal to left or right
    diffRow === direction &&
    board[toRow][toCol] !== "   " &&
    board[toRow][toCol][0] !== color // opponents piece
  ) {
    return true;
  }
};
