"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Briefcase } from "lucide-react";

import FileManager from "./FileManager";
import DecryptorTerminal from "./DecryptorTerminal";
import Terminal from "./Terminal";

export default function ScreenContainer({ folderData }) {
  const [showHighlights, setShowHighlights] = useState(false);

  return (
    <div className="bg-zinc-950 min-h-screen lg:min-h-fit lg:h-screen p-5 w-full relative">
      {/* Dark overlay for recruiter mode */}
      <AnimatePresence>
        {showHighlights && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <div className="flex lg:flex-row flex-col gap-5 w-full h-full lg:h-3/5 tracking-wider font-bold text-xl relative">
        <FileManager folderData={folderData} showHighlights={showHighlights} />
        <DecryptorTerminal showHighlights={showHighlights} />
      </div>
      <motion.div 
        className={`flex lg:flex-row flex-col gap-5 w-full h-2/5 tracking-wider font-bold text-xl pt-5 transition-all duration-500 relative ${
          showHighlights ? "blur-sm opacity-40" : ""
        }`}
      >
        <Terminal folderData={folderData} />
      </motion.div>
      
      {/* Highlight Toggle Button - RECRUITER/HR MODE */}
      <motion.button
        onClick={() => setShowHighlights(!showHighlights)}
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full border-2 transition-all cursor-pointer z-50 flex items-center gap-3 font-mono text-sm shadow-2xl ${
          showHighlights 
            ? "bg-emerald-500 border-emerald-400 text-black shadow-emerald-500/50" 
            : "bg-black border-emerald-700 text-emerald-500 hover:border-emerald-500 hover:shadow-emerald-700/50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={showHighlights ? {
          boxShadow: [
            "0 0 20px rgba(16, 185, 129, 0.5)",
            "0 0 40px rgba(16, 185, 129, 0.8)",
            "0 0 20px rgba(16, 185, 129, 0.5)"
          ]
        } : {}}
        transition={{
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
        title={showHighlights ? "Hide important information" : "Show important information for recruiters"}
        aria-label={showHighlights ? "Hide recruiter highlights" : "Show recruiter highlights"}
      >
        <Briefcase size={20} className={showHighlights ? "animate-pulse" : ""} />
        <span className="font-bold tracking-wider">
          {showHighlights ? "EXIT RECRUITER MODE" : "RECRUITER/HR MODE"}
        </span>
        <Sparkles size={20} className={showHighlights ? "animate-pulse" : ""} />
      </motion.button>
    </div>
  );
}
