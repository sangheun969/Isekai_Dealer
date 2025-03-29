import React, { createContext, useContext, useState, useEffect } from "react";

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

export const PetListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [petList, setPetList] = useState<Pet[]>([]);

  useEffect(() => {
    window.api.loadGameFromDB().then((data) => {
      if (data?.petList) {
        setPetList(data.petList);
      }
    });
  }, []);

  const addPet = (pet: Pet) => {
    setPetList((prev) => {
      const updated = [...prev, pet];
      return updated;
    });
  };

  return (
    <PetListContext.Provider value={{ petList, addPet, setPetList }}>
      {children}
    </PetListContext.Provider>
  );
};

export const usePetList = () => {
  const context = useContext(PetListContext);
  if (!context)
    throw new Error("usePetList must be used within PetListProvider");
  return context;
};
