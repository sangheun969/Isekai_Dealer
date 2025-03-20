import React, { createContext, useContext, useState, useEffect } from "react";

interface Pet {
  id: number;
  name: string;
  image: string;
}

interface PetListContextType {
  pets: Pet[];
  addPet: (pet: Pet) => void;
}

const PetListContext = createContext<PetListContextType | undefined>(undefined);

export const PetListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const storedPets = localStorage.getItem("petList");
    if (storedPets) {
      setPets(JSON.parse(storedPets));
    }
  }, []);

  const addPet = (pet: Pet) => {
    setPets((prevPets) => {
      const updatedPets = [...prevPets, pet];
      localStorage.setItem("petList", JSON.stringify(updatedPets));
      return updatedPets;
    });
  };

  return (
    <PetListContext.Provider value={{ pets, addPet }}>
      {children}
    </PetListContext.Provider>
  );
};

export const usePetList = (): PetListContextType => {
  const context = useContext(PetListContext);
  if (!context) {
    throw new Error("usePetList must be used within a PetListProvider");
  }
  return context;
};
