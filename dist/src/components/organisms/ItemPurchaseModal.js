"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
class ItemPurchaseModal extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            modalItem: null,
            modalPrice: null,
        };
    }
    handleClose = () => {
        this.setState({ isOpen: false });
        this.props.onClose();
    };
    render() {
        const { item, purchasePrice, originalPrice } = this.props;
        const { isOpen } = this.state;
        if (!isOpen || !item)
            return null;
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg shadow-lg w-80 text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold", children: item.name }), (0, jsx_runtime_1.jsx)("img", { src: item.image, alt: item.name, className: "w-32 h-32 mx-auto my-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: item.text }), (0, jsx_runtime_1.jsxs)("p", { className: "text-blue-600 font-bold", children: ["\uD83D\uDCB0 \uC6D0\uB798 \uAD6C\uB9E4 \uAC00\uACA9: ", originalPrice.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-600 font-bold", children: ["\uD83E\uDE99 \uD310\uB9E4 \uAC00\uACA9: ", purchasePrice.toLocaleString(), " \uCF54\uC778"] }), (0, jsx_runtime_1.jsx)("button", { onClick: this.handleClose, className: "mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600", children: "\uB2EB\uAE30" })] }) }));
    }
}
exports.default = ItemPurchaseModal;
