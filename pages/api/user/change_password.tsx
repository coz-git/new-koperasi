import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'mysql2';
import bcrypt from "bcrypt";
const JWT_SECRET_KEY =
  "23becdfc83442ece1c45a863391bd7c7ad408d758f87388dd030aac486c12bca";

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'akutansi2',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id,
      password
    } = req.body;

    try {
      // Hashing password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt 

      await db.promise().execute(`
      UPDATE users
        SET password_hash = ?
      WHERE id = ?
      `, [
        hashedPassword, id
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
