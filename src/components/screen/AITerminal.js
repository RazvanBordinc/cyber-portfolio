"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ArrowRight, Cpu } from "lucide-react";

// Interesting terminal prefixes
const PREFIXES = [
  "quantum@nexus",
  "cypher@mainframe",
  "neo@matrix",
  "ghost@shell",
  "root@cyberdeck",
  "hacker@grid",
  "user@virtual",
  "sentinel@network",
  "void@singularity",
  "echo@system",
];

// Simulated AI responses
const AI_RESPONSES = [
  {
    command: "help",
    response: `Available commands:
- help: Display this help message
- status: Check system status
- scan: Scan for vulnerabilities
- decrypt: Attempt to decrypt a file
- analyze: Analyze current network traffic
- trace: Trace signal origin
- breach: Attempt system breach (unauthorized)
- exit: Terminate session`,
  },
  {
    command: "status",
    response: `System status:
- Neural core: ONLINE
- Quantum modules: ACTIVE
- Data buffers: 72% CAPACITY
- Network interfaces: 4 CONNECTED
- Security level: ENHANCED
- Anomaly detection: RUNNING
- Last update: 4 HOURS AGO`,
  },
  {
    command: "scan",
    response: `Scanning system...
[■■■■■■■■■■] 100%

Potential vulnerabilities detected:
- Port 8742: Unpatched service
- Node Alpha: Outdated encryption
- Memory sector B7: Unusual pattern detected
- Firewall rule #42: Possible bypass vector

Recommend immediate security update.`,
  },
  {
    command: "analyze",
    response: `Network traffic analysis:
Total packets: 42,891
Suspicious packets: 17
Unknown origins: 3
Encryption protocols: VARIED

HIGH TRAFFIC detected from 192.168.0.7
ANOMALY detected in data stream 0xF7C9A
Recommend enhanced monitoring.`,
  },
];

// Thinking animation characters
const THINKING_CHARS = ["-", "\\", "|", "/"];

// ASCII art for different screen sizes
const ASCII_ART = {
  large: `  _    ___ _____ ____ ____  __  __ ___ _   _    _    _     
 / \\  |_ _|_   _/ ___|  _ \\|  \\/  |_ _| \\ | |  / \\  | |    
/ _ \\  | |  | || |   | |_) | |\\/| || ||  \\| | / _ \\ | |    
/ ___ \\ | |  | || |___|  _ <| |  | || || |\\  |/ ___ \\| |___ 
/_/   \\_\\___| |_|\\____|_| \\_\\_|  |_|___|_| \\_/_/   \\_\\_____|
                                                            `,
  small: `
█▀█ █   ▀█▀ █▀▀ █▀█ █▀▄▀█ █ █▄░█ █▀█ █░░
█▀█ █    █  █▀▀ █▀▄ █░▀░█ █ █░▀█ █▀█ █▄▄
`,
};

export default function AITerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingChar, setThinkingChar] = useState(THINKING_CHARS[0]);
  const [currentPrefix, setCurrentPrefix] = useState(PREFIXES[0]);
  const [windowWidth, setWindowWidth] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Set initial window width and handle window resize
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Set initial window width
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
    }, 150);

    return () => clearInterval(interval);
  }, [isThinking]);

  // Handle command submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    // Add user command to history
    const userCommand = {
      type: "user",
      content: input,
      prefix: currentPrefix,
    };

    setHistory((prev) => [...prev, userCommand]);
    setInput("");
    setIsThinking(true);

    // Generate new random prefix for next command
    setCurrentPrefix(PREFIXES[Math.floor(Math.random() * PREFIXES.length)]);

    // Simulate AI thinking and response
    const thinkTime = 1000 + Math.random() * 2000;
    setTimeout(() => {
      // Find matching response or use default
      let aiResponse;
      const matchedResponse = AI_RESPONSES.find((r) =>
        input.toLowerCase().includes(r.command.toLowerCase())
      );

      if (matchedResponse) {
        aiResponse = matchedResponse.response;
      } else {
        aiResponse = `Command "${input}" not recognized. Type "help" for available commands.`;
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

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    if (inputRef.current && !isThinking) {
      inputRef.current.focus();
    }
  };

  // Determine which ASCII art to show based on screen size
  // Default to small ASCII until windowWidth is measured
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
            {showLargeAscii ? (
              <pre className="font-mono whitespace-pre-wrap text-xs overflow-x-auto sm:text-sm sm:overflow-visible">
                {ASCII_ART.large}
              </pre>
            ) : (
              <div className="text-center py-1">
                <pre className="font-mono text-xs inline-block text-emerald-400">
                  {ASCII_ART.small}
                </pre>
              </div>
            )}
            <p className="mt-2 mb-4 text-xs">
              Advanced Intelligence Terminal v3.7 [Initialized]
            </p>
            <p className="text-emerald-300 text-xs">
              Type "help" for available commands
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
            {currentPrefix}:~$
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
