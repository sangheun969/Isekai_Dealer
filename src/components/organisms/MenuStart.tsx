import React, { useState } from "react";
import SavePage from "../../game/SavePage";

const MenuStart: React.FC = () => {
  const [showPhaser, setShowPhaser] = useState(false);

  const handleNewStart = () => {
    setShowPhaser(true);
  };
  return (
    <div className="flex flex-col gap-10 text-6xl font-bold">
      {/* {!showPhaser ? (
        <button
          onClick={handleNewStart}
          className="py-3 hover:rounded-md hover:bg-gradient-to-r hover:from-white hover:via-slate-300 hover:to-white transition-all duration-500"
        >
          새시작
        </button>
      ) : (
        <SavePage />
      )}  */}
    </div>
  );
};

export default MenuStart;
