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
      const { id, id_transaksi, angsuran_ke, jumlah_angsuran_per_bulan, sisa_angsuran, status, foto, created_at, name, nip, acc_by } = req.body;
      console.log(req.body);
      // Membuka koneksi ke database
      let status2;
      const connection = await mysql.createConnection(dbConfig);

      console.log(status);

      if (status == "Acc" || status == "Belum Lunas") {
        const query = `
          UPDATE pembayaran
          SET status = ?, foto = ?
          WHERE id = ?
        `;
        await connection.execute(query, ["Pending", foto, id]);
      }

      // Jika Ditolak
      if (status == "Ditolak") {
        // Create Copy Angsuran Sebelumnya
        const [pembayaran] = await connection.query<RowDataPacket[]>("SELECT * FROM pembayaran Where id = ?", id)

        let querys = `
        INSERT INTO pembayaran (id_transaksi, angsuran_ke,jumlah_angsuran_bulan,sisa_angsuran,status,foto, created_at,name,nip,acc_by)
        VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)
        `;

        await connection.execute(querys, [pembayaran[0].id_transaksi, pembayaran[0].angsuran_ke, pembayaran[0].jumlah_angsuran_bulan, pembayaran[0].sisa_angsuran, "Belum Lunas", pembayaran[0].foto, created_at, name, nip, acc_by])

        await connection.execute("Update pembayaran set status = ? Where id=?", ["Ditolak", id])
      }

      // Query untuk mengedit data dalam tabel berdasarkan ID

      if (status == "Pending") {
        // Get Data lama angsuran

        const [transaksi_pinjam] = await connection.query<RowDataPacket[]>("select * from transaksi_pinjamans where id=?", id_transaksi)

        let jenis = transaksi_pinjam[0].jenis_pinjaman

        const [pinjamans] = await connection.query<RowDataPacket[]>("Select * from pinjamans where jenis_pinjaman=?", jenis)

        let lama_angsuran = pinjamans[0].lama_angsuran

        // if (angsuran_ke == lama_angsuran) {
        //   status2 = "Lunas"
        // } else {
        //   status2 = "Belum Lunas"
        // }

        // console.log(angsuran_ke - 1);
        if (angsuran_ke == lama_angsuran) {
          status2 = "Lunas";

          await connection.execute("UPDATE pembayaran SET status = ? WHERE id = ?", [status2, id])

          // await connection.execute("UPDATE transaksi_pinjamans SET jumlah_pinjaman = ? WHERE id = ?", [sisa_angsuran - jumlah_angsuran_per_bulan, id_transaksi])
        } else {
          status2 = "Belum Lunas";

          await connection.execute("UPDATE pembayaran SET status = ? WHERE id = ?", ["Sudah Dibayar", id])

          // await connection.execute("UPDATE transaksi_pinjamans SET jumlah_pinjaman = ? WHERE id = ?", [sisa_angsuran - jumlah_angsuran_per_bulan, id_transaksi])

          let querys = `
          INSERT INTO pembayaran (id_transaksi, angsuran_ke,jumlah_angsuran_bulan,sisa_angsuran,status,foto, created_at,name,nip,acc_by)
          VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)
          `;

          await connection.execute(querys, [id_transaksi, parseInt(angsuran_ke) + 1, jumlah_angsuran_per_bulan, sisa_angsuran - jumlah_angsuran_per_bulan, status2, foto, created_at, name, nip, acc_by])
        }
        //     const query3 = `
        //     INSERT INTO pembayaran (id_transaksi, angsuran_ke,jumlah_angsuran_bulan,sisa_angsuran,status,foto, created_at,name,nip,acc_by)
        //     VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)
        //   `;
        //     const query4 = `
        //   UPDATE pembayaran
        //   SET status = ?
        //   WHERE id = ?
        // `;
        //     await connection.execute(query4, ["Sudah DIbayar", id]);
        //     //   console.log(id, id_transaksi, angsuran_ke-1, jumlah_angsuran_per_bulan, sisa_angsuran-jumlah_angsuran_per_bulan, status2,tanggal_pencairan);
        //     await connection.execute(query3, [id_transaksi, angsuran_ke - 1, jumlah_angsuran_per_bulan, sisa_angsuran - jumlah_angsuran_per_bulan, status2, foto, created_at, name, nip, acc_by]);
        //     const query = `
        //     UPDATE transaksi_pinjamans
        //     SET jumlah_pinjaman = ?
        //     WHERE id = ?
        //   `;
        //     await connection.execute(query, [sisa_angsuran - jumlah_angsuran_per_bulan, id_transaksi]);
      }

      // Menutup koneksi database
      connection.end();

      res.status(200).json({ message: "sukses" });
    } catch (error) {
      res.status(500).json({ message: 'Error editing data', error: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
