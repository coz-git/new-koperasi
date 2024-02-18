import mysql from 'mysql2/promise';

// Fungsi ini akan menginisialisasi koneksi ke MySQL
export async function createMySQLConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akutansi2',
  });
  return connection;
}