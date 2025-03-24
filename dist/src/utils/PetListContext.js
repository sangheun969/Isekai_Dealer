"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePetList = exports.PetListProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PetListContext = (0, react_1.createContext)(undefined);
const PetListProvider = ({ children, }) => {
    const [pets, setPets] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const storedPets = localStorage.getItem("petList");
        if (storedPets) {
            setPets(JSON.parse(storedPets));
        }
    }, []);
    const addPet = (pet) => {
        setPets((prevPets) => {
            const updatedPets = [...prevPets, pet];
            localStorage.setItem("petList", JSON.stringify(updatedPets));
            return updatedPets;
        });
    };
    return ((0, jsx_runtime_1.jsx)(PetListContext.Provider, { value: { pets, addPet }, children: children }));
};
exports.PetListProvider = PetListProvider;
const usePetList = () => {
    const context = (0, react_1.useContext)(PetListContext);
    if (!context) {
        throw new Error("usePetList must be used within a PetListProvider");
    }
    return context;
};
exports.usePetList = usePetList;
