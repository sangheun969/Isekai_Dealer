"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const PetListContext_1 = require("../components/templates/PetListContext");
const AppProviders = ({ children, }) => {
    return (0, jsx_runtime_1.jsx)(PetListContext_1.PetListProvider, { children: children });
};
exports.default = AppProviders;
