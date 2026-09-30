// 서비스 전역에서 쓰는 타입 정의

export type TasteTag = '달콤한 맛' | '산뜻한 맛' | '묵직한 맛';

export type SpiritCategoryId = 'whiskey' | 'brandy' | 'rum' | 'gin' | 'vodka';

export type SnackCategoryId =
  | 'cheese'
  | 'meat'
  | 'seafood'
  | 'fruit'
  | 'chocolate'
  | 'nuts'
  | 'etc';

export type PrepType = 'cook' | 'easy';

/** 술의 세부 스타일 (같은 분류라도 향과 맛이 다름을 보여주기 위함) */
export interface SpiritVariant {
  id: string;
  name: string;
  flavorTags: TasteTag[];
  aroma: string;
  taste: string;
  note: string;
}

/** 음용 방법 (해당 술에 실제로 적용되는 방법만 데이터에 넣음) */
export interface DrinkingMethod {
  id: string;
  term: string;
  termExplanation: string;
  glass: string;
  useIce: boolean;
  steps: string[];
  ratioIsExample?: boolean;
  note?: string;
}

export interface SpiritCategory {
  id: SpiritCategoryId;
  name: string;
  englishName: string;
  shortIntro: string;
  aromaSummary: string;
  tasteSummary: string;
  characteristicNote: string;
  variants: SpiritVariant[];
  drinkingMethods: DrinkingMethod[];
}

export interface Snack {
  id: string;
  name: string;
  categoryId: SnackCategoryId;
  tags: string[];
  prepTypes: PrepType[];
  estimatedWon: number;
  cookTimeMinutes: number;
  shortDescription: string;
  ingredients?: { name: string; amount: string }[];
  steps?: string[];
  platingSteps?: string[];
  servingTip: {
    temp: string;
    biteSize: string;
    pairedExtra?: string;
  };
  alternativeSnackIds?: string[];
}

/** 술 분류 + 안주 사이의 미리 작성된 페어링 데이터 */
export interface PairingEntry {
  id: string;
  categoryId: SpiritCategoryId;
  snackId: string;
  score: number; // 1~5
  reason: string;
  tasteTags?: TasteTag[];
  tastingTip: string;
  alternativeCategoryIds?: SpiritCategoryId[];
}

export interface SavedCombo {
  comboId: string; // `${categoryId}__${snackId}`
  categoryId: SpiritCategoryId;
  snackId: string;
  savedAt: number;
}

export type FeedbackValue = 'like' | 'dislike';
export type FeedbackMap = Record<string, FeedbackValue>; // pairingId -> value
