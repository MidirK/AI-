import type { PairingEntry } from '../types';

// 술 분류 × 안주 페어링 데이터. score는 1~5, tasteTags는 이 조합이 특히 잘 맞는 취향입니다.
// 추천 문구는 모두 이 파일에 미리 작성되어 있으며, 실시간으로 생성되지 않습니다.

export const pairings: PairingEntry[] = [
  // 카망베르 치즈 플레이트
  {
    id: 'brandy__cheese-camembert',
    categoryId: 'brandy',
    snackId: 'cheese-camembert',
    score: 5,
    reason: '브랜디의 농축된 과일 향이 카망베르의 부드러운 짠맛과 어우러져 풍미가 깊어져요.',
    tasteTags: ['묵직한 맛'],
    tastingTip:
      '치즈를 먼저 한입 맛본 뒤 브랜디를 한 모금 머금어 보세요. 입안에서 치즈의 짠맛과 브랜디의 단맛이 겹쳐지는 걸 느낄 수 있어요.',
  },
  {
    id: 'whiskey__cheese-camembert',
    categoryId: 'whiskey',
    snackId: 'cheese-camembert',
    score: 4,
    reason: '버번 스타일의 바닐라·카라멜 향이 치즈의 고소함과 잘 맞아요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '치즈를 입에 넣고 녹기 시작할 때 위스키를 한 모금 곁들이면 단맛이 더 또렷해져요.',
  },
  {
    id: 'vodka__cheese-camembert',
    categoryId: 'vodka',
    snackId: 'cheese-camembert',
    score: 3,
    reason: '깨끗한 보드카는 치즈의 풍미를 있는 그대로 살려주는 담백한 조합이에요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '보드카를 차갑게 준비해서 치즈 사이사이 입을 가볍게 씻어내듯 마셔보세요.',
  },

  // 체다치즈 크래커
  {
    id: 'whiskey__cheese-cheddar-cracker',
    categoryId: 'whiskey',
    snackId: 'cheese-cheddar-cracker',
    score: 4,
    reason: '스카치 스타일의 스모키한 향이 체다치즈의 고소함과 대비를 이루며 잘 어울려요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '크래커를 먼저 씹어 고소함을 느낀 뒤, 위스키의 스모키한 향을 이어서 맡아보세요.',
  },
  {
    id: 'gin__cheese-cheddar-cracker',
    categoryId: 'gin',
    snackId: 'cheese-cheddar-cracker',
    score: 4,
    reason: '진의 산뜻한 허브 향이 치즈의 짠맛을 가볍게 정리해줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '진토닉의 탄산이 살아있을 때 마시면 치즈의 기름진 맛이 깔끔하게 씻겨나가요.',
  },
  {
    id: 'rum__cheese-cheddar-cracker',
    categoryId: 'rum',
    snackId: 'cheese-cheddar-cracker',
    score: 3,
    reason: '다크 럼의 카라멜 향이 치즈의 짠맛에 은근한 단맛을 더해줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '치즈를 한 조각 먹은 직후 럼을 머금으면 짠맛과 단맛이 번갈아 느껴져요.',
  },

  // 블루치즈와 꿀
  {
    id: 'brandy__cheese-bluecheese-honey',
    categoryId: 'brandy',
    snackId: 'cheese-bluecheese-honey',
    score: 5,
    reason: '브랜디의 묵직한 단맛이 블루치즈의 강한 짠맛과 꿀의 단맛 사이에서 균형을 잡아줘요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '치즈와 꿀을 함께 조금 떠먹은 뒤, 브랜디를 천천히 머금어 여운을 길게 즐겨보세요.',
  },
  {
    id: 'whiskey__cheese-bluecheese-honey',
    categoryId: 'whiskey',
    snackId: 'cheese-bluecheese-honey',
    score: 4,
    reason: '스카치 스타일의 스모키함이 블루치즈의 향과 서로 지지 않고 잘 어우러져요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '향이 강한 조합이라 소량씩 천천히, 한 모금 마다 간격을 두고 즐겨보세요.',
  },
  {
    id: 'rum__cheese-bluecheese-honey',
    categoryId: 'rum',
    snackId: 'cheese-bluecheese-honey',
    score: 3,
    reason: '럼의 달콤함이 블루치즈의 짠맛과 꿀 사이의 균형을 부드럽게 이어줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '꿀을 살짝 더 넉넉하게 올린 치즈와 함께 먹으면 럼의 단맛과 잘 이어져요.',
  },

  // 스테이크 바이트
  {
    id: 'whiskey__meat-steak-bites',
    categoryId: 'whiskey',
    snackId: 'meat-steak-bites',
    score: 5,
    reason: '스카치 스타일의 스모키한 향이 구운 고기의 불향과 자연스럽게 이어져요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '고기를 씹는 동안 위스키 향을 함께 맡으면 훈연 향이 배로 느껴져요.',
  },
  {
    id: 'brandy__meat-steak-bites',
    categoryId: 'brandy',
    snackId: 'meat-steak-bites',
    score: 4,
    reason: '코냑 스타일의 묵직한 과일향이 고기의 진한 육즙과 잘 어울려요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '고기를 다 삼킨 후 브랜디를 머금으면 입안에 남은 육즙과 향이 이어져요.',
  },
  {
    id: 'rum__meat-steak-bites',
    categoryId: 'rum',
    snackId: 'meat-steak-bites',
    score: 3,
    reason: '다크 럼의 카라멜 향이 고기 겉면의 그릴 향과 은근하게 맞아떨어져요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '고기에 소스를 많이 찍지 않고, 럼의 단맛으로 감칠맛을 더해보세요.',
  },

  // 육포
  {
    id: 'rum__meat-jerky',
    categoryId: 'rum',
    snackId: 'meat-jerky',
    score: 4,
    reason: '다크 럼의 카라멜 향이 육포의 짠맛과 만나 단짠의 균형을 만들어줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '육포를 오래 씹으며 감칠맛을 낸 뒤 럼을 한 모금 곁들여보세요.',
  },
  {
    id: 'whiskey__meat-jerky',
    categoryId: 'whiskey',
    snackId: 'meat-jerky',
    score: 4,
    reason: '버번 스타일의 단맛이 육포의 짠맛을 부드럽게 감싸줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '육포를 작게 뜯어 천천히 씹으면서 위스키를 나눠 마셔보세요.',
  },
  {
    id: 'vodka__meat-jerky',
    categoryId: 'vodka',
    snackId: 'meat-jerky',
    score: 3,
    reason: '깨끗한 보드카가 육포의 진한 짠맛을 가볍게 씻어내려줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '짠맛이 입에 오래 남지 않도록 보드카를 차갑게 준비해 곁들여보세요.',
  },

  // 살라미 & 프로슈토 플레이트
  {
    id: 'gin__meat-salami-plate',
    categoryId: 'gin',
    snackId: 'meat-salami-plate',
    score: 4,
    reason: '진의 상큼한 허브 향이 육가공품의 짠맛과 기름기를 산뜻하게 정리해줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '진토닉을 한 모금 마신 뒤 살라미를 먹으면 뒷맛이 깔끔하게 이어져요.',
  },
  {
    id: 'vodka__meat-salami-plate',
    categoryId: 'vodka',
    snackId: 'meat-salami-plate',
    score: 4,
    reason: '보드카의 깨끗한 맛이 여러 육가공품의 다양한 짠맛을 부담 없이 받쳐줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '살라미와 프로슈토를 번갈아 먹으면서 그 사이사이 보드카로 입을 정리해보세요.',
  },
  {
    id: 'whiskey__meat-salami-plate',
    categoryId: 'whiskey',
    snackId: 'meat-salami-plate',
    score: 3,
    reason: '아이리시 스타일의 부드러운 목넘김이 짠맛이 강한 안주와 부딪히지 않고 잘 어울려요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '도수가 세게 느껴지지 않도록 트와이스 업으로 즐기며 곁들여보세요.',
  },

  // 훈제연어 카나페
  {
    id: 'gin__seafood-smoked-salmon',
    categoryId: 'gin',
    snackId: 'seafood-smoked-salmon',
    score: 5,
    reason: '진토닉의 상쾌한 탄산과 시트러스 향이 훈제연어의 훈연 향과 산뜻하게 어울려요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '카나페의 레몬제스트를 함께 맛본 뒤 진토닉을 마시면 향이 서로 이어져요.',
  },
  {
    id: 'vodka__seafood-smoked-salmon',
    categoryId: 'vodka',
    snackId: 'seafood-smoked-salmon',
    score: 4,
    reason: '보드카의 깨끗한 맛이 연어의 기름지고 짠맛을 가볍게 씻어줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '연어와 크림치즈를 함께 먹은 뒤 차가운 보드카로 마무리해보세요.',
  },
  {
    id: 'whiskey__seafood-smoked-salmon',
    categoryId: 'whiskey',
    snackId: 'seafood-smoked-salmon',
    score: 3,
    reason: '아이리시 스타일의 산뜻함이 훈제연어의 향을 가볍게 받쳐줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '위스키를 트와이스 업으로 열어 향을 부드럽게 만든 뒤 곁들여보세요.',
  },

  // 감바스 알 아히요
  {
    id: 'gin__seafood-gambas',
    categoryId: 'gin',
    snackId: 'seafood-gambas',
    score: 4,
    reason: '진토닉의 청량함이 마늘 오일의 매콤하고 고소한 맛을 개운하게 정리해줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '오일이 묵직하게 느껴질 때 진토닉을 한 모금 마시면 입안이 가벼워져요.',
  },
  {
    id: 'whiskey__seafood-gambas',
    categoryId: 'whiskey',
    snackId: 'seafood-gambas',
    score: 4,
    reason: '스카치 스타일의 스모키함이 마늘과 페페론치노의 매콤한 향과 은근하게 맞아떨어져요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '새우를 오일에 한 번 더 적셔 먹은 뒤 위스키의 향으로 마무리해보세요.',
  },
  {
    id: 'rum__seafood-gambas',
    categoryId: 'rum',
    snackId: 'seafood-gambas',
    score: 3,
    reason: '화이트 럼의 산뜻함이 매콤한 오일 맛 사이사이 입을 가볍게 씻어줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '모히토 스타일로 만든 럼을 곁들이면 매콤함이 한층 부드럽게 느껴져요.',
  },

  // 통새우 튀김
  {
    id: 'rum__seafood-shrimp-fry',
    categoryId: 'rum',
    snackId: 'seafood-shrimp-fry',
    score: 4,
    reason: '화이트 럼의 산뜻한 탄산 조합이 튀김의 기름진 맛을 가볍게 정리해줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '튀김을 한 조각 먹은 뒤 탄산이 강한 모히토 스타일을 마시면 개운해져요.',
  },
  {
    id: 'gin__seafood-shrimp-fry',
    categoryId: 'gin',
    snackId: 'seafood-shrimp-fry',
    score: 4,
    reason: '진토닉의 청량감이 튀김의 바삭함과 기름진 맛의 균형을 맞춰줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '레몬즙을 살짝 뿌린 새우와 함께 먹으면 진의 시트러스 향과 잘 이어져요.',
  },
  {
    id: 'vodka__seafood-shrimp-fry',
    categoryId: 'vodka',
    snackId: 'seafood-shrimp-fry',
    score: 3,
    reason: '보드카의 깨끗한 맛이 튀김의 느끼함을 부담 없이 씻어내려줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '차갑게 준비한 보드카를 튀김 한 조각마다 곁들여보세요.',
  },

  // 믹스넛
  {
    id: 'whiskey__nuts-mixed',
    categoryId: 'whiskey',
    snackId: 'nuts-mixed',
    score: 4,
    reason: '버번 스타일의 바닐라 향이 견과류의 고소함과 자연스럽게 어울려요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '견과류를 오래 씹어 고소함을 낸 뒤 위스키를 니트로 천천히 즐겨보세요.',
  },
  {
    id: 'rum__nuts-mixed',
    categoryId: 'rum',
    snackId: 'nuts-mixed',
    score: 4,
    reason: '다크 럼의 카라멜 향이 견과류의 고소함과 만나 단맛을 더해줘요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '마카다미아처럼 기름진 견과류와 함께 먹으면 럼의 향이 더 풍성해져요.',
  },
  {
    id: 'brandy__nuts-mixed',
    categoryId: 'brandy',
    snackId: 'nuts-mixed',
    score: 3,
    reason: '브랜디의 묵직한 향이 견과류의 고소함과 잘 어우러지는 클래식한 조합이에요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '견과류 한 알과 브랜디 한 모금을 천천히 번갈아 즐겨보세요.',
  },

  // 다크초콜릿 태블릿
  {
    id: 'brandy__chocolate-dark-tablet',
    categoryId: 'brandy',
    snackId: 'chocolate-dark-tablet',
    score: 5,
    reason: '브랜디의 농축된 과일향과 다크초콜릿의 쌉쌀한 단맛은 클래식하게 잘 맞는 조합이에요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '초콜릿을 입에 넣고 녹기 시작할 때 브랜디를 머금으면 향이 겹겹이 느껴져요.',
  },
  {
    id: 'rum__chocolate-dark-tablet',
    categoryId: 'rum',
    snackId: 'chocolate-dark-tablet',
    score: 4,
    reason: '다크 럼의 카라멜 향이 초콜릿의 단맛과 만나 깊은 여운을 만들어줘요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '초콜릿 한 조각을 다 녹인 뒤 럼을 한 모금 마시면 여운이 길게 이어져요.',
  },
  {
    id: 'whiskey__chocolate-dark-tablet',
    categoryId: 'whiskey',
    snackId: 'chocolate-dark-tablet',
    score: 4,
    reason: '버번 스타일의 바닐라 향이 다크초콜릿의 쌉쌀함과 균형을 이뤄요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '초콜릿이 쌉쌀하게 느껴질 때 위스키의 단맛으로 균형을 맞춰보세요.',
  },

  // 초콜릿 퐁뒤 과일꼬치
  {
    id: 'rum__chocolate-fondue',
    categoryId: 'rum',
    snackId: 'chocolate-fondue',
    score: 4,
    reason: '럼의 달콤한 향이 녹인 초콜릿과 과일의 단맛과 자연스럽게 이어져요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '과일을 초콜릿에 찍어 먹은 직후 럼을 머금으면 단맛이 겹쳐 풍성해져요.',
  },
  {
    id: 'brandy__chocolate-fondue',
    categoryId: 'brandy',
    snackId: 'chocolate-fondue',
    score: 4,
    reason: '과일 브랜디 스타일의 산뜻한 과일향이 꼬치의 생과일과 서로 잘 어울려요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '과일 조각을 먼저 맛본 뒤 브랜디를 곁들이면 향이 자연스럽게 이어져요.',
  },
  {
    id: 'vodka__chocolate-fondue',
    categoryId: 'vodka',
    snackId: 'chocolate-fondue',
    score: 3,
    reason: '플레이버드 보드카의 은은한 단맛이 초콜릿의 단맛을 무겁지 않게 받쳐줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '너무 달지 않도록 보드카를 차갑게 준비해서 소량씩 곁들여보세요.',
  },

  // 무화과 프로슈토
  {
    id: 'brandy__fruit-fig-prosciutto',
    categoryId: 'brandy',
    snackId: 'fruit-fig-prosciutto',
    score: 4,
    reason: '과일 브랜디 스타일의 산뜻한 과일향이 무화과의 단맛과 자연스럽게 겹쳐져요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '무화과와 프로슈토를 함께 먹은 뒤 브랜디를 머금어 단맛의 여운을 이어보세요.',
  },
  {
    id: 'gin__fruit-fig-prosciutto',
    categoryId: 'gin',
    snackId: 'fruit-fig-prosciutto',
    score: 4,
    reason: '플레이버드 진의 화사한 향이 무화과의 달콤함과 프로슈토의 짠맛 사이를 이어줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '발사믹 글레이즈를 함께 맛본 뒤 진을 마시면 산미와 향이 잘 어울려요.',
  },
  {
    id: 'whiskey__fruit-fig-prosciutto',
    categoryId: 'whiskey',
    snackId: 'fruit-fig-prosciutto',
    score: 3,
    reason: '아이리시 스타일의 산뜻함이 무화과와 프로슈토의 단짠 조합을 가볍게 받쳐줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '프로슈토의 짠맛이 강하게 남지 않도록 위스키를 트와이스 업으로 곁들여보세요.',
  },

  // 애플 시나몬 슬라이스
  {
    id: 'brandy__fruit-apple-cinnamon',
    categoryId: 'brandy',
    snackId: 'fruit-apple-cinnamon',
    score: 4,
    reason: '과일 브랜디 스타일의 사과 향이 애플 슬라이스와 그대로 겹쳐져 자연스러워요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '시나몬 향을 먼저 맡은 뒤 브랜디의 과일향을 이어서 느껴보세요.',
  },
  {
    id: 'whiskey__fruit-apple-cinnamon',
    categoryId: 'whiskey',
    snackId: 'fruit-apple-cinnamon',
    score: 4,
    reason: '버번 스타일의 바닐라·시나몬을 닮은 향이 사과와 시나몬 조합과 잘 맞아요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '사과를 한 조각 먹은 뒤 위스키를 머금으면 시나몬 향이 더 진하게 느껴져요.',
  },
  {
    id: 'rum__fruit-apple-cinnamon',
    categoryId: 'rum',
    snackId: 'fruit-apple-cinnamon',
    score: 3,
    reason: '다크 럼의 카라멜 향이 사과와 시나몬의 달콤함에 깊이를 더해줘요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '사과와 럼을 함께 머금어 시나몬-카라멜 향이 섞이는 걸 느껴보세요.',
  },

  // 오렌지필 다크초콜릿
  {
    id: 'brandy__chocolate-orange-peel',
    categoryId: 'brandy',
    snackId: 'chocolate-orange-peel',
    score: 4,
    reason: '코냑 스타일의 묵직한 향과 오렌지 향의 초콜릿은 서로를 돋보이게 하는 조합이에요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '초콜릿의 오렌지 향이 사라지기 전에 브랜디를 머금어 향을 이어보세요.',
  },
  {
    id: 'gin__chocolate-orange-peel',
    categoryId: 'gin',
    snackId: 'chocolate-orange-peel',
    score: 4,
    reason: '플레이버드 진의 시트러스 향이 오렌지 초콜릿의 향과 겹쳐지며 산뜻해져요.',
    tasteTags: ['달콤한 맛'],
    tastingTip: '초콜릿을 먹기 전 진의 향을 먼저 맡아 시트러스 향을 비교해보세요.',
  },
  {
    id: 'rum__chocolate-orange-peel',
    categoryId: 'rum',
    snackId: 'chocolate-orange-peel',
    score: 3,
    reason: '다크 럼의 카라멜 향이 오렌지 초콜릿의 단맛을 더 묵직하게 받쳐줘요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '초콜릿을 다 녹인 후 럼을 머금으면 오렌지 향이 은은하게 남아있어요.',
  },

  // 올리브 마늘절임
  {
    id: 'gin__etc-olive-marinade',
    categoryId: 'gin',
    snackId: 'etc-olive-marinade',
    score: 5,
    reason: '진의 허브·주니퍼 향과 올리브의 짠맛은 마티니 가니시로도 쓰이는 클래식한 궁합이에요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '올리브를 한 알 씹은 직후 진을 머금으면 향이 서로를 끌어올려줘요.',
  },
  {
    id: 'vodka__etc-olive-marinade',
    categoryId: 'vodka',
    snackId: 'etc-olive-marinade',
    score: 4,
    reason: '보드카의 깨끗한 맛이 올리브와 마늘절임의 짠맛·감칠맛을 부담 없이 받쳐줘요.',
    tasteTags: ['산뜻한 맛'],
    tastingTip: '마늘절임을 먹은 뒤 차가운 보드카로 입안을 가볍게 정리해보세요.',
  },
  {
    id: 'whiskey__etc-olive-marinade',
    categoryId: 'whiskey',
    snackId: 'etc-olive-marinade',
    score: 3,
    reason: '스카치 스타일의 스모키함이 절임의 짠맛과 은근하게 어울려요.',
    tasteTags: ['묵직한 맛'],
    tastingTip: '올리브 하나에 위스키 한 모금씩, 천천히 짠맛과 스모키함을 번갈아 느껴보세요.',
  },
];

export function getPairingsForCategory(categoryId: string) {
  return pairings.filter((p) => p.categoryId === categoryId);
}

export function getPairingsForSnack(snackId: string) {
  return pairings.filter((p) => p.snackId === snackId);
}

export function getPairing(categoryId: string, snackId: string) {
  return pairings.find((p) => p.categoryId === categoryId && p.snackId === snackId);
}
