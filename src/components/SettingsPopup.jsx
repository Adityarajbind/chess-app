import React, { useState } from "react";
import "./SettingsPopup.css";

const SettingsPopup = ({ isVisible, onClose, onSaveSettings }) => {
  const [selectedBoard, setSelectedBoard] = useState("blue");
  const [selectedTimer, setSelectedTimer] = useState("10:00");
  const [flipboard, setFlipboard] = useState(false);

  if (!isVisible) return null;

  const saveSettings = () => {
    onSaveSettings({
      board: selectedBoard,
      timer: selectedTimer,
      flipboard: flipboard,
    });
    onClose();
  };

  return (
    <div className="settings-popup fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-zinc-800 py-2 px-4 rounded shadow-lg w-[50%] h-[80vh] relative text-white">
        <div className="heading flex justify-between items-center h-[10%] w-full">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            className="text-lg font-bold hover:bg-zinc-700 w-5 h-5 flex justify-center items-center rounded-full"
            onClick={onClose}
          >
            <img src="/assets/cross.svg" alt="close" className="invert" />
          </button>
        </div>

        <div className="chess_board w-full">
          <div className="text-2xl">Chess Board:</div>
          <div className="flex justify-around">
            {["blue", "green", "brown", "purple"].map((color) => (
              <button
                key={color}
                className={`board_option ${
                  selectedBoard === color ? "border-2 border-white" : ""
                }`}
                onClick={() => setSelectedBoard(color)}
              >
                <img
                  className="rounded-[0.25rem] w-[90%]"
                  src={`/assets/${color}.svg`}
                  alt={color}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="timer rounded-md hover:bg-zinc-600 p-2 mt-4">
          <label htmlFor="time" className="text-2xl">
            Timers:
          </label>
          <select
            name="time"
            id="time"
            className="bg-zinc-700 text-white w-1/6 h-10 font-bold rounded-md outline-none cursor-pointer"
            value={selectedTimer}
            onChange={(e) => setSelectedTimer(e.target.value)}
          >
            {["1:00", "3:00", "5:00", "10:00", "30:00"].map((option) => {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>

        <div className="rounded-md hover:bg-zinc-600 p-2 mt-4">
          <label htmlFor="flipboard" className="text-2xl">
            FlipBoard:
          </label>
          <select
            name="flipboard"
            id="flipboard"
            className="bg-zinc-700 text-white w-1/8 h-10 font-bold rounded-md outline-none cursor-pointer p-1"
            value={flipboard}
            onChange={(e) => setFlipboard(e.target.value === "true")}
          >
            <option value="true">On</option>
            <option value="false">Off</option>
          </select>
        </div>

        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={saveSettings}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsPopup;
