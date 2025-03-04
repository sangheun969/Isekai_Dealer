import React from "react";

interface PersonalityModalProps {
  personality: string;
}

const PersonalityModal: React.FC<PersonalityModalProps> = ({ personality }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white p-5 rounded-lg z-50">
      <h2 className="text-xl font-bold">손님의 성격</h2>
      <p className="mt-2">{personality}</p>
    </div>
  );
};

export default PersonalityModal;
