import React from "react";

import FileManager from "./FileManager";
import DecryptorTerminal from "./DecryptorTerminal";

import AITerminal from "./AITerminal";

export default function ScreenContainer() {
  return (
    <div className="bg-zinc-950 min-h-screen lg:min-h-fit lg:h-screen p-5 w-full">
      <div className="flex lg:flex-row flex-col gap-5 w-full h-full lg:h-3/5 tracking-wider font-bold text-xl ">
        <FileManager />
        <DecryptorTerminal />
      </div>
      <div className="flex lg:flex-row flex-col gap-5 w-full h-2/5 tracking-wider font-bold text-xl pt-5 ">
        <AITerminal />
      </div>
    </div>
  );
}
