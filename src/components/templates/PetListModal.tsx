import React, { useState, useEffect } from "react";
import { getGameInstance } from "../organisms/gameInstance";

interface Pet {
  id: number;
  name: string;
  image: string;
}

interface PetListModalProps {
  pets: Pet[];
  itemsPerPage: number;
  onClose: () => void;
}

const PetListModal: React.FC<PetListModalProps> = ({
  pets,
  itemsPerPage,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPetId, setSelectedPetId] = useState<number>(0);
  const [ownedPets, setOwnedPets] = useState<Pet[]>([]);

  const defaultPet: Pet = {
    id: 0,
    name: "기본 고양이",
    image: "/images/main/cat1.png",
  };

  useEffect(() => {
    const storedPets = localStorage.getItem("ownedPets");
    if (storedPets) {
      setOwnedPets(JSON.parse(storedPets));
    }
  }, []);

  const allPets = [defaultPet, ...pets];
  const startIndex = currentPage * itemsPerPage;
  const selectedPets = allPets.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const gameScene = getGameInstance();
    if (gameScene && gameScene.scene.isActive()) {
      gameScene.setSelectedPet(defaultPet);
    }
  }, []);
  const nextPage = () => {
    if (startIndex + itemsPerPage < allPets.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePetSelection = (pet: Pet) => {
    setSelectedPetId(pet.id);
    const gameScene = getGameInstance();
    if (gameScene && gameScene.scene.isActive()) {
      gameScene.setSelectedPet(pet);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[600px]"
        style={{ pointerEvents: "auto" }}
      >
        <h2 className="text-2xl font-bold mb-4">🐾 보유한 펫 목록</h2>
        <div className="flex flex-col gap-4">
          {selectedPets.length > 0 ? (
            selectedPets.map((pet) => (
              <button
                key={pet.id}
                className={`flex items-center gap-4 p-3 border rounded-lg ${
                  selectedPetId === pet.id ? "bg-green-400" : "bg-white"
                }`}
                onClick={() => handlePetSelection(pet)}
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-26 h-24 rounded-md"
                />
                <span className="font-semibold">{pet.name}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-600">보유한 펫이 없습니다.</p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            ◀ 이전
          </button>
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={nextPage}
            disabled={startIndex + itemsPerPage >= allPets.length}
          >
            다음 ▶
          </button>
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

export default PetListModal;
