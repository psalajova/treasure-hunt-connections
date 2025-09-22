import React from "react";
import BaseModal from "../BaseModal";
import { PuzzleDataContext } from "../../../providers/PuzzleDataProvider";

function GameWonModal({ open, submittedGuesses }) {
  const { gameData } = React.useContext(PuzzleDataContext);

  // Sort categories by difficulty to ensure correct order (yellow->green->blue->purple)
  const sortedCategories = [...gameData].sort((a, b) => a.difficulty - b.difficulty);

  return (
    <BaseModal
      title="Hádanka vyriešená!"
      initiallyOpen={open}
      showActionButton={false}
    >
      <div className="text-center">
        <div className="text-lg font-medium text-gray-700 mb-6 leading-relaxed">
          Keď hádanku už vyriešiš,<br />
          čo si dáš presne zistíš,<br />
          zdvihni oči zo stránky,<br />
          a spýtaj sa servírky.
        </div>

        <div className="space-y-3">
          {sortedCategories.map((category, index) => (
            <div key={category.category} className="text-lg font-bold">
              {index + 1}. {category.category}
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}

export default GameWonModal;
