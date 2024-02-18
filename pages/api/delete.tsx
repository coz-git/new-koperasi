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
  if (req.method === 'DELETE') {
    try {
      const { nama_tabel, id } = req.body;
      console.log(nama_tabel);
      // Membuka koneksi ke database
      const connection = await mysql.createConnection(dbConfig);

      // Query untuk menambahkan data ke dalam tabel
      const query = `
      DELETE FROM ${nama_tabel} WHERE id = ?
      `;
      await connection.execute(query, [id]);

      // Menutup koneksi database
      connection.end();

      res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding data', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
