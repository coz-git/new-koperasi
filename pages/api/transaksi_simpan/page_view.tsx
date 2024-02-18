import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Konfigurasi koneksi ke database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'akutansi2',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {name, email, jenis_simpanan, deskripsi, amount, created_at,created_by} = req.body;

      // Membuka koneksi ke database
      const connection = await mysql.createConnection(dbConfig);

      // Query untuk menambahkan data ke dalam tabel
      const query = `
        INSERT INTO transaksi_simpanans (nama, jenis_simpan, deskripsi, besar_simpanan, created_at, created_by,email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [name, jenis_simpanan, deskripsi, amount, created_at, created_by,email]);

      // Menutup koneksi database
      connection.end();

      res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding data', error: error});
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
