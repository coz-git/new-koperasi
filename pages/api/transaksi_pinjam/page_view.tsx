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
      const {name, jenis_pinjaman, tanggal_pengajuan, tanggal_pencairan, approved_by,amount,created_at,created_by,email,status,bunga, nama_bank, no_rekening} = req.body;

      // Membuka koneksi ke database
      const connection = await mysql.createConnection(dbConfig);

      // Query untuk menambahkan data ke dalam tabel
      const query = `
        INSERT INTO transaksi_pinjamans (nama, jenis_pinjaman,tanggal_pengajuan,tanggal_pencairan,approved_by,status, jumlah_pinjaman, created_at, created_by,email,bunga, nama_bank, no_rekening)
        VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)
      `;
      await connection.execute(query, [name, jenis_pinjaman, tanggal_pengajuan, tanggal_pencairan, approved_by, status,amount,created_at,created_by,email,bunga, nama_bank, no_rekening]);

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
