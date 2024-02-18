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
  if (req.method === 'PUT') { // Anda dapat menggunakan PUT atau PATCH sesuai preferensi Anda
    try {
      const { id, jenis_pinjaman, deskripsi, maksimal_pinjaman,lama_angsuran,bunga, created_by, created_at } = req.body;
    //   console.log(jenis_simpanan);
      // Membuka koneksi ke database
      const connection = await mysql.createConnection(dbConfig);

      // Query untuk mengedit data dalam tabel berdasarkan ID
      const query = `
        UPDATE pinjamans
        SET jenis_pinjaman = ?, deskripsi = ?,maksimal_pinjaman=?,lama_angsuran=?,bunga = ?, created_by = ?, created_at = ?
        WHERE id = ?
      `;
      await connection.execute(query, [jenis_pinjaman, deskripsi, maksimal_pinjaman,lama_angsuran,bunga, created_by, created_at, id]);

      // Menutup koneksi database
      connection.end();

      res.status(200).json({ message: 'Data edited successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error editing data', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
