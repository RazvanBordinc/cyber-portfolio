"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FolderLock,
  FolderOpen,
  Check,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import TerminalModal from "@/components/shared/TerminalModal";

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

export default function FileManager({ folderData, showHighlights }) {
  // State management
  const [folderState, setFolderState] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFolder, setModalFolder] = useState(null);

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

    // Cleanup
    return () => {
      clearTimeout(timer); // Clean up the timer to prevent memory leaks
    };
  }, [folderData]);

  // Handle folder selection
  const handleFolderClick = useCallback((index) => {
    const folder = folderState[index];
    setModalFolder({
      ...folder,
      password: folder.password,
      index: index
    });
    setIsModalOpen(true);
  }, [folderState]);

  // Handle modal unlock
  const handleModalUnlock = useCallback(() => {
    if (modalFolder && modalFolder.index !== undefined) {
      const updatedFolders = [...folderState];
      updatedFolders[modalFolder.index] = {
        ...updatedFolders[modalFolder.index],
        unlocked: true,
      };
      setFolderState(updatedFolders);
    }
  }, [modalFolder, folderState]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalFolder(null);
  }, []);

  // Show loading skeleton during initial load
  if (isLoading) {
    return <LoadingDataSkeleton />;
  }

  return (
    <motion.div
      className="border-2 rounded border-emerald-700 w-full lg:w-3/5 relative overflow-hidden bg-emerald-700/10"
    >
      <div className="w-full h-10 border-b-2 flex items-center justify-between border-emerald-700 text-emerald-300 px-5">
        <span>File Manager</span>
      </div>

      {/* Scan line effect */}
      {isClient && (
        <motion.div
          className="absolute w-full h-0.5 bg-emerald-500/30 pointer-events-none z-10"
          initial={{ top: "0%" }}
          animate={{ top: ["10%", "100%"] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
        />
      )}

      <div className="text-white h-[calc(100%-2.5rem)] overflow-hidden">
        <div className="w-full h-full text-emerald-400 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-6 overflow-y-auto">
              {folderState.map((folder, index) => (
                <motion.div
                  className={`flex flex-col items-center justify-center relative cursor-pointer p-2 rounded-lg transition-all duration-500 ${
                    showHighlights 
                      ? folder.highlight
                        ? "bg-emerald-950/30 ring-1 ring-emerald-500/50 scale-105 z-10" 
                        : "blur-sm opacity-30 scale-95"
                      : ""
                  }`}
                  key={index}
                  onClick={() => handleFolderClick(index)}
                  whileHover={{ scale: showHighlights && !folder.highlight ? 0.95 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={showHighlights && folder.highlight ? {
                    boxShadow: [
                      "0 0 15px rgba(16, 185, 129, 0.3)",
                      "0 0 25px rgba(16, 185, 129, 0.5)",
                      "0 0 15px rgba(16, 185, 129, 0.3)"
                    ]
                  } : {
                    boxShadow: "none"
                  }}
                  transition={{
                    boxShadow: showHighlights && folder.highlight ? {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    } : {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }}
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
                    
                    {/* Subtle indicator for highlighted folders */}
                    {showHighlights && folder.highlight && (
                      <motion.div
                        className="absolute -top-2 -right-2 bg-emerald-900/80 rounded-full p-1 border border-emerald-500/50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Sparkles size={12} className="text-emerald-400" />
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
      </div>

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        folder={modalFolder}
        isLocked={modalFolder && modalFolder.access === "UNAUTHORIZED" && !modalFolder.unlocked}
        onUnlock={handleModalUnlock}
      />
    </motion.div>
  );
}
