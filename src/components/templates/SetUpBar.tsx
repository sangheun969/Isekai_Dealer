import React from "react";

interface SetUpBarProps {
  onClose: () => void;
  scene: Phaser.Scene;
}

const SetUpBar: React.FC<SetUpBarProps> = ({ onClose, scene }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="w-full h-[100vh] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-full h-full bg-black p-6 rounded-lg shadow-lg">
        <div className="py-9 flex flex-row justify-around items-center border-2 border-b-indigo-500">
          <button className="text-white px-6 py-2 rounded-md mb-4 border">
            비디오
          </button>
          <button className="text-white px-6 py-2 rounded-md mb-4 border">
            오디오
          </button>
          <button className="text-white px-6 py-2 rounded-md mb-4 border">
            언어
          </button>
        </div>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md w-[150px] mb-4 
             absolute bottom-5 right-5"
          onClick={handleClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SetUpBar;
