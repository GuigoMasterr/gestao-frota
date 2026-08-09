import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';

// ✅ CORREÇÃO: Estender a interface Request
declare global {
  namespace Express {
    interface Request {
      usuario: {
        id: number;
        nivel: string;
        veiculosVinculados: number[];
      };
    }
  }
}

interface TokenPayload {
  id: number;
  nivel: string;
  veiculosVinculados?: number[];
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' });

  const [, token] = authHeader.split(' ');
  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
    req.usuario = {
      id: decoded.id,
      nivel: decoded.nivel,
      veiculosVinculados: decoded.veiculosVinculados || []
    };
    return next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

export function apenasNiveis(...niveisPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!niveisPermitidos.includes(req.usuario.nivel)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
}