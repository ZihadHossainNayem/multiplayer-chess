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
