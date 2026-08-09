import { Pool } from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

const host = process.env.DB_HOST || '';
const port = parseInt(process.env.DB_PORT || '5432');
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// Variável exportada (declarada FORA da função)
export let pool: Pool;

// Resolve para IPv4 e conecta
dns.lookup(host, 4, (err, ipv4Address) => {
  if (err) {
    console.error('❌ Erro ao resolver IPv4:', err.message);
    return;
  }

  console.log(`✅ Host resolvido para IPv4: ${ipv4Address}`);

  // Cria pool com IPv4 resolvido
  pool = new Pool({
    host: ipv4Address,
    port,
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool.connect()
    .then(() => console.log('✅ BANCO CONECTADO COM SUCESSO via IPv4! 🎉'))
    .catch((connErr) => console.error('❌ Erro final conexão:', connErr.message));
});