"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Unlock, RefreshCw, Key } from "lucide-react";
import { decryptFunction } from "@/lib/utils/decryptFunction";

export default function DecryptorTerminal({ showHighlights }) {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [glitchText, setGlitchText] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [accessStatus, setAccessStatus] = useState("WAITING FOR INPUT");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRandomChar = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Generate scrambled version of text
  const generateScrambledText = (original, progress) => {
    if (!original) return "";

    return original
      .split("")
      .map((char, index) => {
        // Characters up to the progress point are revealed
        if (index < original.length * (progress / 100)) {
          return char;
        }
        // Rest are scrambled
        return getRandomChar();
      })
      .join("");
  };

  // Handle decryption process with animation
  const handleDecrypt = () => {
    if (!text || !key || isDecrypting) return;

    setIsDecrypting(true);
    setAccessStatus("DECRYPTION IN PROGRESS");
    setDecryptionProgress(0);

    // Try to decrypt using the imported function
    let decryptedResult;
    try {
      decryptedResult = decryptFunction(text, key);

      if (!decryptedResult) {
        setIsDecrypting(false);
        setAccessStatus("INVALID KEY OR DATA");
        return;
      }
    } catch (err) {
      setIsDecrypting(false);
      setAccessStatus("DECRYPTION ERROR");
      return;
    }

    // Start animation sequence
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setDecryptionProgress(progress);

      // Update scrambled text during animation
      if (progress < 100) {
        // Start with scrambled text of the actual decrypted result
        setGlitchText(generateScrambledText(decryptedResult, progress));
      } else {
        // When animation completes, show the actual decrypted result
        setGlitchText(decryptedResult);
        clearInterval(interval);
        setIsDecrypting(false);
        setAccessStatus("DECRYPTION COMPLETE");
        setText(decryptedResult); // Update the text area with decrypted content
      }
    }, 50);
  };

  return (
    <motion.div
      className={`border-2 rounded border-emerald-700 w-full lg:w-2/5 relative overflow-hidden bg-emerald-700/10 transition-all duration-500 ${
        showHighlights ? "blur-sm opacity-40" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 h-[calc(100%-3rem)] flex flex-col text-emerald-400 bg-emerald-900/5">
        {/* Status header */}
        <div className="flex justify-between items-center mb-3 border-b border-emerald-700 pb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isDecrypting
                  ? "bg-yellow-500 animate-pulse"
                  : accessStatus === "DECRYPTION COMPLETE"
                  ? "bg-emerald-500"
                  : accessStatus === "DECRYPTION ERROR"
                  ? "bg-red-500"
                  : "bg-red-700"
              }`}
            ></div>
            <span className="text-sm">{accessStatus}</span>
          </div>
          <motion.div
            className="text-xs"
            animate={{ opacity: isDecrypting ? [0.5, 1, 0.5] : 1 }}
            transition={{ repeat: isDecrypting ? Infinity : 0, duration: 1.5 }}
          >
            {isDecrypting ? `${decryptionProgress}%` : "READY"}
          </motion.div>
        </div>

        {/* Main terminal area */}
        <div className="flex-1 flex flex-col">
          <motion.div
            className="flex-1 relative border-2 border-emerald-700  bg-emerald-900/5 flex flex-col overflow-x-clip"
            animate={{
              borderColor: isDecrypting
                ? "#eab308"
                : accessStatus === "DECRYPTION COMPLETE"
                ? "#10b981"
                : accessStatus === "DECRYPTION ERROR"
                ? "#ef4444"
                : "#047857",
              boxShadow: isDecrypting
                ? "0 0 10px 0 rgba(234, 179, 8, 0.3)"
                : accessStatus === "DECRYPTION COMPLETE"
                ? "0 0 10px 0 rgba(16, 185, 129, 0.3)"
                : accessStatus === "DECRYPTION ERROR"
                ? "0 0 10px 0 rgba(239, 68, 68, 0.3)"
                : "none",
            }}
          >
            {/* Terminal content */}
            <div className="flex-1 p-3 lg:overflow-hidden">
              {isDecrypting ? (
                <motion.div
                  className="text-emerald-400 whitespace-pre-wrap break-all text-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                >
                  {glitchText}
                </motion.div>
              ) : (
                <textarea
                  className="w-full h-full bg-transparent text-emerald-400 outline-none resize-none  text-sm "
                  placeholder="Enter text to decrypt..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isDecrypting}
                />
              )}
            </div>

            {/* Progress bar */}
            {isDecrypting && (
              <motion.div
                className="h-1 bg-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: `${decryptionProgress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            )}
          </motion.div>

          {/* Key input and decrypt button container */}
          <div className="mt-4 flex gap-3">
            {/* Key input field */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={16} className="text-emerald-700" />
              </div>
              <input
                type="password"
                className="w-full bg-emerald-700/10 border-2 border-emerald-700 pl-10 pr-3 py-3 text-sm  text-emerald-400 outline-none"
                placeholder="Enter decryption key..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={isDecrypting}
              />
            </div>

            {/* Decrypt button */}
            <motion.button
              className="bg-emerald-900 border-2 border-emerald-700 px-4 py-3 text-sm flex justify-center items-center gap-2 disabled:opacity-50 min-w-[140px] cursor-pointer"
              onClick={handleDecrypt}
              disabled={isDecrypting || !text || !key}
              whileHover={{ backgroundColor: "#065f46" }}
              whileTap={{ scale: 0.98 }}
            >
              {isDecrypting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>DECRYPTING</span>
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  <span>DECRYPT</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
