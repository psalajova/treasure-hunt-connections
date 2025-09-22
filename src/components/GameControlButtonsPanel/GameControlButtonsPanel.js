import React from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Shuffle, Undo, SendHorizontal } from "lucide-react";
import {
  isGuessCorrect,
  isGuessRepeated,
  shuffleGameData,
} from "../../lib/game-helpers";

import { GameStatusContext } from "../../providers/GameStatusProvider";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";

function GameControlButtonsPanel({
  shuffledRows,
  setShuffledRows,
  setGridShake,
}) {
  const {
    isGameOver,
    guessCandidate,
    setGuessCandidate,
    submittedGuesses,
    setSubmittedGuesses,
    solvedGameData,
    setSolvedGameData,
  } = React.useContext(GameStatusContext);
  const { gameData, categorySize } = React.useContext(PuzzleDataContext);
  const { toast } = useToast();

  function deselectAll() {
    setGuessCandidate([]);
  }

  function submitCandidateGuess() {
    // check that its a valid guess by size
    if (guessCandidate.length !== categorySize) {
      return;
    }
    // check that the guess hasnt already been submitted previously
    if (isGuessRepeated({ submittedGuesses, guessCandidate })) {
      toast({
        label: "Notification",
        title: "Repeated Guess",
        description: "You previously made this guess!",
      });

      return;
    }
    // check if the guess is correct
    const {
      isCorrect,
      correctWords,
      correctCategory,
      isGuessOneAway,
      correctDifficulty,
      correctImageSrc,
    } = isGuessCorrect({
      guessCandidate,
      gameData,
    });

    // if the guess is correct:
    // set it as solved in game data
    if (isCorrect) {
      setSolvedGameData([
        ...solvedGameData,
        {
          category: correctCategory,
          words: correctWords,
          difficulty: correctDifficulty,
          imageSrc: correctImageSrc,
        },
      ]);
      setGuessCandidate([]);
    } else {
      // Only add to submitted guesses if it's not a repeated "one away" guess
      const lastGuess = submittedGuesses[submittedGuesses.length - 1];
      const isSameAsLastGuess = lastGuess &&
        lastGuess.length === guessCandidate.length &&
        lastGuess.every(word => guessCandidate.includes(word));

      // Check if last guess was also "one away" with same words
      let wasLastGuessOneAway = false;
      if (lastGuess) {
        const lastGuessResult = isGuessCorrect({ guessCandidate: lastGuess, gameData });
        wasLastGuessOneAway = lastGuessResult.isGuessOneAway;
      }

      // Only count as new mistake if it's not the same "one away" guess as before
      if (!isSameAsLastGuess || !isGuessOneAway || !wasLastGuessOneAway) {
        setSubmittedGuesses([...submittedGuesses, guessCandidate]);
      }

      // Shake the grid to give feedback that they were wrong
      setGridShake(true);
      if (isGuessOneAway) {
        toast({
          label: "Notification",
          title: "One Off",
          description:
            "You were one word away from correctly guessing a category!",
        });
      }
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        disabled={isGameOver}
        variant="secondary"
        onClick={() =>
          setShuffledRows(shuffleGameData({ gameData: shuffledRows }))
        }
      >
        <Shuffle className="h-4 w-4 mr-2" strokeWidth={1} />
        <p className="select-none">Shuffle</p>
      </Button>
      <Button
        size="deselectallsize"
        disabled={isGameOver}
        variant="secondary"
        onClick={deselectAll}
      >
        <Undo className="h-4 w-4 mr-2" strokeWidth={1} />
        <p className="select-none">Deselect All</p>
      </Button>
      <Button
        variant="submit"
        onClick={submitCandidateGuess}
        disabled={isGameOver || guessCandidate.length !== categorySize}
      >
        <SendHorizontal className="h-4 w-4 mr-2" strokeWidth={1} />
        <p className="select-none">Submit</p>
      </Button>
    </div>
  );
}

export default GameControlButtonsPanel;
