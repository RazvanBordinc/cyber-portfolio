"use client";

import { useState, useEffect } from "react";
import EntranceAnimation from "./EntranceAnimation";

export default function AnimationWrapper({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevents hydration issues by not rendering anything on first render
  if (!isMounted) {
    // Return an invisible placeholder with the same structure to prevent layout shifts
    return (
      <div className="min-h-screen bg-black">
        {/* Empty div with same structure as the app */}
      </div>
    );
  }

  return <EntranceAnimation>{children}</EntranceAnimation>;
}
