export default {
  jwtSecret: process.env.JWT_SECRET || 'segredo_super_secreto',
  expiresIn: '7d'
};