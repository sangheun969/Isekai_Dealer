export function getMinAcceptablePrice(
  suggestedPrice: number,
  personality: string
): number {
  switch (personality) {
    case "호구":
      return suggestedPrice / 4;
    case "철저한 협상가":
      return suggestedPrice / 2;
    case "도둑놈 기질":
      return suggestedPrice / 2.5;
    case "부유한 바보":
      return 0;
    case "초보 수집가":
      return suggestedPrice / 4;
    case "화끈한 사람":
      return suggestedPrice / 4;
    case "수상한 밀수업자":
      return suggestedPrice / 2;
    default:
      return suggestedPrice;
  }
}

export function getResponseText(
  offeredPrice: number,
  minAcceptablePrice: number,
  personality: string,
  suggestedPrice: number
): { response: string; isFinal: boolean } {
  if (offeredPrice >= minAcceptablePrice) {
    switch (personality) {
      case "철저한 협상가":
        return { response: "이 정도면 괜찮겠군요. 거래하죠!", isFinal: true };
      case "도둑놈 기질":
        return {
          response: "이런 가격에 판다고요? 개이득! 거래합시다.",
          isFinal: true,
        };
      case "부유한 바보":
        return {
          response: "오! 좋아요, 아무 가격이나 괜찮습니다! 거래 완료!",
          isFinal: true,
        };
      case "초보 수집가":
        return {
          response: "이게 적정 가격일까요? 잘 모르겠네요. 좋습니다.",
          isFinal: true,
        };
      case "화끈한 사람":
        return { response: "좋아! 바로 거래합시다!", isFinal: true };
      case "수상한 밀수업자":
        return {
          response: "이 가격이면 나도 남는 게 없군. 거래하지.",
          isFinal: true,
        };
      default:
        return {
          response: `"좋습니다. 거래할게요!"`,
          isFinal: true,
        };
    }
  }

  switch (personality) {
    case "호구":
      return {
        response: `음... ${Math.floor(suggestedPrice * 0.9)}코인은 어떠세요?`,
        isFinal: false,
      };
    case "철저한 협상가":
      return {
        response: `이 가격은 말도 안 됩니다! 다시 생각해 보세요. ${Math.floor(
          suggestedPrice * 0.85
        )}코인이라면 생각해볼게요.`,
        isFinal: false,
      };
    case "도둑놈 기질":
      return {
        response: `음..., 안 넘어가시네... ${Math.floor(
          suggestedPrice * 0.8
        )}코인까지 내려줄게요.`,
        isFinal: false,
      };
    case "부유한 바보":
      return {
        response: `이 가격은 좀 너무 낮은 것 같네요. ${Math.floor(
          suggestedPrice * 0.95
        )}코인은 어때요?`,
        isFinal: false,
      };
    case "초보 수집가":
      return {
        response: `이 가격이 적정한지 모르겠어요... 조금 더 주세요! ${Math.floor(
          suggestedPrice * 0.9
        )}코인이면 괜찮을 것 같은데?`,
        isFinal: false,
      };
    case "화끈한 사람":
      return {
        response: `흥! 이렇게 나오시겠다? ${Math.floor(
          suggestedPrice * 0.7
        )}코인 줄게.`,
        isFinal: false,
      };
    case "수상한 밀수업자":
      return {
        response: `이 가격은 너무 낮군. ${Math.floor(
          suggestedPrice * 0.88
        )}코인이라면 거래하지.`,
        isFinal: false,
      };
    default:
      return {
        response: `"${suggestedPrice}코인 이요? ${Math.floor(
          suggestedPrice * 0.85
        )}코인이라면 생각해볼게요."`,
        isFinal: false,
      };
  }
}

export function getMinPurchasePrice(
  clientOriginalPrice: number,
  personality: string
): number {
  const randomMultiplier = Math.random() * 1.5 + 1.5;

  const maxMultipliers: { [key: string]: number } = {
    호구: 2.5,
    "철저한 협상가": 1.8,
    "도둑놈 기질": 1.6,
    "부유한 바보": 3.0,
    "초보 수집가": 2.0,
    "화끈한 사람": 2.2,
    "수상한 밀수업자": 1.9,
  };

  const maxNegotiationPrice =
    clientOriginalPrice * (maxMultipliers[personality] || 2.0);

  let minPrice: number;

  switch (personality) {
    case "호구":
      minPrice = clientOriginalPrice * randomMultiplier;
      break;
    case "철저한 협상가":
      minPrice = clientOriginalPrice * 0.9;
      break;
    case "도둑놈 기질":
      minPrice = clientOriginalPrice * 0.75;
      break;
    case "부유한 바보":
      minPrice = clientOriginalPrice * 1.5;
      break;
    case "초보 수집가":
      minPrice = clientOriginalPrice * 1.1;
      break;
    case "화끈한 사람":
      minPrice = clientOriginalPrice * 1.05;
      break;
    case "수상한 밀수업자":
      minPrice = clientOriginalPrice * (Math.random() * 0.5 + 1.0);
      break;
    default:
      minPrice = clientOriginalPrice;
  }

  return Math.min(minPrice, maxNegotiationPrice);
}

export function getPurchaseResponseText(
  offeredPrice: number,
  minPurchasePrice: number,
  personality: string,
  clientOriginalPrice: number,
  maxNegotiationPrice: number
): { response: string; isFinal: boolean } {
  // 🎯 클라이언트의 제안 가격이 최대 협상 가능 가격을 초과하면 재협상 유도
  if (offeredPrice > maxNegotiationPrice) {
    switch (personality) {
      case "호구":
        return {
          response: `음... 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.5, maxNegotiationPrice)
          )}코인은 어떠세요?`,
          isFinal: false,
        };
      case "철저한 협상가":
        return {
          response: `이 가격은 너무 높습니다! 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.2, maxNegotiationPrice)
          )}코인이라면 고려해보죠.`,
          isFinal: false,
        };
      case "도둑놈 기질":
        return {
          response: `이 가격으론 안 돼요! 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.5, maxNegotiationPrice)
          )}코인까지 깎아주면 사겠습니다.`,
          isFinal: false,
        };
      case "부유한 바보":
        return {
          response: `이 가격은 적당한가요? 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.7, maxNegotiationPrice)
          )}코인에 사겠습니다!`,
          isFinal: false,
        };
      case "초보 수집가":
        return {
          response: `이게 적정 가격일까요? 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.3, maxNegotiationPrice)
          )}코인에 주시면 사겠습니다!`,
          isFinal: false,
        };
      case "화끈한 사람":
        return {
          response: `너무 비싸잖아! 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.8, maxNegotiationPrice)
          )}코인까지 내려주세요!`,
          isFinal: false,
        };
      case "수상한 밀수업자":
        return {
          response: `이 가격은 너무 높군. 💰${Math.floor(
            Math.min(clientOriginalPrice * 1.6, maxNegotiationPrice)
          )}코인에 팔면 바로 사겠습니다.`,
          isFinal: false,
        };
      default:
        return {
          response: `"💰${clientOriginalPrice}코인 이요? ${Math.floor(
            Math.min(clientOriginalPrice * 0.9, maxNegotiationPrice)
          )}코인이라면 거래합시다."`,
          isFinal: false,
        };
    }
  }

  // 기존 코드 유지 (최대 협상 가격 이하일 때)
  if (offeredPrice >= minPurchasePrice) {
    return { response: "좋습니다. 거래합시다!", isFinal: true };
  }

  return {
    response: "그 가격은 너무 낮군요. 좀 더 올려주실래요?",
    isFinal: false,
  };
}
