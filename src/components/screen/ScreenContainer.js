import React from "react";

import FileManager from "./FileManager";
import DecryptorTerminal from "./DecryptorTerminal";

export default function ScreenContainer() {
  return (
    <div className="bg-zinc-950 h-screen p-5 w-full">
      <div className="flex lg:flex-row flex-col gap-5 w-full h-full tracking-wider font-bold text-xl ">
        <FileManager />
        <DecryptorTerminal />
      </div>
      {/* <TerminalAnimation /> */}
    </div>
  );
}
