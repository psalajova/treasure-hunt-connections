import React, { useState } from "react";
import Header from "../Header";
import Game from "../Game";
import CodeInput from "../CodeInput";

import { Toaster } from "../ui/toaster";
import PuzzleDataProvider from "../../providers/PuzzleDataProvider";
import GameStatusProvider from "../../providers/GameStatusProvider";

function App() {
  const [isCodeEntered, setIsCodeEntered] = useState(false);

  const handleCorrectCode = () => {
    setIsCodeEntered(true);
  };

  if (!isCodeEntered) {
    return <CodeInput onCorrectCode={handleCorrectCode} />;
  }

  return (
    <PuzzleDataProvider>
      <GameStatusProvider>
        <div className="wrapper">
          <Toaster />
          <Header />
          <Game />
        </div>
      </GameStatusProvider>
    </PuzzleDataProvider>
  );
}

export default App;
