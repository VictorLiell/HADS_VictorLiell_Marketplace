import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario';
import { assertConnection } from './database';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', usuarioRoutes);

const PORT = process.env.PORT || 3333;

assertConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB error:', err);
    process.exit(1);
  });
