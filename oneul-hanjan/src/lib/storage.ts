import type { FeedbackMap, FeedbackValue, SavedCombo, SpiritCategoryId } from '../types';

// localStorage 기반 저장 유틸. 백엔드가 없는 초기 버전이라 브라우저에만 저장됩니다.

const SAVED_COMBOS_KEY = 'oneul-hanjan:savedCombos';
const FEEDBACK_KEY = 'oneul-hanjan:feedback';

export function makeComboId(categoryId: string, snackId: string) {
  return `${categoryId}__${snackId}`;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getSavedCombos(): SavedCombo[] {
  if (typeof window === 'undefined') return [];
  return safeParse<SavedCombo[]>(window.localStorage.getItem(SAVED_COMBOS_KEY), []);
}

export function isComboSaved(categoryId: string, snackId: string): boolean {
  const id = makeComboId(categoryId, snackId);
  return getSavedCombos().some((c) => c.comboId === id);
}

export function saveCombo(categoryId: SpiritCategoryId, snackId: string): SavedCombo[] {
  const id = makeComboId(categoryId, snackId);
  const current = getSavedCombos();
  if (current.some((c) => c.comboId === id)) return current;
  const next: SavedCombo[] = [
    ...current,
    { comboId: id, categoryId, snackId, savedAt: Date.now() },
  ];
  window.localStorage.setItem(SAVED_COMBOS_KEY, JSON.stringify(next));
  return next;
}

export function removeCombo(comboId: string): SavedCombo[] {
  const next = getSavedCombos().filter((c) => c.comboId !== comboId);
  window.localStorage.setItem(SAVED_COMBOS_KEY, JSON.stringify(next));
  return next;
}

export function toggleSavedCombo(categoryId: SpiritCategoryId, snackId: string): SavedCombo[] {
  const id = makeComboId(categoryId, snackId);
  return isComboSaved(categoryId, snackId) ? removeCombo(id) : saveCombo(categoryId, snackId);
}

export function getFeedbackMap(): FeedbackMap {
  if (typeof window === 'undefined') return {};
  return safeParse<FeedbackMap>(window.localStorage.getItem(FEEDBACK_KEY), {});
}

/** 같은 값을 다시 누르면 피드백을 취소합니다. */
export function setFeedback(pairingId: string, value: FeedbackValue): FeedbackMap {
  const current = getFeedbackMap();
  const next = { ...current };
  if (next[pairingId] === value) {
    delete next[pairingId];
  } else {
    next[pairingId] = value;
  }
  window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
  return next;
}
