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

// Enhanced folders with content, password, and access status
const folders = [
  {
    title: "how_to_use",
    access: "AUTHORIZED",
    content:
      " - click on a folder to see its content\n\n - if the folder is locked, decrypt its password from passwords folder in the decrypt terminal\n\n - if you want to go back, click on the back button\n\n - to see the projects on github go to projects_links",
  },
  {
    title: "projects",
    access: "AUTHORIZED",
    content:
      "1. AI ChatBot\n - connected to my github\n - can answer anything about me\n\n2. Functional Social Media\n - can post,comment,like,rate,etc\n - recommendation algorithm\n\n3. Cryptographic algorithm\n - using Feistel Network and CBC\n\n4. Interactive Portfolio\n - uses certain parts of (1 & 3)\n\n5. Private medical system\n - is not publicly available",
  },
  {
    title: "tech_skills",
    access: "AUTHORIZED",
    content:
      "BACKEND:\n - .NET Core (web api)\n - Entity Framework\n - SQL Server\n - LINQ\n - basic JWT\n - basic Redis\n - REST\n - Session\n - Scalability\n - Rate Limiting\n - Roles\n - OOP\n\nFRONTEND:\n - React\n - Next.js\n - Tailwind CSS\n - Framer Motion\n - Zustand\n - many component libraries\n - Adobe Illustrator\n - Figma\n\nTOOLS:\n - Docker\n - Git\n - Postman\n - Swagger\n - VS\n - VSC\n\nOTHER:\n - strong prompt engineering skills\n - little knowledge of AI\n - little knowledge of Security\n - little knowledge of Cryptography",
  },
  {
    title: "soft_skills",
    access: "AUTHORIZED",
    content:
      "Strengths:\n\n1. Problem-solving\n2. Critical thinking\n3. Creative thinking\n4. Abstract thinking\n5. Fast processing\n6. Adaptability\n7. Good strategist\n\nWeaknesses:\n\n1. Public speaking\n2. Competitiveness\n3. Anxiety\n4. No experience in teams",
  },
  {
    title: "interests",
    access: "AUTHORIZED",
    content:
      "Defending, competing and defeating AI using AI\n\nIn the future, I aspire to pursue opportunities in one of the following areas:\n\n - App Security\n - AI\n - Cryptography - PQC/QC\n - Leadership/Management",
  },
  {
    title: "experience",
    access: "AUTHORIZED",
    content:
      " - creating my own startup (weekends)\n\n - worked on my own projects\n\n - no experience in working in teams or companies\n\n - 2nd year of university (INFORMATICS - UPT ROMANIA)\n\n - self-taught for 4 years",
  },
  {
    title: "about_me",
    access: "AUTHORIZED",
    content:
      " Hi! I'm Razvan Bordinc!\n\n - I'm a 21 years old Software Engineer from Romania, Timisoara\n\n - Looking for remote, on-site or hybrid opportunities\n\n - Full-time, part-time or internships",
  },
  {
    title: "contact",
    access: "AUTHORIZED",
    content:
      "Email: razvan.bordinc@yahoo.com\n\nGithub: github.com/RazvanBordinc\n\nLinkedIn: linkedin.com/in/valentin-r%C4%83zvan-bord%C3%AEnc-30686a298/",
  },

  {
    title: "projects_links",
    access: "AUTHORIZED",
    content:
      "1. AI ChatBot:\n github.com/RazvanBordinc/AIChatBot\n\n2. Functional Social Media:\n github.com/RazvanBordinc/Fragmento\n\n3. Cryptograhic algorithm:\n github.com/RazvanBordinc/CustomCypher\n\n4. Interactive Portfolio:\n github.com/RazvanBordinc/cyber-portfolio ",
  },
  {
    title: "social_media",
    access: "UNAUTHORIZED",
    password: "gamma213",
    content:
      "Instagram: \ninstagram.com/rasvanz5\n\n - currently active only on Instagram",
  },
  {
    title: "passwords",
    access: "AUTHORIZED",
    content:
      "social_media:\n\ntext: \n54A1E0EFAD53EF4F81E54153ABB4A250927E83DFAA521E2D9AFE961254314A0FF8021720A577B9A4B01DC6C056E2BB019458A71C8F945B182ED3EE05362B2F1E\nkey:\nC1n/TRQHTkJZOXn7P97blVQ+HefwVJ1USKJczj7Jo0pxXkYSU7mfj2th/ny7M9Xc+5JBJCC/BXabRBRBL28357GqhKfeWuUaFHpVSVyoMIolaqVw6jHe3E7Nb0488s6UPGcKv6k/6+nMD0Gh4kYAWo4kr9BOL6wOvBt+euJFirGj4W8oopVFeol4alSXX5IgYWI55m/A1ojnqSddBAhEQ4RTsA1dr0rAdcl6g2LtR2lN+gWxRVSmOVcuY7RwRJkISSpoezGM422PwM9EtzqjLyl0ruzO3oS7VKOpSDHQqcNb94C7QIUcEkIywZLDAdGCN2LF1Tmbh0Q+0ouyuYID2A==\n\nhobbies:\n\ntext:\n1AB22F2DD48D9B978818804592F207A7A3258D6A79C51751A988FC3C8B841B7BE43AFF1D246A131FD0BAA1EC98F5591DB8D9B8DAFE44DF96D553D0EAE41A0429\ntoken:\n6tcWvj1EfpP/X7goAD3in5uKyoO0uST45uU26mX/I/hsAsUelJ57P5tQmX2gEGFDgNhklcgpMDUr8obDnqI8sqHL4gvij06EnGVzasyteVwsn0gK/8HOsqsZxhkU7nT2651go93sFx1SWptN+1MsqOtw2t5zLjyXwKRiq4Tn67ww1tsEov4tlQ1HPvP4AFYYIjplGqAmWe3P4PPufXqXURgxRsdUI7SyMmvsjos6Tpa2JV3g2LgP6qrLk1KXRJZ+Mu8EkI1+2iOOvkTNy+NrZkrfZlfE+XH+Svtsvs73RWgHOQv8t6VfvUvHKnzB7tvNcYFUQQJJVEoghiuXmI3aOg==",
  },
  {
    title: "hobbies",
    access: "UNAUTHORIZED",
    password: "delta654",
    content:
      " - Chess\n - Trips\n - Movies, TV Series, Anime\n - Music\n - Gym\n - Watches\n - Fragrances",
  },
];

