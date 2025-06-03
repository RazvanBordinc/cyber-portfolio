"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Lock, Unlock, FileText, ChevronRight } from "lucide-react";

export default function TerminalModal({
  isOpen,
  onClose,
  folder,
  isLocked,
  onUnlock,
}) {
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [typedContent, setTypedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Function to parse content and make URLs clickable
  const renderContentWithLinks = (content) => {
    if (!content) return null;
    
    // Check if content is an array (projects)
    if (Array.isArray(content)) {
      return (
        <div className="space-y-6">
          <div className="text-emerald-300 text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-emerald-500">»</span> PROJECT SHOWCASE
          </div>
          {content.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-emerald-700 bg-emerald-950/20 p-4 rounded-lg hover:bg-emerald-950/30 transition-all"
            >
              <h3 className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-emerald-600">▸</span>
                {project.name}
              </h3>
              <p className="text-emerald-500/80 mb-3 ml-4">{project.description}</p>
              {project.link && (
                <div className="ml-4">
                  <span className="text-emerald-600 text-sm">Repository: </span>
                  <a
                    href={`https://${project.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.link}
                  </a>
                </div>
              )}
              {!project.link && (
                <div className="ml-4 text-emerald-700 text-sm italic">
                  Private repository
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }
    
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Typing animation effect
  useEffect(() => {
    if (!isLocked && folder?.content && isOpen) {
      // If content is an array, show it immediately
      if (Array.isArray(folder.content)) {
        setTypedContent(folder.content);
        setIsTyping(false);
      } else {
        setIsTyping(true);
        setTypedContent("");
        
        const content = folder.content;
        let currentIndex = 0;
        
        const typeInterval = setInterval(() => {
          if (currentIndex < content.length) {
            setTypedContent(content.substring(0, currentIndex + 1));
            currentIndex++;
          } else {
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, 10); // Adjust speed here

        return () => clearInterval(typeInterval);
      }
    }
  }, [isLocked, folder?.content, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPasswordInput("");
      setPasswordError(false);
      setTypedContent("");
      setIsTyping(false);
    }
  }, [isOpen]);

  const handleUnlock = useCallback(() => {
    if (folder.password === passwordInput) {
      onUnlock();
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setShakeKey((prev) => prev + 1);
      setTimeout(() => setPasswordError(false), 2000);
    }
  }, [folder?.password, passwordInput, onUnlock]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && isLocked) {
        handleUnlock();
      }
    },
    [handleUnlock, isLocked]
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!folder) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close modal"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClose();
              }
            }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-zinc-950 border-2 border-emerald-500/50 w-full h-full max-w-5xl max-h-[85vh] flex flex-col relative pointer-events-auto overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                boxShadow: "0 0 50px 5px rgba(16, 185, 129, 0.3), 0 0 100px 10px rgba(16, 185, 129, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Header */}
              <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/20 border-b-2 border-emerald-500/50 px-6 py-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  {/* Terminal dots */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="w-px h-6 bg-emerald-500/30 mx-2" />
                  <Terminal className="text-emerald-500" size={20} />
                  <h2
                    id="modal-title"
                    className="text-emerald-400 text-sm md:text-lg font-mono tracking-wider"
                  >
                    <span className="text-emerald-600">~/files/</span>{folder.title}
                    {isLocked ? (
                      <Lock className="inline w-4 h-4 text-red-500 ml-2 animate-pulse" />
                    ) : (
                      <Unlock className="inline w-4 h-4 text-emerald-400 ml-2" />
                    )}
                  </h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all p-2 rounded-lg cursor-pointer relative z-50"
                  aria-label="Close terminal window"
                  title="Close (ESC)"
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Terminal Content */}
              <div className="flex-1 overflow-hidden bg-gradient-to-b from-black/50 to-emerald-950/10 relative">
                {isLocked ? (
                  /* Password Prompt */
                  <div className="h-full flex items-center justify-center p-8">
                    <motion.div
                      className="text-center max-w-md w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 4,
                          ease: "easeInOut",
                        }}
                      >
                        <Lock size={64} className="text-red-700 mx-auto mb-6" />
                      </motion.div>
                      
                      <h3 className="text-red-500 text-2xl md:text-3xl mb-4 font-mono uppercase tracking-wider animate-pulse">
                        [ ACCESS DENIED ]
                      </h3>
                      <p id="modal-description" className="text-emerald-400/80 mb-8 text-sm md:text-base">
                        Authentication required to decrypt file contents
                      </p>

                      <div className="space-y-4">
                        <motion.div
                          key={`password-input-${shakeKey}`}
                          className={`border-2 ${
                            passwordError ? "border-red-700" : "border-emerald-700"
                          } bg-black/50 p-3 rounded`}
                          animate={
                            passwordError
                              ? {
                                  x: [0, -10, 10, -10, 10, -5, 5, 0],
                                  borderColor: ["#b91c1c", "#b91c1c", "#047857"],
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
                            placeholder="Enter decryption key..."
                            className="w-full bg-transparent text-emerald-400 focus:outline-none font-mono placeholder-emerald-700"
                            autoFocus
                            aria-label="Password input"
                            aria-required="true"
                            aria-invalid={passwordError}
                          />
                        </motion.div>

                        <motion.button
                          onClick={handleUnlock}
                          className="w-full bg-emerald-900 border-2 border-emerald-700 text-emerald-400 py-3 px-6 rounded font-mono uppercase tracking-wider hover:bg-emerald-800 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Decrypt File
                        </motion.button>

                        <AnimatePresence>
                          {passwordError && (
                            <motion.p
                              className="text-red-700 text-sm flex items-center justify-center gap-2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <X size={16} />
                              Invalid decryption key
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  /* File Content */
                  <div className="h-full bg-black/50 p-6 md:p-8 overflow-y-auto emerald-scrollbar">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-mono"
                    >
                      {/* Terminal prompt */}
                      <div className="flex items-start gap-2 text-emerald-500 mb-6">
                        <ChevronRight size={16} className="mt-0.5" />
                        <div>
                          <span className="text-sm text-emerald-600">user@portfolio</span>
                          <span className="text-emerald-400">:</span>
                          <span className="text-sm text-blue-400">~/files</span>
                          <span className="text-emerald-400">$ </span>
                          <span className="text-emerald-300">cat {folder.title}</span>
                        </div>
                      </div>
                      
                      {/* Content with typing effect */}
                      <div className="text-emerald-400 whitespace-pre-wrap text-sm md:text-base leading-relaxed font-mono">
                        {renderContentWithLinks(typedContent)}
                        {isTyping && (
                          <motion.span
                            className="inline-block w-2 h-4 bg-emerald-400 ml-1"
                            animate={{ opacity: [1, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
              >
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-full"
                  animate={{
                    y: ["0vh", "85vh"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "linear",
                  }}
                />
              </motion.div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-emerald-500/30 pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-emerald-500/30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-emerald-500/30 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-emerald-500/30 pointer-events-none" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}