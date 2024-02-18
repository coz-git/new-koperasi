import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    let db;
    const { email} = req.query;
    try {
      // Konfigurasi koneksi database
      db = await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'akutansi2',
      });

      const [rows] = await db.query(`SELECT * FROM transaksi_simpanans WHERE email='${email}'`);
      const [rows2] = await db.query(`SELECT SUM(besar_simpanan) AS total_simpanan
      FROM transaksi_simpanans
      WHERE email = '${email}'`
      );

      res.status(200).json({
        rows,
        rows2
      });
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
