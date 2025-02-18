import React, { useState, useEffect, useRef } from "react";
import Phaser from "phaser";
const Store1: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const [showPhaser, setShowPhaser] = useState(true);

  return (
    <div className="w-full h-full">
      <div ref={gameContainer} className="w-full h-full relative">
        <button className="absolute p-2 text-white rounded-md hover:bg-black transition-all duration-300">
          메뉴
        </button>
      </div>
    </div>
  );
};

export default Store1;
