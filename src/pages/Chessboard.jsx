import React, { useState } from "react";
import { Chess } from "chess.js";
import "./chessboard.css";
import Resultpopup from '../components/resultpopup';

const ChessBoard = ({ boardColor, switchTurn, flipboard }) => {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [promotionInfo, setPromotionInfo] = useState(null); // Stores promotion data
  const [draggedPiece, setDraggedPiece] = useState(null); // Store dragged piece info
  const [gameResult, setGameResult] = useState(null); // Store game result
  const currentPlayer = chess.turn(); // Determine the current player

  const handleSquareClick = (row, col) => {
    const square = String.fromCharCode(97 + col) + (8 - row); // Convert to algebraic notation
    const piece = chess.get(square);

    if (promotionInfo) return; // Block actions during promotion selection

    if (selectedSquare) {
      if (square === selectedSquare) {
        setSelectedSquare(null);
        setValidMoves([]);
      } else if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
        const moves = chess.moves({ square, verbose: true });
        setValidMoves(moves.map((m) => m.to));
      } else {
        const isPromotionMove =
          chess.get(selectedSquare)?.type === "p" &&
          ((chess.turn() === "w" && square.endsWith("8")) ||
            (chess.turn() === "b" && square.endsWith("1")));

        if (isPromotionMove) {
          setPromotionInfo({
            from: selectedSquare,
            to: square,
            color: chess.turn(),
          });
        } else {
          const move = chess.move({ from: selectedSquare, to: square });

          if (move) {
            setBoard(chess.board());
            switchTurn();
            checkGameResult(); // Check for game-ending conditions
          }
          setSelectedSquare(null);
          setValidMoves([]);
        }
      }
    } else if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setValidMoves(moves.map((m) => m.to));
    }
  };

  const handlePromotion = (piece) => {
    if (!promotionInfo) return;

    const { from, to } = promotionInfo;
    chess.move({ from, to, promotion: piece });
    setBoard(chess.board());
    setPromotionInfo(null);
    switchTurn();
    checkGameResult(); // Check for game-ending conditions
  };

  const handleDragStart = (e, square) => {
    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setDraggedPiece({ piece, square });
      e.dataTransfer.setData("text/plain", square); // Store the source square in the drag event
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow the drop
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const targetSquare = String.fromCharCode(97 + col) + (8 - row); // Target square

    if (draggedPiece) {
      const { piece, square } = draggedPiece;

      const move = chess.move({ from: square, to: targetSquare });

      if (move) {
        setBoard(chess.board());
        switchTurn();
        checkGameResult(); // Check for game-ending conditions
      }

      setDraggedPiece(null); // Clear the dragged piece state
    }
  };

  const checkGameResult = () => {
    if (chess.isCheckmate()) {
      setGameResult({
        msg: "Checkmate",
        winner: currentPlayer === "w" ?   "White" :"Black",
      });
    } else if (chess.isStalemate()) {
      setGameResult({ msg: "Stalemate", winner: "None" });
    } else if (chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
      setGameResult({ msg: "Draw", winner: "None" });
    }
  };

  let rotationClass = "none";
  if (flipboard == true) {
    rotationClass = currentPlayer === "w" ? "rotate-0" : "rotate-180";
  }

  return (
    <>
      {gameResult && (
        <Resultpopup msg={gameResult.msg} winner={gameResult.winner} />
      )}
      <div className={`${rotationClass}`}>
      <div className="grid grid-cols-8 grid-rows-8 aspect-square w-[48vw] h-[48vw] rounded-lg board max-md:w-[95vw] max-md:h-[95vw]">

          {board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const isSelected =
                selectedSquare ===
                String.fromCharCode(97 + colIndex) + (8 - rowIndex);
              const isValidMove = validMoves.includes(
                String.fromCharCode(97 + colIndex) + (8 - rowIndex)
              );
              const squareNotation =
                String.fromCharCode(97 + colIndex) + (8 - rowIndex);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex items-center justify-center ${
                    isValidMove ? "border-4 border-yellow-500" : ""
                  } ${isDark ? `${boardColor}-black` : `${boardColor}-white`} ${
                    isSelected ? "border-4 border-green-500" : ""
                  } board`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  onDragOver={(e) => handleDragOver(e)} // Allow drop
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)} // Handle the drop
                >
                  {square && (
                    <div className={`${rotationClass} w-[90%] h-[90%]`}>
                      <img
                        src={`/assets/pieces/${square.color}${square.type}.png`}
                        alt={`${square.color}${square.type}`}
                        className="w-[100%] h-[100%] object-contain cursor-grab"
                        draggable
                        onDragStart={(e) => handleDragStart(e, squareNotation)}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Promotion Modal */}
      {promotionInfo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-center font-bold mb-2">Promote your pawn:</p>
            <div className="flex justify-center space-x-4">
              {["q", "r", "b", "n"].map((piece) => (
                <button
                  key={piece}
                  onClick={() => handlePromotion(piece)}
                  className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
                >
                  <img
                    src={`/assets/pieces/${promotionInfo.color}${piece}.png`}
                    alt={`${promotionInfo.color}${piece}`}
                    className="w-[90%] h-[90%] object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChessBoard;
