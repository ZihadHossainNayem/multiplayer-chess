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
