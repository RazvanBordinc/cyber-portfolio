"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderOpen, FolderLock } from "lucide-react";

export default function LoadingDataSkeleton() {
  // Create an array of mixed folders for visual variety
  const folders = Array.from({ length: 12 }, (_, i) => ({
    locked: true, // Every third folder is locked
  }));

  return (
    <motion.div
      className="border-2 rounded border-emerald-700 w-full lg:w-3/5 relative overflow-hidden bg-emerald-700/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-10 border-b-2 flex items-center justify-between border-emerald-700 text-emerald-300 px-5">
        <span>File Manager</span>

        {/* Status indicator pulse */}
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 bg-yellow-500 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-xs text-yellow-500">LOADING</span>
        </div>
      </div>

      {/* Scan line effect */}
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

      <div className="text-white flex flex-col md:flex-row h-[calc(100%-2.5rem)] overflow-hidden">
        <div className="w-full md:w-3/5 text-emerald-400 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-4 overflow-y-auto md:border-r-2 md:border-emerald-700">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center relative cursor-pointer p-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                {folder.locked ? (
                  <FolderLock
                    strokeWidth="1"
                    className="text-red-700 transition-colors duration-200 size-6 sm:size-8 md:size-10 lg:size-12"
                  />
                ) : (
                  <FolderOpen
                    strokeWidth="1"
                    className="text-emerald-500 transition-colors duration-200 size-6 sm:size-8 md:size-10 lg:size-12"
                  />
                )}
              </motion.div>

              <motion.div
                className={`h-2 mt-2 rounded w-16 ${
                  folder.locked ? "bg-red-700/40" : "bg-emerald-700/40"
                }`}
                initial={{ width: "60%" }}
                animate={{ width: "80%" }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  delay: (index * 0.1) % 0.7,
                }}
              />
            </div>
          ))}
        </div>

        <div className="w-full md:w-2/5 p-4 flex-col overflow-y-auto hidden md:flex">
          <div className="h-full flex flex-col items-center justify-center text-center text-emerald-400">
            <motion.div
              className="mb-4 w-16 h-16 border-2 border-emerald-500 rounded-full flex items-center justify-center"
              initial={{ borderWidth: 2 }}
              animate={{
                borderWidth: [2, 3, 2],
                boxShadow: [
                  "0 0 0px rgba(5, 150, 105, 0)",
                  "0 0 10px rgba(5, 150, 105, 0.5)",
                  "0 0 0px rgba(5, 150, 105, 0)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="w-10 h-10 bg-emerald-500/20 rounded-full"
                animate={{
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.p
              className="text-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Loading data...
            </motion.p>

            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
