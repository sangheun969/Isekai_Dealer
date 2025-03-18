import React from "react";

interface PersonalityModalProps {
  personality: string;
  greedLevel: number;
}

const PersonalityModal: React.FC<PersonalityModalProps> = ({
  personality,
  greedLevel,
}) => {
  return (
    <div className="fixed top-1/2 left-1/2 w-[30%] h-[30%] bg-slate-400 p-5 rounded-lg z-50 flex flex-col justify-center items-center transform -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-xl font-bold">손님의 성격</h2>
      <p className="mt-2">{personality}</p>

      <div className="flex flex-row gap-2 mt-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-10 h-10 border rounded-md transition-all duration-300 ${
              index < greedLevel ? "bg-red-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityModal;
