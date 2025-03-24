import React, { useState, useEffect } from "react";
import { loadGameProgress, saveGameProgress } from "../../utils/apiService";

interface SaveSlot {
  id: number;
  money: number;
  items: any[];
}

const SavePage: React.FC<{
  onClose: () => void;
  onLoad: (data: SaveSlot) => void;
}> = ({ onClose, onLoad }) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    const fetchSaveData = async () => {
      const data = await loadGameProgress();
      if (data) {
        const updatedSlots = Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          money: data[index]?.money || 0,
          items: data[index]?.items || [],
        }));
        setSaveSlots(updatedSlots);
      } else {
        setSaveSlots(
          Array.from({ length: 10 }, (_, index) => ({
            id: index + 1,
            money: 0,
            items: [],
          }))
        );
      }
    };

    fetchSaveData();
  }, []);

  const handleSave = async (slotId: number) => {
    const currentData = { money: 100000, items: [] };
    await saveGameProgress(currentData.money, currentData.items, [], {});
    setSaveSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === slotId
          ? { ...slot, money: currentData.money, items: currentData.items }
          : slot
      )
    );
    alert(`슬롯 ${slotId}에 저장되었습니다.`);
  };

  const handleLoad = (slotId: number) => {
    const selectedData = saveSlots.find((slot) => slot.id === slotId);
    if (selectedData && selectedData.money > 0) {
      onLoad(selectedData);
      onClose();
    } else {
      alert("저장된 데이터가 없습니다.");
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="w-[600px] h-[500px] bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl mb-4 text-center">📂 저장 슬롯</h2>
        <div className="grid grid-cols-5 gap-4">
          {saveSlots.map((slot) => (
            <div
              key={slot.id}
              className="border border-gray-500 p-3 rounded-md flex flex-col items-center"
            >
              <p className="text-white">슬롯 {slot.id}</p>
              <p className="text-sm text-gray-300">
                💰 {slot.money.toLocaleString()} 코인
              </p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                onClick={() => handleSave(slot.id)}
              >
                저장
              </button>
              <button
                className="mt-1 bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-700"
                onClick={() => handleLoad(slot.id)}
              >
                불러오기
              </button>
            </div>
          ))}
        </div>
        <button
          className="w-full mt-6 bg-red-500 text-white py-2 rounded-md hover:bg-red-700"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SavePage;
