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
        response: `바가지 씌우려고 했는데, 안 넘어가시네... ${Math.floor(
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
// export function getFinalAcceptanceText(
//   suggestedPrice: number,
//   minAcceptablePrice: number,
//   personality: string
// ): string {
//   if (suggestedPrice <= minAcceptablePrice) {
//     switch (personality) {
//       case "철저한 협상가":
//         return "네 좋습니다!";
//       case "도둑놈 기질":
//         return "하하 복 받으실 거에요!";
//       case "부유한 바보":
//         return "그런가요? 알겠습니다.";
//       case "초보 수집가":
//         return "아하 그렇군요.. 좋습니다.";
//       case "화끈한 사람":
//         return "좋아! 바로 거래합시다!";
//       case "수상한 밀수업자":
//         return "이 가격이면 나도 남는 게 없군. 거래하지.";
//       default:
//         return "음... 그래, 그 가격으로 하지.";
//     }
//   }

//   return "";
// }
