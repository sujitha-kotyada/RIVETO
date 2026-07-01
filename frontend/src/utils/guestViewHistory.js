// Lightweight localStorage-backed view history for guests (logged-out users).
// Logged-in users get real persistence via the backend (/user/recently-viewed);
// this is just so the section isn't empty before sign-in.

const STORAGE_KEY = 'riveto_guest_recently_viewed';
const MAX_GUEST_HISTORY = 8;

export function getGuestViewedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function recordGuestView(productId) {
  if (!productId) return;
  try {
    const ids = getGuestViewedIds().filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids.slice(0, MAX_GUEST_HISTORY))
    );
  } catch {
    // localStorage may be unavailable (privacy mode, quota, etc.) — fail silently.
  }
}

export function removeGuestViewedId(productId) {
  try {
    const ids = getGuestViewedIds().filter((id) => id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function clearGuestViewHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
