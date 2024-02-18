import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { nama_tabel,email} = req.query;
    // console.log(nama_tabel);
    let db;
    try {
      // Konfigurasi koneksi database
      db = await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'akutansi2',
      });

      const [rows] = await db.query(`SELECT users.*, 
      COALESCE(s.total_simpanan, 0) AS total_simpanan,
      SUM(transaksi_pinjamans.jumlah_pinjaman) AS total_pinjaman
    FROM users
    LEFT JOIN (
      SELECT email, SUM(besar_simpanan) AS total_simpanan
      FROM transaksi_simpanans
      GROUP BY email
    ) s ON users.email = s.email
    LEFT JOIN transaksi_pinjamans ON users.email = transaksi_pinjamans.email
    WHERE users.email = '${email}'  AND transaksi_pinjamans.status = 'Acc'
    GROUP BY users.id;
    `);
     
      console.log(rows);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error });
    } finally {
      if (db) {
        // Pastikan db memiliki nilai sebelum mencoba memanggil .end()
        db.end(); // Menutup koneksi pool saat selesai
      }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
