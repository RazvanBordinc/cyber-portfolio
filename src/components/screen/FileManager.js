"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FolderLock,
  FolderOpen,
  Lock,
  Check,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Default folders as fallback if remote data fails to load
const defaultFolders = [
  {
    title: "error_fetching",
    access: "AUTHORIZED",
    content: "error fetching from github",
  },
];

// Import loading skeleton component dynamically to avoid SSR issues
const LoadingDataSkeleton = dynamic(
  () => import("@/components/shared/LoadingDataSkeleton"),
  {
    ssr: false,
  }
);

export default function FileManager({ folderData }) {
  // State management
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [folderState, setFolderState] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [hackEffect, setHackEffect] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0); // Key to force re-render for shake animation
  const [showMobileFolders, setShowMobileFolders] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize client-side effects and handle window resize
  useEffect(() => {
    setIsClient(true);

    // Process the folderData or use default
    const folders = folderData || defaultFolders;

    // Initialize folder state with unlocked status
    setFolderState(
      folders.map((folder) => ({
        ...folder,
        unlocked: folder.access === "AUTHORIZED" ? true : false,
      }))
    );

    // Simulate loading to show animation briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Handle initial selection based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768 && selectedFolder !== null) {
        setShowMobileFolders(false);
      } else {
        setShowMobileFolders(true);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer); // Clean up the timer to prevent memory leaks
    };
  }, [folderData, selectedFolder]);

  // Handle folder selection
  const handleFolderClick = useCallback((index) => {
    setSelectedFolder(index);
    setPasswordInput("");
    setPasswordError(false);
    // On mobile, hide folders when one is selected
    if (window.innerWidth < 768) {
      setShowMobileFolders(false);
    }
  }, []);

  // Try to unlock a folder with password
  const handleUnlock = useCallback(() => {
    const folder = folderState[selectedFolder];

    if (folder.password === passwordInput) {
      // Trigger hacking effect on successful unlock
      setHackEffect(true);

      // Update folder state after short delay for effect
      setTimeout(() => {
        const updatedFolders = [...folderState];
        updatedFolders[selectedFolder] = {
          ...updatedFolders[selectedFolder],
          unlocked: true,
        };
        setFolderState(updatedFolders);
        setHackEffect(false);
      }, 1000);
    } else {
      // Incorrect password - trigger shake animation
      setPasswordError(true);
      setShakeKey((prev) => prev + 1); // Force re-render of password input to trigger animation
      setHackEffect(true);
      setTimeout(() => setHackEffect(false), 300);
    }
  }, [folderState, selectedFolder, passwordInput]);

  // Handle Enter key for password input
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleUnlock();
      }
    },
    [handleUnlock]
  );

  // Reset selection
  const handleBack = useCallback(() => {
    setSelectedFolder(null);
    setPasswordInput("");
    setPasswordError(false);
    // Show folders again on mobile when going back
    setShowMobileFolders(true);
  }, []);

  // Show loading skeleton during initial load
  if (isLoading) {
    return <LoadingDataSkeleton />;
  }

  return (
    <motion.div
      className="border-2 rounded border-emerald-700 w-full lg:w-3/5 relative overflow-hidden bg-emerald-700/10"
      animate={{
        boxShadow: hackEffect ? "0 0 15px 2px rgba(5, 150, 105, 0.5)" : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-10 border-b-2 flex items-center justify-between border-emerald-700 text-emerald-300 px-5">
        <span>File Manager</span>
        {selectedFolder !== null && (
          <motion.button
            onClick={handleBack}
            className="text-emerald-500 hover:text-emerald-400 cursor-pointer md:hidden flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </motion.button>
        )}
      </div>

      {/* Scan line effect */}
      {isClient && (
        <motion.div
          className="absolute w-full md:w-3/5 h-0.5 bg-emerald-500/30 pointer-events-none z-10"
          initial={{ top: "0%" }}
          animate={{ top: ["10%", "100%"] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
        />
      )}

      <div className="text-white flex flex-col md:flex-row h-[calc(100%-2.5rem)] overflow-hidden">
        <AnimatePresence mode="wait">
          {(showMobileFolders || (isClient && window.innerWidth >= 768)) && (
            <div
              className={`w-full md:w-3/5 text-emerald-400 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-4 overflow-y-auto ${
                selectedFolder !== null ? "hidden md:grid" : ""
              } md:border-r-2 md:border-emerald-700`}
            >
              {folderState.map((folder, index) => (
                <motion.div
                  className="flex flex-col items-center justify-center relative cursor-pointer p-2"
                  key={index}
                  onClick={() => handleFolderClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    {folder.access === "UNAUTHORIZED" && !folder.unlocked ? (
                      <FolderLock
                        strokeWidth="1"
                        className="text-red-700 transition-colors duration-200 size-6 sm:size-8 md:size-10 lg:size-12"
                      />
                    ) : (
                      <FolderOpen
                        strokeWidth="1"
                        className="transition-colors duration-200 size-6 sm:size-8 md:size-10 lg:size-12"
                      />
                    )}

                    {folder.unlocked && folder.access === "UNAUTHORIZED" && (
                      <motion.div
                        className="absolute -top-2 -right-2 bg-emerald-900 rounded-full p-0.5 sm:p-1 border border-emerald-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check size={12} className="text-emerald-500" />
                      </motion.div>
                    )}
                  </div>

                  <span
                    className={`text-xs mt-1 text-center ${
                      folder.access === "UNAUTHORIZED" && !folder.unlocked
                        ? "text-red-700"
                        : folder.access === "UNAUTHORIZED" && folder.unlocked
                        ? "text-emerald-500"
                        : ""
                    }`}
                  >
                    {folder.title}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Content area / password prompt */}
        <AnimatePresence mode="wait">
          {(selectedFolder !== null ||
            (isClient && window.innerWidth >= 768)) && (
            <motion.div
              className={`w-full md:w-2/5 p-4 flex flex-col overflow-y-auto ${
                selectedFolder === null && window.innerWidth < 768
                  ? "hidden"
                  : "flex"
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {selectedFolder !== null && (
                <div className="flex items-center mb-4 justify-between">
                  <motion.h3
                    className="text-emerald-400 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {folderState[selectedFolder].title}
                  </motion.h3>
                  <motion.button
                    onClick={handleBack}
                    className="text-emerald-500 hover:text-emerald-400 cursor-pointer hidden md:flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft size={20} />
                    <span className="text-sm">Back</span>
                  </motion.button>
                </div>
              )}

              {selectedFolder !== null ? (
                <motion.div
                  key={`folder-${selectedFolder}`}
                  className="flex-1 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {folderState[selectedFolder].access === "UNAUTHORIZED" &&
                  !folderState[selectedFolder].unlocked ? (
                    <motion.div
                      className="flex-1 flex flex-col items-center justify-center text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                      >
                        <Lock size={36} className="text-red-700 mb-3" />
                      </motion.div>
                      <motion.h3
                        className="text-red-700 text-lg sm:text-xl mb-4"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        ACCESS DENIED
                      </motion.h3>
                      <motion.p
                        className="text-emerald-500 mb-4 text-xs sm:text-sm"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Authentication required to access this file.
                      </motion.p>

                      <div className="w-full max-w-xs px-4 sm:px-0">
                        <motion.div
                          key={`input-container-${shakeKey}`}
                          className={`border-2 ${
                            passwordError
                              ? "border-red-700"
                              : "border-emerald-700"
                          } bg-black p-2 mb-4`}
                          animate={
                            passwordError
                              ? {
                                  x: [0, -10, 10, -10, 10, -5, 5, 0],
                                  borderColor: [
                                    "#b91c1c",
                                    "#b91c1c",
                                    "#047857",
                                  ],
                                }
                              : {}
                          }
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                        >
                          <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter password"
                            className="w-full bg-transparent text-emerald-400 focus:outline-none text-sm"
                          />
                        </motion.div>

                        <motion.button
                          onClick={handleUnlock}
                          className="w-full bg-emerald-900 border-2 text-sm sm:text-base border-emerald-700 text-emerald-400 py-1.5 px-3 cursor-pointer"
                          whileHover={{
                            backgroundColor: "#065f46",
                            transition: { duration: 0.2 },
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          DECRYPT
                        </motion.button>

                        <AnimatePresence>
                          {passwordError && (
                            <motion.p
                              className="text-red-700 mt-4 text-xs sm:text-sm flex items-center justify-center"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <XCircle size={16} className="mr-2" />
                              Authentication failed
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex-1 text-emerald-400 p-2 rounded text-xs sm:text-sm overflow-y-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <pre
                        className={`whitespace-pre-wrap ${
                          folderState[selectedFolder].content.includes("key") ||
                          folderState[selectedFolder].content.includes(
                            "github.com"
                          )
                            ? "flex-wrap flex break-all"
                            : ""
                        }`}
                      >
                        {folderState[selectedFolder].content}
                      </pre>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="h-full hidden lg:flex flex-col items-center justify-center text-center text-emerald-400 "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <motion.p
                    className="mb-4 text-sm sm:text-base"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    Select a file to view contents
                  </motion.p>
                  <motion.p
                    className="text-xs text-emerald-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {"// System ready"}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
