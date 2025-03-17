import React, { useState } from "react";

interface ItemListProps {
  inventory: any[];
  itemsPerPage: number;
  onClose: () => void;
}

const ItemList: React.FC<ItemListProps> = ({
  inventory,
  itemsPerPage,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const itemsToDisplay = inventory.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div
      className=" fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-gray-900 p-5 rounded-lg text-white w-[900px] text-center">
        <h2 className="text-2xl mb-4">📜 보유 아이템 목록</h2>

        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item, index) => (
            <div key={index} className="border-b py-2 flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-42 h-32 mr-4"
              />
              <div className="pl-6 mx-auto">
                <p className="text-xlg">{item.name}</p>
                <p className="text-lg text-gray-300">{item.text}</p>
                <p className="text-lg text-yellow-400">
                  ⭐ 희귀도: {item.rarity}
                </p>
                <p className="text-lg text-green-400">
                  💰 구매 가격: {(item.price ?? 0).toLocaleString()} 코인
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">아이템이 없습니다.</p>
        )}

        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-blue-500 rounded disabled:bg-gray-500"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ◀ 이전
          </button>

          <span>
            {currentPage + 1} / {totalPages || 1}
          </span>

          <button
            className="px-4 py-2 bg-blue-500 rounded disabled:bg-gray-500"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            다음 ▶
          </button>
        </div>

        <button className="mt-4 px-4 py-2 bg-red-600 rounded" onClick={onClose}>
          닫기 ❌
        </button>
      </div>
    </div>
  );
};

export default ItemList;
