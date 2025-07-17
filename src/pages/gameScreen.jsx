import React, { useState, useEffect } from 'react';
import ChessBoard from "./Chessboard";
import { useLocation } from "react-router-dom";
import Resultpopup from '../components/resultpopup';

const GameScreen = () => {
  const location = useLocation();
  const { player1 = "Player 1", player2 = "Player 2", settings = {} } = location.state || {};

  const parseTime = (timeString) => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + (seconds || 0);
  };

  const timerValue = settings.timer === "10 min" ? "10:00" : settings.timer;
  const initialTime = parseTime(timerValue || "10:00");

  const [player1Time, setPlayer1Time] = useState(initialTime);
  const [player2Time, setPlayer2Time] = useState(initialTime);
  const [activePlayer, setActivePlayer] = useState("player1");
  const [gameResult, setGameResult] = useState(null); // Store game result

  useEffect(() => {
    const timer = setInterval(() => {
      if (activePlayer === "player1" && player1Time > 0) {
        setPlayer1Time((prev) => Math.max(prev - 1, 0));
      } else if (activePlayer === "player2" && player2Time > 0) {
        setPlayer2Time((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activePlayer, player1Time, player2Time]);

  useEffect(() => {
    if (player1Time === 0) {
      setGameResult({
        msg: "Checkmate",
        winner: "Black",
      });
    } else if (player2Time === 0) {
      setGameResult({
        msg: "Checkmate",
        winner: "White",
      });
    }
  }, [player1Time, player2Time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const switchTurn = () => {
    setActivePlayer((prev) => (prev === "player1" ? "player2" : "player1"));
  };

  return (
    <>
      <main className="w-full h-screen flex justify-around items-center">
        <div
          className={`nameplate w-52 h-20 rounded-lg ${
            activePlayer === "player1" ? "bg-slate-900" : "bg-slate-700"
          }`}
        >
          <div className="player1">
            <div className="text-4xl text-center text-yellow-50" style={{ fontWeight: "500" }}>
              {player1}
            </div>
            <div className="text-2xl text-center text-yellow-100">{formatTime(player1Time)}</div>
          </div>
        </div>
        {gameResult && (
          <Resultpopup msg={gameResult.msg} winner={gameResult.winner} />
        )}
        <ChessBoard boardColor={settings?.board || "blue"} switchTurn={switchTurn} flipboard={settings.flipboard} />
        <div
          className={`nameplate w-52 h-20 rounded-lg ${
            activePlayer === "player2" ? "bg-slate-900" : "bg-slate-700"
          }`}
        >
          <div className="player2">
            <div className="text-4xl text-center text-yellow-50" style={{ fontWeight: "500" }}>
              {player2}
            </div>
            <div className="text-2xl text-center text-yellow-100">{formatTime(player2Time)}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default GameScreen;
