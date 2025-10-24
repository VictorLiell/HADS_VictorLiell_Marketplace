import { Router } from 'express';
import { cadastrarUsuario, loginUsuario } from '../controllers/usuarioController';

const router = Router();

router.post('/usuarios', cadastrarUsuario);
router.post('/login', loginUsuario);

export default router;
