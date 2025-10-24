import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../database';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function cadastrarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Dados obrigatórios' });

    const hash = await bcrypt.hash(senha, 10);

    const { rows } = await pool.query(
      'insert into usuarios (nome, email, senha_hash) values ($1, $2, $3) returning id, nome, email',
      [nome, email, hash]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
}

export async function loginUsuario(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Dados obrigatórios' });

    const { rows } = await pool.query(
      'select id, nome, email, senha_hash from usuarios where email = $1',
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no login' });
  }
}
