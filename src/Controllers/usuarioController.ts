import { Request, Response } from 'express';
import pool from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'default_secret';

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, telefone]
    );

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: 'Informe email e senha.' });

  try {
    const [rows] = await pool.query<any[]>('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta.' });

    const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });
    res.json({ mensagem: 'Login bem-sucedido!', token });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no login.' });
  }
};
