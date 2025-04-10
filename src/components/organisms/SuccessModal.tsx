import React from "react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <p className="text-lg font-semibold text-center">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
