import React from "react";

interface PetShopModalProps {
  onClose: () => void;
}

const PetShopModal: React.FC<PetShopModalProps> = ({ onClose }) => {
  const pets = [
    {
      id: 1,
      name: "귀여운 강아지",
      image: "/images/main/pet2_1.png",
      price: 5000,
    },
    {
      id: 2,
      name: "귀여운 고양이",
      image: "/images/main/pet3_1.png",
      price: 7000,
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4">🐾 펫 상점</h2>
        <div className="flex flex-col gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-20 h-20 rounded-md"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{pet.name}</span>
                <span className="text-gray-600">
                  💰 {pet.price.toLocaleString()} 코인
                </span>
                <button className="mt-2 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
                  구매 기능 없음
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default PetShopModal;
