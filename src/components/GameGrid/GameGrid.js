import React from "react";

import WordButton from "../WordButton";

import * as styles from "./GameGrid.module.css";

import { useSpring, animated } from "react-spring";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { GameStatusContext } from "../../providers/GameStatusProvider";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";

function WordRow({ words }) {
  return (
    <div className={`grid grid-cols-4 gap-3`}>
      {words.map((word) => (
        <WordButton key={word} word={word} fullCandidateSize={words.length} />
      ))}
    </div>
  );
}

export function SolvedWordRow({ ...props }) {
  const DIFFICULTY_COLOR_MAP = {
    1: "#ffeb3b", // yellow - ČAROVNÝ
    2: "#6acb66", // green - ČAJ
    3: "#53aefb", // blue - BEZ__
    4: "#a45cb9", // purple - __CUKOR(-ru)
  };

  const color = `${DIFFICULTY_COLOR_MAP[props.difficulty]}`;

  const [hasBeenClicked, setHasBeenClicked] = React.useState(false);

  const springProps = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(100%) scale(0.8)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0%) scale(1.1)",
    },
    delay: 250,
  });
  // if there is an image available render it as a popover
  const isImageAvailable = props.imageSrc != null;
  return (
    <animated.div style={springProps} className="mb-2">
      {!isImageAvailable ? (
        <div style={{ backgroundColor: color, borderRadius: 12 }} className="py-4 px-6">
          <p className="font-bold text-xl mb-1">{props.category}</p>
          <p className="font-medium text-lg">{props.words.join(", ")}</p>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="cursor-pointer hover:animate-pulse shadow-md py-4 px-6"
              style={{ backgroundColor: color, borderRadius: 12 }}
              onClick={() => setHasBeenClicked(true)}
            >
              {!hasBeenClicked && (
                <Badge className="animate-pulse absolute top-0 right-0 mr-2 mt-2">
                  View More
                </Badge>
              )}
              <p className="font-bold text-xl mb-1">{props.category}</p>
              <p className="font-medium text-lg">{props.words.join(", ")}</p>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <img src={props.imageSrc} />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </animated.div>
  );
}

function GameGrid({ gameRows, shouldGridShake, setShouldGridShake }) {
  const { submittedGuesses, isGameOver, isGameWon, solvedGameData } =
    React.useContext(GameStatusContext);

  const { gameData } = React.useContext(PuzzleDataContext);

  React.useEffect(() => {
    const shakeEffect = window.setTimeout(() => {
      setShouldGridShake(false);
      // this timeout should probably be calculated since it depends on animation values for the grid shake
    }, 2000);

    // cleanup timeout
    return () => window.clearTimeout(shakeEffect);
  }, [submittedGuesses]);

  const isGameOverAndLost = isGameOver && !isGameWon;
  const isGameOverAndWon = isGameOver && isGameWon;
  const isGameActive = !isGameOver;
  const isGameActiveWithAnySolvedRows =
    isGameActive && solvedGameData.length > 0;

  // Sort solved categories by difficulty to ensure correct order (yellow->green->blue->purple)
  const sortedSolvedData = [...solvedGameData].sort((a, b) => a.difficulty - b.difficulty);
  const sortedGameData = [...gameData].sort((a, b) => a.difficulty - b.difficulty);

  return (
    <div>
      {(isGameOverAndWon || isGameActiveWithAnySolvedRows) && (
        <div className="grid gap-y-3 pb-4">
          {sortedSolvedData.map((solvedRowObj) => (
            <SolvedWordRow key={solvedRowObj.category} {...solvedRowObj} />
          ))}
        </div>
      )}
      {isGameActive && (
        <div className={`grid gap-y-3 ${shouldGridShake ? styles.shake : ""}`}>
          {gameRows.map((row, idx) => (
            <WordRow key={idx} words={row} />
          ))}
        </div>
      )}
      {/* Show correct answers here after the game is over if they lost */}
      {isGameOverAndLost && (
        <div className="grid gap-y-3 pb-4">
          <p className="text-lg font-medium mb-4">The answer categories are below.</p>
          {sortedGameData.map((obj) => (
            <SolvedWordRow key={obj.category} {...obj} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GameGrid;
