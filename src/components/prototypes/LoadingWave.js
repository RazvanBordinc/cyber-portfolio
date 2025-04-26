"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LoadingWave() {
  const spikeCount = 60;
  const ringRadius = 100; // px from center to spike base
  const maxH = 200; // px when “up”
  const baseH = maxH * 0.6; // px when “down”
  const baseCycle = 3; // average seconds per dip cycle

  // build our spikes with random delay & duration
  const spikes = Array.from({ length: spikeCount }, (_, i) => {
    const angle = (i * 360) / spikeCount;
    // each one waits 0–2s before its first dip
    const delay = Math.random();
    // each cycle lasts ~2.5–3.5s
    const duration = baseCycle * (0.8 + Math.random() * 0.4);
    return { angle, delay, duration };
  });

  return (
    <div className="relative w-64 h-64 rounded-full   ">
      {spikes.map(({ angle, delay, duration }, idx) => (
        <div
          key={idx}
          className="absolute inset-0"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <motion.div
            className="absolute left-1/2 w-1 bg-cyan-400 origin-bottom rounded-full"
            style={{
              bottom: `${ringRadius}px`,
              transform: "translateX(-50%)",
            }}
            initial={{ height: maxH }}
            animate={{ height: [maxH, maxH, baseH, maxH] }}
            transition={{
              duration,
              times: [0, 0.2, 0.6, 1],
              ease: "easeInOut",
              repeat: Infinity,
              delay,
            }}
          />
        </div>
      ))}

      {/* center core */}
      <div className="absolute inset-0 flex items-center justify-center">
        {spikes.map(({ angle, delay, duration }, idx) => (
          <div
            key={idx}
            className="absolute inset-0"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <motion.div
              className="absolute left-1/2 w-1 bg-red-400 origin-bottom rounded-full"
              style={{
                bottom: `${ringRadius}px`,
                transform: "translateX(-50%)",
              }}
              initial={{ height: maxH }}
              animate={{ height: [maxH, maxH, baseH, maxH] }}
              transition={{
                duration,
                times: [0, 0.2, 0.6, 1],
                ease: "easeInOut",
                repeat: Infinity,
                delay: delay + 0.6,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