export default function FileManager() {
  // State management
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [folderState, setFolderState] = useState(
    folders.map((folder) => ({
      ...folder,
      unlocked: folder.access === "AUTHORIZED" ? true : false,
    }))
  );
  const [isClient, setIsClient] = useState(false);
  const [hackEffect, setHackEffect] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0); // Key to force re-render for shake animation
  const [showMobileFolders, setShowMobileFolders] = useState(true);

  // Initialize client-side effects and handle window resize
  useEffect(() => {
    setIsClient(true);

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
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedFolder]);

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

  return (
    <motion.div
      className="border-2 rounded border-emerald-700 w-full lg:w-3/5 relative overflow-hidden bg-emerald-700/10"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
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
        {/* Folder grid */}
        <AnimatePresence mode="wait">
          {(showMobileFolders || (isClient && window.innerWidth >= 768)) && (
            <motion.div
              className={`w-full md:w-3/5 text-emerald-400 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-4 overflow-y-auto ${
                selectedFolder !== null ? "hidden md:grid" : ""
              } md:border-r-2 md:border-emerald-700`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, staggerChildren: 0.05 }}
            >
              {folderState.map((folder, index) => (
                <motion.div
                  className="flex flex-col items-center justify-center relative cursor-pointer p-2"
                  key={index}
                  onClick={() => handleFolderClick(index)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
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
                        <motion.div
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Check size={12} className="text-emerald-500" />
                        </motion.div>
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
            </motion.div>
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
                          opacity: [0.7, 1, 0.7],
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
                    // System ready
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
