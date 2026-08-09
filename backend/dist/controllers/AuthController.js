"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const auth_1 = __importDefault(require("../config/auth"));
async function login(req, res) {
    const { email, senha } = req.body;
    const resultado = await db_1.db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0)
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    const usuario = resultado.rows[0];
    const senhaValida = await bcryptjs_1.default.compare(senha, usuario.senha);
    if (!senhaValida)
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    // Carregar veículos vinculados
    let veiculosVinculados = [];
    if (usuario.nivel === 'motorista') {
        const v = await db_1.db.query('SELECT veiculo_id FROM motorista_veiculo WHERE usuario_id = $1', [usuario.id]);
        veiculosVinculados = v.rows.map(r => r.veiculo_id);
    }
    // ✅ CORREÇÃO: Garantir que os tipos estão corretos
    const token = jsonwebtoken_1.default.sign({
        id: usuario.id,
        nivel: usuario.nivel,
        veiculosVinculados
    }, auth_1.default.jwtSecret, { expiresIn: auth_1.default.expiresIn });
    return res.json({
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            nivel: usuario.nivel,
            veiculosVinculados
        }
    });
}
