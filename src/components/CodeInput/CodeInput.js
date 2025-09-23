import React, { useState, useRef } from "react";
import "./CodeInput.module.css";

function CodeInput({ onCorrectCode }) {
    const [code, setCode] = useState(["", "", "", ""]);
    const [isShaking, setIsShaking] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        // Clear error message when user starts typing again
        if (errorMessage) {
            setErrorMessage("");
        }

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only take the last digit if multiple are entered
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if code is complete
        if (newCode.every(digit => digit !== "") && newCode.join("") === "1442") {
            onCorrectCode();
        } else if (newCode.every(digit => digit !== "") && newCode.join("") !== "1442") {
            // Wrong code - shake and show error, but don't clear the code
            setIsShaking(true);
            setErrorMessage("Wrong code, try again");
            setTimeout(() => {
                setIsShaking(false);
            }, 1000);
        }
    };

    const handleKeyDown = (index, e) => {
        // Clear error message when user starts deleting
        if (e.key === "Backspace" && errorMessage) {
            setErrorMessage("");
        }

        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className={`code-input-container ${isShaking ? 'shake' : ''}`}>
                    <div className="flex gap-4 justify-center mb-4">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-16 h-16 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                maxLength="1"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-lg font-medium">{errorMessage}</p>
                )}
            </div>
        </div>
    );
}

export default CodeInput;
