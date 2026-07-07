import { del, get, post, put } from "./apiClient";

export function loginAdmin(email, senha) {
  return post("/login", { email, senha });
}

export function listarRifasPublicas() {
  return get("/rifas");
}

export function buscarRifaPublica(id) {
  return get(`/rifas/${id}`);
}

export function buscarNumerosDaRifa(id) {
  return get(`/rifas/${id}/numeros`);
}

export function listarRifasAdmin() {
  return get("/admin/rifas", { auth: true });
}

export function buscarRifaAdmin(id) {
  return get(`/admin/rifas/${id}`, { auth: true });
}

export function criarRifa(dados) {
  return post("/admin/rifas", dados, { auth: true });
}

export function excluirRifa(id) {
  return del(`/admin/rifas/${id}`, { auth: true });
}

export function atualizarNumero(id, payload) {
  return put(`/numeros/${id}`, payload, { auth: true });
}

export function reservarNumerosPublico(rifaId, payload) {
  return post(`/rifas/${rifaId}/reservas`, payload);
}

export function listarCompradoresDaRifa(id) {
  return get(`/admin/rifas/${id}/compradores`, { auth: true });
}

export function sortearRifa(id, params) {
  const query = new URLSearchParams(params).toString();
  return get(`/admin/rifas/${id}/sorteio?${query}`, { auth: true });
}

export function listarSorteiosDaRifa(id) {
  return get(`/admin/rifas/${id}/sorteios`, { auth: true });
}
