export function getMinAcceptablePrice(
  suggestedPrice: number,
  personality: string,
  greedLevel: number
): number {
  let basePrice: number;
  switch (personality) {
    case "호구":
    case "초보 수집가":
    case "화끈한 사람":
      basePrice = suggestedPrice / 4;
      break;
    case "철저한 협상가":
      basePrice = suggestedPrice / 2;
      break;
    case "도둑놈 기질":
      basePrice = suggestedPrice / 2.5;
      break;
    case "수상한 밀수업자":
      basePrice = suggestedPrice / 2;
      break;
    case "부유한 바보":
      basePrice = 0;
      break;
    default:
      basePrice = suggestedPrice;
  }
  const greedMultiplier = 1 + (greedLevel - 1) * 0.1;
  return Math.floor(basePrice * greedMultiplier);
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
        return { response: "이 정도면 괜찮겠군요.", isFinal: true };
      case "도둑놈 기질":
        return {
          response: "크크 ",
          isFinal: true,
        };
      case "부유한 바보":
        return {
          response: "오! 좋아요, 아무 가격이나 괜찮습니다!",
          isFinal: true,
        };
      case "초보 수집가":
        return {
          response: "이게 적정 가격일까요? 잘 모르겠네요",
          isFinal: true,
        };
      case "화끈한 사람":
        return { response: "좋습니다!", isFinal: true };
      case "수상한 밀수업자":
        return {
          response: "이 가격이면 나도 남는 게 없군.",
          isFinal: true,
        };
      default:
        return {
          response: `"거래 끝난거죠?"`,
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
        response: `음... ${Math.floor(
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
  personality: string,
  greedLevel: number
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
  const greedMultiplier = 1 + (greedLevel - 1) * 0.05;
  minPrice *= greedMultiplier;

  return Math.min(minPrice, maxNegotiationPrice);
}
export function getPurchaseResponseText(
  offeredPrice: number,
  minPurchasePrice: number,
  personality: string,
  lastClientPrice: number,
  originalPrice: number,
  maxNegotiationPrice: number,
  greedLevel: number,
  purchasePrice: number
): { response: string; isFinal: boolean; increasedPrice?: number } {
  const toleranceMultiplier = Math.random() * (2.2 - 1.05) + 1.05;
  const allowedOverPrice = maxNegotiationPrice * toleranceMultiplier;
  if (offeredPrice > allowedOverPrice) {
    const personalityMultipliers: Record<string, number> = {
      호구: 1.2,
      "철저한 협상가": 1.1,
      "도둑놈 기지": 1.15,
      "부유한 바보": 1.7,
      "초보 수집가": 1.15,
      "화끈한 사람": 1.5,
      "수상한 밀수업자": 1.15,
    };

    const increaseRate = personalityMultipliers[personality] || 1.15;
    const greedBonus = (greedLevel - 1) * 0.02;
    const adjustedRate = Math.min(increaseRate + greedBonus, 1.4);

    const estimatedPrice = offeredPrice / adjustedRate;
    const counterPriceRaw =
      Math.floor(
        Math.max(
          purchasePrice + 100,
          Math.min(estimatedPrice, offeredPrice - 100)
        ) / 100
      ) * 100;

    const counterPrice = counterPriceRaw;

    switch (personality) {
      case "호구":
        return {
          response: `음... 💰${counterPrice}코인은 어떠세요?`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      case "철저한 협상가":
        return {
          response: `이 가격은 너무 높습니다! 💰${counterPrice}코인이라면 고려해보죠.`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      case "도둑놈 기질":
        return {
          response: `이 가격으론 안 돼요! 💰${counterPrice}코인까지 깎아주면 사겠습니다.`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      case "부유한 바보":
        return {
          response: `누구를 바보로 생각하나.. 💰${counterPrice}코인에 하시죠!`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      case "초보 수집가":
        return {
          response: `이게 적정 가격일까요? 💰${counterPrice}코인에 주시면 사겠습니다!`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      case "화끈한 사람":
        return {
          response: `너무 비싸잖아! 💰${counterPrice}코인까지 내려주세요!`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      case "수상한 밀수업자":
        return {
          response: `이 가격은 너무 높군. 💰${counterPrice}코인에 팔면 바로 사겠습니다.`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
      default:
        return {
          response: `💰${counterPrice}코인이라면 거래합시다.`,
          isFinal: false,
          increasedPrice: counterPrice,
        };
    }
  }

  return {
    response: `흠... 좀 더 적절한 가격을 제시해보시죠.`,
    isFinal: false,
  };
}
