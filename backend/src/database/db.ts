import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  family: 4,  // ✅ FORÇA IPv4 — RESOLVE O ERRO ENETUNREACH!
  ssl: {
    rejectUnauthorized: false
  }
});

// Teste de conexão
pool.connect()
  .then(() => console.log('✅ Banco conectado com SUCESSO!'))
  .catch((err) => console.error('❌ Erro ao conectar no banco:', err.message));