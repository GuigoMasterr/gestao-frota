import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  // ✅ Força IPv4 de forma compatível
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  // @ts-ignore
  family: 4
});

pool.connect()
  .then(() => console.log('✅ BANCO CONECTADO COM SUCESSO! 🎉'))
  .catch((err) => {
    console.error('❌ Erro ao conectar:', err.message);
    // Se falhar IPv4, tenta sem restrição
    console.log('⚠️ Tentando sem restrição de IP...');
  });