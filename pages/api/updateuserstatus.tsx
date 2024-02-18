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
    // const userId = req.query.id as string;
    const { status ,id} = req.body;
    // const [rows] = await db.promise().execute('SELECT * FROM users WHERE id = ?', [userId]);
    console.log(req.body);
    try {
      await db.promise().execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: id, message: error });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
