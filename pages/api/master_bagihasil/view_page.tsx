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
      const { presentase_anggota,
      presentase_koperasi,
      vee_admin,
      periode,
      amount_admin,
      amount_anggota,
      amount_koperasi } = req.body;
      console.log(amount_anggota);
      // Membuka koneksi ke database
      const connection = await mysql.createConnection(dbConfig);

      // Query untuk menambahkan data ke dalam tabel
      const query = `
        INSERT INTO bagihasils (presentase_anggota,
      presentase_koperasi,
      vee_admin,
      periode,
      amount_admin,
      amount_anggota,
      amount_koperasi)
        VALUES (?, ?, ?, ?, ?,?,?)
      `;
      await connection.execute(query, [presentase_anggota,
      presentase_koperasi,
      vee_admin,
      periode,
      amount_admin,
      amount_anggota,
      amount_koperasi]);

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
