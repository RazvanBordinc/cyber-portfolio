"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import LoadingDataSkeleton from "./LoadingDataSkeleton";

export default function LoadingFallback() {
  return (
    <div className="bg-zinc-950 min-h-screen lg:min-h-fit lg:h-screen p-5 w-full">
      {/* Header with CPU icon */}
      <motion.div
        className="flex justify-center mb-8 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-2 text-emerald-500 px-4 py-2 border border-emerald-700 rounded bg-emerald-900/20"
          animate={{
            boxShadow: [
              "0 0 0px rgba(5, 150, 105, 0)",
              "0 0 15px rgba(5, 150, 105, 0.5)",
              "0 0 0px rgba(5, 150, 105, 0)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          <Cpu className="animate-pulse" size={24} />
          <span className="text-lg">INITIALIZING SYSTEM</span>
          <motion.div
            className="flex gap-1 ml-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main content area with file manager skeleton */}
      <div className="flex lg:flex-row flex-col gap-5 w-full h-full lg:h-3/5 tracking-wider font-bold text-xl">
        <LoadingDataSkeleton />

        {/* Decryptor Terminal Skeleton */}
        <motion.div
          className="border-2 rounded border-emerald-700 w-full lg:w-2/5 relative overflow-hidden bg-emerald-700/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 h-[calc(100%-3rem)] flex flex-col text-emerald-400 bg-emerald-900/5">
            <div className="flex justify-between items-center mb-3 border-b border-emerald-700 pb-2">
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">SYSTEM BOOTING</span>
              </motion.div>
              <motion.div
                className="text-xs"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                LOADING
              </motion.div>
            </div>

            <motion.div
              className="flex-1 relative border-2 border-emerald-700 bg-emerald-900/5 flex flex-col overflow-hidden"
              animate={{
                borderColor: ["#047857", "#eab308", "#047857"],
                boxShadow: [
                  "0 0 0px rgba(5, 150, 105, 0)",
                  "0 0 10px rgba(5, 150, 105, 0.3)",
                  "0 0 0px rgba(5, 150, 105, 0)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <motion.div
                className="w-full h-1"
                initial={{ x: "-100%" }}
                animate={{ x: ["0%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* AI Terminal Skeleton */}
      <div className="flex lg:flex-row flex-col gap-5 w-full h-2/5 tracking-wider font-bold text-xl pt-5">
        <motion.div
          className="border-2 rounded border-emerald-700 w-full max-w-full h-full min-h-[300px] relative overflow-hidden bg-emerald-900/10 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-10 border-b-2 flex items-center justify-between border-emerald-700 text-emerald-300 px-3 md:px-5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base truncate">AI Terminal</span>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-2 text-xs"
            >
              <Cpu size={14} className="text-yellow-500" />
              INITIALIZING
            </motion.div>
          </div>

          <div className="p-2 sm:p-4 flex-grow overflow-y-auto text-emerald-400 text-xs sm:text-sm font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-6 w-48 bg-emerald-900/30 rounded mb-2"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="h-6 w-64 bg-emerald-900/30 rounded mb-2"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              />
              <motion.div
                className="h-6 w-56 bg-emerald-900/30 rounded mb-2"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
