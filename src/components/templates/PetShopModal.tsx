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

const PetShopModal: React.FC<PetShopModalProps> = ({ onClose, onPurchase }) => {
  const [money, setMoney] = useState<number | null>(null);
  const [petList, setPetList] = useState<Pet[]>([]); // ✅ 로컬 상태에서만 사용

  const petStoreList: Pet[] = [
    {
      id: 1,
      name: "객관안 앵무새",
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
    }

    // 💾 DB에서 기존 펫 리스트 불러오기
    const fetchPetList = async () => {
      try {
        const gameData = await window.api.loadGameFromDB();
        setPetList(gameData.petList || []);
      } catch (err) {
        console.error("❌ 펫 리스트 로드 실패:", err);
      }
    };

    fetchPetList();
  }, []);

  const handlePurchase = async (pet: Pet) => {
    if (money === null || money < pet.price) {
      alert("❌ 코인이 부족합니다.");
      return;
    }

    const gameScene = getGameInstance();
    if (!gameScene) return;

    const updatedMoney = money - pet.price;
    const updatedPetList = [...petList, pet];

    try {
      const gameData = await window.api.loadGameFromDB();

      await window.api.saveGameToDB({
        money: updatedMoney,
        items: gameData.items,
        customerData: gameData.customerData,
        petList: updatedPetList,
      });
      console.log("💾 저장되는 petList:", updatedPetList);
      gameScene.addPet(pet);
      setMoney(updatedMoney);
      setPetList(updatedPetList);
      gameScene.events.emit("updatePlayerMoney", updatedMoney);
      gameScene.setSelectedPet(pet);

      window.dispatchEvent(new Event("petListUpdated"));

      if (onPurchase) onPurchase(pet);
      alert(`✅ ${pet.name}을(를) 구매했습니다!`);
    } catch (err) {
      console.error("❌ 펫 구매 처리 중 오류:", err);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4">🐾 펫 상점</h2>

        <p className="text-lg font-semibold mb-4">
          {money !== null ? `${money.toLocaleString()} 코인` : "로딩 중..."}
        </p>

        <div className="flex flex-col gap-4">
          {petStoreList.map((pet) => (
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
                <button
                  className={`mt-2 px-4 py-2 ${
                    money !== null && money >= pet.price
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white rounded`}
                  onClick={() => handlePurchase(pet)}
                  disabled={money !== null && money < pet.price}
                >
                  구매하기
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
