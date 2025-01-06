import React from "react";
import MenuStart from "../organisms/MenuStart";

const MenuBar: React.FC = () => {
  return (
    <div className="absolute top-0 w-full h-[100vh]">
      <MenuStart />
    </div>
  );
};

export default MenuBar;
