import React from "react";

interface PersonalityModalProps {
  personality: string;
}

const PersonalityModal: React.FC<PersonalityModalProps> = ({ personality }) => {
  return (
    <div className="fixed top-1/2 left-1/2 w-[30%] h-[30%] bg-slate-400 p-5 rounded-lg z-50 flex flex-row justify-center items-center transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col justify-center items-center px-2 border">
        <h2 className="text-xl font-bold">손님의 성격</h2>
        <p className="mt-2">{personality}</p>
      </div>
      <div className="flex justify-center items-center px-2 border">img</div>
    </div>
  );
};

export default PersonalityModal;
