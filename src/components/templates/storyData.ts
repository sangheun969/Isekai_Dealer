interface StoryData {
  id: number;
  name: string | null;
  text: string;
  image: string | null;
  item?: string | null;
  effect?: string | null; // effect는 선택적 속성으로 추가
}

const storyData: StoryData[] = [
  {
    id: 1,
    name: null,
    text: "",
    image: null,
    effect: null,
  },
  {
    id: 2,
    name: "수상한 남자",
    text: "'시간이 늦어서 죄송합니다. 담보로 맡을 물건 있어서요. 전당 거래를 할려고 합니다'",
    image: "frontmen3",
    effect: null,
  },
  {
    id: 3,
    name: "수상한 남자",
    text: "(낡은 가방에서 무언가를 꺼내면서) '이겁니다.'",
    image: "frontmen3",
    effect: null,
  },
  {
    id: 4,
    name: "수상한 남자",
    text: "(눈웃을 지으며) '5개의 보석이 박혀 있는 건틀렛, 단순히 보기 좋은 물건은 아닙니다.'",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 5,
    name: "수상한 남자",
    text: "'얼마까지 대출 할 수 있죠?'",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 6,
    name: "수상한 남자",
    text: "'...알겠습니다.'",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 7,
    name: "수상한 남자",
    text: "(싸인)",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 8,
    name: "수상한 남자",
    text: "...네 금전이 필요해서요. 저에게는 소중하지만 어쩔 수 없죠. 곧 되돌려 받으로 올 겁니다.",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 9,
    name: "수상한 남자",
    text: "(갑자기 눈웃음이 사라지며 진지한 눈빛으로 나를 바라본다)",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 10,
    name: "수상한 남자",
    text: "'...예민한 물건이니 착용하는 일이 없었으면 합니다.'",
    image: "frontmen3",
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 11,
    name: null,
    text: "",
    image: null,
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 12,
    name: null,
    text: "",
    image: null,
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 13,
    name: null,
    text: "",
    image: null,
    item: "gauntletItem",
    effect: null,
  },
  {
    id: 14,
    name: null,
    text: "",
    image: null,
    item: null,
    effect: "흰화면",
  },
  {
    id: 15,
    name: null,
    text: "",
    image: null,
    item: null,
    effect: null,
  },
  {
    id: 16,
    name: null,
    text: "",
    image: null,
    item: null,
    effect: null,
  },
  {
    id: 17,
    name: "소녀",
    text: "오..드디어 일어 났군아",
    image: "master",
    item: null,
    effect: null,
  },
  {
    id: 18,
    name: "소녀",
    text: "너무 긴장하지 말게 ",
    image: "master",
    item: null,
    effect: null,
  },
];

export default storyData;
