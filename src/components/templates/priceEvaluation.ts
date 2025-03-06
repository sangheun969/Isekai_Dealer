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
      return suggestedPrice / 0.8;
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
  price: number,
  minAcceptablePrice: number,
  personality: string
): string {
  if (price >= minAcceptablePrice) {
    switch (personality) {
      case "철저한 협상가":
        return "이 정도면 괜찮겠군요.";
      case "도둑놈 기질":
        return "이런 가격에 판다고요? 개이득!";
      case "부유한 바보":
        return "오! 좋아요, 아무 가격이나 괜찮습니다!";
      case "초보 수집가":
        return "이게 적정 가격일까요? 잘 모르겠네요.";
      case "화끈한 사람":
        return "좋아! 바로 거래합시다!";
      case "수상한 밀수업자":
        return "이 가격이면 나도 남는 게 없군. 거래하지.";
      default:
        return `"${price}코인 이요?"`;
    }
  } else {
    switch (personality) {
      case "호구":
        return "음... 그 정도 바보 아닙니다.";
      case "철저한 협상가":
        return "이 가격은 말도 안 됩니다! 다시 생각해 보세요.";
      case "도둑놈 기질":
        return "바가지 씌우려고 했는데, 안 넘어가시네...";
      case "부유한 바보":
        return "이 가격은 좀 너무 낮은 것 같네요.";
      case "초보 수집가":
        return "이 가격이 적정한지 모르겠어요... 조금 더 주세요!";
      case "화끈한 사람":
        return "흥! 이렇게 나오시겠다?";
      case "수상한 밀수업자":
        return "이 가격은 너무 낮군.";
      default:
        return `"${price}코인 이요?"`;
    }
  }
}
