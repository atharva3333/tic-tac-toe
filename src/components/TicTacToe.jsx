import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('ticTacToeState');
    if (savedState) {
      const { board, xIsNext } = JSON.parse(savedState);
      setBoard(board);
      setXIsNext(xIsNext);
    }
  }, []);

  const handleClick = (index) => {
    if (calculateWinner(board) || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);

  useEffect(() => {
    const gameState = JSON.stringify({ board, xIsNext });
    localStorage.setItem('ticTacToeState', gameState);
  }, [board, xIsNext]);

  const handleSaveState = () => {
    const gameState = JSON.stringify({ board, xIsNext });
    const blob = new Blob([gameState], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticTacToeState.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadState = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const loadedState = JSON.parse(e.target.result);
        setBoard(loadedState.board);
        setXIsNext(loadedState.xIsNext);
      };
      reader.readAsText(file);
    }
  };

  const handleClearState = () => {
    localStorage.removeItem('ticTacToeState');
    setBoard(initialBoard);
    setXIsNext(true);
  };

  return (
    <div className="w-1/2 mx-auto mt-4">
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <div
            key={index}
            className="bg-gray-200 flex items-center justify-center h-16 text-3xl cursor-pointer"
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        {winner ? (
          <div className="text-2xl text-green-600">Winner: {winner}</div>
        ) : (
          <div className="text-2xl">Next Player: {xIsNext ? 'X' : 'O'}</div>
        )}
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSaveState}
        >
          Save State
        </button>
        <input
          type="file"
          accept=".json"
          onChange={handleLoadState}
          className="ml-4"
        />
        <button
          className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClearState}
        >
          Clear State
        </button>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default TicTacToe;
