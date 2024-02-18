import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const{email}=req.query;
    let db;
    try {
      // Konfigurasi koneksi database
      db = await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'akutansi2',
      });
      console.log(email);
      if(email=="null"){
        const [rows] = await db.query(`SELECT 
      pembayaran.*,
      transaksi_pinjamans.nama,
      transaksi_pinjamans.email
        FROM 
            pembayaran
        INNER JOIN 
            transaksi_pinjamans ON pembayaran.id_transaksi = transaksi_pinjamans.id
            WHERE 
              pembayaran.status = 'Pending'
              order by 1 desc;
  `);

  res.status(200).json(rows);
      }else{
        const [rows] = await db.query(`SELECT 
        pembayaran.*,
        transaksi_pinjamans.nama,
        transaksi_pinjamans.email
          FROM 
              pembayaran
          INNER JOIN 
              transaksi_pinjamans ON pembayaran.id_transaksi = transaksi_pinjamans.id
          WHERE 
              transaksi_pinjamans.email = '${email}'
          order by 1 desc;
    `);

    res.status(200).json(rows);
      }
      
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
