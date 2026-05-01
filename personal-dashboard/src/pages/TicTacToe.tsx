import { useState, useCallback } from "react";

type Cell = "X" | "O" | null;

function checkWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const result = checkWinner(board);
  const isDraw = !result && board.every(Boolean);
  const winLine = result?.line ?? [];

  const handleClick = useCallback((i: number) => {
    if (board[i] || gameOver || result || isDraw) return;
    const newBoard = [...board];
    newBoard[i] = currentPlayer;
    setBoard(newBoard);

    const newResult = checkWinner(newBoard);
    if (newResult) {
      setScores((prev) => ({ ...prev, [newResult.winner!]: prev[newResult.winner as "X" | "O"] + 1 }));
      setHistory((prev) => [`${newResult.winner} wins!`, ...prev].slice(0, 5));
      setGameOver(true);
    } else if (newBoard.every(Boolean)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      setHistory((prev) => ["Draw!", ...prev].slice(0, 5));
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }, [board, currentPlayer, gameOver, result, isDraw]);

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameOver(false);
  }, []);

  const resetAll = useCallback(() => {
    reset();
    setScores({ X: 0, O: 0, draws: 0 });
    setHistory([]);
  }, [reset]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6 fade-up">
          <h2 className="text-2xl font-bold text-foreground">Tic-Tac-Toe</h2>
          <p className="text-muted-foreground text-sm">Classic strategy game</p>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 mb-6 fade-up">
          <div className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Player X</p>
            <p className="text-2xl font-bold game-x">{scores.X}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Draws</p>
            <p className="text-2xl font-bold text-muted-foreground">{scores.draws}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Player O</p>
            <p className="text-2xl font-bold game-o">{scores.O}</p>
          </div>
        </div>

        {/* Status */}
        <div className={`mb-5 py-2.5 px-4 rounded-xl text-center text-sm font-semibold fade-up transition-all ${
          result ? "bg-primary/20 text-primary border border-primary/30" :
          isDraw ? "bg-muted text-muted-foreground" :
          "bg-card border border-border text-foreground"
        }`}>
          {result ? `Player ${result.winner} wins! 🎉` :
           isDraw ? "It's a draw! 🤝" :
           `Player ${currentPlayer}'s turn`}
        </div>

        {/* Board */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-5 fade-up">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, i) => {
              const isWinCell = winLine.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`aspect-square rounded-xl text-4xl font-black flex items-center justify-center transition-all border-2 ${
                    cell === null && !gameOver
                      ? "cell-hover border-border bg-secondary/50 hover:border-primary/40"
                      : "cursor-default border-transparent"
                  } ${isWinCell ? "bg-primary/20 border-primary" : ""} ${
                    cell === "X" ? "game-x" : cell === "O" ? "game-o" : ""
                  }`}
                >
                  {cell && (
                    <span className={`fade-up ${isWinCell ? "scale-110" : ""}`}>{cell}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-5 fade-up">
          <button
            onClick={reset}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            New Game
          </button>
          <button
            onClick={resetAll}
            className="flex-1 py-2.5 bg-secondary text-foreground border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            Reset Scores
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4 fade-up">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Recent Results</p>
            {history.map((h, i) => (
              <div key={i} className={`text-xs py-1 ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {i + 1}. {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
