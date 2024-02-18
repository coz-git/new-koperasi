import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'akutansi2'
};

const dashboardHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const connection = await mysql.createConnection(dbConfig);
  const token2= req.query.email;

  try {
    console.log(token2);
    const roleToCount = 'user';
    const status = 'active';  
    const status_pinjam = 'pending'; 
    const status_pinjam_berjalan = 'Acc'; 
    const jenis_simpanan = 'Pokok'; 
    const jenis_simpanan_wajib = 'Wajib'; 
    const jenis_simpanan_sukarela = 'Sukarela'; 
    const query = `SELECT COUNT(*) AS userCount FROM users WHERE role = ? AND status = ?`;
    const [results_user] = await connection.execute<RowDataPacket[]>(query, [roleToCount , status],);
    const query2=`SELECT COUNT(*) AS pengajuanCount FROM transaksi_pinjamans WHERE status = ?`;
    const [results_pinjam] = await connection.execute<RowDataPacket[]>(query2, [status_pinjam],);
    const query3=`SELECT SUM(bunga) AS pemasukanCount FROM transaksi_pinjamans WHERE status = ?`;
    const [results_pemasukan] = await connection.execute<RowDataPacket[]>(query3,[status_pinjam_berjalan]);
    const query4=`SELECT SUM(jumlah_pinjaman) AS pinjamanCount FROM transaksi_pinjamans WHERE status = ?`;
    const [results_pinjaman_berjalan] = await connection.execute<RowDataPacket[]>(query4, [status_pinjam_berjalan],);
    const query5=`SELECT SUM(besar_simpanan) AS pokokCount FROM transaksi_simpanans WHERE jenis_simpan = ? AND email=?`;
    const [total_tabungan_user_pokok] = await connection.execute<RowDataPacket[]>(query5, [jenis_simpanan,token2]);
    const query6=`SELECT SUM(besar_simpanan) AS pokokCount FROM transaksi_simpanans WHERE jenis_simpan = ? AND email=?`;
    const [total_tabungan_user_wajib] = await connection.execute<RowDataPacket[]>(query6, [jenis_simpanan_wajib,token2]);
    const query7=`SELECT SUM(besar_simpanan) AS pokokCount FROM transaksi_simpanans WHERE jenis_simpan = ? AND email=?`;
    const [total_tabungan_user_sukarela] = await connection.execute<RowDataPacket[]>(query7, [jenis_simpanan_sukarela,token2]);
    const query8=`SELECT SUM(jumlah_pinjaman) AS pokokCount FROM transaksi_pinjamans WHERE  email=?`;
    const [total_pinjaman_user] = await connection.execute<RowDataPacket[]>(query8, [token2]);

    const userCount = results_user[0].userCount;
    const pengajuanCount = results_pinjam[0].pengajuanCount;
    const pemasukanCount=results_pemasukan[0].pemasukanCount;
    const pinjamanCount=results_pinjaman_berjalan[0].pinjamanCount;
    const simpanan_pokok=total_tabungan_user_pokok[0].pokokCount;
    const simpanan_wajib=total_tabungan_user_wajib[0].pokokCount;
    const simpanan_sukarela=total_tabungan_user_sukarela[0].pokokCount;
    const total_pinjaman=total_pinjaman_user[0].pokokCount;
    return res.status(200).json({ 
      pengajuan:userCount,
      user:pengajuanCount,
      pemasukan:pemasukanCount,
      pinjaman:pinjamanCount,
      simpanan_pokok:simpanan_pokok,
      simpanan_wajib:simpanan_wajib,
      simpanan_sukarela:simpanan_sukarela,
      total_pinjaman:total_pinjaman
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    connection.end();
  }
};

export default dashboardHandler;
