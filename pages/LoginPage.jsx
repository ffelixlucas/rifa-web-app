import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const token = await login(email, senha);
      localStorage.setItem('token', token);
      navigate('/admin'); // redireciona para dashboard
    } catch (err) {
      setErro('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem', padding: '10px' }}
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit" style={{ width: '100%', padding: '12px' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
