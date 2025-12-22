import React, { useState } from "react";
import "./resultpopup.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

const resultpopup = ({ winner, msg }) => {
  const navigate = useNavigate();

  let message;

  if (msg === "Checkmate") {
    message = <div className="msg">{winner} Won</div>;
  } else if (msg === "stalemate") {
    message = <div className="msg">Stalemate</div>;
  } else if (msg === "Draw") {
    message = <div className="msg">Draw</div>;
  }

  const handleclick = (route) => {
    navigate(route);
  };

  const handlerestart = (route) => {
    window.location.reload();
  };
  return (
    <div className="w-4/5 md:w-1/4 bg-gray-500 rounded-lg p-6 shadow-lg text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {message}
      <div className="btns">
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => handlerestart("/gamescreen")}
        >
          Playagain
        </button>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => handleclick("/")}
        >
          Quit
        </button>
      </div>
    </div>
  );
};

export default resultpopup;
