import React, { useState, useEffect } from "react";
import { getGameInstance } from "../organisms/gameInstance";
import SuccessModal from "../organisms/SuccessModal";
interface Pet {
  id: number;
  name: string;
  image: string;
  price: number;
  showGreedLevel?: boolean;
  description?: string;
}

interface PetShopModalProps {
  onClose: () => void;
  onPurchase?: (pet: Pet) => void;
}

const PetShopModal: React.FC<PetShopModalProps> = ({ onClose, onPurchase }) => {
  const [money, setMoney] = useState<number | null>(null);
  const [petList, setPetList] = useState<Pet[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const petStoreList: Pet[] = [
    {
      id: 1,
      name: "객관안 앵무새",
      image: "/images/main/pet2_1.png",
      price: 5000,
      showGreedLevel: true,
      description: "손님의 욕심 수치를 볼 수 있는 능력을 가진 앵무새입니다.",
    },
    {
      id: 2,
      name: "귀여운 고양이",
      image: "/images/main/pet3_1.png",
      price: 7000,
      showGreedLevel: true,
      description: "손님의 욕심 수치를 볼 수 있는 능력을 가진 앵무새입니다.",
    },
    {
      id: 3,
      name: "꼬마 용",
      image: "/images/main/pet4_1.png",
      price: 7000,
      showGreedLevel: false,
      description:
        "성격 파악 능력은 없지만 귀여움으로 가게 분위기를 살려줍니다.",
    },
  ];
  useEffect(() => {
    const gameScene = getGameInstance();
    if (gameScene) {
      gameScene.events.emit("getPlayerMoney", (currentMoney: number) => {
        setMoney(currentMoney);
      });
    }

    const fetchPetList = async () => {
      try {
        const gameData = await window.api.loadGameFromDB();
        const loadedPetList = Array.isArray(gameData.petList)
          ? gameData.petList
          : [];

        setPetList(loadedPetList);
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
    const updatedPetList = [...(petList || []), pet];

    try {
      const gameData = await window.api.loadGameFromDB();

      await window.api.saveGameToDB({
        money: updatedMoney,
        items: gameData.items,
        customerData: gameData.customerData,
        petList: updatedPetList,
      });

      gameScene.addPet(pet);
      setMoney(updatedMoney);
      setPetList(updatedPetList);
      gameScene.events.emit("updatePlayerMoney", updatedMoney);
      gameScene.setSelectedPet(pet);
      window.dispatchEvent(new Event("petListUpdated"));

      if (onPurchase) onPurchase(pet);
      setSuccessMessage(`✅ ${pet.name}을(를) 구매했습니다!`);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("❌ 펫 구매 처리 중 오류:", err);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
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
                className="w-30 h-20 rounded-md"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{pet.name}</span>
                <span className="text-gray-600">
                  💰 {pet.price.toLocaleString()} 코인
                </span>
                <span className="text-sm text-gray-700 mt-1">
                  {pet.description}
                </span>
                <button
                  className={`w-[150px] mt-2 px-4 py-2 ${
                    money !== null && money >= pet.price
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white rounded`}
                  onClick={() => handlePurchase(pet)}
                  disabled={money !== null && money < pet.price}
                >
                  구매하기
                </button>
                {showSuccessModal && (
                  <SuccessModal
                    message={successMessage}
                    onClose={() => setShowSuccessModal(false)}
                  />
                )}
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
