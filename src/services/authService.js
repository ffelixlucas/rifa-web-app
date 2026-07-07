import { loginAdmin } from "./rifaApi";
import { tokenStorage } from "./tokenStorage";

export async function login(email, senha) {
  const data = await loginAdmin(email, senha);
  if (!data?.token) {
    throw new Error("Token de autenticação não retornado.");
  }
  return data.token;
}

export const authService = {
  setToken(token) {
    tokenStorage.set(token);
  },

  getToken() {
    return tokenStorage.get();
  },

  removeToken() {
    tokenStorage.remove();
  },

  isAuthenticated() {
    return tokenStorage.has();
  },
};
