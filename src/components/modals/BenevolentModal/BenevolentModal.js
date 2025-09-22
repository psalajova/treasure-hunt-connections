import React from "react";
import BaseModal from "../BaseModal";

function BenevolentModal({ open, onResetGame }) {
    return (
        <BaseModal
            title="Don't Give Up!"
            initiallyOpen={open}
            actionButtonText="Try Again"
            onActionButtonClick={onResetGame}
            showActionButton={true}
        >
            <div className="text-center">
                <p className="text-lg font-[500] mb-4">
                    You've made a mistake 4 times, but we are benevolent, and so you may try again...
                </p>
            </div>
        </BaseModal>
    );
}

export default BenevolentModal;
