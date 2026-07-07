import { tokenStorage } from "./tokenStorage";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path) {
  if (!API_BASE_URL) {
    throw new ApiError(
      "VITE_API_URL não configurada. Defina no arquivo .env.",
      500
    );
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

export async function request(path, options = {}) {
  const { method = "GET", headers = {}, body, data, auth = false } = options;
  const finalHeaders = { ...headers };

  let finalBody = body;
  if (data !== undefined) {
    finalHeaders["Content-Type"] =
      finalHeaders["Content-Type"] || "application/json";
    finalBody = JSON.stringify(data);
  }

  if (auth) {
    const token = tokenStorage.get();
    if (!token) {
      throw new ApiError("Sessão expirada. Faça login novamente.", 401);
    }
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  const responseData = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.remove();
    }

    const message =
      responseData?.erro ||
      responseData?.message ||
      `Erro na requisição (${response.status})`;
    throw new ApiError(message, response.status, responseData);
  }

  return responseData;
}

export function get(path, options = {}) {
  return request(path, { ...options, method: "GET" });
}

export function post(path, data, options = {}) {
  return request(path, { ...options, method: "POST", data });
}

export function put(path, data, options = {}) {
  return request(path, { ...options, method: "PUT", data });
}

export function patch(path, data, options = {}) {
  return request(path, { ...options, method: "PATCH", data });
}

export function del(path, options = {}) {
  return request(path, { ...options, method: "DELETE" });
}

export { ApiError, API_BASE_URL };
