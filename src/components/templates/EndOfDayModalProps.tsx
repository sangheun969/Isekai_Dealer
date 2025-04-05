import React, { useState } from "react";
import PetShopModal from "./PetShopModal";
import { PetListProvider } from "./PetListContext";

interface EndOfDayModalProps {
  purchases: number;
  sales: number;
  purchaseCount: number;
  salesCount: number;
  revenue: number;
  onNextDay: () => void;
  onClose: () => void;
}

const EndOfDayModal: React.FC<EndOfDayModalProps> = ({
  purchases,
  sales,
  purchaseCount,
  salesCount,
  revenue,
  onNextDay,
  onClose,
}) => {
  const [showNoticeboard, setShowNoticeboard] = useState(false);
  const [showPetShop, setShowPetShop] = useState(false);

  const handleNext = () => {
    setShowNoticeboard(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {showNoticeboard ? (
        <div
          className="relative bg-cover bg-center p-6 rounded-lg shadow-lg w-full h-full flex flex-col items-center"
          style={{
            backgroundImage: `url(/images/background/bulletinboard.png)`,
          }}
        >
          <div className="mx-auto space-y-6">
            <div className="flex justify-around">
              <button
                className="w-[20%] h-[20%] transition-transform duration-200 hover:scale-110"
                onClick={() => console.log("🏡 부동산 목록 열기")}
              >
                <img
                  src="/images/background/boardlist2.png"
                  alt="부동산 목록"
                  className="w-full h-full"
                />
              </button>

              <button
                className="w-[20%] h-[20%] transition-transform duration-200 hover:scale-110"
                onClick={() => setShowPetShop(true)}
              >
                <img
                  src="/images/background/boardlist3.png"
                  alt="펫 샵"
                  className="w-full h-full"
                />
              </button>
            </div>
            <button
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 border px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() => {
                onNextDay();
                onClose();
              }}
            >
              다음
            </button>
          </div>
          {showPetShop && (
            <PetListProvider>
              <PetShopModal onClose={() => setShowPetShop(false)} />
            </PetListProvider>
          )}
        </div>
      ) : (
        <div
          className="w-[80%] h-[80%] p-40 rounded-lg shadow-lg  bg-cover flex flex-col "
          style={{
            backgroundImage: 'url("/images/background/status2.png")',
          }}
        >
          <h2 className="text-4xl font-bold mb-4">📊 하루 매출 정산</h2>
          <p className="text-2xl">
            🛍️ 총 구매 금액: {purchases.toLocaleString()} 코인
          </p>
          <p className="text-2xl">
            💰 총 판매 금액: {sales.toLocaleString()} 코인
          </p>
          <p className="text-2xl">📦 구매한 아이템 개수: {purchaseCount}개</p>
          <p className="text-2xl">🏪 판매한 아이템 개수: {salesCount}개</p>
          <p className="text-4xl font-bold mt-4">
            💵 오늘의 매출: {revenue.toLocaleString()} 코인
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleNext}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default EndOfDayModal;
