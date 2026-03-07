/**
 * Shared helpers for overlay-style UI mounted into document.body.
 *
 * @module utils/overlay
 */

const LOCK_COUNT_KEY = '__ucOverlayLockCount';
const PREV_OVERFLOW_KEY = '__ucOverlayPrevOverflow';

function getLockCount() {
  const count = Number(window[LOCK_COUNT_KEY]);
  return Number.isFinite(count) ? count : 0;
}

function setLockCount(count) {
  window[LOCK_COUNT_KEY] = count;
}

/**
 * Acquire a shared document.body scroll lock.
 */
export function acquireBodyScrollLock() {
  const currentCount = getLockCount();

  if (currentCount === 0) {
    window[PREV_OVERFLOW_KEY] = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }

  setLockCount(currentCount + 1);
}

/**
 * Release a shared document.body scroll lock.
 */
export function releaseBodyScrollLock() {
  const currentCount = getLockCount();
  if (currentCount <= 0) {
    return;
  }

  const nextCount = currentCount - 1;
  setLockCount(nextCount);

  if (nextCount === 0) {
    const previousOverflow = typeof window[PREV_OVERFLOW_KEY] === 'string'
      ? window[PREV_OVERFLOW_KEY]
      : '';

    document.body.style.overflow = previousOverflow;
    delete window[PREV_OVERFLOW_KEY];
  }
}
