import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const PORTA = process.env.PORT || 3333;

// ==========================================
// ✅ CORS — PRIMEIRO de TUDO, ANTES das rotas!
// ==========================================
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204
}));

// Responde OPTIONS para qualquer rota (pré-voo)
app.options('*', cors());

// ==========================================
// Demais middlewares
// ==========================================
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// ==========================================
// Rotas
// ==========================================
import { login } from './controllers/AuthController';
app.post('/login', login);

// Rotas protegidas
import { authMiddleware } from './middleware/auth';
app.use(authMiddleware);

app.get('/dashboard', (req: any, res) => res.json({ mensagem: `Bem-vindo! Nível: ${req.user.nivel}` }));

// ==========================================
// Inicia servidor
// ==========================================
app.listen(PORTA, () => console.log(`🚀 API rodando na porta ${PORTA}`));