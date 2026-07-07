const TOKEN_KEY = "token";

export const tokenStorage = {
  key: TOKEN_KEY,
  set(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  get() {
    return localStorage.getItem(TOKEN_KEY);
  },
  remove() {
    localStorage.removeItem(TOKEN_KEY);
  },
  has() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
