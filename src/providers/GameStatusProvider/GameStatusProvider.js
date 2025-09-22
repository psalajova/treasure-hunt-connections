import React from "react";
import { MAX_MISTAKES } from "../../lib/constants";
import { PuzzleDataContext } from "../PuzzleDataProvider";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from "../../lib/local-storage";
import {
  isGameDataEquivalent,
  isGuessesFromGame,
} from "../../lib/game-helpers";
export const GameStatusContext = React.createContext();

function GameStatusProvider({ children }) {
  const { gameData } = React.useContext(PuzzleDataContext);

  // Clear any existing local storage on app load for fresh treasure hunt experience
  React.useEffect(() => {
    localStorage.removeItem('gameState');
  }, []);

  const [submittedGuesses, setSubmittedGuesses] = React.useState([]);
  const [solvedGameData, setSolvedGameData] = React.useState(() => {
    // For the treasure hunt, always start fresh - don't load from local storage
    // This ensures the puzzle always starts unsolved
    return [];
  });

  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isGameWon, setIsGameWon] = React.useState(false);
  const [guessCandidate, setGuessCandidate] = React.useState([]);
  const [showBenevolentModal, setShowBenevolentModal] = React.useState(false);

  const numMistakesUsed = submittedGuesses.length - solvedGameData.length;

  // use effect to check if game is won
  React.useEffect(() => {
    if (solvedGameData.length === gameData.length) {
      setIsGameOver(true);
      setIsGameWon(true);
    }
    // Don't save to local storage for treasure hunt - always start fresh
  }, [solvedGameData]);

  // use effect to check if all mistakes have been used and show benevolent modal
  React.useEffect(() => {
    if (numMistakesUsed >= MAX_MISTAKES && !isGameWon) {
      setShowBenevolentModal(true);
    }
    // Don't save to local storage for treasure hunt - always start fresh
  }, [submittedGuesses]);

  const resetGame = () => {
    setSubmittedGuesses([]);
    setSolvedGameData([]);
    setIsGameOver(false);
    setIsGameWon(false);
    setShowBenevolentModal(false);
    setGuessCandidate([]);
    // No local storage for treasure hunt - just reset state
  };

  return (
    <GameStatusContext.Provider
      value={{
        isGameOver,
        isGameWon,
        numMistakesUsed,
        solvedGameData,
        setSolvedGameData,
        submittedGuesses,
        setSubmittedGuesses,
        guessCandidate,
        setGuessCandidate,
        showBenevolentModal,
        setShowBenevolentModal,
        resetGame,
      }}
    >
      {children}
    </GameStatusContext.Provider>
  );
}

export default GameStatusProvider;
