"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntranceAnimation({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const glitchTimerRef = useRef(null);

  // Handle canvas-based matrix rain animation
  useEffect(() => {
    if (!isLoading) return;

    // Setup canvas once DOM is ready
    const setupCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);

      // Matrix rain effect
      const fontSize = 12;
      const columns = Math.ceil(canvas.width / fontSize);
      const drops = [];

      // Initialize the drops
      for (let i = 0; i < columns; i++) {
        // Random starting point (top of screen to a bit above)
        drops[i] = Math.floor((Math.random() * -canvas.height) / fontSize);
      }

      // Glitch effect - disrupt the rain
      const createGlitch = () => {
        // Random glitch timing
        const glitchDuration = 50 + Math.floor(Math.random() * 200);

        // Apply glitch effect
        ctx.save();

        // Full screen flash
        if (Math.random() > 0.7) {
          ctx.fillStyle = "rgba(16, 185, 129, 0.1)"; // Emerald with low opacity
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Line displacement
        if (Math.random() > 0.5) {
          const y = Math.random() * canvas.height;
          const height = 1 + Math.floor(Math.random() * 30);
          ctx.drawImage(
            canvas,
            0,
            y,
            canvas.width,
            height,
            Math.random() > 0.5 ? -20 : 20,
            y,
            canvas.width,
            height
          );
        }

        ctx.restore();

        // Schedule next glitch
        glitchTimerRef.current = setTimeout(() => {
          if (isLoading) {
            createGlitch();
          }
        }, 500 + Math.floor(Math.random() * 2000));
      };

      // Start glitch cycle
      createGlitch();

      // Draw function - render each frame
      const draw = () => {
        if (!isLoading) return;

        // Semi-transparent black to create fade effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#10b981"; // Emerald for most characters
        ctx.font = fontSize + "px monospace";

        // Render each column
        for (let i = 0; i < drops.length; i++) {
          // Choose 0 or 1
          const text = Math.random() > 0.5 ? "0" : "1";

          // Randomize brightness for some characters
          if (Math.random() > 0.98) {
            ctx.fillStyle = "#34d399"; // Brighter emerald for highlights
          } else if (Math.random() > 0.9) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.8)"; // Slightly dimmed
          } else {
            ctx.fillStyle = "rgba(16, 185, 129, 0.5)"; // Regular dim characters
          }

          // Draw the character
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          if (y > 0) {
            ctx.fillText(text, x, y);
          }

          // Reset when reaching bottom or randomly
          if (y > canvas.height || Math.random() > 0.99) {
            drops[i] = 0;
          }

          // Move drop down
          drops[i]++;
        }

        // Request next frame
        frameRef.current = requestAnimationFrame(draw);
      };

      // Start animation
      frameRef.current = requestAnimationFrame(draw);

      // Auto-complete loading after 3 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      // Cleanup
      return () => {
        cancelAnimationFrame(frameRef.current);
        clearTimeout(glitchTimerRef.current);
        clearTimeout(timer);
        window.removeEventListener("resize", updateCanvasSize);
      };
    };

    // Run setup on next frame to ensure DOM is ready
    const timeout = setTimeout(setupCanvas, 0);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.6 },
            }}
          >
            {/* Canvas for the Matrix rain effect */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* Loading text overlay */}
            <div className="relative z-10">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-emerald-500 font-mono text-xl sm:text-2xl md:text-4xl mb-8 relative"
                  animate={{
                    filter: [
                      "blur(0px)",
                      "blur(1px)",
                      "blur(0px)",
                      "blur(2px)",
                      "blur(0px)",
                    ],
                    x: [0, -1, 1, -1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  <motion.span
                    className="relative"
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(16, 185, 129, 0.7)",
                        "0 0 10px rgba(16, 185, 129, 0.8)",
                        "0 0 5px rgba(16, 185, 129, 0.7)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    SYSTEM INITIALIZING
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>

            {/* Scan line */}
            <motion.div
              className="absolute w-full h-[2px] bg-emerald-500/30 pointer-events-none"
              animate={{ top: ["0%", "100%"] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />

            {/* Glitch overlay */}
            <motion.div
              className="absolute inset-0 bg-emerald-500/5 mix-blend-screen pointer-events-none z-20"
              animate={{
                opacity: [0, 0.2, 0],
                scaleY: [1, 1.01, 0.99, 1],
              }}
              transition={{
                opacity: {
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                },
                scaleY: {
                  duration: 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {isLoading && (
        <motion.button
          className="fixed bottom-6 right-6 bg-black text-emerald-500 border border-emerald-700 
                     px-3 py-1 z-50 text-xs opacity-70 hover:opacity-100"
          onClick={() => setIsLoading(false)}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.7,
            transition: { delay: 1 },
          }}
        >
          SKIP &gt;
        </motion.button>
      )}

      {/* Actual content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLoading ? 0 : 1,
          transition: { duration: 0.5 },
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
