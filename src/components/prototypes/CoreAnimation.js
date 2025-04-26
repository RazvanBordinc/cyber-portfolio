import React from "react";

export default function CoreAnimation() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hexagons"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M5 0L10 5L5 10L0 5L5 0Z"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#hexagons)" />
    </svg>
  );
}
