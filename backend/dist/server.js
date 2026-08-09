"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORTA = process.env.PORT || 3333;
// ==========================================
// ✅ CORS — PRIMEIRO de TUDO, ANTES das rotas!
// ==========================================
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204
}));
// Responde OPTIONS para qualquer rota (pré-voo)
app.options('*', (0, cors_1.default)());
// ==========================================
// Demais middlewares
// ==========================================
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '..', 'uploads')));
// ==========================================
// Rotas
// ==========================================
const AuthController_1 = require("./controllers/AuthController");
app.post('/login', AuthController_1.login);
// Rotas protegidas
const auth_1 = require("./middleware/auth");
app.use(auth_1.authMiddleware);
app.get('/dashboard', (req, res) => res.json({ mensagem: `Bem-vindo! Nível: ${req.user.nivel}` }));
// ==========================================
// Inicia servidor
// ==========================================
app.listen(PORTA, () => console.log(`🚀 API rodando na porta ${PORTA}`));
