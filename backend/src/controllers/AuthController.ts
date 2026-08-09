import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import authConfig from '../config/auth';

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (resultado.rows.length === 0) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

  const usuario = resultado.rows[0];
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

  // Carregar veículos vinculados
  let veiculosVinculados: number[] = [];
  if (usuario.nivel === 'motorista') {
    const v = await db.query('SELECT veiculo_id FROM motorista_veiculo WHERE usuario_id = $1', [usuario.id]);
    veiculosVinculados = v.rows.map(r => r.veiculo_id);
  }

  // ✅ CORREÇÃO: Garantir que os tipos estão corretos
  const token = jwt.sign(
    { 
      id: usuario.id, 
      nivel: usuario.nivel, 
      veiculosVinculados 
    },
    authConfig.jwtSecret as string,
    { expiresIn: authConfig.expiresIn as jwt.SignOptions['expiresIn'] }
  );

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