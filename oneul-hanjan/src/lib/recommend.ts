import { snacks } from '../data/snacks';
import { pairings } from '../data/pairings';
import type {
  FeedbackMap,
  PairingEntry,
  PrepType,
  Snack,
  SpiritCategoryId,
  TasteTag,
} from '../types';

export interface BudgetOption {
  id: 'low' | 'mid' | 'high';
  label: string;
  maxWon: number;
}

export interface TimeOption {
  id: 'quick' | 'medium' | 'long';
  label: string;
  maxMinutes: number;
}

export const BUDGET_OPTIONS: BudgetOption[] = [
  { id: 'low', label: '1만원 이하', maxWon: 10000 },
  { id: 'mid', label: '2만원 이하', maxWon: 20000 },
  { id: 'high', label: '예산 제한 없음', maxWon: Infinity },
];

export const TIME_OPTIONS: TimeOption[] = [
  { id: 'quick', label: '10분 이내', maxMinutes: 10 },
  { id: 'medium', label: '20분 이내', maxMinutes: 20 },
  { id: 'long', label: '시간 제한 없음', maxMinutes: Infinity },
];

export const PREP_OPTIONS: { id: PrepType; label: string; helper: string }[] = [
  { id: 'cook', label: '직접 만들기', helper: '재료를 사서 직접 조리하는 안주예요' },
  { id: 'easy', label: '간편식', helper: '사서 바로, 또는 간단히 담기만 하면 되는 안주예요' },
];

export const TASTE_OPTIONS: { id: TasteTag; label: string; helper: string }[] = [
  { id: '달콤한 맛', label: '달콤한 맛', helper: '단맛과 부드러운 향이 도드라지는 스타일' },
  { id: '산뜻한 맛', label: '산뜻한 맛', helper: '가볍고 청량하게 넘어가는 스타일' },
  { id: '묵직한 맛', label: '묵직한 맛', helper: '향과 여운이 길고 진하게 남는 스타일' },
];

export interface RankedSnack {
  snack: Snack;
  pairing: PairingEntry;
  finalScore: number;
}

function scorePairing(p: PairingEntry, taste: TasteTag | null, feedback: FeedbackMap): number {
  const tasteBonus = taste && p.tasteTags?.includes(taste) ? 1.5 : 0;
  const fb = feedback[p.id];
  const feedbackAdjust = fb === 'like' ? 1 : fb === 'dislike' ? -2 : 0;
  return p.score + tasteBonus + feedbackAdjust;
}

function filterSnackPool(prep: PrepType, maxWon: number, maxMinutes: number): Snack[] {
  return snacks.filter(
    (s) => s.prepTypes.includes(prep) && s.estimatedWon <= maxWon && s.cookTimeMinutes <= maxMinutes,
  );
}

function rankForCategory(
  categoryId: SpiritCategoryId,
  taste: TasteTag | null,
  pool: Snack[],
  feedback: FeedbackMap,
): RankedSnack[] {
  const poolIds = new Set(pool.map((s) => s.id));
  return pairings
    .filter((p) => p.categoryId === categoryId && poolIds.has(p.snackId))
    .map((p) => ({
      snack: snacks.find((s) => s.id === p.snackId)!,
      pairing: p,
      finalScore: scorePairing(p, taste, feedback),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
}

export interface DrinkRecommendationInput {
  categoryId: SpiritCategoryId;
  taste: TasteTag;
  budgetId: BudgetOption['id'];
  timeId: TimeOption['id'];
  prep: PrepType;
  feedback: FeedbackMap;
}

export interface DrinkRecommendationResult {
  strict: RankedSnack[];
  relaxed: RankedSnack[];
  usedRelaxed: boolean;
}

/** "술부터 고르기" 흐름: 조건을 만족하는 안주를 최대 3개까지 추천합니다. */
export function recommendSnacksForSpirit(input: DrinkRecommendationInput): DrinkRecommendationResult {
  const budget = BUDGET_OPTIONS.find((b) => b.id === input.budgetId) ?? BUDGET_OPTIONS[2];
  const time = TIME_OPTIONS.find((t) => t.id === input.timeId) ?? TIME_OPTIONS[2];

  const strictPool = filterSnackPool(input.prep, budget.maxWon, time.maxMinutes);
  const strict = rankForCategory(input.categoryId, input.taste, strictPool, input.feedback).slice(0, 3);

  if (strict.length > 0) {
    return { strict, relaxed: [], usedRelaxed: false };
  }

  const relaxedPool = filterSnackPool(input.prep, Infinity, Infinity);
  const relaxed = rankForCategory(input.categoryId, input.taste, relaxedPool, input.feedback).slice(0, 3);
  return { strict, relaxed, usedRelaxed: relaxed.length > 0 };
}

export interface RankedSpirit {
  categoryId: SpiritCategoryId;
  pairing: PairingEntry;
  finalScore: number;
}

/** "안주부터 고르기" 흐름: 선택한 안주에 어울리는 술 종류를 추천합니다. */
export function recommendSpiritsForSnack(snackId: string, feedback: FeedbackMap): RankedSpirit[] {
  return pairings
    .filter((p) => p.snackId === snackId)
    .map((p) => ({
      categoryId: p.categoryId,
      pairing: p,
      finalScore: scorePairing(p, null, feedback),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
}

export function searchSnacks(query: string, categoryId: string | null): Snack[] {
  const q = query.trim().toLowerCase();
  return snacks.filter((s) => {
    const matchesCategory = !categoryId || s.categoryId === categoryId;
    const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });
}

/** 홈 화면에 보여줄, 데이터에서 특히 점수가 높은 조합만 뽑은 목록 */
export function getFeaturedCombos(limit = 4) {
  return [...pairings].sort((a, b) => b.score - a.score).slice(0, limit);
}
