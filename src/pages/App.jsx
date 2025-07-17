import { useState } from "react";
import "./App.css";
import SettingsPopup from "../components/SettingsPopup";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import GameScreen from "./gameScreen"; // Update with the correct path
function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [settings, setSettings] = useState({ board: "blue", timer: "10 min" });
  const navigate = useNavigate();
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };


  const handleStart = () => {
    if (player1 && player2) {
      navigate("/gamescreen", { state: { player1, player2, settings } });
    } else {
      alert("Please enter names for both players!");
    }
  };
  

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
  };
  return (
    <>
      <div className="w-full h-screen " id="black-sheet">
        <video className="w-[100%] h-[100vh]" autoPlay muted loop>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* form */}
      <div className="fomr-container flex justify-start items-center flex-col">
        <div className="inputs flex justify-center items-center flex-col gap-3">
          <input
            type="text"
            id="player1"
            placeholder="PLAYER 1 (White)"
            maxlength="16"
            autoComplete="off"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <input
            type="text"
            id="player2"
            placeholder="PLAYER 2 (Black)"
            maxlength="16"
            autoComplete="off"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            
          />
          <button className="btn" onClick={handleStart}>START</button>
        </div>
        <button className="w-9 text-right settings" onClick={toggleSettings}>
          <img src="/assets/Group 2.svg" alt="settings" />
        </button>
      </div>
      {/* Settings Popup */}
      <SettingsPopup isVisible={showSettings} onClose={toggleSettings} onSaveSettings={saveSettings} />
    </>
  );
}

  function AppWrapper() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/gamescreen" element={<GameScreen />} />
        </Routes>
      </Router>
    );
}

export default AppWrapper;
