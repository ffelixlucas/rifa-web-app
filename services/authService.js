const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw new Error('Erro no login');
  }

  const data = await response.json();
  return data.token;
}
