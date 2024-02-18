import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'mysql2';

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'akutansi2',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id,
      name,
      email,
      nik,
      nip,
      alamat 
    } = req.body;

    try {
      await db.promise().execute(`
      UPDATE users
        SET name = ?, email = ?, nik = ?, nip = ?, alamat = ?
      WHERE id = ?
      `, [
        name, email, nik, nip, alamat, id
      ]);
      res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: id, message: error });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
