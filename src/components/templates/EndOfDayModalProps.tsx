import React from "react";

interface EndOfDayModalProps {
  purchases: number;
  sales: number;
  purchaseCount: number;
  salesCount: number;
  revenue: number;
  onClose: () => void;
}

const EndOfDayModal: React.FC<EndOfDayModalProps> = ({
  purchases,
  sales,
  purchaseCount,
  salesCount,
  revenue,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">📊 하루 매출 정산</h2>
        <p>🛍️ 총 구매 금액: {purchases.toLocaleString()} 코인</p>
        <p>💰 총 판매 금액: {sales.toLocaleString()} 코인</p>
        <p>📦 구매한 아이템 개수: {purchaseCount}개</p>
        <p>🏪 판매한 아이템 개수: {salesCount}개</p>
        <p className="text-xl font-bold mt-4">
          💵 오늘의 매출: {revenue.toLocaleString()} 코인
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default EndOfDayModal;
