import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const PORTA = process.env.PORT || 3333;

// Configurar CORS
app.use(cors({
  origin: "*", // Permite qualquer origem (ajuste depois para o endereço do seu frontend)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Rotas
import { login } from './controllers/AuthController';
app.post('/login', login);

// Rotas protegidas
import { authMiddleware } from './middleware/auth';
app.use(authMiddleware);

// Usuários, Veículos, Checklists e Chamados — adicione as rotas completas
app.get('/dashboard', (req, res) => res.json({ mensagem: `Bem-vindo! Nível: ${req.usuario.nivel}` }));

app.listen(PORTA, () => console.log(`🚀 API rodando na porta ${PORTA}`));