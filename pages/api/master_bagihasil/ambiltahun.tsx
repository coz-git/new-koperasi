import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    let db;
    try {
      // Konfigurasi koneksi database
      db = await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'akutansi2',
      });

      const [rows] = await db.query(`SELECT periode FROM bagihasils ORDER BY id DESC LIMIT 1;
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
