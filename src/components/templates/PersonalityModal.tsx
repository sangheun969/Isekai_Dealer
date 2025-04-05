import React from "react";

interface PersonalityModalProps {
  personality: string;
  greedLevel: number;
  showGreedLevel?: boolean;
  onClose: () => void;
  clientImage?: string;
}

const PersonalityModal: React.FC<PersonalityModalProps> = ({
  personality,
  greedLevel,
  showGreedLevel,
  clientImage,
  onClose,
}) => {
  return (
    <div
      className="fixed top-1/2 left-1/2 w-[70%] h-[70%] p-5 rounded-lg z-50 flex flex-col justify-center items-center transform -translate-x-1/2 -translate-y-1/2 bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/background/status1.png")',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-5 w-8 h-8"
        title="닫기"
      >
        <img
          src="/images/icon/icon2.png"
          alt="닫기"
          className="w-full h-full object-contain"
        />
      </button>
      <div className="flex flex-row w-full justify-around">
        <div className="p-10 flex flex-col gap-10">
          <span>
            <h2 className="text-2xl font-bold">손님의 성격</h2>
            <p className="mt-2 text-4xl">{personality}</p>
          </span>
          <span>
            <h2 className="text-2xl font-bold">욕심 수치</h2>
            {showGreedLevel ? (
              <div className="flex flex-row gap-2 mt-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 border rounded-md transition-all duration-300 ${
                      index < greedLevel ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-700 font-medium">
                욕심 수치를 알 수 없습니다.
              </p>
            )}
          </span>
        </div>
        <div className="">
          {clientImage && (
            <img
              src={clientImage}
              alt="클라이언트 이미지"
              className="w-[350px] h-[500px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityModal;
