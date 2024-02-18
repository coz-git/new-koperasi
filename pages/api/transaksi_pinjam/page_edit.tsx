import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

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
      const { id, jenis_pinjaman, tanggal_pencairan, approved_by, status, jumlah_pinjaman, email } = req.body;
      console.log(email);
      // Membuka koneksi ke database
      const connection = await mysql.createConnection(dbConfig);
      const querydata = `select * FROM users WHERE email='${email}'`
      const [rows2] = await connection.query<RowDataPacket[]>(querydata);
      console.log(rows2[0].nip);
      // Query untuk mengedit data dalam tabel berdasarkan ID
      const query = `
        UPDATE transaksi_pinjamans
        SET tanggal_pencairan = ?, approved_by = ?,status=?
        WHERE id = ?
      `;
      const query2 = `SELECT * FROM pinjamans WHERE jenis_pinjaman='${jenis_pinjaman}'`;
      const [rows] = await connection.query<RowDataPacket[]>(query2);
      await connection.execute(query, [tanggal_pencairan, approved_by, status, id]);

      // Menutup koneksi database
      if (rows.length > 0) {


        try {
          const lamaAngsuran = rows[0].lama_angsuran;
          // console.log(lamaAngsuran);
          const bunga = rows[0].bunga;
          // console.log(bunga);
          const angsuran = (jumlah_pinjaman * bunga / 100) + jumlah_pinjaman;
          // console.log(angsuran);
          const hasil = angsuran / lamaAngsuran;
          // console.log(hasil);
          const query3 = `
        INSERT INTO pembayaran (id_transaksi, angsuran_ke,jumlah_angsuran_bulan,sisa_angsuran,status,foto, created_at,name,nip,acc_by)
        VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)
      `;
          console.log(id, lamaAngsuran, hasil, lamaAngsuran, status, "null", tanggal_pencairan);
          await connection.execute(query3, [id, 1, hasil, angsuran, status, "null", tanggal_pencairan, rows2[0].name, rows2[0].nip, approved_by]);
          // console.log(connection.execute(query3, [id, lamaAngsuran, hasil, lamaAngsuran, status, "null",tanggal_pencairan]));
          // Menutup koneksi database
          connection.end();

          res.status(201).json({ message: 'Data added successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Error adding data', error: error });
        }
      } else {
        console.log("Data tidak ditemukan.");
      }
      res.status(200).json({ message: rows });
    } catch (error) {
      res.status(500).json({ message: 'Error editing data', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
