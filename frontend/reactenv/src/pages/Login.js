import { useState } from 'react';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await api.post('/login', { email, senha });
      localStorage.setItem('token', resposta.data.token);
      alert('✅ Login realizado com sucesso!');
      console.log('Usuário:', resposta.data.usuario);
      console.log('Token:', resposta.data.token);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar na API');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)'
    }}>
      <form onSubmit={entrar} style={{
        background: '#fff', padding: 40, borderRadius: 16, width: '100%', maxWidth: 400,
        boxShadow: '0 10px 40px rgba(0,0,0,.2)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 8, color: '#1e3a8a' }}>Gestão Frota</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 24 }}>Faça seu login</p>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={estiloInput}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ ...estiloInput, marginTop: 12 }}
          required
        />

        {erro && <p style={{ color: '#dc2626', marginTop: 12, fontSize: 14 }}>{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          style={{
            ...estiloBotao,
            opacity: carregando ? 0.6 : 1,
            marginTop: 20
          }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

const estiloInput = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #ddd',
  borderRadius: 8,
  fontSize: 15,
  outline: 'none'
};

const estiloBotao = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: 8,
  background: '#1e3a8a',
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer'
};