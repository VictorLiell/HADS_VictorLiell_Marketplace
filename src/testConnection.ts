import pool from './database.js';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    console.log('Usuários:', rows);
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
