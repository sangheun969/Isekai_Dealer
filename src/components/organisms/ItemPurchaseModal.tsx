import React, { Component } from "react";

interface ItemPurchaseModalProps {
  item: any;
  purchasePrice: number;
  originalPrice: number;
  onClose: () => void;
}

interface ItemPurchaseModalState {
  isOpen: boolean;
  modalItem: any | null;
  modalPrice: number | null;
}

class ItemPurchaseModal extends Component<
  ItemPurchaseModalProps,
  ItemPurchaseModalState
> {
  constructor(props: ItemPurchaseModalProps) {
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

    if (!isOpen || !item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
          <h2 className="text-lg font-bold">{item.name}</h2>
          <img
            src={item.image}
            alt={item.name}
            className="w-32 h-32 mx-auto my-4"
          />
          <p className="text-gray-600">{item.text}</p>
          <p className="text-blue-600 font-bold">
            💰 원래 구매 가격: {originalPrice.toLocaleString()} 코인
          </p>

          <p className="text-green-600 font-bold">
            🪙 판매 가격: {purchasePrice.toLocaleString()} 코인
          </p>
          <button
            onClick={this.handleClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }
}

export default ItemPurchaseModal;
