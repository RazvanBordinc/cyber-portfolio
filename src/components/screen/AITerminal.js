"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Cpu } from "lucide-react";

// Terminal prefix
const PREFIX = "root@cyberdeck";

// Thinking animation characters
const THINKING_CHARS = ["-", "\\", "|", "/"];

// Smaller, mobile-friendly ASCII art
const ASCII_ART = `
_______  ______  _____   __  __  _____  _   _            _      
|__   __||  ____||  __ \\ |  \\/  ||_   _|| \\ | |    /\\    | |     
   | |   | |__   | |__) || \\  / |  | |  |  \\| |   /  \\   | |     
   | |   |  __|  |  _  / | |\\/| |  | |  | . \` |  / /\\ \\  | |     
   | |   | |____ | | \\ \\ | |  | | _| |_ | |\\  | / ____ \\ | |____ 
   |_|   |______||_|  \\_\\|_|  |_||_____||_| \\_|/_/    \\_\\|______|
                                                                 
                                                                 
`;

export default function AITerminal({ folderData = [] }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingChar, setThinkingChar] = useState(THINKING_CHARS[0]);
  const [windowWidth, setWindowWidth] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [helpInitialized, setHelpInitialized] = useState(false);

  // Set initial window width and handle window resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isThinking]);

  // Rotate thinking animation
  useEffect(() => {
    if (!isThinking) return;

    const interval = setInterval(() => {
      setThinkingChar((prev) => {
        const currentIndex = THINKING_CHARS.indexOf(prev);
        return THINKING_CHARS[(currentIndex + 1) % THINKING_CHARS.length];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isThinking]);

  useEffect(() => {
    if (!hasInitialized && folderData.length > 0) {
      setHasInitialized(true);

      setTimeout(() => {
        handleCommand("help");
      }, 3500);
    }
  }, [folderData, hasInitialized]);

  // Generate help response from GitHub data
  const generateHelpResponse = () => {
    let response = "Available commands:\n\n";

    folderData.forEach((folder) => {
      response += `- ${folder.title}: Access ${folder.title} information\n`;
    });

    response += "\nNote: Some files may require decryption";
    return response;
  };

  // Handle command submission
  const handleCommand = (command) => {
    const trimmedCommand = command.toLowerCase().trim();

    // Add user command to history
    const userCommand = {
      type: "user",
      content: trimmedCommand,
      prefix: PREFIX,
    };

    setHistory((prev) => [...prev, userCommand]);
    setInput("");
    setIsThinking(true);

    // Simulate AI thinking and response
    const thinkTime = 800 + Math.random() * 1500;
    setTimeout(() => {
      let aiResponse;

      if (trimmedCommand === "help") {
        aiResponse = generateHelpResponse();
      } else {
        // Check if command matches a folder title
        const matchedFolder = folderData.find(
          (folder) =>
            folder.title.toLowerCase().replace(/_/g, "").replace(/\s+/g, "") ===
            trimmedCommand.replace(/_/g, "").replace(/\s+/g, "")
        );

        if (matchedFolder) {
          if (
            matchedFolder.access === "UNAUTHORIZED" &&
            !matchedFolder.unlocked
          ) {
            aiResponse = `Access denied: "${matchedFolder.title}" requires authentication\nUse the File Manager to decrypt this file first`;
          } else {
            aiResponse = `${matchedFolder.title}:\n\n${matchedFolder.content}`;
          }
        } else {
          aiResponse = `Command "${trimmedCommand}" not recognized. Type "help" for available commands.`;
        }
      }

      // Add AI response to history
      setHistory((prev) => [
        ...prev,
        {
          type: "ai",
          content: aiResponse,
        },
      ]);

      setIsThinking(false);
    }, thinkTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    handleCommand(input);
  };

  // Fix text selection issues by only focusing when clicking on empty space
  const handleTerminalClick = (e) => {
    // Don't interfere with text selection or if clicking on interactive elements
    if (
      window.getSelection().toString() ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON"
    ) {
      return;
    }

    if (inputRef.current && !isThinking) {
      inputRef.current.focus();
    }
  };

  const showLargeAscii = windowWidth ? windowWidth >= 768 : false;

  return (
    <motion.div
      className="border-2 rounded border-emerald-700 w-full max-w-full h-full min-h-[300px] relative overflow-hidden bg-emerald-900/10 flex flex-col"
      style={{ colorScheme: "dark" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={handleTerminalClick}
    >
      {/* Terminal header */}
      <div className="w-full h-10 border-b-2 flex items-center justify-between border-emerald-700 text-emerald-300 px-3 md:px-5 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={16} />
          <span className="text-sm md:text-base truncate">AI Terminal</span>
        </div>
        <motion.div
          animate={{ opacity: isThinking ? [0.5, 1] : 1 }}
          transition={{ repeat: isThinking ? Infinity : 0, duration: 1 }}
          className="flex items-center gap-2 text-xs"
        >
          <Cpu
            size={14}
            className={isThinking ? "text-yellow-500" : "text-emerald-500"}
          />
          {isThinking ? "PROCESSING" : "READY"}
        </motion.div>
      </div>

      {/* Terminal content area */}
      <div
        ref={terminalRef}
        className="p-2 sm:p-4 flex-grow overflow-y-auto text-emerald-400 text-xs sm:text-sm font-mono"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome message */}
          <div className="text-emerald-500 mb-4">
            <pre className="font-mono whitespace-pre text-center hidden md:flex">
              {ASCII_ART}
            </pre>
            <p className="mt-2 mb-4 text-xs">
              Advanced Intelligence Terminal v3.7 [Initialized]
            </p>
            <p className="text-emerald-300 text-xs">
              Loading available commands...
            </p>
          </div>

          {/* Command history */}
          {history.map((entry, index) => (
            <div key={index} className="mb-3">
              {entry.type === "user" ? (
                <div className="text-emerald-400 break-words">
                  <span className="text-yellow-500">{entry.prefix}:~$ </span>
                  {entry.content}
                </div>
              ) : (
                <div className="text-emerald-300 pl-2 sm:pl-4 mt-1 whitespace-pre-wrap break-words">
                  {entry.content}
                </div>
              )}
            </div>
          ))}

          {/* Thinking animation */}
          {isThinking && (
            <div className="text-emerald-400">
              <span className="text-yellow-500">ai@system:~$ </span>
              <motion.span
                animate={{ opacity: [0.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                {thinkingChar}
              </motion.span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="w-full border-t-2 border-emerald-700 bg-black/30 shrink-0"
      >
        <div className="flex items-center px-2 sm:px-4 py-2">
          <span className="text-yellow-500 mr-2 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
            {PREFIX}:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            className="flex-1 bg-transparent text-emerald-400 outline-none text-xs sm:text-sm min-w-0"
            placeholder={isThinking ? "AI processing..." : "Enter command..."}
          />
          <motion.button
            type="submit"
            disabled={isThinking || !input.trim()}
            className={`ml-2 text-emerald-500 ${
              isThinking || !input.trim()
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            whileHover={!isThinking && input.trim() ? { scale: 1.1 } : {}}
            whileTap={!isThinking && input.trim() ? { scale: 0.95 } : {}}
          >
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
