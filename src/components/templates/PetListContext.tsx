import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Pet {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface PetListContextType {
  petList: Pet[];
  addPet: (pet: Pet) => void;
  setPetList: (pets: Pet[]) => void;
}

const PetListContext = createContext<PetListContextType | undefined>(undefined);

export const PetListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [petList, setPetList] = useState<Pet[]>([]);

  // 💾 로컬스토리지에서 초기값 불러오기 (선택사항)
  useEffect(() => {
    const stored = localStorage.getItem("petList");
    if (stored) {
      try {
        setPetList(JSON.parse(stored));
      } catch (err) {
        console.error("❌ 저장된 펫 리스트 파싱 실패:", err);
      }
    }
  }, []);

  // 🧠 펫 추가 함수
  const addPet = (pet: Pet) => {
    setPetList((prevList) => {
      const updated = [...prevList, pet];
      localStorage.setItem("petList", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <PetListContext.Provider value={{ petList, addPet, setPetList }}>
      {children}
    </PetListContext.Provider>
  );
};

export const usePetList = (): PetListContextType => {
  const context = useContext(PetListContext);
  if (!context) {
    throw new Error(
      "usePetList는 PetListProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};
