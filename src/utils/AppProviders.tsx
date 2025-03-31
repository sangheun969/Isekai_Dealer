import React from "react";
import { PetListProvider } from "../components/templates/PetListContext";

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <PetListProvider>{children}</PetListProvider>;
};

export default AppProviders;
