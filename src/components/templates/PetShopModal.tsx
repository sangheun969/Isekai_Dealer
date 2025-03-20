import React, { useState, useEffect } from "react";
import { getGameInstance } from "../organisms/gameInstance";

interface Pet {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface PetShopModalProps {
  onClose: () => void;
  onPurchase?: (pet: Pet) => void;
}

const PetShopModal: React.FC<PetShopModalProps> = ({ onClose }) => {
  const [money, setMoney] = useState<number | null>(null);
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
  useEffect(() => {
    const gameScene = getGameInstance();

    if (gameScene) {
      gameScene.events.emit("getPlayerMoney", (currentMoney: number) => {
        setMoney(currentMoney);
      });
    } else {
      console.warn("❌ [PetShopModal] GameScene을 찾을 수 없습니다.");
    }
  }, []);

  console.log("📌 [PetShopModal] 현재 보유 금액 업데이트:", money);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4">🐾 펫 상점</h2>

        <p className="text-lg font-semibold mb-4">
          {money !== null ? `${money.toLocaleString()} 코인` : "로딩 중..."}
        </p>
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
