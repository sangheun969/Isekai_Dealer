"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePetList = exports.PetListProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PetListContext = (0, react_1.createContext)(undefined);
const PetListProvider = ({ children, }) => {
    const [petList, setPetList] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const stored = localStorage.getItem("petList");
        if (stored) {
            try {
                setPetList(JSON.parse(stored));
            }
            catch (err) {
                console.error("❌ 저장된 펫 리스트 파싱 실패:", err);
            }
        }
    }, []);
    const addPet = (pet) => {
        setPetList((prevList) => {
            const updated = [...prevList, pet];
            localStorage.setItem("petList", JSON.stringify(updated));
            return updated;
        });
    };
    return ((0, jsx_runtime_1.jsx)(PetListContext.Provider, { value: { petList, addPet, setPetList }, children: children }));
};
exports.PetListProvider = PetListProvider;
const usePetList = () => {
    const context = (0, react_1.useContext)(PetListContext);
    if (!context) {
        throw new Error("usePetList는 PetListProvider 내부에서만 사용할 수 있습니다.");
    }
    return context;
};
exports.usePetList = usePetList;
