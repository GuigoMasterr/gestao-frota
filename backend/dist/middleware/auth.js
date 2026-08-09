"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.apenasNiveis = apenasNiveis;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../config/auth"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ erro: 'Token não fornecido' });
    const [, token] = authHeader.split(' ');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, auth_1.default.jwtSecret);
        req.usuario = {
            id: decoded.id,
            nivel: decoded.nivel,
            veiculosVinculados: decoded.veiculosVinculados || []
        };
        return next();
    }
    catch {
        return res.status(401).json({ erro: 'Token inválido' });
    }
}
function apenasNiveis(...niveisPermitidos) {
    return (req, res, next) => {
        if (!niveisPermitidos.includes(req.usuario.nivel)) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }
        next();
    };
}
